{ Mongo } = require 'meteor/mongo'
{ Factory } = require 'meteor/factory'
faker = require 'faker'

incompleteCountDenormalizer = require './incompleteCountDenormalizer.coffee'
{ SimpleSchema } = require 'meteor/aldeed:simple-schema'

# lists.coffee includes todos.coffee, and vice versa: a circular reference
# CommonJS doesn’t resolve this as we would like, so save a reference to the top-level module rather than destructuring it
# Learn more at https://github.com/meteor/meteor/issues/6381
# and http://benjamn.github.io/empirenode-2015/#/31
ListsModule = require '../lists/lists.coffee'


class TodosCollection extends Mongo.Collection
  insert: (doc, callback) ->
    ourDoc = doc
    ourDoc.createdAt = ourDoc.createdAt or new Date()
    result = super ourDoc, callback
    incompleteCountDenormalizer.afterInsertTodo ourDoc
    result


  update: (selector, modifier) ->
    result = super selector, modifier
    incompleteCountDenormalizer.afterUpdateTodo selector, modifier
    result


  remove: (selector) ->
    todos = @find(selector).fetch()
    result = super selector
    incompleteCountDenormalizer.afterRemoveTodos todos
    result

Todos = exports.Todos = new TodosCollection 'Todos'


# Deny all client-side updates since we will be using methods to manage this collection
Todos.deny
  insert: ->
    yes

  update: ->
    yes

  remove: ->
    yes


Todos.schema = new SimpleSchema
  listId:
    type: String
    regEx: SimpleSchema.RegEx.Id
    denyUpdate: yes
  text:
    type: String
    max: 100
  createdAt:
    type: Date
    denyUpdate: yes
  checked:
    type: Boolean
    defaultValue: no

Todos.attachSchema Todos.schema

# This represents the keys from Lists objects that should be published
# to the client. If we add secret properties to List objects, don't list
# them here to keep them private to the server.
Todos.publicFields =
  listId: 1
  text: 1
  createdAt: 1
  checked: 1

# TODO This factory has a name - do we have a code style for this?
#   - usually I've used the singular, sometimes you have more than one though, like
#   'todo', 'emptyTodo', 'checkedTodo'
Factory.define 'todo', Todos,
  listId: ->
    Factory.get 'list'


  text: ->
    faker.lorem.sentence()


  createdAt: ->
    new Date()


Todos.helpers
  list: ->
    ListsModule.Lists.findOne @listId


  editableBy: (userId) ->
    @list().editableBy userId


module.exports = Todos: Todos

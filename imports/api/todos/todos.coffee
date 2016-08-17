{ Mongo } = require 'meteor/mongo'
{ Factory } = require 'meteor/factory'
faker = require 'faker'

{ SimpleSchema } = require 'meteor/aldeed:simple-schema'

# lists.coffee includes todos.coffee, and vice versa: a circular reference
# CommonJS doesn’t resolve this as we would like, so save a reference to the top-level module rather than destructuring it
# Learn more at https://github.com/meteor/meteor/issues/6381
# and http://benjamn.github.io/empirenode-2015/#/31
`import { Lists } from '../lists/lists.coffee' `

# incompleteCountDenormalizer = require './incompleteCountDenormalizer.coffee'
`import { incompleteCountDenormalizer } from './incompleteCountDenormalizer.coffee'`

class TodosCollection extends Mongo.Collection
  insert: (doc, callback) ->
    ourDoc = doc
    ourDoc.createdAt = ourDoc.createdAt or new Date()

    callback || callback = () ->

    result = super ourDoc, callback
    incompleteCountDenormalizer.afterInsertTodo ourDoc

    result

  update: (selector, modifier) ->
    result = super selector, modifier
    incompleteCountDenormalizer.afterUpdateTodo selector, modifier
    result

  remove: (selector) ->
    # Should be super?
    todos = @find(selector).fetch()
    result = super selector

    incompleteCountDenormalizer.afterRemoveTodos todos
    result

TodosModule = new TodosCollection 'Todos'

# Export both of these until we have moved completely to the backticked style
exports.Todos = TodosModule
`export const Todos = TodosModule`

# Deny all client-side updates since we will be using methods to manage this collection
TodosModule.deny
  insert: ->
    yes
  update: ->
    yes
  remove: ->
    yes

TodosModule.schema = new SimpleSchema
  _id:
    type: String
    regEx: SimpleSchema.RegEx.Id
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

TodosModule.attachSchema TodosModule.schema

# This represents the keys from Lists objects that should be published
# to the client. If we add secret properties to List objects, don't list
# them here to keep them private to the server.
TodosModule.publicFields =
  _id: 1
  listId: 1
  text: 1
  createdAt: 1
  checked: 1

# TODO This factory has a name - do we have a code style for this?
#   - usually I've used the singular, sometimes you have more than one though, like
#   'todo', 'emptyTodo', 'checkedTodo'
Factory.define 'todo', TodosModule,
  listId: ->
    Factory.get 'list'
  text: ->
    faker.lorem.sentence()
  createdAt: ->
    new Date()


TodosModule.helpers
  list: ->
    Lists.findOne @listId

  editableBy: (userId) ->
    @list().editableBy userId

module.exports = Todos: TodosModule

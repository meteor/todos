import { Mongo } from 'meteor/mongo'
import { Factory } from 'meteor/dburles:factory'
import { SimpleSchema } from 'meteor/aldeed:simple-schema'
import faker from 'faker'
import incompleteCountDenormalizer from './incompleteCountDenormalizer.coffee'

import { Lists } from '../lists/lists.coffee'


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

export Todos = new TodosCollection 'todos'


# Deny all client-side updates since we will be using methods to manage this collection
Todos.deny
  insert: -> yes
  update: -> yes
  remove: -> yes


Todos.schema = new SimpleSchema
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
    optional: yes
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
    Lists.findOne @listId


  editableBy: (userId) ->
    @list().editableBy userId

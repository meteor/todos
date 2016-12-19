import { Meteor } from 'meteor/meteor'
import { _ } from 'meteor/underscore'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { SimpleSchema } from 'meteor/aldeed:simple-schema'
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter'

import TodosModule from './todos.coffee'
import ListsModule from '../lists/lists.coffee'


export insert = new ValidatedMethod
  name: 'todos.insert'
  validate: TodosModule.Todos.simpleSchema().pick([
    'listId'
    'text'
  ]).validator
    clean: yes
    filter: no
  run: ({ listId, text }) ->
    list = ListsModule.Lists.findOne listId

    if list.isPrivate() and list.userId isnt @userId
      throw new Meteor.Error 'todos.insert.accessDenied', 'Cannot add todos to a private list that is not yours'

    todo =
      listId: listId
      text: text
      checked: no
      createdAt: new Date()

    TodosModule.Todos.insert todo


export setCheckedStatus = new ValidatedMethod
  name: 'todos.makeChecked'
  validate: new SimpleSchema
    todoId: TodosModule.Todos.simpleSchema().schema('_id')
    newCheckedStatus: TodosModule.Todos.simpleSchema().schema('checked')
  .validator
    clean: yes
    filter: no
  run: ({ todoId, newCheckedStatus }) ->
    todo = TodosModule.Todos.findOne todoId

    if todo.checked is newCheckedStatus
      # The status is already what we want, let's not do any extra work
      return

    unless todo.editableBy(@userId)
      throw new Meteor.Error 'todos.setCheckedStatus.accessDenied', 'Cannot edit checked status in a private list that is not yours'

    TodosModule.Todos.update todoId,
      $set:
        checked: newCheckedStatus


export updateText = new ValidatedMethod
  name: 'todos.updateText'
  validate: new SimpleSchema
    todoId: TodosModule.Todos.simpleSchema().schema('_id')
    newText: TodosModule.Todos.simpleSchema().schema('text')
  .validator
    clean: yes
    filter: no
  run: ({ todoId, newText }) ->
    # This is complex auth stuff - perhaps denormalizing a userId onto todos
    # would be correct here?
    todo = TodosModule.Todos.findOne todoId

    unless todo.editableBy(@userId)
      throw new Meteor.Error 'todos.updateText.accessDenied', 'Cannot edit todos in a private list that is not yours'

    TodosModule.Todos.update todoId,
      $set:
        text: newText


export remove = new ValidatedMethod
  name: 'todos.remove'
  validate: new SimpleSchema
    todoId: TodosModule.Todos.simpleSchema().schema('_id')
  .validator
    clean: yes
    filter: no
  run: ({ todoId }) ->
    todo = TodosModule.Todos.findOne todoId

    unless todo.editableBy(@userId)
      throw new Meteor.Error 'todos.remove.accessDenied', 'Cannot remove todos in a private list that is not yours'

    TodosModule.Todos.remove todoId


# Get list of all method names on Todos
TODOS_METHODS = _.pluck([
  insert
  setCheckedStatus
  updateText
  remove
], 'name')

if Meteor.isServer
  # Only allow 5 todos operations per connection per second
  DDPRateLimiter.addRule {
    name: (name) ->
      _.contains TODOS_METHODS, name

    # Rate limit per connection ID
    connectionId: ->
      yes

  }, 5, 1000

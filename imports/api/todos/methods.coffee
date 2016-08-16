{ Meteor } = require 'meteor/meteor'
{ _ } = require 'meteor/underscore'
{ ValidatedMethod } = require 'meteor/mdg:validated-method'
{ SimpleSchema } = require 'meteor/aldeed:simple-schema'
{ DDPRateLimiter } = require 'meteor/ddp-rate-limiter'

`import { Todos } from './todos.coffee'`
`import { Lists } from '../lists/lists.coffee'`

#TodosModule = Todos
#ListsModule = Lists

insertMethod = new ValidatedMethod
  name: 'todos.insert'
  validate: Todos.schema
  .pick(['listId', 'text'])  
  .validator({ clean: true, filter: false })

  run: ({ listId, text }) ->
    list = Lists.findOne listId
    if list.isPrivate() and list.userId isnt @userId
      throw new Meteor.Error 'todos.insert.accessDenied', 'Cannot add todos to a private list that is not yours'

    todo =
      listId: listId
      text: text
      checked: no
      createdAt: new Date()

    Todos.insert todo

module.exports.insert = insertMethod
`export const insert  = insertMethod`

setCheckedStatusMethod = new ValidatedMethod
  name: 'todos.makeChecked'
  validate: new SimpleSchema
    todoId: Todos.simpleSchema().schema('_id')
    newCheckedStatus: Todos.simpleSchema().schema('checked')
  .validator({ clean: true, filter: false })
  run: ({ todoId, newCheckedStatus }) ->
    console.log 'setCheckedStatusMethod'
    todo = Todos.findOne todoId

    if todo.checked is newCheckedStatus
      # The status is already what we want, let's not do any extra work
      return

    unless todo.editableBy(@userId)
      throw new Meteor.Error 'todos.setCheckedStatus.accessDenied', 'Cannot edit checked status in a private list that is not yours'

    Todos.update todoId,
      $set:
        checked: newCheckedStatus

module.exports.setCheckedStatus = setCheckedStatusMethod 
`export const setCheckedStatus = setCheckedStatusMethod`

updateTextMethod = new ValidatedMethod
  name: 'todos.updateText'
  validate: new SimpleSchema
    todoId:  Todos.simpleSchema().schema('_id')
    newText: Todos.simpleSchema().schema('text')
  .validator({ clean: true, filter: false })
  run: ({ todoId, newText }) ->
    console.log 'updateTextMethod'
    # This is complex auth stuff - perhaps denormalizing a userId onto todos
    # would be correct here?
    todo = Todos.findOne todoId

    unless todo.editableBy(@userId)
      throw new Meteor.Error 'todos.updateText.accessDenied', 'Cannot edit todos in a private list that is not yours'

    Todos.update todoId,
      $set:
        text: newText

module.exports.updateText = updateTextMethod
`export const updateText = updateTextMethod`

removeMethod = new ValidatedMethod
  name: 'todos.remove'
  validate: new SimpleSchema
    todoId: Todos.simpleSchema().schema('_id')
  .validator({ clean: true, filter: false })
  run: ({ todoId }) ->
    console.log 'Hit inside remove code'
    todo = Todos.findOne todoId

    unless todo.editableBy(@userId)
      throw new Meteor.Error 'todos.remove.accessDenied', 'Cannot remove todos in a private list that is not yours'

    Todos.remove todoId

module.exports.remove = removeMethod
`export const remove = removeMethod`

# Get list of all method names on Todos
TODOS_METHODS = _.pluck([
  module.exports.insert
  module.exports.setCheckedStatus
  module.exports.updateText
  module.exports.remove
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

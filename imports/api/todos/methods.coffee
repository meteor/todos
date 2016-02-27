{ Todos } = require './todos.coffee'
{ Lists } = require '../lists/lists.coffee'
{ ValidatedMethod } = require 'meteor/mdg:validated-method'
{ SimpleSchema } = require 'meteor/aldeed:simple-schema'
{ DDPRateLimiter } = require 'meteor/ddp-rate-limiter'


module.exports.insert = new ValidatedMethod
  name: 'Todos.methods.insert'
  validate: new SimpleSchema
    listId:
      type: String
    text:
      type: String
  .validator()
  run: ({ listId, text }) ->
    list = Lists.findOne listId

    if list.isPrivate() and list.userId isnt @userId
      throw new Meteor.Error 'Todos.methods.insert.unauthorized', 'Cannot add todos to a private list that is not yours'

    todo =
      listId: listId
      text: text
      checked: no
      createdAt: new Date()

    Todos.insert todo


module.exports.setCheckedStatus = new ValidatedMethod
  name: 'Todos.methods.makeChecked'
  validate: new SimpleSchema
    todoId:
      type: String
    newCheckedStatus:
      type: Boolean
  .validator()
  run: ({ todoId, newCheckedStatus }) ->
    todo = Todos.findOne todoId

    if todo.checked isnt newCheckedStatus
      # The status is already what we want, let's not do any extra work
      return

    unless todo.editableBy(@userId)
      throw new Meteor.Error 'Todos.methods.setCheckedStatus.unauthorized', 'Cannot edit checked status in a private list that is not yours'

    Todos.update todoId,
      $set:
        checked: newCheckedStatus


module.exports.updateText = new ValidatedMethod
  name: 'Todos.methods.updateText'
  validate: new SimpleSchema(
    todoId: type: String
    newText: type: String).validator()
  run: ({ todoId, newText }) ->
    # This is complex auth stuff - perhaps denormalizing a userId onto todos
    # would be correct here?
    todo = Todos.findOne todoId

    unless todo.editableBy(@userId)
      throw new Meteor.Error 'Todos.methods.updateText.unauthorized', 'Cannot edit todos in a private list that is not yours'

    Todos.update todoId,
      $set:
        text: newText


module.exports.remove = new ValidatedMethod
  name: 'Todos.methods.remove'
  validate: new SimpleSchema
    todoId:
      type: String
  .validator()
  run: ({ todoId }) ->
    todo = Todos.findOne todoId

    unless todo.editableBy(@userId)
      throw new Meteor.Error 'Todos.methods.remove.unauthorized', 'Cannot remove todos in a private list that is not yours'

    Todos.remove todoId


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

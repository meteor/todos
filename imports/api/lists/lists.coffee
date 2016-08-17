{ Mongo } = require 'meteor/mongo'
{ SimpleSchema } = require 'meteor/aldeed:simple-schema'
{ Factory } = require 'meteor/factory'

# todos.coffee includes lists.coffee, and vice versa: a circular reference
# CommonJS doesn’t resolve this as we would like, so save a reference to the top-level module rather than destructuring it
# Learn more at https://github.com/meteor/meteor/issues/6381
# and http://benjamn.github.io/empirenode-2015/#/31

# TodosModule = require '../todos/todos.coffee'
`import { Todos } from '../todos/todos.coffee'`

TodosModule = Todos

class ListsCollection extends Mongo.Collection
  insert: (list, callback) ->
    ourList = list
    unless ourList.name?
      nextLetter = 'A'
      ourList.name = "List #{nextLetter}"

      while this.findOne({name: ourList.name})?
        # not going to be too smart here, can go past Z
        nextLetter = String.fromCharCode(nextLetter.charCodeAt(0) + 1)
        ourList.name = "List #{nextLetter}"

    super ourList, callback

  remove: (selector, callback) ->
    console.log 'From Lists [remove]: ', selector
    Todos.remove {listId: selector}
    super selector, callback

# Lists = exports.Lists = new ListsCollection 'Lists'
`export const Lists = new ListsCollection('Lists')`


# Deny all client-side updates since we will be using methods to manage this collection
Lists.deny
  insert: ->
    yes

  update: ->
    yes

  remove: ->
    yes

Lists.schema = new SimpleSchema
  _id: 
    type: String 
    regEx: SimpleSchema.RegEx.Id
  name:
    type: String
  incompleteCount:
    type: Number
    defaultValue: 0
  userId:
    type: String
    regEx: SimpleSchema.RegEx.Id
    optional: yes

Lists.attachSchema Lists.schema

# This represents the keys from Lists objects that should be published
# to the client. If we add secret properties to List objects, don't list
# them here to keep them private to the server.
Lists.publicFields =
  name: 1
  incompleteCount: 1
  userId: 1

Factory.define 'list', Lists, {}


Lists.helpers
  isPrivate: ->
    @userId?


  isLastPublicList: ->
    publicListCount = Lists.find(userId: $exists: no).count()
    not @isPrivate() and publicListCount is 1


  editableBy: (userId) ->
    unless @userId?
      return yes

    @userId is userId


  todos: ->
    Todos.find { listId: @_id }, sort: createdAt: -1

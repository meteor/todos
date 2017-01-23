import { Mongo } from 'meteor/mongo'
import { SimpleSchema } from 'meteor/aldeed:simple-schema'
import { Factory } from 'meteor/dburles:factory'
import { TAPi18n } from 'meteor/tap:i18n'

import { Todos } from '../todos/todos.coffee'

class ListsCollection extends Mongo.Collection
  insert: (list, callback, language = 'en') ->
    ourList = list
    unless ourList.name?
      defaultName = TAPi18n.__ 'lists.insert.list', null, language
      nextLetter = 'A'
      ourList.name = "#{defaultName} #{nextLetter}"

      while this.findOne({name: ourList.name})?
        # not going to be too smart here, can go past Z
        nextLetter = String.fromCharCode(nextLetter.charCodeAt(0) + 1)
        ourList.name = "#{defaultName} #{nextLetter}"

    super ourList, callback

  remove: (selector, callback) ->
    Todos.remove {listId: selector}
    super selector, callback

export Lists = new ListsCollection 'lists'


# Deny all client-side updates since we will be using methods to manage this collection
Lists.deny
  insert: -> yes
  update: -> yes
  remove: -> yes


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

import { Meteor } from 'meteor/meteor'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { SimpleSchema } from 'meteor/aldeed:simple-schema'
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter'
import { _ } from 'meteor/underscore'

import { Lists } from '../lists/lists.coffee'


LIST_ID_ONLY = new SimpleSchema
  listId: Lists.simpleSchema().schema('_id')
.validator
  clean: yes
  filter: no


export insert = new ValidatedMethod
  name: 'lists.insert'
  validate: new SimpleSchema(
      language:
        type: String
    ).validator()
  run: ({ language }) ->
    Lists.insert {}, null, language


export makePrivate = new ValidatedMethod
  name: 'lists.makePrivate'
  validate: LIST_ID_ONLY
  run: ({ listId }) ->
    unless @userId?
      throw new Meteor.Error 'lists.makePrivate.notLoggedIn', 'Must be logged in to make private lists.'

    list = Lists.findOne listId

    if list.isLastPublicList()
      throw new Meteor.Error 'lists.makePrivate.lastPublicList', 'Cannot make the last public list private.'

    Lists.update listId,
    	$set:
    		userId: @userId


export makePublic = new ValidatedMethod
  name: 'lists.makePublic'
  validate: LIST_ID_ONLY
  run: ({ listId }) ->
    unless @userId?
      throw new Meteor.Error 'lists.makePublic.notLoggedIn', 'Must be logged in.'
    list = Lists.findOne listId

    unless list.editableBy @userId
      throw new Meteor.Error 'lists.makePublic.accessDenied', 'You don’t have permission to edit this list.'

    # XXX the security check above is not atomic, so in theory a race condition could
    # result in exposing private data
    Lists.update listId,
    	$unset:
    		userId: yes


export updateName = new ValidatedMethod
  name: 'lists.updateName'
  validate: new SimpleSchema
    listId: Lists.simpleSchema().schema('_id')
    newName: Lists.simpleSchema().schema('name')
  .validator
    clean: yes
    filter: no
  run: ({ listId, newName }) ->
    list = Lists.findOne listId

    unless list.editableBy @userId
      throw new Meteor.Error 'lists.updateName.accessDenied', 'You don’t have permission to edit this list.'

    # XXX the security check above is not atomic, so in theory a race condition could
    # result in exposing private data

    Lists.update listId,
    	$set:
    		name: newName


export remove = new ValidatedMethod
  name: 'lists.remove'
  validate: LIST_ID_ONLY
  run: ({ listId }) ->
    list = Lists.findOne listId

    unless list.editableBy @userId
      throw new Meteor.Error 'lists.remove.accessDenied', 'You don’t have permission to remove this list.'

    # XXX the security check above is not atomic, so in theory a race condition could
    # result in exposing private data

    if list.isLastPublicList()
      throw new Meteor.Error 'lists.remove.lastPublicList', 'Cannot delete the last public list.'

    Lists.remove listId


# Get list of all method names on Lists
LISTS_METHODS = _.pluck [
  insert
  makePublic
  makePrivate
  updateName
  remove
], 'name'

if Meteor.isServer
  # Only allow 5 list operations per connection per second
  DDPRateLimiter.addRule
    name: (name) ->
      _.contains LISTS_METHODS, name

    # Rate limit per connection ID
    connectionId: ->
      yes

  , 5, 1000

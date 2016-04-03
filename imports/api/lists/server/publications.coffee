{ Meteor } = require 'meteor/meteor'

{ Lists } = require '../lists.coffee'


Meteor.publish 'lists.public', ->
  Lists.find { userId: $exists: no }, fields: Lists.publicFields


Meteor.publish 'lists.private', ->
  unless @userId
    return @ready()

  Lists.find { userId: @userId }, fields: Lists.publicFields

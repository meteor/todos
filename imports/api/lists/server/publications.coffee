{ Lists } = require '../lists.coffee'


Meteor.publish 'Lists.public', ->
  Lists.find { userId: $exists: no }, fields: Lists.publicFields


Meteor.publish 'Lists.private', ->
  unless @userId
    return @ready()

  Lists.find { userId: @userId }, fields: Lists.publicFields

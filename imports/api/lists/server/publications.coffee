import { Meteor } from 'meteor/meteor'

import { Lists } from '../lists.coffee'


Meteor.publish 'lists.public', ->
  Lists.find { userId: $exists: no }, fields: Lists.publicFields


Meteor.publish 'lists.private', ->
  unless @userId
    return @ready()

  Lists.find { userId: @userId }, fields: Lists.publicFields

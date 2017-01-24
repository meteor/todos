import { Meteor } from 'meteor/meteor'

import { Lists } from '../lists.coffee'


Meteor.publish 'lists.public', ->
  Lists.find
      userId:
        $exists: no
    ,
      fields: Lists.publicFields


Meteor.publish 'lists.private', ->
  return @ready() unless @userId

  Lists.find
      userId: @userId
    ,
      fields: Lists.publicFields

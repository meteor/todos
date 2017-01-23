import { Meteor } from 'meteor/meteor'
import { SimpleSchema } from 'meteor/aldeed:simple-schema'

import { Todos } from '../todos.coffee'
import { Lists } from '../../lists/lists.coffee'


Meteor.publishComposite 'todos.inList', (params) ->
  new SimpleSchema
  	listId:
  		type: String
  .validate params

  { listId } = params
  userId = @userId

  ret =
    find: ->
      query =
        _id: listId
        $or: [
          { userId: $exists: no }
          { userId: userId }
        ]

      # We only need the _id field in this query, since it's only
      # used to drive the child queries to get the todos
      options =
      	fields:
      		_id: 1

      Lists.find query, options

    children: [
    	find: (list) ->
      	Todos.find { listId: list._id }, fields: Todos.publicFields
 		]

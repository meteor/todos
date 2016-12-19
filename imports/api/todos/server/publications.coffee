import { Meteor } from 'meteor/meteor'
import { SimpleSchema } from 'meteor/aldeed:simple-schema'

import TodosModule from '../todos.coffee'
import ListsModule from '../../lists/lists.coffee'


Meteor.publishComposite 'todos.inList', (listId) ->
  new SimpleSchema
  	listId:
  		type: String
  .validate listId: listId

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

      ListsModule.Lists.find query, options

    children: [
    	find: (list) ->
      	TodosModule.Todos.find { listId: list._id }, fields: TodosModule.Todos.publicFields
 		]

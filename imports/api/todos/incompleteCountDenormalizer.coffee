import { _ } from 'meteor/underscore'
import { check } from 'meteor/check'

import { Todos } from './todos.coffee'
import { Lists } from '../lists/lists.coffee'


export default incompleteCountDenormalizer =
  _updateList: (listId) ->
    # Recalculate the correct incomplete count direct from MongoDB
    incompleteCount = Todos.find
      listId: listId
      checked: no
    .count()

    Lists.update listId, $set: incompleteCount: incompleteCount


  afterInsertTodo: (todo) ->
    @_updateList todo.listId


  afterUpdateTodo: (selector, modifier) ->
    # We only support very limited operations on todos
    check modifier, $set: Object

    # We can only deal with $set modifiers, but that's all we do in this app
    if _.has(modifier.$set, 'checked')
      Todos.find(selector, fields: listId: 1).forEach (todo) =>
        @_updateList todo.listId


  afterRemoveTodos: (todos) ->
    todos.forEach (todo) =>
      @_updateList todo.listId

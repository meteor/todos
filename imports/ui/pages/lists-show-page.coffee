{ Template } = require 'meteor/templating'
{ FlowRouter } = require 'meteor/kadira:flow-router'

{ Lists } = require '../../api/lists/lists.coffee'

{ listRenderHold } = require '../launch-screen.coffee'
require './lists-show-page.html'

# Components used inside the template
require './app-not-found.coffee'
require '../components/lists-show.coffee'


Template.Lists_show_page.onCreated ->
  @getListId = ->
    FlowRouter.getParam '_id'

  @autorun =>
    @subscribe 'todos.inList', @getListId()


Template.Lists_show_page.onRendered ->
  @autorun =>
    if @subscriptionsReady()
      listRenderHold.release()


Template.Lists_show_page.helpers
  # We use #each on an array of one item so that the "list" template is
  # removed and a new copy is added when changing lists, which is
  # important for animation purposes.
  listIdArray: ->
    instance = Template.instance()
    listId = instance.getListId()
    if Lists.findOne(listId) then [ listId ] else []

  listArgs: (listId) ->
    instance = Template.instance()
    # By finding the list with only the `_id` field set, we don't create a dependency on the
    # `list.incompleteCount`, and avoid re-rendering the todos when it changes
    list = Lists.findOne(listId, fields: _id: yes)
    todos = list.todos() if list?

    ret =
      todosReady: instance.subscriptionsReady()
      # We pass `list` (which contains the full list, with all fields, as a function
      # because we want to control reactivity. When you check a todo item, the
      # `list.incompleteCount` changes. If we didn't do this the entire list would
      # re-render whenever you checked an item. By isolating the reactiviy on the list
      # to the area that cares about it, we stop it from happening.
      list: ->
        Lists.findOne listId

      todos: todos

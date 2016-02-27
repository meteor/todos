require './lists-show.html'

# Component used in the template
require './todos-item.coffee'

{ updateName, makePublic, makePrivate, remove } = require '../../api/lists/methods.coffee'

{ insert } = require '../../api/todos/methods.coffee'

{ FlowRouter } = require 'meteor/kadira:flow-router'
{ SimpleSchema } = require 'meteor/aldeed:simple-schema'


Template.Lists_show.onCreated ->
  @autorun ->
    new SimpleSchema
      list:
        type: Function
      todosReady:
        type: Boolean
      todos:
        type: Mongo.Cursor
    .validate Template.currentData()

  @state = new ReactiveDict()
  @state.setDefault
    editing: no
    editingTodo: no


  @saveList = =>
    @state.set 'editing', no
    updateName.call
      listId: @data.list()._id
      newName: @$('[name=name]').val()
    , (err) ->
      # Ignore the error - there's nothing useful we can do in the UI
      # here. In particular this case happens if you try to save with
      # an empty list name.
      console.error err if err?


  @editList = =>
    @state.set 'editing', yes

    # force the template to redraw based on the reactive change
    Tracker.flush()
    # TODO -- I think velocity introduces a timeout before actually setting opacity on the
    #   element, so I can't focus it for a moment.
    Meteor.setTimeout =>
      @$('.js-edit-form input[type=text]').focus()


  @deleteList = =>
    list = @data.list()
    message = "Are you sure you want to delete the list #{list.name}?"
    if confirm(message)
      remove.call { listId: list._id }, (err) ->
        # At this point, we have already redirected home as if the list was
        # successfully deleted, but we should at least warn the user their list
        # could not be deleted
        console.error err if err? # translate this string after #59

      FlowRouter.go 'App.home'
      return yes
    return no


  @toggleListPrivacy = =>
    list = @data.list()
    if list.userId?
      makePublic.call { listId: list._id }, (err) ->
        console.error err if err? # translate this string after #59
    else
      makePrivate.call { listId: list._id }, (err) ->
        console.error err if err? # translate this string after #59


Template.Lists_show.helpers
  todoArgs: (todo) ->
    instance = Template.instance()
    return ret =
      todo: todo
      editing: instance.state.equals 'editingTodo', todo._id
      onEditingChange: (editing) ->
        instance.state.set 'editingTodo', if editing then todo._id else no


Template.Lists_show.events
  'click .js-cancel': (event, instance) ->
    instance.state.set 'editing', no


  'keydown input[type=text]': (event) ->
    # ESC
    if event.which is 27
      event.preventDefault()
      $(event.target).blur()


  'blur input[type=text]': (event, instance) ->
    # if we are still editing (we haven't just clicked the cancel button)
    if instance.state.get('editing')
      instance.saveList()


  'submit .js-edit-form': (event, instance) ->
    event.preventDefault()
    instance.saveList()


  'mousedown .js-cancel, click .js-cancel': (event, instance) ->
    event.preventDefault()
    instance.state.set 'editing', no


  'change .list-edit': (event, instance) ->
    if $(event.target).val() is 'edit'
      instance.editList()
    else if $(event.target).val() is 'delete'
      instance.deleteList()
    else
      instance.toggleListPrivacy()
    event.target.selectedIndex = 0


  'click .js-edit-list': (event, instance) ->
    instance.editList()


  'click .js-toggle-list-privacy': (event, instance) ->
    instance.toggleListPrivacy()


  'click .js-delete-list': (event, instance) ->
    instance.deleteList()


  'click .js-todo-add': (event, instance) ->
    instance.$('.js-todo-new input').focus()


  'submit .js-todo-new': (event) ->
    event.preventDefault()
    $input = $(event.target).find('[type=text]')
    unless $input.val()
      insert.call
        listId: @list()._id
        text: $input.val()
      , (err) ->
        console.error err if err? # translate this string after #59
        $input.val ''

console.log 'right here 10'

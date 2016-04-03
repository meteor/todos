{ Meteor } = require 'meteor/meteor'
{ Template } = require 'meteor/templating'
{ Mongo } = require 'meteor/mongo'
{ ReactiveDict } = require 'meteor/reactive-dict'
{ Tracker } = require 'meteor/tracker'
{ $ } = require 'meteor/jquery'

require './lists-show.html'

# Component used in the template
require './todos-item.coffee'

{ updateName, makePublic, makePrivate, remove } = require '../../api/lists/methods.coffee'

{ insert } = require '../../api/todos/methods.coffee'

{ displayError } = require '../lib/errors.coffee'

{ FlowRouter } = require 'meteor/kadira:flow-router'
{ SimpleSchema } = require 'meteor/aldeed:simple-schema'
{ TAPi18n } = require 'meteor/tap:i18n'


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
    , displayError


  @editList = =>
    @state.set 'editing', yes

    # force the template to redraw based on the reactive change
    Tracker.flush()
    # TODO -- I think velocity introduces a timeout before actually setting opacity on the
    #   element, so I can't focus it for a moment.
    Meteor.defer =>
      @$('.js-edit-form input[type=text]').focus()


  @deleteList = =>
    list = @data.list()
    message = "#{TAPi18n.__('Are you sure you want to delete the list')} #{list.name}?"
    if confirm(message)
      remove.call { listId: list._id }, displayError

      FlowRouter.go 'App.home'
      return yes
    return no


  @toggleListPrivacy = =>
    list = @data.list()
    if list.userId?
      makePublic.call { listId: list._id }, displayError
    else
      makePrivate.call { listId: list._id }, displayError


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
    target = event.target
    if $(target).val() is 'edit'
      instance.editList()
    else if $(target).val() is 'delete'
      instance.deleteList()
    else
      instance.toggleListPrivacy()
    target.selectedIndex = 0


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
    if $input.val()
      insert.call
        listId: @list()._id
        text: $input.val()
      , displayError

      $input.val ''

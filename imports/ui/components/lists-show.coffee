import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { Mongo } from 'meteor/mongo'
import { ReactiveDict } from 'meteor/reactive-dict'
import { Tracker } from 'meteor/tracker'
import { $ } from 'meteor/jquery'

import './lists-show.html'

# Component used in the template
import './todos-item.coffee'

import { updateName, makePublic, makePrivate, remove } from '../../api/lists/methods.coffee'

import { insert } from '../../api/todos/methods.coffee'

import { displayError } from '../lib/errors.coffee'

import { FlowRouter } from 'meteor/kadira:flow-router'
import { SimpleSchema } from 'meteor/aldeed:simple-schema'
import { TAPi18n } from 'meteor/tap:i18n'


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

    newName = @$('[name=name]').val().trim()
    if newName
      updateName.call
        listId: @data.list()._id
        newName: newName
      , displayError


  @editList = =>
    @state.set 'editing', yes

    # force the template to redraw based on the reactive change
    Tracker.flush()
    # We need to wait for the fade in animation to complete to reliably focus the input
    Meteor.setTimeout =>
      @$('.js-edit-form input[type=text]').focus()
      return
    , 400


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

  editing: ->
    instance = Template.instance()
    instance.state.get 'editing'


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

    $input = $(event.target).find '[type=text]'
    return unless $input.val()

    insert.call
      listId: @list()._id
      text: $input.val()
    , displayError

    $input.val ''

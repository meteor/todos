import { Meteor } from 'meteor/meteor'
import { ReactiveVar } from 'meteor/reactive-var'
import { ReactiveDict } from 'meteor/reactive-dict'
import { Template } from 'meteor/templating'
import { ActiveRoute } from 'meteor/zimme:active-route'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { TAPi18n } from 'meteor/tap:i18n'
import { T9n } from 'meteor/softwarerero:accounts-t9n'
import { _ } from 'meteor/underscore'
import { $ } from 'meteor/jquery'

import { Lists } from '../../api/lists/lists.coffee'
import { insert } from '../../api/lists/methods.coffee'

import '../components/loading.coffee'
import './app-body.html'


CONNECTION_ISSUE_TIMEOUT = 5000

# A store which is local to this file?
showConnectionIssue = new ReactiveVar no

Meteor.startup ->
  # Only show the connection error box if it has been 5 seconds since
  # the app started
  setTimeout (->
    # FIXME:
    # Launch screen handle created in lib/router.coffee
    # dataReadyHold.release();

    # Show the connection error box
    showConnectionIssue.set yes
  ), CONNECTION_ISSUE_TIMEOUT


Template.App_body.onCreated ->
  @subscribe 'lists.public'
  @subscribe 'lists.private'

  @state = new ReactiveDict
  @state.setDefault
    menuOpen: no
    userMenuOpen: no


Template.App_body.helpers
  menuOpen: ->
    instance = Template.instance()
    'menu-open' if instance.state.get('menuOpen')

  cordova: ->
    'cordova' if Meteor.isCordova

  emailLocalPart: ->
    email = Meteor.user().emails[0].address
    email.substring 0, email.indexOf('@')

  userMenuOpen: ->
    instance = Template.instance()
    instance.state.get 'userMenuOpen'

  lists: ->
    Lists.find $or: [
      { userId: $exists: no }
      { userId: Meteor.userId() }
    ]

  activeListClass: (list) ->
    active = ActiveRoute.name('Lists.show') and FlowRouter.getParam('_id') is list._id
    'active' if active

  connected: ->
    if showConnectionIssue.get()
      Meteor.status().connected
    else
    	yes

  templateGestures:
    'swipeleft .cordova': (event, instance) ->
      instance.state.set 'menuOpen', no

    'swiperight .cordova': (event, instance) ->
      instance.state.set 'menuOpen', yes

  languages: ->
    _.keys TAPi18n.getLanguages()

  isActiveLanguage: (language) ->
    TAPi18n.getLanguage() is language


Template.App_body.events
  'click .js-menu': (event, instance) ->
    instance.state.set 'menuOpen', not instance.state.get('menuOpen')

  'click .content-overlay': (event, instance) ->
    instance.state.set 'menuOpen', no
    event.preventDefault()

  'click .js-user-menu': (event, instance) ->
    instance.state.set 'userMenuOpen', !instance.state.get('userMenuOpen')
    # stop the menu from closing
    event.stopImmediatePropagation()

  'click #menu a': (event, instance) ->
    instance.state.set 'menuOpen', no

  'click .js-logout': ->
    Meteor.logout()
    # if we are on a private list, we'll need to go to a public one
    if ActiveRoute.name('Lists.show')
      # TODO -- test this code path
      list = Lists.findOne(FlowRouter.getParam('_id'))
      if list.userId
        FlowRouter.go 'Lists.show', Lists.findOne(userId: $exists: no)

  'click .js-new-list': ->
    listId = insert.call { language: TAPi18n.getLanguage() }, (err) ->
      if err
        # At this point, we have already redirected to the new list page, but
        # for some reason the list didn't get created. This should almost never
        # happen, but it's good to handle it anyway.
        FlowRouter.go 'App.home'
        alert TAPi18n.__ 'layouts.appBody.newListError'

    FlowRouter.go 'Lists.show', _id: listId

  'click .js-toggle-language': (event) ->
    language = $(event.target).html().trim()
    T9n.setLanguage language
    TAPi18n.setLanguage language


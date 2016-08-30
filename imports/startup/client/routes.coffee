{ FlowRouter } = require 'meteor/kadira:flow-router'
{ BlazeLayout } = require 'meteor/kadira:blaze-layout'

# Import to load these templates
require '../../ui/layouts/app-body.coffee'
require '../../ui/pages/root-redirector.coffee'
require '../../ui/pages/lists-show-page.coffee'
require '../../ui/pages/app-not-found.coffee'

# Import to override accounts templates
require '../../ui/accounts/accounts-templates.coffee'

FlowRouter.route '/lists/:_id',
  name: 'Lists.show'
  action: ->
    BlazeLayout.render 'App_body', main: 'Lists_show_page'

FlowRouter.route '/',
  name: 'App.home'
  action: ->
    BlazeLayout.render 'App_body', main: 'app_rootRedirector'

# the App_notFound template is used for unknown routes and missing lists
FlowRouter.notFound = action: ->
  BlazeLayout.render 'App_body', main: 'App_notFound'

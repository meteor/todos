import { FlowRouter } from 'meteor/kadira:flow-router'
import { BlazeLayout } from 'meteor/kadira:blaze-layout'

# Import to load these templates
import '../../ui/layouts/app-body.coffee'
import '../../ui/pages/root-redirector.coffee'
import '../../ui/pages/lists-show-page.coffee'
import '../../ui/pages/app-not-found.coffee'

# Import to override accounts templates
import '../../ui/accounts/accounts-templates.coffee'

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

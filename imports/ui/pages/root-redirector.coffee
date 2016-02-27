{ FlowRouter } = require 'meteor/kadira:flow-router'
{ Lists } = require '../../api/lists/lists.coffee'

require './root-redirector.html';

Template.app_rootRedirector.onCreated ->
  # We need to set a timeout here so that we don't redirect from inside a redirection
  #   which is a no-no in FR.
  Meteor.setTimeout ->
    FlowRouter.go 'Lists.show', Lists.findOne()

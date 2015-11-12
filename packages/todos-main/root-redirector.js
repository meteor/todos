/* globals FlowRouter, Lists */

Template.rootRedirector.onCreated(() => {
  // We need to set a timeout here so that we don't redirect from inside a redirection
  //   which is a no-no in FR. TODO: find out from arunoda if this is correct.
  Meteor.setTimeout(() => {
    FlowRouter.go('listsShow', Lists.findOne());
  });
});

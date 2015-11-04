/* globals FlowRouter, Lists */

Template.rootRedirector.onCreated(() => {
  FlowRouter.go('listsShow', Lists.findOne());
});

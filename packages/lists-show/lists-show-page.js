/* global FlowRouter Lists AppLaunchScreenHolds */

Template.listsShowPage.onCreated(function() {
  // XXX: FR
  // XXX as I understand, we don't want this to be reactive because we might
  // want to animate between pages?
  this.listId = FlowRouter.getParam('_id');
  this.subscribe('list/todos', this.listId);
});

Template.listsShowPage.onRendered(function() {
  this.autorun(() => {
    if (this.subscriptionsReady()) {
      // Handle for launch screen defined in app-body.js
      AppLaunchScreenHolds.listRender.release();
    }
  });
});

Template.listsShowPage.helpers({
  list: function() {
    const instance = Template.instance();
    return Lists.findOne(instance.listId);
  }
});

/* global FlowRouter Lists AppLaunchScreenHolds */

Template.listsShowPage.onCreated(function() {
  this.state = new ReactiveDict();
  this.autorun(() => {
    this.state.set('listId', FlowRouter.getParam('_id'));
    this.subscribe('list/todos', this.state.get('listId'));
  });
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
  listIdArray() {
    const instance = Template.instance();
    return [{_id: instance.state.get('listId')}];
  },
  list() {
    const instance = Template.instance();
    return Lists.findOne(instance.state.get('listId'));
  }
});

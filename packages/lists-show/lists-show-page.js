/* global FlowRouter Lists AppLaunchScreen */

Template.listsShowPage.onCreated(function() {
  this.state = new ReactiveDict();
  this.autorun(() => {
    const listId = FlowRouter.getParam('_id');
    this.state.set({listId});
    this.subscribe('list/todos', listId);
  });
});

Template.listsShowPage.onRendered(function() {
  this.autorun(() => {
    if (this.subscriptionsReady()) {
      // Handle for launch screen defined in app-body.js
      AppLaunchScreen.listRender.release();
    }
  });
});

Template.listsShowPage.helpers({
  // We use #each on an array of one item so that the "list" template is
  // removed and a new copy is added when changing lists, which is
  // important for animation purposes. #each looks at the _id property of it's
  // items to know when to insert a new item and when to update an old one.
  listArray() {
    const instance = Template.instance();
    const list = Lists.findOne(instance.state.get('listId'));
    return [list];
  }
});

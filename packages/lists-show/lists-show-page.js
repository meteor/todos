/* global FlowRouter Lists AppLaunchScreen */

Template.listsShowPage.onCreated(function() {
  this.getListId = () => FlowRouter.getParam('_id');

  this.autorun(() => {
    this.subscribe('list/todos', this.getListId());
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
    const list = Lists.findOne(instance.getListId(), {fields: {_id: true}});
    return list ? [list] : [];
  },
  // We pass `list` (which contains the full list, with all fields, as oppposed the record
  // with _id only from above, because we want to control reactivity. When you check a todo
  // item, the `list.incompleteCount` changes. If we didn't do this the entire list would
  // re-render whenever you checked and item. By isolating the reactiviy on the list
  // to the area that cares about it, we stop it from happening.
  getFullList(listIdOnly) {
    // XXX: I've no idea why I need to return a function that returns a function here.
    //   I think a refactor is in order
    return () => {
      return () => {
        return Lists.findOne(listIdOnly._id);
      };
    };
  }
});

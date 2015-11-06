/* global listFadeInHold:true dataReadyHold:true */
/* global LaunchScreen FlowRouter Lists */

// Track if this is the first time the list template is rendered
let firstRender = true;
const listRenderHold = LaunchScreen.hold();
listFadeInHold = null;
// Keep showing the launch screen on mobile devices until we have loaded
// the app's data
dataReadyHold = LaunchScreen.hold();

Template.listsShowPage.onCreated(function() {
  if (firstRender) {
    // Released in app-body.js
    listFadeInHold = LaunchScreen.hold();

    // Handle for launch screen defined in app-body.js
    listRenderHold.release();

    firstRender = false;
  }

  // XXX: FR
  // XXX as I understand, we don't want this to be reactive because we might
  // want to animate between pages?
  this.listId = FlowRouter.getParam('_id');
  this.subscribe('list/todos', this.listId);

  this.autorun(() => {
    if (this.subscriptionsReady()) {
      // Handle for launch screen defined in app-body.js
      dataReadyHold.release();
    }
  });
});

Template.listsShowPage.helpers({
  list: function() {
    const instance = Template.instance();
    return Lists.findOne(instance.listId);
  }
});

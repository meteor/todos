// Track if this is the first time the list template is rendered
var firstRender = true;
var listRenderHold = LaunchScreen.hold();
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
  this.listId = Router.current().params._id;
  this.subscribe('todos', this.listId);

  this.autorun(() => {
    if (this.subscriptionsReady()) {
      // Handle for launch screen defined in app-body.js
      dataReadyHold.release();
    }
  });
});

Template.listsShowPage.helpers({
  list: function() {
    const template = Template.instance();
    return Lists.findOne(template.listId);
  }
});

/* global Lists ActiveRoute FlowRouter listFadeInHold */

const MENU_KEY = 'menuOpen';
Session.setDefault(MENU_KEY, false);

const USER_MENU_KEY = 'userMenuOpen';
Session.setDefault(USER_MENU_KEY, false);

const SHOW_CONNECTION_ISSUE_KEY = 'showConnectionIssue';
Session.setDefault(SHOW_CONNECTION_ISSUE_KEY, false);

const CONNECTION_ISSUE_TIMEOUT = 5000;

Meteor.startup(() => {
  // set up a swipe left / right handler
  $(document.body).touchwipe({
    wipeLeft() {
      Session.set(MENU_KEY, false);
    },
    wipeRight() {
      Session.set(MENU_KEY, true);
    },
    preventDefaultEvents: false
  });

  // Only show the connection error box if it has been 5 seconds since
  // the app started
  setTimeout(() => {
    // FIXME:
    // Launch screen handle created in lib/router.js
    // dataReadyHold.release();

    // Show the connection error box
    Session.set(SHOW_CONNECTION_ISSUE_KEY, true);
  }, CONNECTION_ISSUE_TIMEOUT);
});

Template.appBody.onCreated(function() {
  this.subscribe('lists/public');
  this.subscribe('lists/private');

  this.state = new ReactiveDict('app.body');
  this.state.setDefault({
    menuOpen: false,
    userMenuOpen: false,
    showConnectionIssue: false
  });
});

Template.appBody.onRendered(function() {
  this.find('#content-container')._uihooks = {
    insertElement(node, next) {
      $(node)
        .hide()
        .insertBefore(next)
        .fadeIn(function() {
          if (listFadeInHold) {
            listFadeInHold.release();
          }
        });
    },
    removeElement(node) {
      $(node).fadeOut(function() {
        $(this).remove();
      });
    }
  };
});

Template.appBody.helpers({
  // We use #each on an array of one item so that the "list" template is
  // removed and a new copy is added when changing lists, which is
  // important for animation purposes. #each looks at the _id property of it's
  // items to know when to insert a new item and when to update an old one.
  thisArray() {
    return [this];
  },
  menuOpen() {
    const instance = Template.instance();
    return instance.state.get('menuOpen') && 'menu-open';
  },
  cordova() {
    return Meteor.isCordova && 'cordova';
  },
  emailLocalPart() {
    const email = Meteor.user().emails[0].address;
    return email.substring(0, email.indexOf('@'));
  },
  userMenuOpen() {
    const instance = Template.instance();
    return instance.state.get('userMenuOpen');
  },
  lists() {
    return Lists.find();
  },
  activeListClass(list) {
    const active = ActiveRoute.name('listsShow')
      && FlowRouter.getParam('_id') === list._id;

    return active && 'active';
  },
  connected() {
    const instance = Template.instance();
    if (instance.state.get('showConnectionIssue')) {
      return Meteor.status().connected;
    }

    return true;
  }
});

Template.appBody.events({
  'click .js-menu'(event, instance) {
    instance.state.set('menuOpen', !instance.state.get('menuOpen'));
  },

  'click .content-overlay'(event, instance) {
    instance.state.set('menuOpen', false);
    event.preventDefault();
  },

  'click .js-user-menu'(event, instance) {
    instance.state.set('userMenuOpen', !instance.state.get('userMenuOpen'));
    // stop the menu from closing
    event.stopImmediatePropagation();
  },

  'click #menu a'(event, instance) {
    instance.state.set('menuOpen', false);
  },

  'click .js-logout'() {
    Meteor.logout();

    // if we are on a private list, we'll need to go to a public one
    if (ActiveRoute.name('listsShow')) {
      // TODO -- test this code path
      const list = Lists.findOne(FlowRouter.getParam('_id'));
      if (list.userId) {
        FlowRouter.go('listsShow', Lists.findOne({userId: {$exists: false}}));
      }
    }
  },

  'click .js-new-list'() {
    const listId = Lists.methods.insert.call();

    console.log(listId);

    // Doesn't work since the above doesn't return anything
    FlowRouter.go('listsShow', { _id: listId });
  }
});

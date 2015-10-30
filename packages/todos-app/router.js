Router.configure({
  // we use the  appBody template to define the layout for the entire app
  layoutTemplate: 'appBody',

  // the appNotFound template is used for unknown routes and missing lists
  notFoundTemplate: 'appNotFound',

  // show the appLoading template whilst the subscriptions below load their data
  loadingTemplate: 'appLoading',

  // wait on the following subscriptions before rendering the page to ensure
  // the data it's expecting is present
  waitOn: function() {
    return [
      Meteor.subscribe('lists/public'),
      Meteor.subscribe('lists/private')
    ];
  }
});

if (Meteor.isClient) {
  // Show the loading screen on desktop
  Router.onBeforeAction('loading', {except: ['join', 'signin']});
  Router.onBeforeAction('dataNotFound', {except: ['join', 'signin']});
}

Router.route('join');
Router.route('signin');

Router.route('listsShowPage', {path: '/lists/:_id'});

Router.route('home', {
  path: '/',
  action: function() {
    Router.go('listsShow', Lists.findOne());
  }
});

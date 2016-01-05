/* global FlowRouter BlazeLayout AccountsTemplates */

// This file needs to load first, so that useraccounts:core doesn't complain when we define
// a forgotPwd route
import '../useraccounts-configuration.js';

// Import to load these templates
import '../imports/client/layouts/app-body.js';
import '../imports/client/pages/root-redirector.js';
import '../imports/client/pages/lists-show-page.js';
import '../imports/client/pages/app-not-found.js';

// Import to override accounts templates
import '../imports/client/accounts/accounts-templates.js';

FlowRouter.route('/lists/:_id', {
  name: 'Lists.show',
  action() {
    BlazeLayout.render('App_body', {main: 'Lists_show_page'});
  }
});

FlowRouter.route('/', {
  name: 'App.home',
  action() {
    BlazeLayout.render('App_body', {main: 'app_rootRedirector'});
  }
});

// the App_notFound template is used for unknown routes and missing lists
FlowRouter.notFound = {
  action() {
    BlazeLayout.render('App_body', {main: 'App_notFound'});
  }
};

AccountsTemplates.configureRoute('signIn', {
  name: 'signin',
  path: '/signin'
});

AccountsTemplates.configureRoute('signUp', {
  name: 'join',
  path: '/join'
});

AccountsTemplates.configureRoute('forgotPwd');

AccountsTemplates.configureRoute('resetPwd', {
  name: 'resetPwd',
  path: '/reset-password'
});

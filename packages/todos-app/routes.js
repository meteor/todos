/* global FlowRouter BlazeLayout AccountsTemplates */

FlowRouter.route('/lists/:_id', {
  name: 'listsShow',
  action: () => {
    BlazeLayout.render('appBody', {main: 'listsShowPage'});
  }
});

FlowRouter.route('/', {
  name: 'home',
  action: () => {
    BlazeLayout.render('appBody', {main: 'rootRedirector'});
  }
});

// the appNotFound template is used for unknown routes and missing lists
FlowRouter.notFound = {
  action() {
    BlazeLayout.render('appBody', {main: 'appNotFound'});
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

AccountsTemplates.configureRoute('resetPwd');

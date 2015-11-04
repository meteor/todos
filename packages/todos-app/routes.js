/* global FlowRouter BlazeLayout */

FlowRouter.route('/join', {
  name: 'join',
  action: () => {
    BlazeLayout.render('appBody', {main: 'join'});
  }
});

FlowRouter.route('/signin', {
  name: 'signin',
  action: () => {
    BlazeLayout.render('appBody', {main: 'signin'});
  }
});

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

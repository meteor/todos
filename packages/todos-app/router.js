/* global FlowRouter BlazeLayout */

FlowRouter.route('/join', {action: () => {
  BlazeLayout.render('appBody', {main: 'join'});
}});

FlowRouter.route('/signin', {action: () => {
  BlazeLayout.render('appBody', {main: 'signin'});
}});

FlowRouter.route('/lists/:_id', {action: () => {
  BlazeLayout.render('appBody', {main: 'listsShowPage'});
}});

FlowRouter.route('/', {action: () => {
  // TODO: use an "appRedirector template"
  FlowRouter.go('listsShow', Lists.findOne());
}});

// the appNotFound template is used for unknown routes and missing lists
FlowRouter.notFound = {
  action() {
    BlazeLayout.render('appBody', {main: 'appNotFound'});
  }
};

import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

// Import to load these templates
import '../../ui/layouts/app-body.js';
import '../../ui/pages/root-redirector.js';
import '../../ui/pages/lists-show-page.js';
import '../../ui/pages/app-not-found.js';

// Import to override accounts templates
import '../../ui/accounts/accounts-templates.js';

FlowRouter.route('/lists/:_id', {
  name: 'Lists.show',
  action() {
    this.render('App_body', { main: 'Lists_show_page' });
  },
});

FlowRouter.route('/', {
  name: 'App.home',
  action() {
      this.render('App_body', { main: 'app_rootRedirector' });
  },
});

// the App_notFound template is used for unknown routes and missing lists
FlowRouter.route('*', {
  name: "NotFound",
  action() {
      this.render('App_body', { main: 'App_notFound' });
  },
});

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Lists } from '../../api/lists/lists.js';

import './root-redirector.html';

Template.app_rootRedirector.onCreated(() => {
  // We need to set a timeout here so that we don't redirect from inside a redirection
  //   which is a no-no in FR.
  Meteor.defer(() => {
    FlowRouter.go('Lists.show', Lists.findOne());
  });
});

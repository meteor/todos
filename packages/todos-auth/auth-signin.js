/* global FlowRouter */

const ERRORS_KEY = 'signinErrors';

Template.signin.onCreated(function() {
  Session.set(ERRORS_KEY, {});
});

Template.signin.helpers({
  errorMessages() {
    return _.values(Session.get(ERRORS_KEY));
  },
  errorClass(key) {
    return Session.get(ERRORS_KEY)[key] && 'error';
  }
});

Template.signin.events({
  'submit'(event, template) {
    event.preventDefault();

    const email = template.$('[name=email]').val();
    const password = template.$('[name=password]').val();

    const errors = {};

    if (!email) {
      errors.email = 'Email is required';
    }

    if (!password) {
      errors.password = 'Password is required';
    }

    Session.set(ERRORS_KEY, errors);
    if (_.keys(errors).length) {
      return;
    }

    Meteor.loginWithPassword(email, password, function(error) {
      if (error) {
        return Session.set(ERRORS_KEY, {'none': error.reason});
      }

      FlowRouter.go('home');
    });
  }
});

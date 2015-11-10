/* global AccountsTemplates */

// We identified the templates that need to be overridden by looking at the available templates
// here: https://github.com/meteor-useraccounts/unstyled/tree/master/lib
Template['override-atPwdFormBtn'].replaces('atPwdFormBtn');
Template['override-atPwdForm'].replaces('atPwdForm');
Template['override-atTextInput'].replaces('atTextInput');
Template['override-atTitle'].replaces('atTitle');
Template['override-atError'].replaces('atError');

AccountsTemplates.configure({
  showForgotPasswordLink: true,
  texts: {
    errors: {
      loginForbidden: "Incorrect username or password",
      pwdMismatch: "Passwords don't match",
    },
    title: {
      signIn: "Sign In",
      signUp: "Join",
    }
  },
  defaultTemplate: 'authPage',
  defaultLayout: 'appBody',
  defaultContentRegion: 'main',
  defaultLayoutRegions: {}
});

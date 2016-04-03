{ AccountsTemplates } = require 'meteor/useraccounts:core'
{ TAPi18n } = require 'meteor/tap:i18n'


AccountsTemplates.configure
  showForgotPasswordLink: true
  texts:
    errors:
      loginForbidden: TAPi18n.__ 'Incorrect username or password'
      pwdMismatch: TAPi18n.__ 'Passwords don\'t match'
    title:
      signIn: TAPi18n.__ 'Sign In'
      signUp: TAPi18n.__ 'Join'
  defaultTemplate: 'Auth_page'
  defaultLayout: 'App_body'
  defaultContentRegion: 'main'
  defaultLayoutRegions: {}

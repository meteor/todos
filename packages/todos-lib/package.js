Package.describe({
  name: 'todos-lib',
  summary: 'Common dependencies of all app packages'
});

Package.onUse(function(api) {
  // Language stuff
  api.imply([
    'ecmascript',
    'es5-shim',
    'standard-minifiers',
    'underscore',
    'check',
  ]);

  // Collections
  api.imply([
    'mongo',
    'aldeed:collection2@2.5.0',
    'dburles:collection-helpers@1.0.4'
  ]);

  // Client-side libraries
  api.imply([
    'tracker',
    'jquery',
    'blaze-html-templates',
    'reactive-dict',
    'session',
  ]);

  // Routing
  api.imply([
    'kadira:flow-router@2.7.0',
    'kadira:blaze-layout@2.2.0',
    'arillo:flow-router-helpers@0.4.5',
    'zimme:active-route@2.3.0',
  ]);

  // Mobile stuff
  api.imply([
    'touchwipe',
    'mobile-experience',
  ]);

  // CSS
  api.imply([
    'less',
    'less-imports',
  ]);

  // Testing setup
  api.imply([
    'factory',
  ]);

  // Accounts
  api.imply([
    'accounts-password',
  ]);

  // DDP
  api.imply([
    'method',
  ]);
});

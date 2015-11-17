Package.describe({
  summary: 'Common dependencies of all app packages',
  documentation: null,
});

Package.onUse(function(api) {
  // Language stuff
  api.imply([
    'ecmascript',
    'es5-shim',
    'underscore',
    'check',
  ]);

  // Collections
  api.imply([
    'mongo',
    'aldeed:collection2@2.5.0',
    'dburles:collection-helpers@1.0.4',
    'denormalizer',
    'mdg:validation-error'
  ]);

  // Client-side libraries
  api.imply([
    'tracker',
    'jquery',
    'blaze-html-templates',
    'blaze-helpers',
    'reactive-dict',
    'reactive-var',
    'session',
    'aldeed:template-extension@3.4.3',
    'percolate:momentum@0.7.2'
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
    'mobile-experience',
    'chriswessels:hammer@4.0.2'
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
    'useraccounts:unstyled@1.12.4',
    'useraccounts:flow-routing@1.12.4',
    // Required by the above. This version fixes https://github.com/softwarerero/meteor-accounts-t9n/issues/122
    'softwarerero:accounts-t9n@1.1.6'
  ]);

  // Security
  api.imply([
    'ddp-rate-limiter',

    // Production only package with some more security
    'app-prod-security',
  ]);

  // DDP
  api.imply([
    'method',
  ]);
});

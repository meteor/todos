Package.describe({
  name: 'todos-lib',
  // Brief, one-line summary of the package.
  summary: 'Common dependencies of all app packages'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');

  api.imply([
    'ecmascript',
    'blaze-html-templates',
    'less',
    'kadira:flow-router@2.7.0',
    'kadira:blaze-layout@2.2.0',
    'session',
    'launch-screen',
    'arillo:flow-router-helpers@0.4.5',
    'zimme:active-route@2.3.0',
    'aldeed:collection2@2.5.0',
    'factory',
    'reactive-dict',
    'underscore',
    'touchwipe',
    'less-imports',
  ]);
});

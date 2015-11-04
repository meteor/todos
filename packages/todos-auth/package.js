Package.describe({
  name: 'todos-auth',
  version: '0.0.1',
  summary: 'Authentication Templates for Todos App'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use([
    'ecmascript',
    'templating',
    'less',
    'kadira:flow-router@2.7.0',
    'arillo:flow-router-helpers@0.4.5'
  ]);
  api.addFiles([
    'auth-join.html',
    'auth-join.js',
    'auth-signin.html',
    'auth-signin.js',
    'auth.import.less'
  ], 'client');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('todos-auth');
  api.addFiles('todos-auth-tests.js');
});

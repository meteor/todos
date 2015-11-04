Package.describe({
  name: 'todos-app',
  version: '0.0.1',
  summary: 'Base Layouts and Styles for the Todos app'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  // For now, switch to FR in a sec
  // TODO: remove session
  api.use([
    'todos-lib',
    'lists'
  ]);

  api.addFiles([
    'head.html',
    'loading.html',
    'loading.import.less',
    'app-not-found.html',
    'app-not-found.import.less',
    'app-body.html',
    'app-body.js',
    'root-redirector.html',
    'root-redirector.js',
    'routes.js'
  ], 'client');
});

Package.onTest(function(api) {
  api.use('todos-lib');
  api.use('tinytest');
  api.use('todos-app');
  api.addFiles('todos-app-tests.js');
});

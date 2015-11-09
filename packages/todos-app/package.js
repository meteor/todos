Package.describe({
  name: 'todos-main',
  version: '0.0.1',
  summary: 'Entry point for the Todos app',
  documentation: null,
});

Package.onUse(function(api) {
  api.use('todos-lib');

  api.use([
    'lists',
    'lists-show',
    'todos',
    'todos-auth',
    'less-globals',
  ]);

  api.addFiles([
    'head.html',
    'loading.html',
    'loading.less',
    'app-not-found.html',
    'app-not-found.less',
    'app-body.html',
    'app-body.js',
    'root-redirector.html',
    'root-redirector.js',
    'routes.js'
  ], 'client');

  api.addFiles([
    'bootstrap.js'
  ], 'server');
});

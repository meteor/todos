Package.describe({
  name: 'todos-auth',
  version: '0.0.1',
  summary: 'Authentication Templates for Todos App'
});

Package.onUse(function(api) {
  api.use('todos-lib');

  api.addFiles([
    'auth.html',
    'auth.js',
    'auth.less'
  ], 'client');
});

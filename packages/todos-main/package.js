Package.describe({
  name: 'todos-main',
  version: '0.0.1',
  summary: 'Entry point for the Todos app',
  documentation: null,
});

Package.onUse(function(api) {
  api.use([
    'lists',
    'todos',
    'todos-auth',
    'less-globals',
  ]);

  api.imply([
    'lists',
    'todos',
    'todos-auth',
    'less-globals',
  ]);
});

Package.describe({
  name: 'todos',
  version: '0.0.1',
  summary: 'Todo collection',
  documentation: null,
});

Package.onUse(function (api) {
  api.use(['todos-lib', 'lists']);

  api.addFiles([
    'todos.js',
    'methods.js',
  ]);

  api.addFiles('publications.js', 'server');

  api.export('Todos');
});

Package.onTest(function (api) {
  api.use([
    'todos-test-lib',
    'todos',
    'lists'
  ]);

  api.addFiles('todos-tests.js', 'server');
});

Package.describe({
  name: 'lists',
  version: '0.0.1',
  summary: 'Todo list collection',
  documentation: null,
});

Package.onUse(function(api) {
  api.use(['todos-lib']);

  api.addFiles([
    'lists.js',
    'methods.js',
  ]);

  api.addFiles('publications.js', 'server');

  api.export('Lists');
});

Package.onTest(function(api) {
  api.use([
    'todos-test-lib',
    'lists',
    'todos'
  ]);
  api.addFiles('lists-tests.js', 'server');
});

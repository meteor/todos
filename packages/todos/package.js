Package.describe({
  name: 'todos',
  version: '0.0.1',
  summary: 'Todo collection'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('todos-lib');
  api.addFiles('todos.js');
  api.export('Todos');
});

Package.onTest(function(api) {
  api.use([
    'todos-lib',
    'practicalmeteor:mocha@2.1.0_5',
    'todos',
    'lists'
  ]);
  api.addFiles('todos-tests.js', 'server');
});

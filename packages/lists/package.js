Package.describe({
  name: 'lists',
  version: '0.0.1',
  summary: 'Todo list collection'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('todos-lib');
  api.addFiles('lists.js');
  api.addFiles('methods.js');
  api.export('Lists');
});

Package.onTest(function(api) {
  api.use([
    'todos-lib',
    'practicalmeteor:mocha@2.1.0_5',
    'lists',
    'underscore',
    'publication-collector'
  ]);
  api.addFiles('lists-tests.js', 'server');
});

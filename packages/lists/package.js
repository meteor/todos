Package.describe({
  name: 'lists',
  version: '0.0.1',
  summary: 'Todo list collection'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use(['ecmascript', 'aldeed:collection2@2.5.0', 'factory']);
  api.addFiles('lists.js');
  api.export('Lists');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('lists');
  api.addFiles('lists-tests.js');
});

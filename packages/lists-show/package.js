Package.describe({
  name: 'lists-show',
  version: '0.0.1',
  summary: 'Render a single list and its todos',
  documentation: null,
});

Package.onUse(function(api) {
  api.use('todos-lib');

  api.use([
    'lists',
    'todos',
  ]);

  api.addFiles([
    'todos-item.html',
    'todos-item.js',
  ], 'client');

  // UGGGH. Get rid of this ASAP!
  api.export('listFadeInHold');
});

Package.onTest(function(api) {
  api.use([
    'todos-test-lib',
    'lists-show',
    'todos',
    'lists',
    'templating',
    'jquery'
  ]);

  api.addFiles([
    'test-helpers.js',
    'todos-item-tests.js'
  ], 'client');
});

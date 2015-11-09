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
    'todos'
  ]);

  api.addFiles([
    'todos-item.html',
    'todos-item.js',
    'lists-show.html',
    'lists-show.js',
    'lists-show-page.html',
    'lists-show-page.js',
    'lists-show.less'
  ], 'client');

  // UGGGH. Get rid of this ASAP!
  api.export('listFadeInHold');
});

Package.onTest(function(api) {
  api.use([
    'todos-test-lib',
    'lists-show',
    'practicalmeteor:mocha@2.1.0_5',
    'todos',
    'lists',
    'templating',
    'jquery'
  ]);

  api.addFiles([
    'test-helpers.js',
    'lists-show-tests.js',
    'todos-item-tests.js'
  ], 'client');
});

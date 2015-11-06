Package.describe({
  name: 'lists-show',
  version: '0.0.1',
  summary: 'Render a single list and it\'s todos'
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
    'ecmascript',
    'lists-show',
    'practicalmeteor:mocha@2.1.0_5',
    'factory',
    'stub-collections',
    'todos',
    'lists',
    'underscore',
    'templating',
    'tracker',
    'jquery'
  ]);

  api.addFiles('lists-show-tests.js', 'client');
});

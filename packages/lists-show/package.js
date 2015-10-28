Package.describe({
  name: 'lists-show',
  version: '0.0.1',
  summary: 'Render a single list and it\'s todos'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  // TODO: remove session, iron-router?
  api.use(['ecmascript', 'templating', 'less', 'underscore', 'session', 'launch-screen', 'iron:router@1.0.12']);
  api.addFiles([
    'todos-item.html',
    'todos-item.js',
    'lists-show.html',
    'lists-show.js',
    'lists-show.import.less'
  ], 'client');

  // UGGGH. Get rid of this ASAP!
  api.export('listFadeInHold');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('lists-show');
  api.addFiles('lists-show-tests.js', 'client');
});

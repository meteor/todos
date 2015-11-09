Package.describe({
  name: 'factory',
  version: '1.0.0',
  summary: 'Factories for Meteor',
  documentation: null,
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.use([
    'underscore',
    'minimongo',
    'random',
    'ecmascript'
  ]);
  api.imply(['dfischer:faker', 'random']);
  api.addFiles(['factory.js', 'dataset.js', 'factory-api.js']);
  api.export('Factory');
});

Package.onTest(function(api) {
  api.use(['ecmascript', 'tinytest', 'factory', 'underscore']);
  api.addFiles('factory-tests.js', 'server');
});

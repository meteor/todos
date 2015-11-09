Package.describe({
  name: 'denormalizer',
  version: '0.0.1',
  summary: 'Encapsulate denormalizing logic in one place',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  api.addFiles('denormalizer.js');
  api.export('Denormalizer');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('denormalizer');
  api.addFiles('denormalizer-tests.js');
});

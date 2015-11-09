Package.describe({
  name: 'todos-test-lib',
  summary: 'Common dependencies of all app tests',
  documentation: null,
});

Package.onUse(function(api) {
  api.imply([
    'ecmascript',
    'underscore',
    'check',
    'practicalmeteor:mocha@2.1.0_5',
    'publication-collector',
    'factory',
    'stub-collections',
    'tracker'
  ]);
});

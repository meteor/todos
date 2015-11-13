Package.describe({
  name: 'todos-test-lib',
  summary: 'Common dependencies of all app tests',
  documentation: null,
});

Package.onUse(function(api) {
  api.imply([
    'todos-lib',
    'practicalmeteor:mocha@2.1.0_5',
    'practicalmeteor:chai@2.1.0_1',
    'publication-collector',
    'factory',
    'stub-collections',
    'ddp',
  ]);
});

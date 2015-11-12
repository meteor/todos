Package.describe({
  name: 'todos-test-lib',
  summary: 'Common dependencies of all app tests',
  documentation: null,
});

Package.onUse(function(api) {
  api.imply([
    'todos-lib',
    'mike:mocha-package@0.5.9',
    'practicalmeteor:chai@2.1.0_1',
    'publication-collector',
    'factory',
    'stub-collections',
    'ddp',
  ]);
});

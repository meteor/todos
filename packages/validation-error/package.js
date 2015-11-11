Package.describe({
  name: 'validation-error',
  version: '0.0.1',
  summary: 'A generic validation error type to be used by form/method/validation packages'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use([
    'ecmascript',
    'aldeed:simple-schema@1.3.3',
    'check'
  ]);
  api.addFiles('validation-error.js');
  api.export('ValidationError');
});

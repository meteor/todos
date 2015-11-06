Package.describe({
  name: 'blaze-helpers',
  version: '0.0.1',
  summary: 'Simple helpers to make reusable blaze components'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use(['ecmascript', 'blaze', 'templating']);
  api.addFiles('blaze-helpers.js', 'client');
});

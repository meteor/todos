Package.describe({
  name: 'todos-auth',
  summary: 'Authentication Templates for Todos App',
  documentation: null,
});

Package.onUse(function(api) {
  api.use('todos-lib');

  api.addFiles([
    'accounts-templates.html',
    'accounts-templates.js',
    'accounts-templates.less'
  ], 'client');

  api.addFiles([
    'reset-password-email.js',
  ], 'server');

  api.addFiles([
    'deny-profile.js',
  ]);
});

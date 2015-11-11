Package.describe({
  name: 'app-launch-screen',
  summary: 'Manage launch screen status for the app',
  documentation: null,
});

Package.onUse(function(api) {
  api.use('todos-lib');

  api.addFiles('app-launch-screen.js', 'client');

  api.export('AppLaunchScreen');
});

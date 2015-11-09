Package.describe({
  name: 'app-launch-screen',
  summary: 'Manage launch screen status for the app',
});

Package.onUse(function(api) {
  api.use('todos-lib');

  api.addFiles('app-launch-screen.js');

  api.export('AppLaunchScreen');
});

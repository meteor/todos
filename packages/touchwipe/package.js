Package.describe({
  name: 'touchwipe',
  summary: 'jQuery touch wipe plugin'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('jquery');
  api.addFiles('jquery.touchwipe.js', 'client');
});

Package.describe({
  name: 'less-util',
  summary: 'LESS variables and mixins used throughout the app',
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('less');

  api.addFiles([
    'reset.less',
    'util.import.less',
    'util/helpers.import.less',
    'util/lesshat.import.less',
    'util/fontface.import.less',
    'util/text.import.less',
    'util/typography.import.less',
    'util/variables.import.less',
  ]);
});

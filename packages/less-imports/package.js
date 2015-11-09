Package.describe({
  name: 'less-imports',
  summary: 'LESS variables and mixins used throughout the app',
  documentation: null,
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');

  api.use('less');

  api.addFiles([
    'imports.import.less',
    'imports/helpers.import.less',
    'imports/fontface.import.less',
    'imports/text.import.less',
    'imports/typography.import.less',
    'imports/variables.import.less',
  ]);
});

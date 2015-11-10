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

  api.addAssets([
    'font/OpenSans-Light-webfont.eot',
    'font/OpenSans-Light-webfont.svg',
    'font/OpenSans-Light-webfont.ttf',
    'font/OpenSans-Light-webfont.woff',
    'font/OpenSans-Regular-webfont.eot',
    'font/OpenSans-Regular-webfont.svg',
    'font/OpenSans-Regular-webfont.ttf',
    'font/OpenSans-Regular-webfont.woff',
  ], 'client');
});

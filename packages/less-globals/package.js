Package.describe({
  name: 'less-globals',
  summary: 'Global CSS styles that are eagerly included',
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');

  api.use('less');

  api.addFiles([
    // Reset goes first
    'reset.less',

    // Everything else
    'base.less',
    'button.less',
    'form.less',
    'icon.less',
    'layout.less',
    'link.less',
    'list-items.less',
    'menu.less',
    'message.less',
    'nav.less',
    'notification.less',
  ]);
});

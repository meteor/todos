Package.describe({
  name: 'less-globals',
  summary: 'Global CSS styles that are eagerly included',
});

Package.onUse(function(api) {
  api.use('todos-lib');

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

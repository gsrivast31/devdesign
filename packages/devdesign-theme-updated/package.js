Package.describe({
  summary: "DevDesign custom theme",
  version: '0.0.0',
  name: "devdesign-theme-updated"
});

Package.onUse(function (api) {

	api.use(['templating', 'devdesign-base', 'devdesign-theme-hubble'], ['client']);

  api.add_files([
    'lib/client/stylesheets/screen.css',
    'lib/client/templates/new_posts_list.html',
    'lib/client/devdesign.js'
    ], ['client']);

});

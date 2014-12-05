Package.describe({
  summary: "Telescope custom theme",
  version: '0.1.0',
  name: "telescope-theme-devdesign"
});

Package.onUse(function (api) {

	api.use(['templating', 'telescope-base', 'telescope-theme-hubble'], ['client']);
  //api.use(['telescope-theme-hubble'], ['client']);

  api.add_files([
    'lib/client/stylesheets/screen.css',
    'lib/client/templates/new_posts_list.html',
    'lib/client/devdesign.js'
    ], ['client']);

});

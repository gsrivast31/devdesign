Package.describe({summary: "DevDesign API package"});

Package.onUse(function (api) {

  api.use(['devdesign-base', 'devdesign-lib'], ['server']);

  api.add_files(['lib/server/api.js', 'lib/server/routes.js'], ['server']);

  api.export(['serveAPI']);

});
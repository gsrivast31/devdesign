Package.describe({summary: "DevDesign base theme"});

Package.onUse(function (api) {

  api.use(['devdesign-lib', 'devdesign-base'], ['client', 'server']);
  
  api.add_files([
    'lib/client/css/screen.css',
    ], ['client']);
  
});
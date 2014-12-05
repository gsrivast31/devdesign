Package.describe({summary: "DevDesign Hubble theme"});

Package.onUse(function (api) {

  api.use(['devdesign-lib', 'devdesign-base'], ['client', 'server']);

  api.add_files([
    'lib/hubble.js',
    ], ['client', 'server']);

  api.add_files([
    'lib/client/css/screen.css',
    ], ['client']);
  
});
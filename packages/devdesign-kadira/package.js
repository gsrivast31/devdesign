Package.describe({
  summary: "DevDesign Kadira package",
  version: '0.0.0',
  name: "devdesign-kadira"
});

Package.onUse(function (api) {

  api.use([
    'devdesign-lib', 
    'devdesign-base'
  ], ['client', 'server']);

  api.use([
    'meteorhacks:kadira@2.14.0'
  ], ['server']);

  api.add_files([
    'lib/kadira-settings.js'
  ], ['client', 'server']);

  api.add_files([
    'lib/server/kadira.js'
  ], ['server']);

});
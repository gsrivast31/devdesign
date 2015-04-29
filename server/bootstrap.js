// if the database is empty on server start, create some sample data.
Meteor.startup(function () {
  console.log("Bootstrapping the app");
  if (Categories.find().count() === 0) {
    var data = [{
      name: "Developers", order: 1, slug: 'developers', parent: null, childCount: 0
    },{
      name: "Designers", order: 2, slug: 'designers', parent: null, childCount: 0
    },{
      name: "Startups", order: 3, slug: 'startups', parent: null, childCount: 0
    }];

    _.each(data, function(list) {
      Categories.insert({name: list.name,
        order: list.order, slug: list.slug, parent: list.parent});
    });

    var developerId = Categories.findOne({slug:'developers'})._id;

    var developer_data = [{
      name: "Javascript", order: 3, slug: 'javascript', parent: developerId, childCount: 0
    },{
      name: "Android", order: 4, slug: 'android', parent: developerId, childCount: 0
    },{
      name: "iOS", order: 5, slug: 'ios', parent: developerId, childCount: 0
    }];

    _.each(developer_data, function(list) {
      Categories.insert({name: list.name,
        order: list.order, slug: list.slug, parent: list.parent});
    });

    var javascriptId = Categories.findOne({slug:'javascript'})._id;

    var javascript_data = [{
      name: "Animation", order: 6, slug: 'animation', parent: javascriptId, childCount: 0
    },{
      name: "Application Tools", order: 7, slug: 'application+tools', parent: javascriptId, childCount: 0
    },{
      name: "Audio", order: 8, slug: 'audio', parent: javascriptId, childCount: 0
    },{
      name: "Development Aids", order: 9, slug: 'development+aids', parent: javascriptId, childCount: 0
    },{
      name: "DOM", order: 10, slug: 'dom', parent: javascriptId, childCount: 0
    },{
      name: "Forms", order: 11, slug: 'forms', parent: javascriptId, childCount: 0
    },{
      name: "Games", order: 12, slug: 'games', parent: javascriptId, childCount: 0
    },{
      name: "Helpers", order: 13, slug: 'helpers', parent: javascriptId, childCount: 0
    },{
      name: "Images", order: 14, slug: 'images', parent: javascriptId, childCount: 0
    },{
      name: "Data", order: 15, slug: 'data', parent: javascriptId, childCount: 0
    },{
      name: "Mobile and Touch", order: 16, slug: 'mobile+and+touch', parent: javascriptId, childCount: 0
    },{
      name: "Typography", order: 17, slug: 'typography', parent: javascriptId, childCount: 0
    },{
      name: "User Interface", order: 18, slug: 'user+interface', parent: javascriptId, childCount: 0
    },{
      name: "Video", order: 19, slug: 'video', parent: javascriptId, childCount: 0
    },{
      name: "Miscellaneous", order: 20, slug: 'miscellaneous', parent: javascriptId, childCount: 0
    }];

    _.each(javascript_data, function(list) {
      Categories.insert({name: list.name,
        order: list.order, slug: list.slug, parent: list.parent});
    });
  }
});

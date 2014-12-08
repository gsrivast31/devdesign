// if the database is empty on server start, create some sample data.
Meteor.startup(function () {
  if (Categories.find().count() === 0) {
    var data = [{
      name: "Developers",
      order: 1,
      slug: 'developers', 
      parent: null,
      childCount: 0
    },{
      name: "Designers",
      order: 2,
      slug: 'designers', 
      parent: null,
      childCount: 0
    }];

    _.each(data, function(list) {
      var list_id = Categories.insert({name: list.name,
        order: list.order, slug: list.slug, parent: list.parent});
    });
  }
});

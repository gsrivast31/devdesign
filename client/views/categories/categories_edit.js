Meteor.startup(function () {
  Template[getTemplate('editCategories')].helpers({
    categories: function(){
      return Categories.find({});
    },
    categoryItem: function () {
      return getTemplate('categoryItem');
    }
  });
});
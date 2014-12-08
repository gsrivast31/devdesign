Meteor.startup(function () {
  Template[getTemplate('leftPanel')].helpers({
    signIn: function() {
      return getTemplate('signIn');
    },
    categoriesList: function() {
      return getTemplate('categoriesList');
    }
  });
});

Meteor.startup(function () {
  Template[getTemplate('leftPanel')].helpers({
    signIn: function() {
      return getTemplate('signIn');
    },
    topCategoryMenu: function() {
      return getTemplate('topCategoryMenu');
    },
    categoriesList: function() {
      return getTemplate('categoriesList');
    },
    correctView: function() {
    	var view = Session.get('view');
    	return (view === 'top' || view === 'best' || view === 'new' || view === 'category');
    }
  });
});

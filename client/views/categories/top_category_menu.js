var TOP_CATEGORY_MENU_KEY = 'topCategoryMenuOpen';
Session.setDefault(TOP_CATEGORY_MENU_KEY, false);

var TOP_CATEGORY = 'topCategory';
Session.setDefault(TOP_CATEGORY, '');

var TOP_CATEGORY_FIRST_CHILD_DEVELOPER = 'topCategoryFirstChildDeveloper';
Session.setDefault(TOP_CATEGORY_FIRST_CHILD_DEVELOPER, '');

var TOP_CATEGORY_FIRST_CHILD_DESIGNER = 'topCategoryFirstChildDesigner';
Session.setDefault(TOP_CATEGORY_FIRST_CHILD_DESIGNER, '');

var TOP_CATEGORY_FIRST_CHILD_STARTUP = 'topCategoryFirstChildStartup';
Session.setDefault(TOP_CATEGORY_FIRST_CHILD_STARTUP, '');

var USER_MENU_KEY = 'userMenuOpen';
var CATEGORY_MENU_KEY = 'categoryMenuOpen';

Meteor.startup(function () {
  Template[getTemplate('topCategoryMenu')].helpers({
    topCategoryMenuOpen: function() {
      return Session.get(TOP_CATEGORY_MENU_KEY);
    },
    currentTopCategory: function() {
      var category = Categories.findOne(Session.get(TOP_CATEGORY));
      return category ? category.name : '';
    },
    topCategories: function() {
      if (Session.get(TOP_CATEGORY) === Session.get('developerId')) {
        return [Categories.findOne(Session.get('designerId'))];
      } else if (Session.get(TOP_CATEGORY) === Session.get('designerId')){
        return [Categories.findOne(Session.get('developerId'))];  
      } else if (Session.get(TOP_CATEGORY) === Session.get('startupId')){
        return [Categories.findOne(Session.get('startupId'))];  
      }
      return [];
    }
  });

  Template[getTemplate('topCategoryMenu')].events({
    'click .js-top-category-menu': function(event) {
      Session.set(TOP_CATEGORY_MENU_KEY, ! Session.get(TOP_CATEGORY_MENU_KEY));
      Session.set(USER_MENU_KEY, false);
      Session.set(CATEGORY_MENU_KEY, false);
      // stop the menu from closing
      event.stopImmediatePropagation();
    },
    'click .js-top-category': function(event) {
      event.preventDefault();

      Session.set(TOP_CATEGORY, this._id);
      Session.set(TOP_CATEGORY_MENU_KEY, false);

      if (this._id === Session.get('developerId')) {
        var active_child = Session.get(TOP_CATEGORY_FIRST_CHILD_DEVELOPER);
        if (active_child === '') {
          var firstChild = Categories.findOne({parent: this._id});
          active_child = firstChild._id;
          Session.set(TOP_CATEGORY_FIRST_CHILD_DEVELOPER, firstChild._id);
        }
        Router.go("/category/" + active_child);
      } else if (this._id === Session.get('designerId')) {
        var active_child = Session.get(TOP_CATEGORY_FIRST_CHILD_DESIGNER);
        if (active_child === '') {
          var firstChild = Categories.findOne({parent: this._id});
          active_child = firstChild._id;
          Session.set(TOP_CATEGORY_FIRST_CHILD_DESIGNER, firstChild._id);
        }
        Router.go("/category/" + active_child);
      } else if (this._id === Session.get('startupId')) {
        var active_child = Session.get(TOP_CATEGORY_FIRST_CHILD_STARTUP);
        if (active_child === '') {
          var firstChild = Categories.findOne({parent: this._id});
          active_child = firstChild._id;
          Session.set(TOP_CATEGORY_FIRST_CHILD_STARTUP, firstChild._id);
        }
        Router.go("/category/" + active_child);
      }
    }
  });

});
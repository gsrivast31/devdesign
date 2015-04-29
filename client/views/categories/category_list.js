var CATEGORY_MENU_KEY = 'categoryMenuOpen';
Session.setDefault(CATEGORY_MENU_KEY, false);

var USER_LIST_OPEN = 'userListOpen';
Session.setDefault(USER_LIST_OPEN, '');

var USER_LIST_COLLAPSED = 'userListCollapsed';
Session.setDefault(USER_LIST_COLLAPSED, true);

var TOP_CATEGORY = 'topCategory';
var TOP_CATEGORY_FIRST_CHILD_DEVELOPER = 'topCategoryFirstChildDeveloper';
var TOP_CATEGORY_FIRST_CHILD_DESIGNER = 'topCategoryFirstChildDesigner';
var TOP_CATEGORY_FIRST_CHILD_STARTUP = 'topCategoryFirstChildStartup';
var USER_MENU_KEY = 'userMenuOpen';
var TOP_CATEGORY_MENU_KEY = 'topCategoryMenuOpen';

Meteor.startup(function () {

  var hasChildren = function(parentId) {
    return Categories.find({parent: parentId}).count() > 0;
  };

  var hasParent = function(categoryId) {
    var category = Categories.findOne({_id:categoryId});
    return (category.parent && category.parent === Session.get(TOP_CATEGORY));
  };

  var isTopCategoryDeveloper = function() {
    return Session.get('developerId') === Session.get(TOP_CATEGORY);
  };

  var isTopCategoryDesigner = function() {
    return Session.get('designerId') === Session.get(TOP_CATEGORY);
  };

  var isTopCategoryStartup = function() {
    return Session.get('startupId') === Session.get(TOP_CATEGORY);
  };

  var topCategoryFirstChild = function() {
    if (isTopCategoryDeveloper()) {
      return Session.get(TOP_CATEGORY_FIRST_CHILD_DEVELOPER);
    } else if (isTopCategoryDesigner()) {
      return Session.get(TOP_CATEGORY_FIRST_CHILD_DESIGNER);
    } else if (isTopCategoryStartup()) {
      return Session.get(TOP_CATEGORY_FIRST_CHILD_STARTUP);
    } else {
      return '';
    }
  };

  Template[getTemplate('categoriesList')].helpers({
    categoryMenuOpen: function() {
      return Session.get(CATEGORY_MENU_KEY);
    },
    hasCategories: function(){
      return typeof Categories !== 'undefined' && Categories.find().count();
    },
    cat: function () {
      return __('categories')
    },
    firstChild: function() {
      var first_child = topCategoryFirstChild();
      if (first_child) {
        var category = Categories.findOne({_id: first_child});
        return category ? category.name : '';
      }
      return '';
    },
    categories: function(){
      var first_child = topCategoryFirstChild();
      if (first_child) {
        return Categories.find({
            parent: Session.get(TOP_CATEGORY), 
            _id : { $ne : first_child }
          }, {sort: {name: 1}});
      } 
      return [];
    },
    childCategories: function(){
      var first_child = topCategoryFirstChild();
      if (first_child) {
        return Categories.find({parent: first_child}, {sort: {name: 1}});
      }
      return [];
    },
    categoryLink: function () {
      return getCategoryUrl(this._id);
    },
    activeListClass: function() {
      var current = Router.current();
      if (current.params._id === this._id || 
        current.params._id === topCategoryFirstChild() && this._id === undefined) {
        return 'active';
      } 
    },
    isActive: function() {
      var current = Router.current();
      if (current.params._id === this._id) {
        return true;
      }

      var category = Categories.findOne({_id : current.params._id});
      if (category != undefined && category.parent === this._id) {
        return true;
      }

      return false;
    },
    hasChild: function(parent) {
      return hasChildren(parent._id);
    },
    childlists: function(parent) {
      return Categories.find({parent: parent._id});
    },
    categoryCount: function() {
      return Categories.find({parent:Session.get(TOP_CATEGORY)}).count();
    },
    totalCount: function() {
      var category = Categories.findOne({_id : topCategoryFirstChild() });
      return category ? (category.childCount !== undefined ? category.childCount : 0) : 0;
    },
    childrenCount: function() {
      if (this.childCount === undefined) {
        return 0;
      }
      return this.childCount;
    },
    listExpanded: function() {
      return !Session.get(USER_LIST_COLLAPSED);
    },
    connected: function() {
      if (Session.get(SHOW_CONNECTION_ISSUE_KEY)) {
        return Meteor.status().connected;
      } else {
        return true;
      }
    }
  });

  Template[getTemplate('categoriesList')].events({
    'click .js-category-menu': function(event) {
      Session.set(CATEGORY_MENU_KEY, ! Session.get(CATEGORY_MENU_KEY));
      Session.set(USER_MENU_KEY, false);
      Session.set(TOP_CATEGORY_MENU_KEY, false);
      // stop the menu from closing
      event.stopImmediatePropagation();
    },

    'click .js-top-category': function(event) {
      event.preventDefault();

      if (isTopCategoryDeveloper()) {
        Session.set(TOP_CATEGORY_FIRST_CHILD_DEVELOPER, this._id);
      } else if (isTopCategoryDesigner()) {
        Session.set(TOP_CATEGORY_FIRST_CHILD_DESIGNER, this._id);
      } else if (isTopCategoryStartup()) {
        Session.set(TOP_CATEGORY_FIRST_CHILD_STARTUP, this._id);
      }
      
      Session.set(CATEGORY_MENU_KEY, false);

      Router.go("/category/" + this._id);
    },

    'click .list-category': function(event) {
      event.preventDefault();

      if (event.target.classList.contains("all-items") === true) {
        Session.set(USER_LIST_COLLAPSED, true);
        Router.go("/category/" + topCategoryFirstChild());
        return;
      }

      var current = Router.current();
      var hasChildrenOfPrevious = hasChildren(current.params._id);
      var hasChildrenOfCurrent = hasChildren(this._id);

      if (hasParent(this._id)) {
        //do nothing
      } else if (current.params._id === this._id) {
        if (hasChildrenOfCurrent) {
          Session.set(USER_LIST_COLLAPSED, ! Session.get(USER_LIST_COLLAPSED));    
        };
      } else if (hasChildrenOfCurrent) {
        Session.set(USER_LIST_COLLAPSED, false);
      } else {
        Session.set(USER_LIST_COLLAPSED, true);    
      }

      Router.go("/category/" + this._id);
    }
  });
});

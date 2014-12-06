var MENU_KEY = 'menuOpen';
Session.setDefault(MENU_KEY, false);

var USER_MENU_KEY = 'userMenuOpen';
Session.setDefault(USER_MENU_KEY, false);

var CATEGORY_MENU_KEY = 'categoryMenuOpen';
Session.setDefault(CATEGORY_MENU_KEY, false);

var SHOW_CONNECTION_ISSUE_KEY = 'showConnectionIssue';
Session.setDefault(SHOW_CONNECTION_ISSUE_KEY, false);

var USER_LIST_OPEN = 'userListOpen';
Session.setDefault(USER_LIST_OPEN, '');

var USER_LIST_COLLAPSED = 'userListCollapsed';
Session.setDefault(USER_LIST_COLLAPSED, true);

var CONNECTION_ISSUE_TIMEOUT = 5000;

var TOP_CATEGORY = 'topCategory';
var TOP_CATEGORY_FIRST_CHILD = 'topCategoryFirstChild';

Meteor.startup(function () {

  var hasChildren = function(parentId) {
    return Categories.find({parent: parentId}).count() > 0;
  };

  var hasParent = function(categoryId) {
    return Categories.findOne({parent: {$exists: true}, _id:categoryId}) != undefined;
  };

  Template[getTemplate('categoriesList')].helpers({
    menuOpen: function() {
      return Session.get(MENU_KEY) && 'menu-open';
    },
    cordova: function() {
      return Meteor.isCordova && 'cordova';
    },
    userMenuOpen: function() {
      return Session.get(USER_MENU_KEY);
    },
    categoryMenuOpen: function() {
      return Session.get(CATEGORY_MENU_KEY);
    },
    isLoggedIn: function () {
    return !!Meteor.user();
    },
    username: function () {
      return getDisplayName(Meteor.user());
    },
    profileUrl: function () {
      return getProfileUrl(Meteor.user());
    },
    hasCategories: function(){
      return typeof Categories !== 'undefined' && Categories.find().count();
    },
    cat: function () {
      return __('categories')
    },
    firstChild: function() {
      var category = Categories.findOne({_id: Session.get(TOP_CATEGORY_FIRST_CHILD)});
      return category ? category.name : '';
    },
    categories: function(){
      return Categories.find({
        parent: Session.get(TOP_CATEGORY), 
        _id : { $ne : Session.get(TOP_CATEGORY_FIRST_CHILD) }
      }, {sort: {order: 1, name: 1}});
    },
    childCategories: function(){
      return Categories.find({parent: Session.get(TOP_CATEGORY_FIRST_CHILD)}, {sort: {order: 1, name: 1}});
    },
    categoryLink: function () {
      return getCategoryUrl(this._id);
    },
    activeListClass: function() {
      var current = Router.current();
      if (current.params._id === this._id || 
        current.params._id === Session.get(TOP_CATEGORY_FIRST_CHILD) && this._id === undefined) {
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
      var category = Categories.findOne({_id : Session.get(TOP_CATEGORY_FIRST_CHILD) });
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
  
    'click .js-menu': function() {
      Session.set(MENU_KEY, ! Session.get(MENU_KEY));
    },

    'click .content-overlay': function(event) {
      Session.set(MENU_KEY, false);
      event.preventDefault();
    },

    'click .js-user-menu': function(event) {
      Session.set(USER_MENU_KEY, ! Session.get(USER_MENU_KEY));
      Session.set(CATEGORY_MENU_KEY, false);
      // stop the menu from closing
      event.stopImmediatePropagation();
    },

    'click .js-category-menu': function(event) {
      Session.set(CATEGORY_MENU_KEY, ! Session.get(CATEGORY_MENU_KEY));
      Session.set(USER_MENU_KEY, false);
      event.stopImmediatePropagation();
    },

    'click #menu a': function() {
      Session.set(MENU_KEY, false);
    },

    'click .js-top-category': function(event) {
      event.preventDefault();

      Session.set(TOP_CATEGORY_FIRST_CHILD, this._id);
      Session.set(CATEGORY_MENU_KEY, false);

      Router.go("/category/" + this._id);
    },

    'click .list-category': function(event) {
      event.preventDefault();

      if (event.target.classList.contains("all-items") === true) {
        Session.set(USER_LIST_COLLAPSED, true);
        Router.go("/category/" + Session.get(TOP_CATEGORY_FIRST_CHILD));
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

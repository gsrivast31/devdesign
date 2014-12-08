var MENU_KEY = 'menuOpen';
Session.setDefault(MENU_KEY, false);

var USER_MENU_KEY = 'userMenuOpen';
Session.setDefault(USER_MENU_KEY, false);

var SHOW_CONNECTION_ISSUE_KEY = 'showConnectionIssue';
Session.setDefault(SHOW_CONNECTION_ISSUE_KEY, false);

var CONNECTION_ISSUE_TIMEOUT = 5000;

var CATEGORY_MENU_KEY = 'categoryMenuOpen';
var TOP_CATEGORY_MENU_KEY = 'topCategoryMenuOpen';

Meteor.startup(function () {

  Template[getTemplate('signIn')].helpers({
    menuOpen: function() {
      return Session.get(MENU_KEY) && 'menu-open';
    },
    userMenuOpen: function() {
      return Session.get(USER_MENU_KEY);
    },
    isLoggedIn: function () {
    return !!Meteor.user();
    },
    username: function () {
      return getDisplayName(Meteor.user());
    },
    connected: function() {
      if (Session.get(SHOW_CONNECTION_ISSUE_KEY)) {
        return Meteor.status().connected;
      } else {
        return true;
      }
    }
  });

  Template[getTemplate('signIn')].events({
  
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
      Session.set(TOP_CATEGORY_MENU_KEY, false);
      // stop the menu from closing
      event.stopImmediatePropagation();
    },

    'click #menu a': function() {
      Session.set(MENU_KEY, false);
    }
  });
});

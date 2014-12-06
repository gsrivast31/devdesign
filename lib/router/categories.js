preloadSubscriptions.push('categories');

adminNav.push({
  route: 'categories',
  label: 'Categories'
});

Meteor.startup(function () {

  Router.onBeforeAction(Router._filters.isAdmin, {only: ['categories']});

  PostsCategoryController = PostsListController.extend({
    view: 'category'
  });


  // Categories

  Router.route('/category/:_id/:limit?', {
    name: 'posts_category',
    controller: PostsCategoryController,
    onAfterAction: function() {
      Session.set('categoryId', this.params._id);
    }
  });

  // Categories Admin

  Router.route('/categories', {
    name: 'categories'
  });
  Router.route('/categories/edit', {
    name: 'editCategories'
  });

});
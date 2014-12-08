var getDefaultViewController = function () {
  var defaultView = getSetting('defaultView', 'top');
  defaultView = defaultView.charAt(0).toUpperCase() + defaultView.slice(1);
  return eval("Posts"+defaultView+"Controller");
};

// Controller for all posts lists

PostsListController = FastRender.RouteController.extend({
  template: getTemplate('posts_list'),
  subscriptions: function () {
    // take the first segment of the path to get the view, unless it's '/' in which case the view default to 'top'
    // note: most of the time this.params._id will be empty
    this._terms = {
      view: this.view,
      limit: this.params.limit || getSetting('postsPerPage', 10),
      category: this.params._id
    };

    if(Meteor.isClient) {
      this._terms.query = Session.get("searchQuery");
    }

    this.postsListSub = coreSubscriptions.subscribe('postsList', this._terms);
    this.postsListUsersSub = coreSubscriptions.subscribe('postsListUsers', this._terms);
  },
  data: function () {
    this._terms = {
      view: this.view,
      limit: this.params.limit || getSetting('postsPerPage', 10),
      category: this.params._id
    };

    if(Meteor.isClient) {
      this._terms.query = Session.get("searchQuery");
    }

    var parameters = getPostsParameters(this._terms),
      postCount = Posts.find(parameters.find, parameters.options).count();

    parameters.find.createdAt = { $lte: Session.get('listPopulatedAt') };
    var posts = Posts.find(parameters.find, parameters.options);
    
    // Incoming posts
    parameters.find.createdAt = { $gt: Session.get('listPopulatedAt') };
    var postsIncoming = Posts.find(parameters.find, parameters.options);

    Session.set('postsLimit', this._terms.limit);

    return {
      incoming: postsIncoming,
      postsList: posts,
      postCount: postCount,
      ready: this.postsListSub.ready
    };
  },
  onAfterAction: function() {
    Session.set('view', this.view);

    if (this.params._id) {
      Session.set('categoryId', this.params._id);

      var category = Categories.findOne({_id: this.params._id});
      var parent_category_id = category.parent;
      var current_top_category_id = Session.get('topCategory');

      while (parent_category_id !== current_top_category_id) {
        category = Categories.findOne({_id : parent_category_id});
        parent_category_id = category.parent;
      }

      if (current_top_category_id === Session.get('developerId')) {
        Session.set('topCategoryFirstChildDeveloper', category._id);
      } else if(current_top_category_id === Session.get('designerId')) {
        Session.set('topCategoryFirstChildDesigner', category._id);
      }
    }
  }
});

PostsTopController = PostsListController.extend({
  view: 'top'
});

PostsNewController = PostsListController.extend({
  view: 'new'
});

PostsBestController = PostsListController.extend({
  view: 'best'
});

PostsPendingController = PostsListController.extend({
  view: 'pending'
});

// Controller for post digest

PostsDigestController = FastRender.RouteController.extend({
  template: getTemplate('posts_digest'),
  waitOn: function() {
    // if day is set, use that. If not default to today
    var currentDate = this.params.day ? new Date(this.params.year, this.params.month-1, this.params.day) : new Date(),
        terms = {
          view: 'digest',
          after: moment(currentDate).startOf('day').toDate(),
          before: moment(currentDate).endOf('day').toDate()
        };
    return [
      coreSubscriptions.subscribe('postsList', terms),
      coreSubscriptions.subscribe('postsListUsers', terms)
    ];
  },
  data: function() {
    var currentDate = this.params.day ? new Date(this.params.year, this.params.month-1, this.params.day) : Session.get('today'),
        terms = {
          view: 'digest',
          after: moment(currentDate).startOf('day').toDate(),
          before: moment(currentDate).endOf('day').toDate()
        },
        parameters = getPostsParameters(terms);
    Session.set('currentDate', currentDate);

    parameters.find.createdAt = { $lte: Session.get('listPopulatedAt') };
    var posts = Posts.find(parameters.find, parameters.options);

    // Incoming posts
    parameters.find.createdAt = { $gt: Session.get('listPopulatedAt') };
    var postsIncoming = Posts.find(parameters.find, parameters.options);

    return {
      incoming: postsIncoming,
      posts: posts
    };
  }
});

// Controller for post pages

PostPageController = FastRender.RouteController.extend({
  
  template: getTemplate('post_page'),

  waitOn: function() {
    this.postSubscription = coreSubscriptions.subscribe('singlePost', this.params._id);
    this.postUsersSubscription = coreSubscriptions.subscribe('postUsers', this.params._id);
    this.commentSubscription = coreSubscriptions.subscribe('postComments', this.params._id);
  },

  post: function() {
    return Posts.findOne(this.params._id);
  },

  onBeforeAction: function() {
    if (! this.post()) {
      if (this.postSubscription.ready()) {
        this.render(getTemplate('not_found'));
      } else {
        this.render(getTemplate('loading'));
      }
    } else {
      var post = this.post();
      var url = post.url;

      if (!!url) {
        var l = document.createElement('a');
        l.href = url;
        var hostname = l.hostname;
        var pathname = l.pathname;

        if (hostname.indexOf("github") !== -1) {
          var path_split = pathname.split("/");

          if (path_split.length > 1) {
            var user = path_split[1];
            var repo = path_split[2];

            Meteor.call('getGitHubDetails', user, repo, function(err, data) {
              if (!err) {
                data._id = post._id;
                Session.set('gitHubInfo', data);
              }
            });
          }
        }

        var categories = post.categories;
      }

      this.next();
    }
  },

  onRun: function() {
    var sessionId = Meteor.default_connection && Meteor.default_connection._lastSessionId ? Meteor.default_connection._lastSessionId : null;
    Meteor.call('increasePostViews', this.params._id, sessionId);
  },

  data: function() {
    Session.set('view', 'post');
    return this.post();
  }
});

Meteor.startup(function () {

  Router.route('/', {
    name: 'posts_default',
    action: function() {
      var categoryId = Session.get('developerId');
      if (categoryId != undefined) {
        Session.set('topCategory', categoryId);

        var active_child = Session.get('topCategoryFirstChildDeveloper');
        if (active_child === '') {
          var firstChild = Categories.findOne({parent: categoryId});
          active_child = firstChild._id;
          Session.set('topCategoryFirstChildDeveloper', firstChild._id);
        }
        Router.go("/category/" + active_child);
      }
    }
    //controller: getDefaultViewController()
  });

  Router.route('/top/:_id/:limit?', {
    name: 'posts_top',
    controller: PostsTopController
  });

  // New

  Router.route('/new/:_id/:limit?', {
    name: 'posts_new',
    controller: PostsNewController
  });

  // Best

  Router.route('/best/:_id/:limit?', {
    name: 'posts_best',
    controller: PostsBestController
  });

  // Pending

  Router.route('/pending/:limit?', {
    name: 'posts_pending',
    controller: PostsPendingController
  });

  // TODO: enable /category/new, /category/best, etc. views

  // Digest

  Router.route('/digest/:year/:month/:day', {
    name: 'posts_digest',
    controller: PostsDigestController
  });

  Router.route('/digest', {
    name: 'posts_digest_default',
    controller: PostsDigestController
  });

  // Post Page

  Router.route('/posts/:_id', {
    name: 'post_page',
    controller: PostPageController
  });

  Router.route('/posts/:_id/comment/:commentId', {
    name: 'post_page_comment',
    controller: PostPageController,
    onAfterAction: function () {
      // TODO: scroll to comment position
    }
  });

  // Post Edit

  Router.route('/posts/:_id/edit', {
    name: 'post_edit',
    template: getTemplate('post_edit'),
    waitOn: function () {
      return [
        coreSubscriptions.subscribe('singlePost', this.params._id),
        coreSubscriptions.subscribe('allUsersAdmin')
      ];
    },
    data: function() {
      return {
        postId: this.params._id,
        post: Posts.findOne(this.params._id)
      };
    },
    fastRender: true
  });

  // Post Submit

  Router.route('/submit', {
    name: 'post_submit',
    template: getTemplate('post_submit'),
    waitOn: function () {
      return coreSubscriptions.subscribe('allUsersAdmin');
    }
  });

});
Template[getTemplate('posts_list')].helpers({
  post_item: function () {
    return getTemplate('post_item');
  },
  viewsMenu: function() {
    return getTemplate('viewsMenu');
  },
  posts : function () {
    if(this.postsList){ // XXX
      this.postsList.rewind();    
      var posts = this.postsList.map(function (post, index, cursor) {
        post.rank = index;
        return post;
      });
      return posts;
    }
  },
  postsLoadMore: function () {
    return getTemplate('postsLoadMore');
  },
  postsListIncoming: function () {
    return getTemplate('postsListIncoming');
  },
  categoriesList: function () {
    return getTemplate('categoriesList');
  }
});

Template[getTemplate('posts_list')].created = function() {
  Session.set('listPopulatedAt', new Date());
};
Template[getTemplate('post_page')].helpers({
  post_item: function () {
    return getTemplate('post_item');
  },
  post_body: function () {
    return getTemplate('post_body');
  },
  post_stats: function() {
    return getTemplate('post_stats');
  },
  post_readme: function() {
    return getTemplate('post_readme');
  },
  comment_form: function () {
    return getTemplate('comment_form');
  },
  comment_list: function () {
    return getTemplate('comment_list');
  },
  stats: function() {
    var current = Router.current();
    var gitId = Session.get('gitHubInfo') ? Session.get('gitHubInfo')._id : '';
    if (gitId && current.params._id === gitId) {
      return true;
    } else {
      return false;
    }
  },
  readme: function() {
    return !Session.get('viewREADME') && 
      (Session.get('gitHubInfo') ? ( Session.get('gitHubInfo').readme ? true : false) : false);
  }
});

Template[getTemplate('post_page')].created = function() {
  Session.set('viewREADME', false);
  Session.set('gitHubInfo', '');
};

Template[getTemplate('post_page')].rendered = function(){
  $('body').scrollTop(0);
  if(this.data) // XXX
    document.title = $(".post-title").text();
};

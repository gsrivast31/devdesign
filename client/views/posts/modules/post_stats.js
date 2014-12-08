Template[getTemplate('post_stats')].helpers({
  postStats: function () {
    return postStats;
  },
  getTemplate: function () {
    return getTemplate(this.template);
  }
});

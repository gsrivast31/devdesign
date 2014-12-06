Template[getTemplate('viewsMenu')].helpers({
  viewItem: function () {
    return getTemplate('viewItem');
  },
  views: function () {
    return viewNav;
  }
});

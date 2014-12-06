Template[getTemplate('viewItem')].helpers({
  activeViewMenuItem: function () {
  	if (Session.get('view') === this.label) {
  		return 'active';
  	}
  },

  viewItemLink: function() {
  	return getViewUrl(Session.get('categoryId'), this.label);
  }
});

Template[getTemplate('post_readme')].helpers({
  readme: function(){
  	var current = Router.current();
  	var gitId = Session.get('gitHubInfo') ? Session.get('gitHubInfo')._id : '';
		if (gitId && current.params._id === gitId) {
			return Session.get('gitHubInfo') ? atob(Session.get('gitHubInfo').readme) : '';
		}
  }
});
Template[getTemplate('postContributors')].helpers({
  contributors: function(){
  	var current = Router.current();
  	var gitId = Session.get('gitHubInfo') ? Session.get('gitHubInfo')._id : '';
		if (gitId && current.params._id === gitId) {
	    return Session.get('gitHubInfo') ? Session.get('gitHubInfo').subscribers : '';
	  }
  }
});
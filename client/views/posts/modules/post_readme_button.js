Template[getTemplate('postReadmeButton')].helpers({  
	btnText : function() {
		return Session.get('viewREADME') ? 'View README' : 'Hide README';
	},
	readme: function() {
		var current = Router.current();
		var gitId = Session.get('gitHubInfo') ? Session.get('gitHubInfo')._id : '';
		if (gitId && current.params._id === gitId) {
			return Session.get('gitHubInfo') ? (Session.get('gitHubInfo').readme ? true : false ): false;
		}
		return false;		
	}
});

Template[getTemplate('postReadmeButton')].events({  
	'click .readme-btn' : function (event) {
		Session.set('viewREADME', ! Session.get('viewREADME'));
	}
});
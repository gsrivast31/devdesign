var TOP_CATEGORY = 'topCategory';
Session.setDefault(TOP_CATEGORY, '');

var TOP_CATEGORY_FIRST_CHILD = 'topCategoryFirstChild';
Session.setDefault(TOP_CATEGORY_FIRST_CHILD, '');

Meteor.startup(function () {

	Template[getTemplate('topCategory')].helpers({
		activeCategory: function(name) {
			var category = Categories.findOne({slug:name});
			if (category !== undefined && Session.get(TOP_CATEGORY) === category._id) {
				return 'active';
			}
		}
	});

  Template[getTemplate('topCategory')].events({
  
    'click .developers': function(event) {
      event.preventDefault();

      var category = Categories.findOne({slug:'developers'});
	     if (category != undefined) {
	      Session.set(TOP_CATEGORY, category._id);
	      var firstChild = Categories.findOne({parent: category._id});
	      Session.set(TOP_CATEGORY_FIRST_CHILD, firstChild._id);
	      Router.go("/category/" + firstChild._id);
      }
    },

    'click .designers' : function(event) {
      event.preventDefault();

	    var category = Categories.findOne({slug:'designers'});
	    if (category != undefined) {
	    	Session.set(TOP_CATEGORY, category._id);
	    	var firstChild = Categories.findOne({parent: category._id});
	    	Session.set(TOP_CATEGORY_FIRST_CHILD, firstChild._id);
	    	Router.go("/category/" + firstChild._id);
      }
    }
  });
});
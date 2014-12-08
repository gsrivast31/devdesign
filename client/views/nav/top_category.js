var TOP_CATEGORY = 'topCategory';
Session.setDefault(TOP_CATEGORY, '');

var TOP_CATEGORY_FIRST_CHILD_DEVELOPER = 'topCategoryFirstChildDeveloper';
Session.setDefault(TOP_CATEGORY_FIRST_CHILD_DEVELOPER, '');
var TOP_CATEGORY_FIRST_CHILD_DESIGNER = 'topCategoryFirstChildDesigner';
Session.setDefault(TOP_CATEGORY_FIRST_CHILD_DESIGNER, '');

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

      var categoryId = Session.get('developerId');
	     if (categoryId != undefined) {
	      Session.set(TOP_CATEGORY, categoryId);

	      var active_child = Session.get(TOP_CATEGORY_FIRST_CHILD_DEVELOPER);
	      if (active_child === '') {
	      	var firstChild = Categories.findOne({parent: categoryId});
	      	active_child = firstChild._id;
	      	Session.set(TOP_CATEGORY_FIRST_CHILD_DEVELOPER, firstChild._id);
	      }
	      Router.go("/category/" + active_child);
      }
    },

    'click .designers' : function(event) {
      event.preventDefault();

	    var categoryId = Session.get('designerId');
	    if (categoryId != undefined) {
	    	Session.set(TOP_CATEGORY, categoryId);

	    	var active_child = Session.get(TOP_CATEGORY_FIRST_CHILD_DESIGNER);
	      if (active_child === '') {
	      	var firstChild = Categories.findOne({parent: categoryId});
	      	active_child = firstChild._id;
	      	Session.set(TOP_CATEGORY_FIRST_CHILD_DESIGNER, firstChild._id);
	      }
	      
	    	Router.go("/category/" + active_child);
      }
    }
  });
});
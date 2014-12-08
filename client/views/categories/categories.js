Meteor.startup(function () {
  Template[getTemplate('categories')].helpers({
    topCategories: function(){
      return [Session.get('developerId'), Session.get('designerId')];
    },
    firstLevelCategory: function() {
      return Categories.find({parent: this._id}, {sort: {order: 1, name: 1}});
    },
    secondLevelCategory: function() {
      return Categories.find({parent: this._id}, {sort: {order: 1, name: 1}});
    }
  });

  Template[getTemplate('categories')].events({
    'click input[type=submit]': function(e){
      e.preventDefault();

      var name = $('#name').val();
      var numberOfCategories = Categories.find().count();
      var order = numberOfCategories + 1;
      var parent = $('#parentcategory').val();
      var slug = slugify(name);
      
      Meteor.call('category', {
        name: name,
        order: order,
        slug: slug,
        parent: parent
      }, function(error, categoryName) {
        if(error){
          console.log(error);
          throwError(error.reason);
          clearSeenErrors();
        }else{
          $('#name').val('');
          $('#parentcategory').val('0');
          // throwError('New category "'+categoryName+'" created');
        }
      });
    }
  });
});
Meteor.methods({
  updateCategories: function () {
    // TODO: see if this method is still necessary
    if(isAdmin(Meteor.user())){
      Posts.find().forEach(function(post){
        if(post.categories){
          console.log('Found categories for post "'+post.title+'"');
          Posts.update(post._id,{$set:{userId:post.user_id}}, function(error){
            console.log(error);
          });
        }
      });
    }
  },
  giveInvites: function () {
    if(isAdmin(Meteor.user()))
      Meteor.users.update({}, {$inc:{inviteCount: 1}}, {multi:true});
  },
  updateCategoryInPosts: function (categoryId) {
    check(categoryId, String);

    if (!isAdmin(Meteor.user()))
      throw new Meteor.Error(403, "Not an admin");

    var category = Categories.findOne(categoryId);
    if (!category) {
      Posts.update(
        {}
      , {$pull: {categories: {_id: categoryId}}}
      , {multi: true}
      );
    } else {
      // Such update is server-only, because Minimongo does not support $ yet
      Posts.update(
        {'categories._id': categoryId}
      , {$set: {'categories.$': category}}
      , {multi: true}
      );
    }
  },
  /* GAURAV */
  updateCategoryCounts: function(addedCategories, removedCategories) {

    var updateCounts = function(categoryId) {
      var category = Categories.findOne({_id:categoryId});

      if (category) {
        var count = Posts.find({'categories._id': categoryId}).count();
        Categories.update(
          {_id:categoryId}
        , {$set : {childCount: count}} 
        );  
      }
    };

    if (!isAdmin(Meteor.user()))
      throw new Meteor.Error(403, "Not an admin");

    console.log(addedCategories);
    console.log(removedCategories);
    
    addedCategories.forEach(function(categoryId) {
      updateCounts(categoryId);
    });

    removedCategories.forEach(function(categoryId) {
      updateCounts(categoryId);
    });
    
  }
  /* -GAURAV */
});
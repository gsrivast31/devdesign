var GitHubApi = Meteor.npmRequire('github');
var markdown = Meteor.npmRequire('markdown').markdown;
var github = new GitHubApi({version: "3.0.0"});

github.authenticate({
  type: "oauth",
  key: "ebd6a922dc8c3c1304d3",
  secret: "3b1eab2fb85492e32a78c347bba5647e1395b57a"
});

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
  },

  getGitHubDetails : function(user, repo) {
    var repoInfo = {};
         
    var repoDetails = Async.runSync(function(done) {
      github.repos.get({user: user, repo: repo}, function(err, data) {
        done(null, data);
      });
    });
    repoInfo.createdAt = repoDetails.result.created_at;
    repoInfo.description = repoDetails.result.description;
    repoInfo.forks = repoDetails.result.forks_count;
    repoInfo.gitURL = repoDetails.result.it_url;
    repoInfo.homepage = repoDetails.result.homepage;
    repoInfo.html_url = repoDetails.result.html_url;
    repoInfo.stars = repoDetails.result.stargazers_count;
    repoInfo.subscribers = repoDetails.result.subscribers_count;
    repoInfo.watchers = repoDetails.result.watchers_count;
    
    var repoReadMe = Async.runSync(function(done) {
      github.repos.getReadme({user: user, repo: repo}, function(err, data) {
        done(null, data);
      });
    });

    /*if (repoReadMe.result.content) {
      var readme_base64 = new Buffer(repoReadMe.result.content, 'base64');
      repoInfo.readme = markdown.toHTML(readme_base64.toString());
    }*/
    repoInfo.readme = repoReadMe.result.content;
    
    return repoInfo;
  }
  /* -GAURAV */
});
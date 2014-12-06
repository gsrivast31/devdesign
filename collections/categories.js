categorySchema = new SimpleSchema({
 _id: {
    type: String,
    optional: true
  },
  order: {
    type: Number,
    optional: true
  },
  slug: {
    type: String
  },
  name: {
    type: String
  }, 
  childCount: {
    type: Number,
    defaultValue: 0,
    optional: true
  },  
  parentId: {
    type: String, 
    optional: true
  }
});

Categories = new Meteor.Collection("categories", {
  schema: categorySchema
});

// category post list parameters
viewParameters.category = function (terms) { 
  return {
    find: {'categories._id': terms.category},
    options: {sort: {sticky: -1, score: -1}}
  };
}

// push "categories" modules to postHeading
postHeading.push({
  template: 'postCategories',
  order: 3
});
  
// push "categoriesMenu" template to primaryNav
primaryNav.push('topCategory');

// push "categories" property to addToPostSchema, so that it's later added to postSchema
addToPostSchema.push(
  {
    propertyName: 'categories',
    propertySchema: {
      type: [categorySchema],
      optional: true
    }
  }
);

var getCheckedCategories = function (properties) {
  properties.categories = [];

  var categoryIds = [];

  $('input[name=category]:checked').each(function() {
    var categoryId = $(this).val();
    categoryIds.push(categoryId);

    var category = Categories.findOne(categoryId);
    properties.categories.push(category);

    while (category.parent != undefined) {
      category = Categories.findOne(category.parent);

      if (categoryIds.indexOf(category._id) === -1) {
        categoryIds.push(category._id);
        properties.categories.push(category);
      }
    }   
  });
  return properties;
}

postSubmitClientCallbacks.push(getCheckedCategories);
postEditClientCallbacks.push(getCheckedCategories);

Meteor.startup(function () {
  Categories.allow({
    insert: isAdminById
  , update: isAdminById
  , remove: isAdminById
  });

  Meteor.methods({
    category: function(category){
      console.log(category)
      if (!Meteor.user() || !isAdmin(Meteor.user()))
        throw new Meteor.Error(i18n.t('you_need_to_login_and_be_an_admin_to_add_a_new_category'));
      var categoryId=Categories.insert(category);
      return category.name;
    }
  });
});

getCategoryUrl = function(_id){
  return getSiteUrl()+'category/'+_id;
};

getViewUrl = function(_id, view){
  return getSiteUrl()+view+'/'+_id;
};
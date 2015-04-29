// Session variables
Session.set('initialLoad', true);
Session.set('today', new Date());
Session.set('view', 'top');
Session.set('postsLimit', getSetting('postsPerPage', 10));
Session.set('sessionId', Meteor.default_connection._lastSessionId);

STATUS_PENDING=1;
STATUS_APPROVED=2;
STATUS_REJECTED=3;

adminNav = adminNav.concat([
  {
    route: 'posts_pending',
    label: 'Pending'
  },
  {
    route: 'posts_digest_default',
    label: 'Digest'
  }, 
  {
    route: 'all-users',
    label: 'Users'
  },
  {
    route: 'settings',
    label: 'Settings'
  },
  {
    route: 'toolbox',
    label: 'Toolbox'
  }   
]);

// Sort postModules array position using modulePositions as index
postModules = _.sortBy(postModules, function(module){return _.indexOf(modulePositions, module.position)});

postHeading = _.sortBy(postHeading, 'order');

postMeta = _.sortBy(postMeta, 'order');

postStats = _.sortBy(postStats, 'order');

Meteor.startup(function () {
  $('#rss-link').attr('title', i18n.t('new_posts'));

  var developerId = Categories.findOne({slug: 'developers'})._id;
  var designerId = Categories.findOne({slug: 'designers'})._id;
  var startupId = Categories.findOne({slug: 'startups'})._id;

  Session.set('developerId', developerId);
  Session.set('designerId', designerId);
  Session.set('startupId', startupId);
  Session.set('topCategory', developerId);
});
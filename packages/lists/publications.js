/* globals Lists */
/* eslint-disable prefer-arrow-callback */

Meteor.publish('lists/public', function() {
  return Lists.find({userId: {$exists: false}});
});

Meteor.publish('lists/private', function() {
  if (!this.userId) {
    return this.ready();
  }

  return Lists.find({userId: this.userId});
});

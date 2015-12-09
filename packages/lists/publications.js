/* globals Lists */
/* eslint-disable prefer-arrow-callback */

Meteor.publish('Lists.public', function() {
  return Lists.find({userId: {$exists: false}});
});

Meteor.publish('Lists.private', function() {
  if (!this.userId) {
    return this.ready();
  }

  return Lists.find({userId: this.userId});
});

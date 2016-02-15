/* eslint-disable prefer-arrow-callback */

import { Lists } from '../lists.js';

Meteor.publish('lists.public', function () {
  return Lists.find({
    userId: { $exists: false },
  }, {
    fields: Lists.publicFields,
  });
});

Meteor.publish('lists.private', function () {
  if (!this.userId) {
    return this.ready();
  }

  return Lists.find({
    userId: this.userId,
  }, {
    fields: Lists.publicFields,
  });
});

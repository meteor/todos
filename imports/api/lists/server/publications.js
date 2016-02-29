/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';

import { Lists } from '../lists.js';

Meteor.publish('lists.public', function listsPublic() {
  return Lists.find({
    userId: { $exists: false },
  }, {
    fields: Lists.publicFields,
  });
});

Meteor.publish('lists.private', function listsPrivate() {
  if (!this.userId) {
    return this.ready();
  }

  return Lists.find({
    userId: this.userId,
  }, {
    fields: Lists.publicFields,
  });
});

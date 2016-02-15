/* eslint-disable prefer-arrow-callback */

import { MeteorServer } from 'meteor/ddp-server';
import { Lists } from '../lists.js';

MeteorServer.publish('Lists.public', function () {
  return Lists.find({
    userId: { $exists: false },
  }, {
    fields: Lists.publicFields,
  });
});

MeteorServer.publish('Lists.private', function () {
  if (!this.userId) {
    return this.ready();
  }

  return Lists.find({
    userId: this.userId,
  }, {
    fields: Lists.publicFields,
  });
});

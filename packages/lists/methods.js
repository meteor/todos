/* global Lists SimpleSchema Method Todos */

Lists.methods = {};

const LIST_ID_ONLY = new SimpleSchema({
  listId: { type: String }
});

Lists.methods.insert = new Method({
  name: 'Lists.methods.insert',
  schema: new SimpleSchema({}),
  run() {
    return Lists.insert({});
  }
});

Lists.methods.makePrivate = new Method({
  name: 'Lists.methods.makePrivate',
  schema: LIST_ID_ONLY,
  run({ listId }) {
    if (!this.userId) {
      throw new Meteor.Error('Lists.methods.makePrivate.notLoggedIn',
        'Must be logged in to make private lists.');
    }

    const list = Lists.findOne(listId);

    if (list.isLastPublicList()) {
      throw new Meteor.Error('Lists.methods.makePrivate.lastPublicList',
        'Cannot make the last public list private.');
    }

    Lists.update(listId, {
      $set: { userId: this.userId }
    });
    Lists.userIdDenormalizer.set(listId, this.userId);
  }
});

Lists.methods.makePublic = new Method({
  name: 'Lists.methods.makePublic',
  schema: LIST_ID_ONLY,
  run({ listId }) {
    if (!this.userId) {
      throw new Meteor.Error('Lists.methods.makePublic.notLoggedIn',
        'Must be logged in.');
    }

    // Put both the list ID and the user ID in the selector instead of loading
    // the list from the DB. This way the security check is atomic.
    Lists.update({
      _id: listId,
      userId: this.userId,
    }, {
      $unset: { userId: true }
    });
    Lists.userIdDenormalizer.unset(listId);
  }
});

Lists.methods.updateName = new Method({
  name: 'Lists.methods.updateName',
  schema: new SimpleSchema({
    listId: { type: String },
    newName: { type: String }
  }),
  run({ listId, newName }) {
    Lists.update(listId, {
      $set: { name: newName }
    });
  }
});

Lists.methods.remove = new Method({
  name: 'Lists.methods.remove',
  schema: LIST_ID_ONLY,
  run({ listId }) {
    const list = Lists.findOne(listId);

    if (list.isLastPublicList()) {
      // XXX what's our error i18n strategy here?
      throw new Meteor.Error('Lists.methods.remove.lastPublicList',
        'Cannot delete the last public list.');
    }

    Lists.remove(listId);
  }
});

// Get list of all method names on Lists
const LISTS_METHODS = _.pluck(Lists.methods, 'name');

// Only allow 5 list operations per connection per second
DDPRateLimiter.addRule({
  name(name) {
    return _.contains(LISTS_METHODS, name);
  },

  // Rate limit per connection ID
  connectionId() { return true; }
}, 5, 1000);

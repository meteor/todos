/* global Lists SimpleSchema Method Todos */

Lists.methods = {};

const LIST_ID_ONLY = new SimpleSchema({
  listId: { type: String }
}).validator();

Lists.methods.insert = new ValidatedMethod({
  name: 'Lists.methods.insert',
  validate: new SimpleSchema({}).validator(),
  run() {
    return Lists.insert({});
  }
});

Lists.methods.makePrivate = new ValidatedMethod({
  name: 'Lists.methods.makePrivate',
  validate: LIST_ID_ONLY,
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
  }
});

Lists.methods.makePublic = new ValidatedMethod({
  name: 'Lists.methods.makePublic',
  validate: LIST_ID_ONLY,
  run({ listId }) {
    if (!this.userId) {
      throw new Meteor.Error('Lists.methods.makePublic.notLoggedIn',
        'Must be logged in.');
    }

    const list = Lists.findOne(listId);

    if (!list.editableBy(this.userId)) {
      throw new Meteor.Error('Lists.methods.makePublic.accessDenied',
        'You don\'t have permission to edit this list.');
    }

    // XXX the security check above is not atomic, so in theory a race condition could
    // result in exposing private data
    Lists.update(listId, {
      $unset: { userId: true }
    });
  }
});

Lists.methods.updateName = new ValidatedMethod({
  name: 'Lists.methods.updateName',
  validate: new SimpleSchema({
    listId: { type: String },
    newName: { type: String }
  }).validator(),
  run({ listId, newName }) {
    const list = Lists.findOne(listId);

    if (!list.editableBy(this.userId)) {
      throw new Meteor.Error('Lists.methods.updateName.accessDenied',
        'You don\'t have permission to edit this list.');
    }

    // XXX the security check above is not atomic, so in theory a race condition could
    // result in exposing private data

    Lists.update(listId, {
      $set: { name: newName }
    });
  }
});

Lists.methods.remove = new ValidatedMethod({
  name: 'Lists.methods.remove',
  validate: LIST_ID_ONLY,
  run({ listId }) {
    const list = Lists.findOne(listId);

    if (!list.editableBy(this.userId)) {
      throw new Meteor.Error('Lists.methods.remove.accessDenied',
        'You don\'t have permission to remove this list.');
    }

    // XXX the security check above is not atomic, so in theory a race condition could
    // result in exposing private data

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

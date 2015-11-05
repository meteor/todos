Lists.methods = {};

Lists.methods.insert = new Method({
  name: 'Lists.methods.insert',
  validate() {
    // XXX how do I validate that this shouldn't take any arguments?
  },
  run() {
    const list = {
      name: generateListName(),
      incompleteCount: 0
    };

    return Lists.insert(list);
  }
});

Lists.methods.makePrivate = new Method({
  name: 'Lists.methods.makePrivate',
  validate({ listId }) {
    check(listId, String);
  },
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

Lists.methods.makePublic = new Method({
  name: 'Lists.methods.makePublic',
  validate({ listId }) {
    check(listId, String);
  },
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
  }
});

Lists.methods.updateName = new Method({
  name: 'Lists.methods.updateName',
  validate({ listId, newName }) {
    check(listId, String);
    check(newName, String);
  },
  run({ listId, newName }) {
    Lists.update(listId, {
      $set: {name: newName}
    });
  }
});

Lists.methods.remove = new Method({
  name: 'Lists.methods.remove',
  validate({ listId }) {
    check(listId, String);
  },
  run({ listId }) {
    const list = Lists.findOne(listId);

    if (list.isLastPublicList()) {
      // XXX what's our error i18n strategy here?
      throw new Meteor.Error('Lists.methods.remove.lastPublicList',
        'Cannot delete the last public list.');
    }

    Todos.remove({listId: listId});
    Lists.remove(listId);
  }
});

function generateListName() {
  let nextLetter = 'A', nextName = `List ${nextLetter}`;

  while (Lists.findOne({name: nextName})) {
    // not going to be too smart here, can go past Z
    nextLetter = String.fromCharCode(nextLetter.charCodeAt(0) + 1);
    nextName = `List ${nextLetter}`;
  }

  return nextName; // eslint-disable-line consistent-return
}

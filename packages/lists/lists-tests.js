/* eslint-env mocha */
/* globals chai Factory Lists PublicationCollector Todos */

const assert = chai.assert;

describe('lists', () => {
  describe('mutators', () => {
    it('builds correctly from factory', () => {
      const list = Factory.create('list');
      assert.typeOf(list, 'object');
      assert.match(list.name, /List /);
    });
  });

  describe('publications', () => {
    const userId = Random.id();

    // TODO -- make a `listWithTodos` factory
    const createList = (props = {}) => {
      const list = Factory.create('list', props);
      _.times(3, () => {
        Factory.create('todo', {listId: list._id});
      });
    };

    before(() => {
      Lists.remove({});
      _.times(3, () => createList());
      _.times(2, () => createList({userId}));
      _.times(2, () => createList({userId: Random.id()}));
    });


    describe('lists/public', () => {
      it('sends all public lists', (done) => {
        const collector = new PublicationCollector();
        collector.collect('lists/public', (collections) => {
          chai.assert.equal(collections.Lists.length, 3);
          done();
        });
      });
    });

    describe('lists/private', () => {
      it('sends all owned lists', (done) => {
        const collector = new PublicationCollector({userId});
        collector.collect('lists/private', (collections) => {
          chai.assert.equal(collections.Lists.length, 2);
          done();
        });
      });
    });
  });

  describe('methods', () => {
    let listId, todoId, otherListId, userId;

    beforeEach(() => {
      // Clear
      Lists.remove({});
      Todos.remove({});

      // Create a list and a todo in that list
      listId = Factory.create('list')._id;
      todoId = Factory.create('todo', { listId })._id;

      // Create throwaway list, since the last public list can't be made private
      otherListId = Factory.create('list')._id;

      // Generate a 'user'
      userId = Random.id();
    });

    describe('Lists.methods.makePrivate / makePublic', () => {
      function assertListAndTodoArePrivate() {
        assert.equal(Lists.findOne(listId).userId, userId);
        assert.isTrue(Lists.findOne(listId).isPrivate());
        assert.equal(Todos.findOne(todoId).userId, userId);
        assert.isTrue(Todos.findOne(todoId).editableBy(userId));
      }

      it('makes a list private and updates the todos', () => {
        // Check initial state is public
        assert.isUndefined(Todos.findOne(todoId).userId);
        assert.isFalse(Lists.findOne(listId).isPrivate());

        // Set up method arguments and context
        const methodInvocation = { userId };
        const args = { listId };

        // Making the list private adds userId to the todo
        Lists.methods.makePrivate._execute(methodInvocation, args);
        assertListAndTodoArePrivate();

        // Making the list public removes it
        Lists.methods.makePublic._execute(methodInvocation, args);
        assert.isUndefined(Todos.findOne(todoId).userId);
        assert.isTrue(Todos.findOne(todoId).editableBy(userId));
      });

      it('only works if you are logged in', () => {
        // Set up method arguments and context
        const methodInvocation = { };
        const args = { listId };

        assert.throws(() => {
          Lists.methods.makePrivate._execute(methodInvocation, args);
        }, Meteor.Error, /Lists.methods.makePrivate.notLoggedIn/);

        assert.throws(() => {
          Lists.methods.makePublic._execute(methodInvocation, args);
        }, Meteor.Error, /Lists.methods.makePublic.notLoggedIn/);
      });

      it('only works if it\'s not the last public list', () => {
        // Remove other list, now we're the last public list
        Lists.remove(otherListId);

        // Set up method arguments and context
        const methodInvocation = { userId };
        const args = { listId };

        assert.throws(() => {
          Lists.methods.makePrivate._execute(methodInvocation, args);
        }, Meteor.Error, /Lists.methods.makePrivate.lastPublicList/);
      });

      it('only makes the list public if you made it private', () => {
        // Set up method arguments and context
        const methodInvocation = { userId };
        const args = { listId };

        Lists.methods.makePrivate._execute(methodInvocation, args);

        const otherUserMethodInvocation = { userId: Random.id() };

        // Shouldn't do anything
        assert.throws(() => {
          Lists.methods.makePublic._execute(otherUserMethodInvocation, args);
        }, Meteor.Error, /Lists.methods.makePublic.accessDenied/);

        // Make sure things are still private
        assertListAndTodoArePrivate();
      });
    });

    describe('Lists.methods.updateName', () => {
      it('changes the name, but not if you don\'t have permission', () => {
        Lists.methods.updateName._execute({}, {
          listId,
          newName: "new name"
        });

        assert.equal(Lists.findOne(listId).name, "new name");

        // Make the list private
        Lists.methods.makePrivate._execute({ userId }, { listId });

        // Works if the owner changes the name
        Lists.methods.updateName._execute({ userId }, {
          listId,
          newName: "new name 2"
        });

        assert.equal(Lists.findOne(listId).name, "new name 2");

        // Throws if another user, or logged out user, tries to change the name
        assert.throws(() => {
          Lists.methods.updateName._execute({ userId: Random.id() }, {
            listId,
            newName: "new name 3"
          });
        }, Meteor.Error, /Lists.methods.updateName.accessDenied/);

        assert.throws(() => {
          Lists.methods.updateName._execute({}, {
            listId,
            newName: "new name 3"
          });
        }, Meteor.Error, /Lists.methods.updateName.accessDenied/);

        // Confirm name didn't change
        assert.equal(Lists.findOne(listId).name, "new name 2");
      });
    });

    describe('Lists.methods.remove', () => {
      it('does not delete the last public list', () => {
        const methodInvocation = { userId };

        // Works fine
        Lists.methods.remove._execute(methodInvocation, { listId: otherListId });

        // Should throw because it is the last public list
        assert.throws(() => {
          Lists.methods.remove._execute(methodInvocation, { listId });
        }, Meteor.Error, /Lists.methods.remove.lastPublicList/);
      });
    });

    describe('rate limiting', () => {
      it('does not allow more than 5 operations rapidly', () => {
        const connection = DDP.connect(Meteor.absoluteUrl());

        _.times(5, () => {
          connection.call(Lists.methods.insert.name, {});
        });

        assert.throws(() => {
          connection.call(Lists.methods.insert.name, {});
        }, Meteor.Error, /too-many-requests/);

        connection.disconnect();
      });
    });
  });
});

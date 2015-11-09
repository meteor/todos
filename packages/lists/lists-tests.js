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
    it('updates todos when userId changes', () => {
      const list = Factory.create('list');
      const todo = Factory.create('todo', {listId: list._id});
      assert.isUndefined(Todos.findOne(todo._id).userId);

      const userId = Random.id();
      Lists.update(list._id, {$set: {userId}});
      assert.equal(Todos.findOne(todo._id).userId, userId);

      Lists.update(list._id, {$unset: {userId}});
      assert.isUndefined(Todos.findOne(todo._id).userId);
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
});

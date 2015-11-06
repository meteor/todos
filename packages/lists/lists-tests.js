/* eslint-env mocha */
/* globals chai Factory Lists PublicationCollector */

const assert = chai.assert;

describe('lists', () => {
  it('builds correctly from factory', () => {
    const list = Factory.create('list');
    assert.typeOf(list, 'object');
    assert.match(list.name, /List /);
  });

  describe('publications', () => {
    describe('lists/public', () => {
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

      it('sends all public lists', (done) => {
        const collector = new PublicationCollector();
        collector.collect('lists/public', (collections) => {
          chai.assert.equal(collections.Lists.length, 3);
          done();
        });
      });

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

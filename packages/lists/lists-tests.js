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
      before(() => {
        Lists.remove({});
        _.times(3, () => {
          // TODO -- make a `listWithTodos` factory
          const list = Factory.create('list');
          _.times(3, () => {
            Factory.create('todo', {listId: list._id});
          });
        });
      });

      it('sends all public lists', (done) => {
        const collector = new PublicationCollector();
        collector.on('ready', (collections) => {
          chai.assert.equal(collections.Lists.length, 3);
          done();
        });
        collector.collect('lists/public');
      });
    });
  });
});

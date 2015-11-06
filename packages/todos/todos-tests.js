/* eslint-env mocha */
/* globals chai Factory Lists Todos PublicationCollector */

const assert = chai.assert;

describe('todos', () => {
  it('builds correctly from factory', () => {
    const todo = Factory.create('todo');
    assert.typeOf(todo, 'object');
    assert.typeOf(todo.createdAt, 'date');
  });


  it('leaves createdAt on update', () => {
    const createdAt = new Date(new Date() - 1000);
    let todo = Factory.create('todo', {createdAt});

    const text = 'some new text';
    Todos.update(todo, {$set: {text}});

    todo = Todos.findOne(todo._id);
    assert.equal(todo.text, text);
    assert.equal(todo.createdAt.getTime(), createdAt.getTime());
  });

  describe('publications', () => {
    let list;

    before(() => {
      list = Factory.create('list');
      _.times(3, () => {
        Factory.create('todo', {listId: list._id});
      });
      // create some other todos that aren't on this list
      _.times(3, () => {
        Factory.create('todo');
      });
    });

    describe('list/todos', () => {
      it('sends all todos for a list', (done) => {
        const collector = new PublicationCollector();
        collector.collect('list/todos', list._id, (collections) => {
          chai.assert.equal(collections.Todos.length, 3);
          done();
        });
      });
    });
  });
});

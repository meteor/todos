/* eslint-env mocha */
/* globals chai Factory Todos */

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
});

/* eslint-env mocha */

import { Factory } from 'meteor/factory';
import { Todos } from '../../api/todos/todos.js';
import { Lists } from '../../api/lists/lists.js';
import { chai } from 'meteor/practicalmeteor:chai';
import { withRenderedTemplate } from './test-helpers.js';
import { StubCollections } from 'meteor/stub-collections';

describe('Lists_show', () => {
  beforeEach(() => {
    StubCollections.stub([Todos, Lists]);
  });

  afterEach(() => {
    StubCollections.restore();
  });

  it('renders correctly with simple data', () => {
    const list = Factory.create('list');
    const timestamp = new Date();
    const todos = _.times(3, (i) => {
      return Factory.create('todo', {
        listId: list._id,
        createdAt: new Date(timestamp - (3 - i))
      });
    });

    const data = {
      list: () => list,
      todosReady: true,
      todos: list.todos()
    };

    withRenderedTemplate('Lists_show', data, el => {
      const todosText = todos.map(t => t.text).reverse();
      const renderedText = $(el).find('.list-items input[type=text]')
        .map((i, e) => $(e).val())
        .toArray();
      chai.assert.deepEqual(renderedText, todosText);
    });
  });
});

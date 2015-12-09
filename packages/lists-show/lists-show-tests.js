/* eslint-env mocha */
/* global Todos Lists Factory chai withRenderedTemplate */

const StubCollections = Package['stub-collections'] && Package['stub-collections'].StubCollections;

describe('listsShow', () => {
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
      list,
      todosReady: true,
      todos: list.todos()
    };

    withRenderedTemplate('listsShow', data, el => {
      const todosText = todos.map(t => t.text).reverse();
      const renderedText = $(el).find('.list-items input[type=text]')
        .map((i, e) => $(e).val())
        .toArray();
      chai.assert.deepEqual(renderedText, todosText);
    });
  });
});

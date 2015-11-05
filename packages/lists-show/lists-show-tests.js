/* eslint-env mocha */
/* global Todos Lists Factory chai */

// This is just copied from iron:layout. There's probably a package that does this
const StubCollections = Package['stub-collections'] && Package['stub-collections'].StubCollections;

const withDiv = function(callback) {
  const el = document.createElement('div');
  document.body.appendChild(el);
  try {
    callback(el);
  } finally {
    document.body.removeChild(el);
  }
};

const withRenderedTemplate = function(template, data, callback) {
  withDiv((el) => {
    template = _.isString(template) ? Template[template] : template;
    Blaze.renderWithData(template, data, el);
    Deps.flush();
    callback(el);
  });
};

describe('todosItem', () => {
  beforeEach(() => {
    StubCollections.stub([Todos, Lists]);
  });

  afterEach(() => {
    StubCollections.restore();
  });

  it('renders correctly with simple data', () => {
    const todo = Factory.create('todo');
    withRenderedTemplate('todosItem', todo, el => {
      chai.assert.equal($(el).find('input[type=text]').val(), todo.text);
    });
  });
});

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
      todosReady: true
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

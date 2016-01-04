// Test-only file
return;

/* eslint-env mocha */
/* global Todos Lists Factory chai withRenderedTemplate */
const StubCollections = Package['stub-collections'] && Package['stub-collections'].StubCollections;

describe('Todos_item', () => {
  beforeEach(() => {
    StubCollections.stub([Todos, Lists]);
  });

  afterEach(() => {
    StubCollections.restore();
  });

  it('renders correctly with simple data', () => {
    const todo = Factory.create('todo', {checked: false});
    const data = {
      todo,
      onEditingChange: () => {}
    };

    withRenderedTemplate('Todos_item', data, el => {
      chai.assert.equal($(el).find('input[type=text]').val(), todo.text);
      chai.assert.equal($(el).find('.list-item.checked').length, 0);
      chai.assert.equal($(el).find('.list-item.editing').length, 0);
    });
  });

  it('renders correctly when checked', () => {
    const todo = Factory.create('todo', {checked: true});
    const data = {
      todo,
      onEditingChange: () => {}
    };

    withRenderedTemplate('Todos_item', data, el => {
      chai.assert.equal($(el).find('input[type=text]').val(), todo.text);
      chai.assert.equal($(el).find('.list-item.checked').length, 1);
    });
  });

  it('renders correctly when editing', () => {
    const todo = Factory.create('todo');
    const data = {
      todo,
      editing: true,
      onEditingChange: () => {}
    };

    withRenderedTemplate('Todos_item', data, el => {
      chai.assert.equal($(el).find('input[type=text]').val(), todo.text);
      chai.assert.equal($(el).find('.list-item.editing').length, 1);
    });
  });
});

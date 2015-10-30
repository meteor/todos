// This is just copied from iron:layout. There's probably a package that does this
const StubCollections = Package['stub-collections'] && Package['stub-collections'].StubCollections;

var withDiv = function (callback) {
  var el = document.createElement('div');
  document.body.appendChild(el);
  try {
    callback(el);
  } finally {
    document.body.removeChild(el);
  }
};

var withRenderedTemplate = function (template, data, callback) {
  withDiv(function (el) {
    template = _.isString(template) ? Template[template] : template;
    Blaze.renderWithData(template, data, el);
    Deps.flush();
    callback(el);
  });
};

describe('todosItem', () => {
  beforeEach(() => {
    StubCollections.stub(Todos, Lists);
  });

  afterEach(() => {
    StubCollections.restore();
  });

  it('renders correctly with simple data', () => {
    const todo = Factory.create('todo');
    withRenderedTemplate('todosItem', todo, el => {
      console.log(el);
      chai.assert.equal($(el).find('input[type=text]').val(), todo.text);
    });
  });
});

// describe('listsShow', () => {
//   beforeEach(() => {
//     StubCollections.stub(Todos, Lists);
//   });

//   afterEach(() => {
//     StubCollections.restore();
//   });

//   it('renders correctly with simple data', () => {
//     const list = Factory.create('list');
//     const todos = _.times(3, () => Factory.create('todo', {listId: list._id}));

//     withRenderedTemplate('listsShow', list, el => {
//       console.log(el);
//       chai.assert.equal($(el).text(), 'foo');
//     });
//   });
// });

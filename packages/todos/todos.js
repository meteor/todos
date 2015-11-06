/* global Todos:true */
/* global SimpleSchema Factory faker Lists */

class TodosCollection extends Mongo.Collection {
  insert(doc) {
    doc.createdAt = doc.createdAt || new Date();
    return super(doc);
  }
}

Todos = new TodosCollection('Todos');

Todos.schema = new SimpleSchema({
  listId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    denyUpdate: true
  },
  text: {
    type: String,
    max: 100
  },
  createdAt: {
    type: Date,
    denyUpdate: true
  },
  checked: {
    type: Boolean,
    defaultValue: false
  }
});

Todos.attachSchema(Todos.schema);

// TODO This factory has a name - do we have a code style for this?
//   - usually I've used the singular, sometimes you have more than one though, like
//   'todo', 'emptyTodo', 'checkedTodo'
Factory.define('todo', Todos, {
  listId: () => Factory.get('list'),
  text: () => faker.lorem.sentence(),
  createdAt: () => new Date()
});

Todos.helpers({
  getList() {
    return Lists.findOne(this.listId);
  }
});

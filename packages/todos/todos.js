/* global Todos:true */
/* global SimpleSchema Factory faker Lists */

class TodosCollection extends Mongo.Collection {
  insert(doc, callback) {
    doc.createdAt = doc.createdAt || new Date();
    return super(doc, callback);
  }
}

Todos = new TodosCollection('Todos');

// Deny all client-side updates since we will be using methods to manage this collection
Todos.deny({
  insert() { return true },
  update() { return true },
  remove() { return true },
});

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
  list() {
    return Lists.findOne(this.listId);
  },
  editableBy(userId) {
    return this.list().editableBy(userId);
  }
});

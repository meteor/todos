/* global Todos:true */
/* global SimpleSchema Factory faker */

Todos = new Mongo.Collection('Todos');

Todos.schema = new SimpleSchema({
  listId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  text: {
    type: String,
    max: 100
  },
  createdAt: {
    type: Date,
    denyUpdate: true,
    autoValue: () => {
      if (this.isInsert) {
        return new Date();
      }
    }
  },
  checked: {
    type: Boolean,
    defaultValue: false
  }
});

Todos.attachSchema(Todos.schema);

if (Meteor.isServer) {
  Meteor.publish('todos', (listId) => {
    check(listId, String);

    return Todos.find({listId: listId});
  });
}

// TODO This factory has a name - do we have a code style for this?
//   - usually I've used the singular, sometimes you have more than one though, like
//   'todo', 'emptyTodo', 'checkedTodo'
Factory.define('todo', Todos, {
  listId: () => Factory.get('list'),
  text: () => faker.lorem.sentence(),
  createdAt: () => new Date()
});

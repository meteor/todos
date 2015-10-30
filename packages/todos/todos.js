/* global Todos:true */
/* global SimpleSchema Factory faker */

Todos = new Mongo.Collection('todos');

Todos.schema = new SimpleSchema({
  listId: {type: String, regEx: SimpleSchema.RegEx.Id},
  // TODO -- add length requirements
  text: {type: String},
  // TODO make autovalue
  createdAt: {type: Date}
});

Todos.attachSchema(Todos.schema);

if (Meteor.isServer) {
  Meteor.publish('todos', (listId) => {
    check(listId, String);

    return Todos.find({listId: listId});
  });
}

Factory.define('todo', Todos, {
  listId: () => Factory.get('list'),
  text: () => faker.lorem.sentence(),
  createdAt: () => new Date()
});

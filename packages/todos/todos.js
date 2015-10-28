/* global Todos:true */
/* global SimpleSchema */

Todos = new Mongo.Collection('todos');

Todos.schema = new SimpleSchema({
});

Todos.attachSchema(Todos.schema);

if (Meteor.isServer) {
  Meteor.publish('todos', (listId) => {
    check(listId, String);

    return Todos.find({listId: listId});
  });
}

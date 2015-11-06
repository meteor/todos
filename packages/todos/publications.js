/* global Todos */

Meteor.publish('todos', (listId) => {
  check(listId, String);

  return Todos.find({listId: listId});
});

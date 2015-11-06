/* global Todos */
/* eslint-disable prefer-arrow-callback */

Meteor.publish('list/todos', function(listId) {
  check(listId, String);

  return Todos.find({listId: listId});
});

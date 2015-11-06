/* global Todos */
/* eslint-disable prefer-arrow-callback */

Meteor.publish('todos', function(listId) {
  check(listId, String);

  return Todos.find({listId: listId});
});

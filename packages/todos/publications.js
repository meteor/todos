/* global Todos */
/* eslint-disable prefer-arrow-callback */

Meteor.publish('list/todos', function(listId) {
  check(listId, String);

  const publicCondition = {
    listId: listId,
    userId: { $exists: false }
  };

  const privateCondition = {
    listId: listId,
    userId: this.userId
  };

  // We need to make sure that you can only get todos that are in a public list, or in a list that
  // belongs to the current user, so we need to use Mongo $or.
  return Todos.find({ $or: [
    publicCondition,
    privateCondition
  ]});
});

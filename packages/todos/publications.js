/* global Todos, Lists */
/* eslint-disable prefer-arrow-callback */

Meteor.publishComposite('list/todos', function(listId) {
  check(listId, String);

  const userId = this.userId;
  return {
    find() {
      const query = {
        _id: listId,
        $or: [{userId: {$exists: false}}, {userId}]
      };

      return Lists.find(query);
    },
    children: [{
      find(list) {
        return Todos.find({listId: list._id});
      }
    }]
  };
});

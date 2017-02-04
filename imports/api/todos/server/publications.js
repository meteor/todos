/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Todos } from '/imports/api/todos/todos.js';
import { Lists } from '/imports/api/lists/lists.js';

Meteor.publishComposite('todos.inList', function todosInList(params) {
  new SimpleSchema({
    listId: { type: String },
  }).validate(params);

  const { listId } = params;
  const userId = this.userId;

  return {
    find() {
      const query = {
        _id: listId,
        $or: [{ userId: { $exists: false } }, { userId }],
      };

      // We only need the _id field in this query, since it's only
      // used to drive the child queries to get the todos
      const options = {
        fields: { _id: 1 },
      };

      return Lists.find(query, options);
    },

    children: [{
      find(list) {
        return Todos.find({ listId: list._id }, { fields: Todos.publicFields });
      },
    }],
  };
});

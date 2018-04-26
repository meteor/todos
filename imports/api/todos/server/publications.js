/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Todos } from '../todos.js';
import { Lists } from '../../lists/lists.js';

Meteor.publishComposite('todos.inList', function todosInList(params) {
  new SimpleSchema({
    listId: { type: String },
  }).validate(params);

  const { listId } = params;
  const { userId } = this;

  return {
    find() {
      const orSelectors = [{ userId: { $exists: false } }];
      if (userId) {
        orSelectors.push({ userId });
      }
      const query = {
        _id: listId,
        $or: orSelectors,
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

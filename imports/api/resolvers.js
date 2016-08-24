import { Lists } from './lists/lists';

export default {
  RootQuery: {
    lists(_, { mine = false }, context) {
      if (mine) {
        // XXX: is this the correct way to do auth?
        if (!context.userId) {
          return [];
        }

        return Lists.find({ userId: context.userId }).fetch();
      }

      return Lists.find({ userId: { $exists: false } }).fetch();
    },
  },
  List: {
    private(list, _, context) {
      return !!list.userId && list.userId === context.userId;
    },
    todos(list) {
      return list.todos().fetch();
    },
  },
};

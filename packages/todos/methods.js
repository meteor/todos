Todos.methods = {};

Todos.methods.insert = new Method({
  name: 'Todos.methods.insert',
  schema: new SimpleSchema({
    listId: { type: String },
    text: { type: String }
  }),
  run({ listId, text }) {
    const list = Lists.findOne(listId);

    if (list.isPrivate() && list.userId !== this.userId) {
      throw new Meteor.Error('Todos.methods.insert.unauthorized',
        'Cannot add todos to a private list that is not yours');
    }

    Todos.insert({
      listId,
      text,
      checked: false,
      createdAt: new Date()
    });

    // XXX should this just get the incomplete count from a query? otherwise
    // it could become off-by-one forever...
    Lists.update(listId, {
      $inc: { incompleteCount: 1 }
    });
  }
})

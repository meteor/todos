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
});

Todos.methods.updateText = new Method({
  name: 'Todos.methods.updateText',
  schema: new SimpleSchema({
    todoId: { type: String },
    newText: { type: String }
  }),
  run({ todoId, newText }) {
    // This is complex auth stuff - perhaps denormalizing a userId onto todos
    // would be correct here?
    const todo = Todos.findOne(todoId);
    const list = todo.getList();

    if (list.isPrivate() && list.userId !== this.userId) {
      throw new Meteor.Error('Todos.methods.updateText.unauthorized',
        'Cannot edit todos in a private list that is not yours');
    }

    Todos.update(todoId, {
      $set: { text: newText }
    });
  }
})

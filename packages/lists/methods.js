Lists.methods = {};

Lists.methods.updateName = new Method({
  name: 'Lists.methods.updateName',
  validate({ listId, newName }) {
    check(listId, String);
    check(newName, String);
  },
  authorize() {
    // XXX what's the best way to ensure all methods are authorized?
    return;
  },
  run({ listId, newName }) {
    Lists.update(listId, {
      $set: {name: newName}
    });
  }
});

Lists.methods.remove = new Method({
  name: 'Lists.methods.remove',
  validate({ listId }) {
    check(listId, String);
  },
  authorize() {
    // XXX what's the best way to ensure all methods are authorized?
    return;
  },
  run({ listId }) {
    Todos.remove({listId: listId});
    Lists.remove(listId);
  }
});

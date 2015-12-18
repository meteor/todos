/* globals Lists, Todos */
Todos.incompleteCountDenormalizer = {
  _updateList(listId) {
    const incompleteCount = Todos.find({
      listId,
      checked: false
    }).count();

    Lists.update(listId, {$set: {incompleteCount}});
  },
  _updateListFromTodos(selector) {
    Todos.find(selector, {fields: {listId: 1}}).forEach(todo => {
      this._updateList(todo.listId);
    });
  },
  afterInsertTodo(todo) {
    this._updateList(todo.listId);
  },
  afterUpdateTodo(selector, modifier) {
    // We can only deal with $set modifiers, but that's all we do in this app
    if (_.has(modifier.$set, 'checked')) {
      this._updateListFromTodos(selector);
    }
  },
  afterRemoveTodos(todos) {
    todos.forEach(todo => this._updateList(todo.listId));
  }
};

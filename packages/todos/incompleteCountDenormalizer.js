/* globals Lists, Todos */
Todos.incompleteCountDenormalizer = {
  _updateList(listId) {
    const incompleteCount = Todos.find({
      listId,
      checked: false
    }).count();

    Lists.update(listId, {$set: {incompleteCount}});
  },
  _updateListFromTodo(selector) {
    const listId = Todos.findOne(selector, {fields: {listId: 1}}).listId;
    this._updateList(listId);
  },
  afterInsertTodo(todo) {
    this._updateList(todo.listId);
  },
  afterUpdateTodo(selector, modifier) {
    // We can only deal with $set modifiers, but that's all we do in this app
    if (_.has(modifier.$set, 'checked')) {
      this._updateListFromTodo(selector);
    }
  },
  afterRemoveTodo(todo) {
    this._updateList(todo.listId);
  }
};

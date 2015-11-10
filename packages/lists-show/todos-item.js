/* global Todos SimpleSchema */

Template.todosItem.onCreated(function() {
  // TODO -- figure out how to make this check work with the todo being a "Document"
  // check(this.data, new SimpleSchema({
  //   todo: {blackbox: true},
  //   editing: {type: Boolean, optional: true},
  //   onEdit: {type: Function}
  // }));
});

Template.todosItem.helpers({
  checkedClass() {
    return this.todo.checked && 'checked';
  },
  editingClass() {
    return this.editing && 'editing';
  }
});

Template.todosItem.events({
  'change [type=checkbox]'(event) {
    const checked = $(event.target).is(':checked');

    Todos.methods.setCheckedStatus({
      todoId: this._id,
      newCheckedStatus: checked
    });
  },

  'focus input[type=text]'() {
    this.onEdit(true);
  },

  'blur input[type=text]'() {
    if (this.editing) {
      this.onEdit(false);
    }
  },

  'keydown input[type=text]'(event) {
    // ESC or ENTER
    if (event.which === 27 || event.which === 13) {
      event.preventDefault();
      event.target.blur();
    }
  },

  // update the text of the item on keypress but throttle the event to ensure
  // we don't flood the server with updates (handles the event at most once
  // every 300ms)
  'keyup input[type=text]': _.throttle(function(event) {
    Todos.methods.updateText.call({
      todoId: this._id,
      newText: event.target.value
    }, (err) => {
      alert(err.error); // XXX i18n
    });
  }, 300),

  // handle mousedown otherwise the blur handler above will swallow the click
  // on iOS, we still require the click event so handle both
  'mousedown .js-delete-item, click .js-delete-item'() {
    Todos.methods.remove.call({
      todoId: this._id
    }, (err) => {
      alert(err.error); // XXX i18n
    });
  }
});

/* global Todos SimpleSchema */

Template.todosItem.onCreated(function() {
  this.autorun(() => {
    new SimpleSchema({
      todo: {type: Todos._helpers},
      editing: {type: Boolean, optional: true},
      onEditingChange: {type: Function}
    }).validate(Template.currentData());
  });
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

    Todos.methods.setCheckedStatus.call({
      todoId: this.todo._id,
      newCheckedStatus: checked
    });
  },

  'focus input[type=text]'() {
    this.onEditingChange(true);
  },

  'blur input[type=text]'() {
    if (this.editing) {
      this.onEditingChange(false);
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
      todoId: this.todo._id,
      newText: event.target.value
    }, (err) => {
      err && alert(err.error); // translate this string after #59
    });
  }, 300),

  // handle mousedown otherwise the blur handler above will swallow the click
  // on iOS, we still require the click event so handle both
  'mousedown .js-delete-item, click .js-delete-item'() {
    Todos.methods.remove.call({
      todoId: this.todo._id
    }, (err) => {
      err && alert(err.error); // translate this string after #59
    });
  }
});

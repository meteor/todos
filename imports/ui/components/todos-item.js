import './todos-item.html';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Todos } from '../../api/todos/todos.js';

import {
  setCheckedStatus,
  updateText,
  remove,
} from '../../api/todos/methods.js';

import { handleError } from '../lib/errors.js';

Template.Todos_item.onCreated(function() {
  this.autorun(() => {
    new SimpleSchema({
      todo: {type: Todos._helpers},
      editing: {type: Boolean, optional: true},
      onEditingChange: {type: Function}
    }).validate(Template.currentData());
  });
});

Template.Todos_item.helpers({
  checkedClass(todo) {
    return todo.checked && 'checked';
  },
  editingClass(editing) {
    return editing && 'editing';
  }
});

Template.Todos_item.events({
  'change [type=checkbox]'(event) {
    const checked = $(event.target).is(':checked');

    setCheckedStatus.call({
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
    updateText.call({
      todoId: this.todo._id,
      newText: event.target.value
    }, handleError);
  }, 300),

  // handle mousedown otherwise the blur handler above will swallow the click
  // on iOS, we still require the click event so handle both
  'mousedown .js-delete-item, click .js-delete-item'() {
    remove.call({
      todoId: this.todo._id
    }, handleError);
  }
});

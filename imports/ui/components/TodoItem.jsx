import React from 'react';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import classnames from 'classnames';
import i18n from 'meteor/universe:i18n';
import { displayError } from '../helpers/errors.js';

import {
  setCheckedStatus,
  updateText,
  remove,
} from '../../api/todos/methods.js';

const TodoItem = ({
  todo,
  editing,
  onEditingChange,
}) => {
  const throttledUpdate = _.throttle((value) => {
    if (value) {
      updateText.call({
        todoId: todo._id,
        newText: value,
      }, displayError);
    }
  }, 300);

  const onFocus = () => {
    onEditingChange(todo._id, true);
  };

  const onBlur = () => {
    onEditingChange(todo._id, false);
  };

  const setTodoCheckStatus = (event) => {
    setCheckedStatus.call({
      todoId: todo._id,
      newCheckedStatus: event.target.checked,
    });
  };

  const updateTodo = (event) => {
    throttledUpdate(event.target.value);
  };

  const deleteTodo = () => {
    remove.call({ todoId: todo._id }, displayError);
  };

  return (
    <div
      className={classnames({
        'list-item': true,
        checked: todo.checked,
        editing,
      })}
    >
      <label className="checkbox" htmlFor={todo._id}>
        <input
          id={todo._id}
          type="checkbox"
          checked={todo.checked}
          name="checked"
          onChange={setTodoCheckStatus}
        />
        <span className="checkbox-custom" />
      </label>
      <input

        type="text"
        defaultValue={todo.text}
        placeholder={i18n.__('components.todoItem.taskName')}
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={updateTodo}
      />
      <a
        className="delete-item"
        href="#delete"
        onClick={deleteTodo}
        onMouseDown={deleteTodo}
      >
        <span className="icon-trash" />
      </a>
    </div>
  );
};

TodoItem.propTypes = {
  todo: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    checked: PropTypes.bool,
    text: PropTypes.string,
  }).isRequired,
  editing: PropTypes.bool,
  onEditingChange: PropTypes.func.isRequired,
};

TodoItem.defaultProps = {
  editing: false,
};

export default TodoItem;

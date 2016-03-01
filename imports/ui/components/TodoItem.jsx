import React from 'react';
import classnames from 'classnames';

import {
  setCheckedStatus,
  updateText,
  remove,
} from '../../api/todos/methods.js';

export default class TodoItem extends React.Component {
  constructor(props) {
    super(props);
    this.throttledUpdate = _.throttle(value => {
      if (value) {
        updateText.call({
          todoId: this.props.todo._id,
          newText: value
        }, (err) => {
          err && alert(err.error);
        });
      }
    }, 300);
  }

  setTodoCheckStatus(event) {
    setCheckedStatus.call({
      todoId: this.props.todo._id,
      newCheckedStatus: event.target.checked
    });
  }

  updateTodo(event) {
    this.throttledUpdate(event.target.value);
  }

  deleteTodo() {
    remove.call({
      todoId: this.props.todo._id
    }, (err) => {
      err && alert(err.error);
    });
  }

  onFocus() {
    this.props.onEditingChange(this.props.todo._id, true);
  }

  onBlur() {
    this.props.onEditingChange(this.props.todo._id, false);
  }

  render() {
    const { todo, editing } = this.props;
    const todoClass = classnames({
      'list-item': true,
      checked: todo.checked,
      editing
    });

    return (
      <div className={todoClass}>
        <label className="checkbox">
          <input
            type="checkbox"
            checked={todo.checked}
            name="checked"
            onChange={this.setTodoCheckStatus.bind(this)}/>
          <span className="checkbox-custom"></span>
        </label>
        <input
          type="text"
          defaultValue={todo.text}
          placeholder="Task name"
          onFocus={this.onFocus.bind(this)}
          onBlur={this.onBlur.bind(this)}
          onChange={this.updateTodo.bind(this)}/>
        <a
          className="delete-item"
          href="#"
          onClick={this.deleteTodo.bind(this)}
          onMouseDown={this.deleteTodo.bind(this)}>
          <span className="icon-trash"></span>
        </a>
      </div>
    );
  }
}

TodoItem.propTypes = {
  todo: React.PropTypes.object,
  editing: React.PropTypes.bool
};

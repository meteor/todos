import React from 'react';
import MobileMenu from './MobileMenu.jsx';
import { displayError } from '../helpers/errors.js';

import {
  updateName,
  makePublic,
  makePrivate,
  remove,
} from '../../api/lists/methods.js';

import {
  insert,
} from '../../api/todos/methods.js';

export default class ListHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editing: false };

    this.onListFormSubmit = this.onListFormSubmit.bind(this);
    this.onListInputKeyUp = this.onListInputKeyUp.bind(this);
    this.onListInputBlur = this.onListInputBlur.bind(this);
    this.onListDropdownAction = this.onListDropdownAction.bind(this);
    this.editList = this.editList.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.saveList = this.saveList.bind(this);
    this.deleteList = this.deleteList.bind(this);
    this.toggleListPrivacy = this.toggleListPrivacy.bind(this);
    this.createTodo = this.createTodo.bind(this);
    this.focusTodoInput = this.focusTodoInput.bind(this);
  }

  onListFormSubmit(event) {
    event.preventDefault();
    this.saveList();
  }

  onListInputKeyUp(event) {
    if (event.keyCode === 27) {
      this.cancelEdit();
    }
  }

  onListInputBlur() {
    if (this.state.editing) {
      this.saveList();
    }
  }

  onListDropdownAction(event) {
    if (event.target.value === 'delete') {
      this.deleteList();
    } else {
      this.toggleListPrivacy();
    }
  }

  editList() {
    this.setState({ editing: true }, () => {
      this.refs.listNameInput.focus();
    });
  }

  cancelEdit() {
    this.setState({ editing: false });
  }

  saveList() {
    this.setState({ editing: false });
    updateName.call({
      listId: this.props.list._id,
      newName: this.refs.listNameInput.value,
    }, displayError);
  }

  deleteList() {
    const list = this.props.list;
    const message = `Are you sure you want to delete the list ${list.name}?`;

    if (confirm(message)) { // eslint-disable-line no-alert
      remove.call({ listId: list._id }, displayError);
      this.context.router.push('/');
    }
  }

  toggleListPrivacy() {
    const list = this.props.list;
    if (list.userId) {
      makePublic.call({ listId: list._id }, displayError);
    } else {
      makePrivate.call({ listId: list._id }, displayError);
    }
  }

  createTodo(event) {
    event.preventDefault();
    const input = this.refs.newTodoInput;
    if (input.value.trim()) {
      insert.call({
        listId: this.props.list._id,
        text: input.value,
      }, displayError);
      input.value = '';
    }
  }

  focusTodoInput() {
    this.refs.newTodoInput.focus();
  }

  renderDefaultHeader() {
    const { list } = this.props;
    return (
      <div>
        <MobileMenu/>
        <h1 className="title-page" onClick={this.editList}>
          <span className="title-wrapper">{list.name}</span>
          <span className="count-list">{list.incompleteCount}</span>
        </h1>
        <div className="nav-group right">
          <div className="nav-item options-mobile">
            <select className="list-edit"
              defaultValue="default"
              onChange={this.onListDropdownAction}
            >
              <option disabled value="default">Select an action</option>
              {list.userId
                ? <option value="public">Make Public</option>
                : <option value="private">Make Private</option>}
              <option value="delete">Delete</option>
            </select>
            <span className="icon-cog"></span>
          </div>
          <div className="options-web">
            <a className="nav-item" onClick={this.toggleListPrivacy}>
              {list.userId
                ? <span className="icon-lock" title="Make list public"></span>
                : <span className="icon-unlock" title="Make list private"></span>}
            </a>
            <a className="nav-item" onClick={this.deleteList}>
              <span className="icon-trash" title="Delete list"></span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  renderEditingHeader() {
    const { list } = this.props;
    return (
      <form className="list-edit-form" onSubmit={this.onListFormSubmit}>
        <input type="text"
          name="name"
          autoComplete="off"
          ref="listNameInput"
          defaultValue={list.name}
          onKeyUp={this.onListInputKeyUp}
          onBlur={this.onListInputBlur}
        />
        <div className="nav-group right">
          <a className="nav-item"
            onMouseDown={this.cancelEdit}
            onClick={this.cancelEdit}
          >
            <span className="icon-close" title="Cancel"></span>
          </a>
        </div>
      </form>
    );
  }

  render() {
    const { editing } = this.state;
    return (
      <nav className="list-header">
        {editing ? this.renderEditingHeader() : this.renderDefaultHeader()}
        <form className="todo-new input-symbol" onSubmit={this.createTodo}>
          <input type="text" ref="newTodoInput" placeholder="Type to add new tasks"/>
          <span className="icon-add" onClick={this.focusTodoInput}></span>
        </form>
      </nav>
    );
  }
}

ListHeader.propTypes = {
  list: React.PropTypes.object,
};

ListHeader.contextTypes = {
  router: React.PropTypes.object,
};

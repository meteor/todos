import React from 'react';
import MobileMenu from './MobileMenu.jsx';

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
      newName: this.refs.listNameInput.value
    }, (err) => {
      /* eslint-disable no-console */
      err && console.error(err);
      /* eslint-enable no-console */
    });
  }

  deleteList() {
    const list = this.props.list;
    const message = `Are you sure you want to delete the list ${list.name}?`;

    if (confirm(message)) {
      remove.call({
        listId: list._id
      }, (err) => {
        err && alert(err.error);
      });
      this.context.router.push('/');
    }
  }

  toggleListPrivacy() {
    const list = this.props.list;
    if (list.userId) {
      makePublic.call({ listId: list._id }, (err) => {
        err && alert(err.error);
      });
    } else {
      makePrivate.call({ listId: list._id }, (err) => {
        err && alert(err.error);
      });
    }
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

  createTodo(event) {
    event.preventDefault();
    const input = this.refs.newTodoInput;
    if (input.value.trim()) {
      insert.call({
        listId: this.props.list._id,
        text: input.value
      }, (err) => {
        err && alert(err.error);
      });
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
        <h1 className="title-page" onClick={this.editList.bind(this)}>
          <span className="title-wrapper">{list.name}</span>
          <span className="count-list">{list.incompleteCount}</span>
        </h1>
        <div className="nav-group right">
          <div className="nav-item options-mobile">
            <select className="list-edit"
              defaultValue="default"
              onChange={this.onListDropdownAction.bind(this)}>
              <option disabled value="default">Select an action</option>
              {list.userId
                ? <option value="public">Make Public</option>
                : <option value="private">Make Private</option>}
              <option value="delete">Delete</option>
            </select>
            <span className="icon-cog"></span>
          </div>
          <div className="options-web">
            <a className="nav-item" onClick={this.toggleListPrivacy.bind(this)}>
              {list.userId
                ? <span className="icon-lock" title="Make list public"></span>
                : <span className="icon-unlock" title="Make list private"></span>}
            </a>
            <a className="nav-item" onClick={this.deleteList.bind(this)}>
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
      <form className="list-edit-form" onSubmit={this.onListFormSubmit.bind(this)}>
        <input type="text"
          name="name"
          autoComplete="off"
          ref="listNameInput"
          defaultValue={list.name}
          onKeyUp={this.onListInputKeyUp.bind(this)}
          onBlur={this.onListInputBlur.bind(this)}/>
        <div className="nav-group right">
          <a className="nav-item"
            onMouseDown={this.cancelEdit.bind(this)}
            onClick={this.cancelEdit.bind(this)}>
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
        <form className="todo-new input-symbol" onSubmit={this.createTodo.bind(this)}>
          <input type="text" ref="newTodoInput" placeholder="Type to add new tasks"/>
          <span className="icon-add" onClick={this.focusTodoInput.bind(this)}></span>
        </form>
      </nav>
    );
  }
}

ListHeader.propTypes = {
  list: React.PropTypes.object
};

ListHeader.contextTypes = {
  router: React.PropTypes.object
};

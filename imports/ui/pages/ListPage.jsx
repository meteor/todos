import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';

import BaseComponent from '../components/BaseComponent.jsx';
import ListHeader from '../components/ListHeader.jsx';
import TodoItem from '../components/TodoItem.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import Message from '../components/Message.jsx';

export default class ListPage extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = Object.assign(this.state, { editingTodo: null });
    this.onEditingChange = this.onEditingChange.bind(this);
  }

  onEditingChange(id, editing) {
    this.setState({
      editingTodo: editing ? id : null,
    });
  }

  render() {
    const {
      list,
      listExists,
      loading,
      todos,
    } = this.props;
    const { editingTodo } = this.state;

    if (!listExists) {
      return <NotFoundPage menuOpen={this.props.menuOpen} />;
    }

    let Todos;
    if (!todos || !todos.length) {
      Todos = (
        <Message
          title={i18n.__('pages.listPage.noTasks')}
          subtitle={i18n.__('pages.listPage.addAbove')}
        />
      );
    } else {
      Todos = todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo._id}
          editing={todo._id === editingTodo}
          onEditingChange={this.onEditingChange}
        />
      ));
    }

    return (
      <div className="page lists-show">
        <ListHeader list={list} menuOpen={this.props.menuOpen} />
        <div className="content-scrollable list-items">
          {loading
            ? <Message title={i18n.__('pages.listPage.loading')} />
            : Todos}
        </div>
      </div>
    );
  }
}

ListPage.propTypes = {
  list: PropTypes.object,
  todos: PropTypes.array,
  loading: PropTypes.bool,
  listExists: PropTypes.bool,
  menuOpen: PropTypes.object.isRequired,
};

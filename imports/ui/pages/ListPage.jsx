import React, { useState } from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';

import ListHeader from '../components/ListHeader.jsx';
import TodoItem from '../components/TodoItem.jsx';
import NotFoundPage from './NotFoundPage.jsx';
import Message from '../components/Message.jsx';
import Loading from '../components/Loading.jsx';

const ListPage = ({
  list,
  todos,
  loading,
  listExists,
}) => {
  const [editingTodo, setEditingTodo] = useState(null);

  const onEditingChange = (id, editing) => {
    setEditingTodo(editing ? id : null);
  };

  if (!listExists) {
    if (loading) {
      return <Loading />;
    }
    return <NotFoundPage />;
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
    Todos = todos.map((todo) => (
      <TodoItem
        todo={todo}
        key={todo._id}
        editing={todo._id === editingTodo}
        onEditingChange={onEditingChange}
      />
    ));
  }

  return (
    <div className="page lists-show">
      <ListHeader list={list} />
      <div className="content-scrollable list-items">
        {loading
          ? <Message title={i18n.__('pages.listPage.loading')} />
          : Todos}
      </div>
    </div>
  );
};

ListPage.propTypes = {
  list: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    userId: PropTypes.string,
    name: PropTypes.string.isRequired,
    incompleteCount: PropTypes.number.isRequired,
  }),
  todos: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  listExists: PropTypes.bool.isRequired,
};

ListPage.defaultProps = {
  list: {},
};

export default ListPage;

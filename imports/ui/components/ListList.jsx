/* global alert */

import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import { insert } from '../../api/lists/methods.js';

const ListList = ({ lists }) => {
  const history = useHistory();

  const createNewList = () => {
    const listId = insert.call({ locale: i18n.getLocale() }, (err) => {
      if (err) {
        history.replace('/');
        /* eslint-disable no-alert */
        alert(i18n.__('components.listList.newListError'));
      }
    });
    history.replace(`/lists/${listId}`);
  };

  return (
    <div className="list-todos">
      <a className="link-list-new" onClick={createNewList}>
        <span className="icon-plus" />
        {i18n.__('components.listList.newList')}
      </a>
      {lists.map((list) => (
        <NavLink
          to={`/lists/${list._id}`}
          key={list._id}
          title={list.name}
          className="list-todo"
          activeClassName="active"
        >
          {list.userId
            ? <span className="icon-lock" />
            : null}
          {list.incompleteCount
            ? <span className="count-list">{list.incompleteCount}</span>
            : null}
          {list.name}
        </NavLink>
      ))}
    </div>
  );
};

ListList.propTypes = {
  lists: PropTypes.array,
};

ListList.defaultProps = {
  lists: [],
};

export default ListList;

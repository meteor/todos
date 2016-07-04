import React from 'react';
import { Link } from 'react-router';
import { insert } from '../../api/lists/methods.js';

export default class ListList extends React.Component {
  constructor(props) {
    super(props);

    this.createNewList = this.createNewList.bind(this);
  }

  createNewList() {
    const { router } = this.context;
    const listId = insert.call((err) => {
      if (err) {
        router.push('/');
        /* eslint-disable no-alert */
        alert('Could not create list.');
      }
    });
    router.push(`/lists/${ listId }`);
  }

  render() {
    const { lists } = this.props;
    return (
      <div className="list-todos">
        <a className="link-list-new" onClick={this.createNewList}>
          <span className="icon-plus"></span>
          New List
        </a>
        {lists.map(list => (
          <Link
            to={`/lists/${ list._id }`}
            key={list._id}
            title={list.name}
            className="list-todo"
            activeClassName="active"
          >
            {list.userId
              ? <span className="icon-lock"></span>
              : null}
            {list.incompleteCount
              ? <span className="count-list">{list.incompleteCount}</span>
              : null}
            {list.name}
          </Link>
        ))}
      </div>
    );
  }
}

ListList.propTypes = {
  lists: React.PropTypes.array,
};

ListList.contextTypes = {
  router: React.PropTypes.object,
};

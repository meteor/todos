import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Lists } from '../../api/lists/lists.js';
import ListPage from '../pages/ListPage.jsx';

const ListPageContainer = withTracker(({ params: { id } }) => {
  const todosHandle = Meteor.subscribe('todos.inList', { listId: id });
  const loading = !todosHandle.ready();
  const list = Lists.findOne(id);
  const listExists = !loading && !!list;
  return {
    loading,
    list,
    listExists,
    todos: listExists ? list.todos().fetch() : [],
  };
})(ListPage);

export default ListPageContainer;

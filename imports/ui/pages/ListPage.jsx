import React from 'react';
import ListHeader from '../components/ListHeader.jsx';
import TodoItem from '../components/TodoItem.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import Message from '../components/Message.jsx';

export default class ListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editingTodo: null
    };
  }

  onEditingChange(id, editing) {
    this.setState({
      editingTodo: editing ? id : null
    });
  }

  render() {
    const { list, listExists, loading, todos } = this.props;
    const { editingTodo } = this.state;

    if (!listExists) {
      return <NotFoundPage/>;
    }

    const Todos = !todos || !todos.length
      ? <Message
          title="No tasks here"
          subtitle="Add new tasks using the field above"/>
      : todos.map(todo => (
          <TodoItem
            todo={todo}
            key={todo._id}
            editing={todo._id === editingTodo}
            onEditingChange={this.onEditingChange.bind(this)}/>
        ));

    return (
      <div className="page lists-show">
        <ListHeader list={list}/>
        <div className="content-scrollable list-items">
          {loading ? <Message title="Loading tasks..."/> : Todos}
        </div>
      </div>
    );
  }
}

ListPage.propTypes = {
  list: React.PropTypes.object,
  todos: React.PropTypes.array,
  loading: React.PropTypes.bool,
  listExists: React.PropTypes.bool
};

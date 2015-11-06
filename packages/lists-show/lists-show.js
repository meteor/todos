/* global Todos Lists FlowRouter Tracker */

Template.listsShow.onCreated(function() {
  // TODO -- figure out how to make this check work with the todo being a "Document"
  // check(this.data, new SimpleSchema({
  //   list: {blackbox: true},
  //   todosReady: {type: Boolean}
  // }));

  this.state = new ReactiveDict(`list.${this.data.list._id}`);
  this.state.setDefault({
    editing: false,
    editingTodo: false
  });

  this.saveList = () => {
    this.state.set('editing', false);

    Lists.methods.updateName.call({
      listId: this.data.list._id,
      newName: this.$('[name=name]').val()
    });
  };

  this.editList = () => {
    this.state.set('editing', true);

    // force the template to redraw based on the reactive change
    Tracker.flush();
    this.$('.js-edit-form input[type=text]').focus();
  };

  this.deleteList = () => {
    const list = this.data.list;
    const message = `Are you sure you want to delete the list ${list.name}?`;

    if (confirm(message)) {
      Lists.methods.remove.call({
        listId: list._id
      });

      // XXX should this be optimistic?
      // We need some way of calling this only if the client-side validation
      // passes
      FlowRouter.go('home');
      return true;
    }

    return false;
  };

  this.toggleListPrivacy = () => {
    const list = this.data.list;
    if (list.userId) {
      Lists.methods.makePublic.call({ listId: list._id });
    } else {
      Lists.methods.makePrivate.call({ listId: list._id });
    }
  };
});

Template.listsShow.onRendered(function() {
  this.find('.js-title-nav')._uihooks = {
    insertElement(node, next) {
      $(node)
        .hide()
        .insertBefore(next)
        .fadeIn();
    },
    removeElement(node) {
      $(node).fadeOut(function() {
        this.remove();
      });
    }
  };
});

Template.listsShow.helpers({
  todos(listId) {
    return Todos.find({listId: listId}, {sort: {createdAt: -1}});
  },
  todoArgs(todo) {
    const instance = Template.instance();
    return {
      todo,
      editing: instance.state.equals('editingTodo', todo._id),
      onEdit(doEdit) {
        instance.state.set('editingTodo', doEdit ? todo._id : false);
      }
    };
  }
});

Template.listsShow.events({
  'click .js-cancel'(event, instance) {
    instance.state.set('editing', false);
  },

  'keydown input[type=text]'(event) {
    // ESC
    if (event.which === 27) {
      event.preventDefault();
      $(event.target).blur();
    }
  },

  'blur input[type=text]'(event, instance) {
    // if we are still editing (we haven't just clicked the cancel button)
    if (instance.state.get('editing')) {
      instance.saveList();
    }
  },

  'submit .js-edit-form'(event, instance) {
    event.preventDefault();
    instance.saveList();
  },

  // handle mousedown otherwise the blur handler above will swallow the click
  // on iOS, we still require the click event so handle both
  'mousedown .js-cancel, click .js-cancel'(event, instance) {
    event.preventDefault();
    instance.state.set('editing', false);
  },

  // This is for the mobile dropdown
  'change .list-edit'(event, instance) {
    if ($(event.target).val() === 'edit') {
      instance.editList();
    } else if ($(event.target).val() === 'delete') {
      instance.deleteList();
    } else {
      instance.toggleListPrivacy();
    }

    event.target.selectedIndex = 0;
  },

  'click .js-edit-list'(event, instance) {
    instance.editList();
  },

  'click .js-toggle-list-privacy'(event, instance) {
    instance.toggleListPrivacy();
  },

  'click .js-delete-list'(event, instance) {
    instance.deleteList();
  },

  'click .js-todo-add'(event, instance) {
    instance.$('.js-todo-new input').focus();
  },

  'submit .js-todo-new'(event) {
    event.preventDefault();

    const $input = $(event.target).find('[type=text]');
    if (!$input.val()) {
      return;
    }

    Todos.methods.insert.call({
      listId: this.list._id,
      text: $input.val()
    });

    $input.val('');
  }
});

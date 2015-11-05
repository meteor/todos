var EDITING_KEY = 'editingList';
Session.setDefault(EDITING_KEY, false);

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
  editing() {
    return Session.get(EDITING_KEY);
  },
  todos(listId) {
    return Todos.find({listId: listId}, {sort: {createdAt : -1}});
  }
});

Template.listsShow.events({
  'click .js-cancel'() {
    Session.set(EDITING_KEY, false);
  },

  'keydown input[type=text]'(event) {
    // ESC
    if (27 === event.which) {
      event.preventDefault();
      $(event.target).blur();
    }
  },

  'blur input[type=text]'(event, template) {
    // if we are still editing (we haven't just clicked the cancel button)
    if (Session.get(EDITING_KEY))
      saveList(this.list, template);
  },

  'submit .js-edit-form'(event, template) {
    event.preventDefault();
    saveList(this.list, template);
  },

  // handle mousedown otherwise the blur handler above will swallow the click
  // on iOS, we still require the click event so handle both
  'mousedown .js-cancel, click .js-cancel'(event) {
    event.preventDefault();
    Session.set(EDITING_KEY, false);
  },

  // This is for the mobile dropdown
  'change .list-edit'(event, template) {
    if ($(event.target).val() === 'edit') {
      editList(this.list, template);
    } else if ($(event.target).val() === 'delete') {
      deleteList(this.list, template);
    } else {
      toggleListPrivacy(this.list, template);
    }

    event.target.selectedIndex = 0;
  },

  'click .js-edit-list'(event, template) {
    editList(this.list, template);
  },

  'click .js-toggle-list-privacy'(event, template) {
    toggleListPrivacy(this.list, template);
  },

  'click .js-delete-list'(event, template) {
    deleteList(this.list, template);
  },

  'click .js-todo-add'(event, template) {
    template.$('.js-todo-new input').focus();
  },

  'submit .js-todo-new'(event) {
    event.preventDefault();

    var $input = $(event.target).find('[type=text]');
    if (! $input.val())
      return;

    Todos.methods.insert.call({
      listId: this.list._id,
      text: $input.val()
    });

    $input.val('');
  }
});

function editList(list, template) {
  Session.set(EDITING_KEY, true);

  // force the template to redraw based on the reactive change
  Tracker.flush();
  template.$('.js-edit-form input[type=text]').focus();
};

function saveList(list, template) {
  Session.set(EDITING_KEY, false);

  Lists.methods.updateName.call({
    listId: list._id,
    newName: template.$('[name=name]').val()
  });
}

function deleteList(list) {
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
  } else {
    return false;
  }
};

function toggleListPrivacy(list) {
  if (list.userId) {
    Lists.methods.makePublic.call({ listId: list._id });
  } else {
    Lists.methods.makePrivate.call({ listId: list._id });
  }
};

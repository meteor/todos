/* eslint-env mocha */
/* global Todos Lists Factory chai withRenderedTemplate */

import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/factory';
import { chai } from 'meteor/practicalmeteor:chai';
import { StubCollections } from 'meteor/stub-collections';
import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';

import { withRenderedTemplate } from './test-helpers.js';

import { Todos } from '../../api/todos/todos.js';
import { Lists } from '../../api/lists/lists.js';

if (Meteor.isClient) {
  require('./todos-item.js');

  describe('Todos_item', () => {
    beforeEach(() => {
      StubCollections.stub([Todos, Lists]);
      Template.registerHelper('_', key => key);
    });

    afterEach(() => {
      StubCollections.restore();
      Template.deregisterHelper('_');
    });

    it('renders correctly with simple data', () => {
      const todo = Factory.create('todo', { checked: false });
      const data = {
        todo,
        onEditingChange: () => 0,
      };

      withRenderedTemplate('Todos_item', data, el => {
        chai.assert.equal($(el).find('input[type=text]').val(), todo.text);
        chai.assert.equal($(el).find('.list-item.checked').length, 0);
        chai.assert.equal($(el).find('.list-item.editing').length, 0);
      });
    });

    it('renders correctly when checked', () => {
      const todo = Factory.create('todo', { checked: true });
      const data = {
        todo,
        onEditingChange: () => 0,
      };

      withRenderedTemplate('Todos_item', data, el => {
        chai.assert.equal($(el).find('input[type=text]').val(), todo.text);
        chai.assert.equal($(el).find('.list-item.checked').length, 1);
      });
    });

    it('renders correctly when editing', () => {
      const todo = Factory.create('todo');
      const data = {
        todo,
        editing: true,
        onEditingChange: () => 0,
      };

      withRenderedTemplate('Todos_item', data, el => {
        chai.assert.equal($(el).find('input[type=text]').val(), todo.text);
        chai.assert.equal($(el).find('.list-item.editing').length, 1);
      });
    });
  });
}

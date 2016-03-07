/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/factory';
import { chai } from 'meteor/practicalmeteor:chai';
import { StubCollections } from 'meteor/stub-collections';
import { Template } from 'meteor/templating';
import { _ } from 'meteor/underscore';
import { $ } from 'meteor/jquery';

import { withRenderedTemplate } from './test-helpers.js';

import { Todos } from '../../api/todos/todos.js';
import { Lists } from '../../api/lists/lists.js';

if (Meteor.isClient) {
  require('./lists-show.js');

  describe('Lists_show', () => {
    beforeEach(() => {
      StubCollections.stub([Todos, Lists]);
      Template.registerHelper('_', key => key);
    });

    afterEach(() => {
      StubCollections.restore();
      Template.deregisterHelper('_');
    });

    it('renders correctly with simple data', () => {
      const list = Factory.create('list');
      const timestamp = new Date();
      const todos = _.times(3, i => Factory.create('todo', {
        listId: list._id,
        createdAt: new Date(timestamp - (3 - i)),
      }));

      const data = {
        list: () => list,
        todosReady: true,
        todos: list.todos(),
      };

      withRenderedTemplate('Lists_show', data, el => {
        const todosText = todos.map(t => t.text).reverse();
        const renderedText = $(el).find('.list-items input[type=text]')
          .map((i, e) => $(e).val())
          .toArray();
        chai.assert.deepEqual(renderedText, todosText);
      });
    });
  });
}

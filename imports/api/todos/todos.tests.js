/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/factory';
import { PublicationCollector } from 'meteor/publication-collector';
import { chai, assert } from 'meteor/practicalmeteor:chai';
import { Random } from 'meteor/random';
import { _ } from 'meteor/underscore';

import { Todos } from './todos.js';

if (Meteor.isServer) {
  // eslint-disable-next-line import/no-unresolved
  import './server/publications.js';

  describe('todos', () => {
    describe('mutators', () => {
      it('builds correctly from factory', () => {
        const todo = Factory.create('todo');
        assert.typeOf(todo, 'object');
        assert.typeOf(todo.createdAt, 'date');
      });
    });

    it('leaves createdAt on update', () => {
      const createdAt = new Date(new Date() - 1000);
      let todo = Factory.create('todo', { createdAt });

      const text = 'some new text';
      Todos.update(todo, { $set: { text } });

      todo = Todos.findOne(todo._id);
      assert.equal(todo.text, text);
      assert.equal(todo.createdAt.getTime(), createdAt.getTime());
    });

    describe('publications', () => {
      let publicList;
      let privateList;
      let userId;

      before(() => {
        userId = Random.id();
        publicList = Factory.create('list');
        privateList = Factory.create('list', { userId });

        _.times(3, () => {
          Factory.create('todo', { listId: publicList._id });
          // TODO get rid of userId, https://github.com/meteor/todos/pull/49
          Factory.create('todo', { listId: privateList._id, userId });
        });
      });

      describe('todos.inList', () => {
        it('sends all todos for a public list', (done) => {
          const collector = new PublicationCollector();
          collector.collect(
            'todos.inList',
            { listId: publicList._id },
            (collections) => {
              chai.assert.equal(collections.Todos.length, 3);
              done();
            },
          );
        });

        it('sends all todos for a public list when logged in', (done) => {
          const collector = new PublicationCollector({ userId });
          collector.collect(
            'todos.inList',
            { listId: publicList._id },
            (collections) => {
              chai.assert.equal(collections.Todos.length, 3);
              done();
            },
          );
        });

        it('sends all todos for a private list when logged in as owner', (done) => {
          const collector = new PublicationCollector({ userId });
          collector.collect(
            'todos.inList',
            { listId: privateList._id },
            (collections) => {
              chai.assert.equal(collections.Todos.length, 3);
              done();
            },
          );
        });

        it('sends no todos for a private list when not logged in', (done) => {
          const collector = new PublicationCollector();
          collector.collect(
            'todos.inList',
            { listId: privateList._id },
            (collections) => {
              chai.assert.isUndefined(collections.Todos);
              done();
            },
          );
        });

        it('sends no todos for a private list when logged in as another user', (done) => {
          const collector = new PublicationCollector({ userId: Random.id() });
          collector.collect(
            'todos.inList',
            { listId: privateList._id },
            (collections) => {
              chai.assert.isUndefined(collections.Todos);
              done();
            },
          );
        });
      });
    });
  });
}

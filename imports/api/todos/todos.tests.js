/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/factory';
import { PublicationCollector } from 'meteor/publication-collector';
import { chai, assert } from 'meteor/practicalmeteor:chai';
import { Random } from 'meteor/random';
import { _ } from 'meteor/underscore';

import { Todos } from './todos.js';

if (Meteor.isServer) {
  require('./server/publications.js');

  describe('todos', function () {
    describe('mutators', function () {
      it('builds correctly from factory', function () {
        const todo = Factory.create('todo');
        assert.typeOf(todo, 'object');
        assert.typeOf(todo.createdAt, 'date');
      });
    });

    it('leaves createdAt on update', function () {
      const createdAt = new Date(new Date() - 1000);
      let todo = Factory.create('todo', { createdAt });

      const text = 'some new text';
      Todos.update(todo, { $set: { text } });

      todo = Todos.findOne(todo._id);
      assert.equal(todo.text, text);
      assert.equal(todo.createdAt.getTime(), createdAt.getTime());
    });

    describe('publications', function () {
      let publicList;
      let privateList;
      let userId;

      before(function () {
        userId = Random.id();
        publicList = Factory.create('list');
        privateList = Factory.create('list', { userId });

        _.times(3, () => {
          Factory.create('todo', { listId: publicList._id });
          // TODO get rid of userId, https://github.com/meteor/todos/pull/49
          Factory.create('todo', { listId: privateList._id, userId });
        });
      });

      describe('todos.inList', function () {
        it('sends all todos for a public list', function (done) {
          const collector = new PublicationCollector();
          collector.collect('todos.inList', publicList._id, (collections) => {
            chai.assert.equal(collections.Todos.length, 3);
            done();
          });
        });

        it('sends all todos for a public list when logged in', function (done) {
          const collector = new PublicationCollector({ userId });
          collector.collect('todos.inList', publicList._id, (collections) => {
            chai.assert.equal(collections.Todos.length, 3);
            done();
          });
        });

        it('sends all todos for a private list when logged in as owner', function (done) {
          const collector = new PublicationCollector({ userId });
          collector.collect('todos.inList', privateList._id, (collections) => {
            chai.assert.equal(collections.Todos.length, 3);
            done();
          });
        });

        it('sends no todos for a private list when not logged in', function (done) {
          const collector = new PublicationCollector();
          collector.collect('todos.inList', privateList._id, (collections) => {
            chai.assert.isUndefined(collections.Todos);
            done();
          });
        });

        it('sends no todos for a private list when logged in as another user', function (done) {
          const collector = new PublicationCollector({ userId: Random.id() });
          collector.collect('todos.inList', privateList._id, (collections) => {
            chai.assert.isUndefined(collections.Todos);
            done();
          });
        });
      });
    });
  });
}

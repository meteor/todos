/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Factory } from 'meteor/dburles:factory';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import { chai, assert } from 'meteor/practicalmeteor:chai';
import { Random } from 'meteor/random';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { DDP } from 'meteor/ddp-client';
import { Lists } from '../lists.js';
import { insert, makePublic, makePrivate, updateName, remove } from '../methods.js';
import { Todos } from '../../todos/todos.js';
import '../../../../i18n/en.i18n.json';
import './publications.js';

describe('lists', function () {
  describe('mutators', function () {
    it('builds correctly from factory', function () {
      const list = Factory.create('list');
      assert.typeOf(list, 'object');
      assert.match(list.name, /List /);
    });
  });
  describe('publications', function () {
    const userId = Random.id();
    // TODO -- make a `listWithTodos` factory
    const createList = (props = {}) => {
      const list = Factory.create('list', props);
      _.times(3, () => {
        Factory.create('todo', { listId: list._id });
      });
    };
    before(function () {
      Lists.remove({});
      _.times(3, () => createList());
      _.times(2, () => createList({ userId }));
      _.times(2, () => createList({ userId: Random.id() }));
    });
    describe('lists.public', function () {
      it('sends all public lists', function (done) {
        const collector = new PublicationCollector();
        collector.collect('lists.public', (collections) => {
          chai.assert.equal(collections.lists.length, 3);
          done();
        });
      });
    });
    describe('lists.private', function () {
      it('sends all owned lists', function (done) {
        const collector = new PublicationCollector({ userId });
        collector.collect('lists.private', (collections) => {
          chai.assert.equal(collections.lists.length, 2);
          done();
        });
      });
    });
  });
  describe('methods', function () {
    let listId;
    let todoId;
    let otherListId;
    let userId;
    beforeEach(function () {
      // Clear
      Lists.remove({});
      Todos.remove({});
      // Create a list and a todo in that list
      listId = Factory.create('list')._id;
      todoId = Factory.create('todo', { listId })._id;
      // Create throwaway list, since the last public list can't be made private
      otherListId = Factory.create('list')._id;
      // Generate a 'user'
      userId = Random.id();
    });
    describe('makePrivate / makePublic', function () {
      function assertListAndTodoArePrivate() {
        assert.equal(Lists.findOne(listId).userId, userId);
        assert.isTrue(Lists.findOne(listId).isPrivate());
        assert.isTrue(Todos.findOne(todoId).editableBy(userId));
        assert.isFalse(Todos.findOne(todoId).editableBy(Random.id()));
      }

      it('makes a list private and updates the todos', function () {
        // Check initial state is public
        assert.isFalse(Lists.findOne(listId).isPrivate());
        // Set up method arguments and context
        const methodInvocation = { userId };
        const args = { listId };
        // Making the list private adds userId to the todo
        makePrivate._execute(methodInvocation, args);
        assertListAndTodoArePrivate();
        // Making the list public removes it
        makePublic._execute(methodInvocation, args);
        assert.isUndefined(Todos.findOne(todoId).userId);
        assert.isTrue(Todos.findOne(todoId).editableBy(userId));
      });
      it('only works if you are logged in', function () {
        // Set up method arguments and context
        const methodInvocation = {};
        const args = { listId };
        assert.throws(() => {
          makePrivate._execute(methodInvocation, args);
        }, Meteor.Error, /lists.makePrivate.notLoggedIn/);
        assert.throws(() => {
          makePublic._execute(methodInvocation, args);
        }, Meteor.Error, /lists.makePublic.notLoggedIn/);
      });
      it('only works if it\'s not the last public list', function () {
        // Remove other list, now we're the last public list
        Lists.remove(otherListId);
        // Set up method arguments and context
        const methodInvocation = { userId };
        const args = { listId };
        assert.throws(() => {
          makePrivate._execute(methodInvocation, args);
        }, Meteor.Error, /lists.makePrivate.lastPublicList/);
      });
      it('only makes the list public if you made it private', function () {
        // Set up method arguments and context
        const methodInvocation = { userId };
        const args = { listId };
        makePrivate._execute(methodInvocation, args);
        const otherUserMethodInvocation = { userId: Random.id() };
        // Shouldn't do anything
        assert.throws(() => {
          makePublic._execute(otherUserMethodInvocation, args);
        }, Meteor.Error, /lists.makePublic.accessDenied/);
        // Make sure things are still private
        assertListAndTodoArePrivate();
      });
    });
    describe('updateName', () => {
      it('changes the name, but not if you don\'t have permission', function () {
        updateName._execute({}, {
          listId,
          newName: 'new name',
        });
        assert.equal(Lists.findOne(listId).name, 'new name');
        // Make the list private
        makePrivate._execute({ userId }, { listId });
        // Works if the owner changes the name
        updateName._execute({ userId }, {
          listId,
          newName: 'new name 2',
        });
        assert.equal(Lists.findOne(listId).name, 'new name 2');
        // Throws if another user, or logged out user, tries to change the name
        assert.throws(() => {
          updateName._execute({ userId: Random.id() }, {
            listId,
            newName: 'new name 3',
          });
        }, Meteor.Error, /lists.updateName.accessDenied/);
        assert.throws(() => {
          updateName._execute({}, {
            listId,
            newName: 'new name 3',
          });
        }, Meteor.Error, /lists.updateName.accessDenied/);
        // Confirm name didn't change
        assert.equal(Lists.findOne(listId).name, 'new name 2');
      });
    });
    describe('remove', function () {
      it('does not delete the last public list', function () {
        const methodInvocation = { userId };
        // Works fine
        remove._execute(methodInvocation, { listId: otherListId });
        // Should throw because it is the last public list
        assert.throws(() => {
          remove._execute(methodInvocation, { listId });
        }, Meteor.Error, /lists.remove.lastPublicList/);
      });
      it('does not delete a private list you don\'t own', function () {
        // Make the list private
        makePrivate._execute({ userId }, { listId });
        // Throws if another user, or logged out user, tries to delete the list
        assert.throws(() => {
          remove._execute({ userId: Random.id() }, { listId });
        }, Meteor.Error, /lists.remove.accessDenied/);
        assert.throws(() => {
          remove._execute({}, { listId });
        }, Meteor.Error, /lists.remove.accessDenied/);
      });
    });
    describe('rate limiting', function () {
      it('does not allow more than 5 operations rapidly', function () {
        const connection = DDP.connect(Meteor.absoluteUrl());
        _.times(5, () => {
          connection.call(insert.name, { language: 'en' });
        });
        assert.throws(() => {
          connection.call(insert.name, { language: 'en' });
        }, Meteor.Error, /too-many-requests/);
        connection.disconnect();
      });
    });
  });
});


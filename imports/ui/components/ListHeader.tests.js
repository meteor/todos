/* global window */
/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/factory';
import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { chai } from 'meteor/practicalmeteor:chai';
import { sinon } from 'meteor/practicalmeteor:sinon';
import { Random } from 'meteor/random';

import ListHeader from './ListHeader.jsx';
import {
  updateName,
  remove,
} from '../../api/lists/methods.js';
import { insert } from '../../api/todos/methods.js';

configure({ adapter: new Adapter() });

if (Meteor.isClient) {
  describe('ListHeader', () => {
    let list = null;
    let header = null;
    let redirectToStub = null;

    beforeEach(() => {
      list = Factory.create('list', { userId: Random.id(), name: 'testing' });
      header = mount(<ListHeader list={list} />);
      const headerWrapper = header.instance();
      redirectToStub = sinon.stub(headerWrapper, 'redirectTo', () => {});
      headerWrapper.componentDidMount();
    });

    describe('any state', () => {
      it('should create a new todo when user submits', () => {
        sinon.stub(insert, 'call');

        header.instance().newTodoInput.value = 'new todo';
        header.find('.todo-new').simulate('submit');

        sinon.assert.calledWith(insert.call, { listId: list._id, text: 'new todo' });

        insert.call.restore();
      });

      it('should delete list and navigate home when user clicks trash', () => {
        sinon.stub(remove, 'call');
        sinon.stub(window, 'confirm').returns(true);

        header.find('.trash').simulate('click');

        sinon.assert.calledWith(remove.call, { listId: list._id });
        sinon.assert.calledWith(redirectToStub, '/');

        remove.call.restore();
        window.confirm.restore();
      });
    });

    describe('non-editing state', () => {
      it('should render title and todo creation form', () => {
        chai.assert.equal(header.find('.title-wrapper').text(), 'testing');
        chai.assert(header.find('.todo-new').length);
        chai.assert(!header.find('.list-edit-form').length);
      });
    });

    describe('editing state', () => {
      beforeEach(() => {
        header.setState({ editing: true });
      });

      it('should render edit and todo creation forms', () => {
        chai.assert(header.find('.list-edit-form').length);
        chai.assert(header.find('.todo-new').length);
        chai.assert(!header.find('.title-page').length);
      });

      it('should rename the list when user edits', () => {
        sinon.stub(updateName, 'call');

        header.instance().listNameInput.value = 'renamed';
        header.find('.list-edit-form').simulate('submit');
        sinon.assert.calledWith(updateName.call, {
          listId: list._id,
          newName: 'renamed',
        });
        updateName.call.restore();
      });
    });
  });
}

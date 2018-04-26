/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/factory';
import React from 'react';
import { configure, shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';
import { sinon } from 'meteor/practicalmeteor:sinon';
import Adapter from 'enzyme-adapter-react-16';

import TodoItem from './TodoItem.jsx';
import {
  setCheckedStatus,
  updateText,
  remove,
} from '../../api/todos/methods.js';

configure({ adapter: new Adapter() });

if (Meteor.isClient) {
  describe('TodoItem', () => {
    it('should render', () => {
      const todo = Factory.create('todo', { text: 'testing', checked: true });
      const item = shallow(<TodoItem todo={todo} />);
      chai.assert(item.hasClass('list-item'));
      chai.assert(item.hasClass('checked'));
      chai.assert.equal(item.find('input[type="text"]').prop('defaultValue'), 'testing');
    });

    describe('interaction', () => {
      let item = null;
      let todo = null;
      beforeEach(() => {
        todo = Factory.create('todo', { text: 'testing' });
        item = shallow(<TodoItem todo={todo} />);
      });

      it('should update text when edited', () => {
        sinon.stub(updateText, 'call');

        item.find('input[type="text"]').simulate('change', {
          target: { value: 'tested' },
        });

        sinon.assert.calledWith(updateText.call, {
          todoId: todo._id,
          newText: 'tested',
        });

        updateText.call.restore();
      });

      it('should update status when checked', () => {
        sinon.stub(setCheckedStatus, 'call');

        item.find('input[type="checkbox"]').simulate('change', {
          target: { checked: true },
        });

        sinon.assert.calledWith(setCheckedStatus.call, {
          todoId: todo._id,
          newCheckedStatus: true,
        });

        setCheckedStatus.call.restore();
      });

      it('should delete when trash is clicked', () => {
        sinon.stub(remove, 'call');

        item.find('.delete-item').simulate('click');

        sinon.assert.calledOnce(remove.call);

        remove.call.restore();
      });
    });
  });
}

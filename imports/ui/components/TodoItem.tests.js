/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/factory';
import React from 'react';
import { shallow, mount } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';
import { sinon } from 'meteor/practicalmeteor:sinon';
import TodoItem from './TodoItem.jsx';

import {
  setCheckedStatus,
  updateText,
  remove,
} from '../../api/todos/methods.js';

if (Meteor.isClient) {
  describe('TodoItem', () => {
    it('should render', () => {
      const todo = Factory.create('todo', { text: 'testing', checked: true });
      const item = shallow(<TodoItem todo={todo} />);
      chai.assert.equal(item.hasClass('list-item'), true);
      chai.assert.equal(item.hasClass('checked'), true);
      chai.assert.equal(item.find('input[type="text"]').prop('defaultValue'), 'testing');
    });
    describe('interaction', function testInteraction() {
      beforeEach(() => {
        this.todo = Factory.create('todo', { text: 'testing' });
        this.item = mount(<TodoItem todo={this.todo} />);
      });
      it('should update text when edited', () => {
        sinon.stub(updateText, 'call');
        this.item.find('input[type="text"]').simulate('change', {
          target: { value: 'tested' },
        });
        chai.assert(updateText.call.calledWith({
          todoId: this.todo._id,
          newText: 'tested',
        }));
        updateText.call.restore();
      });
      it('should update status when checked', () => {
        sinon.stub(setCheckedStatus, 'call');
        this.item.find('input[type="checkbox"]').simulate('change', {
          target: { checked: true },
        });
        chai.assert(setCheckedStatus.call.calledWith({
          todoId: this.todo._id,
          newCheckedStatus: true,
        }));
        setCheckedStatus.call.restore();
      });
      it('should delete when trash is clicked', () => {
        sinon.stub(remove, 'call');
        this.item.find('.delete-item').simulate('click');
        chai.assert(remove.call.calledOnce);
        remove.call.restore();
      });
    });
  });
}

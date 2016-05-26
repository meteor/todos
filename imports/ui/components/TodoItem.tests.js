/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/factory';
import React from 'react';
import { shallow, mount } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';
import { sinon } from 'meteor/practicalmeteor:sinon';
import TodoItem from './TodoItem.jsx';

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
        const todo = Factory.create('todo', { text: 'testing' });
        this.item = mount(<TodoItem todo={todo} />);
      });
      it('should update text when edited', () => {
        const stub = sinon.stub(this.item.instance(), 'throttledUpdate');
        this.item.find('input[type="text"]').simulate('change', { target: { value: 'tested' } });
        chai.assert(stub.calledWith('tested'));
      });
      it('should update status when checked', () => {
        const stub = sinon.stub(this.item.instance(), 'setTodoCheckStatus');
        this.item.find('input[type="checkbox"]').simulate('change', { target: { checked: true } });
        chai.assert(stub.calledOnce);
      });
      it('should delete when trash is clicked', () => {
        const stub = sinon.stub(this.item.instance(), 'deleteTodo');
        this.item.find('.delete-item').simulate('click');
        chai.assert(stub.calledOnce);
      });
    });
  });
}

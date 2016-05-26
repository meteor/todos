/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/factory';
import React from 'react';
import { shallow, mount } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';
import { sinon } from 'meteor/practicalmeteor:sinon';
import TodoItem from './TodoItem.jsx';
import { _ } from 'meteor/underscore';

if (Meteor.isClient) {
  describe('TodoItem', () => {
    it('should render', () => {
      const todo = Factory.create('todo', { text: 'testing', checked: true });
      const item = shallow(<TodoItem todo={todo} />);
      chai.assert.equal(item.hasClass('list-item'), true);
      chai.assert.equal(item.hasClass('checked'), true);
      chai.assert.equal(item.find('input[type="text"]').prop('defaultValue'), 'testing');
    });
    it('should update text when edited', () => {
      const todo = Factory.create('todo', { text: 'testing' });
      const item = mount(<TodoItem todo={todo} />);
      const stub = sinon.stub(item.instance(), 'throttledUpdate');
      item.find('input[type="text"]').simulate('change', {target: {value: 'tested'}});
      chai.assert(stub.calledWith('tested'));
    });
  });
}

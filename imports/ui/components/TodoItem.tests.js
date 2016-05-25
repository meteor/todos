/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/factory';
import React from 'react';
import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';
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
  });
}

/* eslint-env mocha */

import React from 'react';
import { chai } from 'meteor/practicalmeteor:chai';
import { mount } from 'enzyme';
import { Factory } from 'meteor/factory';

// XXX: should be able to get sinon from npm, but https://github.com/meteor/meteor/issues/6427
// import { sinon } from 'sinon';
import { sinon } from 'meteor/practicalmeteor:sinon';

import TodoItem from './TodoItem.jsx';

const { expect } = chai;


describe('<TodoItem />', () => {
  it('calls componentDidMount', () => {
    sinon.spy(TodoItem.prototype, 'componentDidMount');

    const onEditingChange = () => 0;
    mount(
      <TodoItem
        todo={Factory.create('todo')}
        editing={false}
        onEditingChange={onEditingChange}
      />
    );

    // expect(wrapper.find('div.list-item')).to.have.length(1);
    expect(TodoItem.prototype.componentDidMount.calledOnce).to.equal(true);

    TodoItem.prototype.componentDidMount.restore();
  });
});

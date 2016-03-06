import React from 'react';
// import {mocha} from 'meteor/avital:mocha';
import {chai} from 'meteor/practicalmeteor:chai';
import {mount, shallow} from 'enzyme';
import { Factory } from 'meteor/factory';

import TodoItem from './TodoItem.jsx';

// const {describe, it} = mocha;
const {expect, to, equal} = chai;

describe('<TodoItem />', () => {
  it('calls componentDidMount', () => {
    const wrapper = mount(
      <TodoItem
        todo={Factory.create('todo')}
        editing={false}
        onEditingChange={() => 0}
      />
    );

    expect(wrapper.find('div.list-item')).to.have.length(1);
    // expect(TodoItem.prototype.componentDidMount.calledOnce).to.equal(true);
  })
});
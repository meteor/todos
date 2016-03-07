/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { generateData } from './generate-route-test-data.js';
import { Lists } from '../../imports/api/lists/lists.js';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { assert } from 'meteor/practicalmeteor:chai';

if (Meteor.isClient) {
  describe('data available when routed', () => {
    beforeEach(done => {
      generateData()
        .then(() => FlowRouter.go('/'))
        .nodeify(done);
    });

    describe('when logged out', () => {
      it('has all public lists at homepage', () => {
        assert.equal(Lists.find().count(), 3);
      });

      it('renders the correct list when routed to', () => {
        const list = Lists.findOne();
        FlowRouter.go('Lists.show', {listId: list._id});
        assert.equal($('.title-wrapper').html(), list.name);
      });
    });
  });
}

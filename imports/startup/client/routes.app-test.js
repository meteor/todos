/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { DDP } from 'meteor/ddp-client';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { assert } from 'meteor/practicalmeteor:chai';
import { $ } from 'meteor/jquery';

import { generateData } from './../../api/generate-data.app-tests.js';
import { Lists } from '../../api/lists/lists.js';
import { Todos } from '../../api/todos/todos.js';

// Utility function to wait for subscriptions
const waitForSubscriptions = (done) => {
  const poll = Meteor.setInterval(() => {
    if (DDP._allSubscriptionsReady()) {
      clearInterval(poll);
      done();
    }
  }, 200);
};

// Utility to allow throwing inside callback
const catchAsync = (done, cb) => () => {
  try {
    cb();
  } catch (e) {
    done(e);
  }
};

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

      it('renders the correct list when routed to', done => {
        const list = Lists.findOne();
        FlowRouter.go('Lists.show', { _id: list._id });

        // Wait for the router change to take affect
        Tracker.afterFlush(catchAsync(done, () => {
          assert.equal($('.title-wrapper').html(), list.name);

          // Wait for all subscriptions triggered by this route to complete
          waitForSubscriptions(catchAsync(done, () => {
            assert.equal(Todos.find({listId: list._id}).count(), 3);
            done();
          }));
        }));
      });
    });
  });
}

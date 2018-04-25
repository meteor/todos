import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { withTracker } from 'meteor/react-meteor-data';

import { Lists } from '../../api/lists/lists.js';
import App from '../layouts/App.jsx';

const menuOpen = new ReactiveVar(false);

export default withTracker(() => {
  const publicHandle = Meteor.subscribe('lists.public');
  const privateHandle = Meteor.subscribe('lists.private');
  return {
    user: Meteor.user(),
    loading: !(publicHandle.ready() && privateHandle.ready()),
    connected: Meteor.status().connected,
    menuOpen,
    lists: Lists.find({
      $or: [
        { userId: { $exists: false } },
        { userId: Meteor.userId() },
      ],
    }).fetch(),
  };
})(App);

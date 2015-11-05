/* global Lists:true */
/* global SimpleSchema Factory faker */

Lists = new Mongo.Collection('Lists', {
  transform(listDoc) {
    return new ListModel(listDoc);
  }
});

Lists.schema = new SimpleSchema({
  name: { type: String },
  incompleteCount: {type: Number, defaultValue: 0},
  userId: { type: String, optional: true }
});

Lists.attachSchema(Lists.schema);

if (Meteor.isServer) {
  Meteor.publish('lists/public', function() {
    return Lists.find({userId: {$exists: false}});
  });

  Meteor.publish('lists/private', function() {
    if (!this.userId) {
      return this.ready();
    }

    return Lists.find({userId: this.userId});
  });
}

Factory.define('list', Lists, {});
Factory.define('list', Lists, {});

class ListModel {
  constructor(listDoc) {
    _.extend(this, listDoc);
  }

  // A list is considered to be private if it has a userId set
  isPrivate() {
    return !! this.userId;
  }

  isLastPublicList() {
    const publicListCount = Lists.find({userId: {$exists: false}}).count();
    return !this.isPrivate() && publicListCount === 1;
  }
}

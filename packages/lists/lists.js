/* global Lists:true */
/* global SimpleSchema Factory faker */

Lists = new Mongo.Collection('Lists');

Lists.schema = new SimpleSchema({
  name: {
    type: String,
    // Calculate a default name for a list in the form of 'List A'
    autoValue() {
      if (this.isSet) {
        // Don't override a manually set name
        return;
      }

      let nextLetter = 'A', nextName = `List ${nextLetter}`;
      while (Lists.findOne({name: nextName})) {
        // not going to be too smart here, can go past Z
        nextLetter = String.fromCharCode(nextLetter.charCodeAt(0) + 1);
        nextName = `List ${nextLetter}`;
      }
      return nextName; // eslint-disable-line consistent-return
    }
  },
  incompleteCount: {type: Number, defaultValue: 0}
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

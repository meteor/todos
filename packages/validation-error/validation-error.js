/* global ValidationError:true */
/* global SimpleSchema */

// This is exactly what comes out of SS.
const errorSchema = new SimpleSchema({
  name: {type: String},
  type: {type: String},
  details: {type: Object, blackbox: true, optional: true}
});
const errorsSchema = new SimpleSchema({
  errors: {type: [errorSchema]}
});

ValidationError = class extends Meteor.Error {
  constructor(errors) {
    check({errors}, errorsSchema);
    super('validation-error', 'Validation Failed', errors);
  }
};

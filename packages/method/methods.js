/* global Method:true */
/* global SimpleSchema */

// TODO
// 1. Need a way to share data between authorize and run, in case you need to
// load a particular document
// 2. Need to figure out how the client stub should behave when error is thrown

Method = class Method {
  constructor({
    name,
    schema,
    validate,
    run,
  }) {
    check(name, String);
    check(schema, Match.Optional(SimpleSchema));

    if (schema) {
      if (validate) {
        // Make sure people don't pass schema and validate
        throw new Error('Validate is overriden by schema.');
      }

      validate = (args) => {
        validateAgainstSimpleSchema(args, schema);
      };
    }

    check(validate, Function);
    check(run, Function);

    _.extend(this, {
      name,
      validate,
      run,
    });

    const method = this;
    Meteor.methods({
      [name](args) {
        const methodInvocation = this;
        return method._execute(methodInvocation, args);
      }
    });
  }

  call(args, callback) {
    const options = {
      returnStubValue: true
    };

    return Meteor.apply(this.name, [args], options, callback);
  }

  _execute(methodInvocation, args) {
    const validateResult = this.validate.bind(methodInvocation)(args);

    if (typeof validateResult !== 'undefined') {
      throw new Error(`Returning from validate doesn't do anything; \
perhaps you meant to throw an error?`);
    }

    return this.run.bind(methodInvocation)(args);
  }
};

function validateAgainstSimpleSchema(obj, ss) {
  const validationContext = ss.newContext();
  const isValid = validationContext.validate(obj);

  if (isValid) {
    // All good!
    return;
  }

  const validationError = new Error('validation-failed');
  validationError.keys = validationContext.invalidKeys();
  throw validationError;
}

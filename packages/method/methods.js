/* global Method:true */
/* global SimpleSchema ValidationError */

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
        // Silence audit-argument-checks since arguments are always checked when using this package,
        // we just use SimpleSchema instead of check
        check(args, Match.Any);
        const methodInvocation = this;
        return method._execute(methodInvocation, args);
      }
    });
  }

  call(args, callback) {
    // Accept calling with just a callback
    if (_.isFunction(args)) {
      callback = args;
      args = {};
    }

    const options = {
      // Make it possible to get the ID of an inserted item
      returnStubValue: true,

      // Don't call the server method if the client stub throws an error, so that we don't end
      // up doing validations twice
      // XXX needs option to disable, in cases where the client might have incomplete information to
      // make a decision
      throwStubExceptions: true
    };

    try {
      return Meteor.apply(this.name, [args], options, callback);
    } catch (err) {
      // Get errors from the stub in the same way as from the server-side method
      callback(err);
    }
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

  const {name, type, value} = validationContext.invalidKeys();
  throw new ValidationError({name, type, details: {value}});
}

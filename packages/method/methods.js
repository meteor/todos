Method = class Method {
  constructor({
    name,
    validate,
    authorize,
    run,
  }) {
    check(name, String);
    check(validate, Function);
    check(authorize, Function);
    check(run, Function);

    _.extend(this, {
      name,
      validate,
      authorize,
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
    Meteor.call(this.name, args, callback);
  }

  _execute(methodInvocation, args) {
    const validateResult = this.validate.bind(methodInvocation)(args);

    if (typeof validateResult !== 'undefined') {
      throw new Error(`Returning from validate doesn't do anything; \
perhaps you meant to throw an error?`);
    }

    const authorizeResult = this.authorize.bind(methodInvocation)(args);

    if (typeof authorizeResult !== 'undefined') {
      throw new Error(`Returning from authorize doesn't do anything; \
perhaps you meant to throw an error?`);
    }

    return this.run.bind(methodInvocation)(args);
  }
}

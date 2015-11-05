// TODO
// 1. Need a way to share data between authorize and run, in case you need to
// load a particular document
// 2. Need to figure out how the client stub should behave when error is thrown

Method = class Method {
  constructor({
    name,
    validate,
    run,
  }) {
    check(name, String);
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
    Meteor.call(this.name, args, callback);
  }

  _execute(methodInvocation, args) {
    const validateResult = this.validate.bind(methodInvocation)(args);

    if (typeof validateResult !== 'undefined') {
      throw new Error(`Returning from validate doesn't do anything; \
perhaps you meant to throw an error?`);
    }

    return this.run.bind(methodInvocation)(args);
  }
}

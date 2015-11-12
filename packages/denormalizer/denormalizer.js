/* global Denormalizer:true */

// this is an "abstract" class
Denormalizer = class {
  constructor({source, target, foreignKey}) {
    this.source = source;
    this.target = target;
    this.foreignKey = foreignKey;
  }
  updateTargets(selector, modifier) {
    if (typeof selector !== 'string') {
      throw new Error("NOT IMPLEMENTED: can't denormalize non-_id updates");
    }
    return this.target().update({[this.foreignKey]: selector}, modifier, {multi: true});
  }
  updateSource(foreignKey, modifier) {
    return this.source().update(foreignKey, modifier);
  }
};

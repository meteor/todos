/* global Denormalizer:true */

Denormalizer = class {
  constructor({source, target, field, foreignKey}) {
    this.source = source;
    this.target = target;
    this.field = field;
    this.foreignKey = foreignKey;
  }
  getSourceValue(selector) {
    return this.source().findOne(selector)[this.field];
  }
  insert(doc) {
    const foreignId = doc[this.foreignKey];
    if (foreignId) {
      doc[this.field] = this.getSourceValue(foreignId);
    }
  }
  update(selector, modifier) { // eslint-disable-line
    // NOT YET IMPLEMENTED (we don't do this in todos)
  }
  updateTargetValues(selector, modifier) {
    if (typeof selector !== 'string') {
      throw new Error("NOT IMPLEMENTED: can't denormalize non-_id updates");
    }
    this.target().update({[this.foreignKey]: selector}, modifier, {multi: true});
  }
  set(selector, value) {
    this.updateTargetValues(selector, {$set: {[this.field]: value}});
  }
  unset(selector) {
    this.updateTargetValues(selector, {$unset: {[this.field]: true}});
  }
};

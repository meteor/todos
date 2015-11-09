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
  sourceUpdate(selector, modifier) {
    // NOTE: assumes modifier is only going to $set, and selector is always an _id
    if (modifier.$set && modifier.$set[this.field]) {
      if (typeof selector !== 'string') {
        throw new Error("NOT IMPLEMENTED: can't denormalize non-_id updates");
      }
      const update = {
        [this.field]: modifier.$set[this.field]
      };
      this.target().update({[this.foreignKey]: selector}, {$set: update});
    }
    if (modifier.$unset && modifier.$unset[this.field]) {
      if (typeof selector !== 'string') {
        throw new Error("NOT IMPLEMENTED: can't denormalize non-_id updates");
      }
      this.target().update({[this.foreignKey]: selector}, {$unset: {[this.field]: true}});
    }
  }
};

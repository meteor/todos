/* global Denormalizer */

Denormalizer.Property = class extends Denormalizer {
  constructor(options) {
    super(options);
    this.field = options.field;
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
  set(selector, value) {
    this.updateTargets(selector, {$set: {[this.field]: value}});
  }
  unset(selector) {
    this.updateTargets(selector, {$unset: {[this.field]: true}});
  }
};

/* global CountDenormalizer:true */
/* global Denormalizer */

Denormalizer.Count = class extends Denormalizer {
  constructor(options) {
    super(options);
    this.field = options.field;
  }
  inc(foreignKey, count) {
    this.updateSource(foreignKey, {$inc: {[this.field]: count}});
  }
  insert(doc) {
    if (doc[this.foreignKey]) {
      this.inc(doc[this.foreignKey], 1);
    }
  }
  remove(doc) {
    if (doc[this.foreignKey]) {
      this.inc(doc[this.foreignKey], -1);
    }
  }
};

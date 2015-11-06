/* global Factory:true */
/* global LocalCollection */

Factory = function(name, collection, properties) {
  this.name = name;
  this.collection = collection;
  this.properties = properties;
  this.afterBuildCbs = [];
};

Factory.prototype.afterBuild = function(cb) {
  this.afterBuildCbs.push(cb);
};

Factory.prototype.build = function(dataset, props, opts) {
  // favour passed in properties to defined properties
  const properties = _.extend({}, this.properties, props);
  const options = opts || {};

  const doc = {};
  const setProp = function(subDoc, prop, value) {
    if (_.isFunction(value)) {
      setProp(subDoc, prop, value.call(doc, dataset));
    } else if (value instanceof Factory) {
      if (options.noRelations) {
        setProp(subDoc, prop, Random.id());
      } else {
        const relation = value.build(dataset);
        setProp(subDoc, prop, relation._id);
      }
    // TODO: what is the correct check here?
    } else if (_.isObject(value) && !_.isDate(value) && !_.isArray(value)) {
      subDoc[prop] = subDoc[prop] || {};
      walk(subDoc[prop], value);  // eslint-disable-line
    } else if (prop !== '_id') {
      const modifier = {$set: {}};
      modifier.$set[prop] = value;
      LocalCollection._modify(subDoc, modifier);
    }
  };

  // walk the tree and evaluate
  function walk(subDoc, subProps) {
    _.each(subProps, function(value, prop) {
      setProp(subDoc, prop, value);
    });
  }

  // you can't set _id with _modify
  if (properties._id) {
    let id = properties._id;
    if (_.isFunction(id)) {
      id = id.call(doc);
    }
    doc._id = id;
  } else {
    doc._id = Random.id();
  }

  walk(doc, properties);

  _.each(this.afterBuildCbs, function(callback) {
    callback(doc, dataset);
  });

  dataset.addDocument(doc, this.collection);
  return doc;
};

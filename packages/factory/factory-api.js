/* global Factory */

Factory._factories = {};

Factory.get = function(name) {
  const factory = Factory._factories[name];
  if (!factory) {
    throw new Meteor.Error(`No factory defined named ${name}`);
  }
  return factory;
};

Factory.define = function(name, collection, properties) {
  Factory._factories[name] = new Factory(name, collection, properties);
  return Factory.get(name);
};


Factory.create = function(name, properties) {
  const dataset = Factory.compile(name, properties);
  dataset.createAll();
  return dataset.targetDocCollection.findOne(dataset.targetDocId);
};

Factory.compile = function(name, properties, options) {
  const dataset = new Factory.Dataset();
  const factory = Factory.get(name);
  dataset.add(factory, properties, _.extend({target: true}, options));
  return dataset;
};

Factory.build = function(name, properties) {
  const dataset = Factory.compile(name, properties, {noRelations: true});
  return dataset.getTargetDoc();
};

Factory.extend = function(name, properties) {
  return _.extend({}, Factory.get(name).properties, properties || {});
};

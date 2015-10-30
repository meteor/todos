/* global Factory */

var Dataset = function() {
  this.documents = {};
  this.collections = {};
};

_.extend(Dataset.prototype, {
  add: function(nameOrFactory, properties, opts) {
    var options = opts || {};

    var factory;
    if (_.isString(nameOrFactory)) {
      factory = Factory.get(nameOrFactory);
    } else {
      factory = nameOrFactory;
    }

    var doc = factory.build(this, properties, _.pick(options || {}, 'noRelations'));
    if (options && options.target) {
      // We need to apply the transform from the collection as we aren't inserting anywhere
      if (factory.collection._transform) {
        doc = factory.collection._transform(doc);
      }

      this.targetDocId = doc._id;
      this.targetDocCollection = factory.collection;
    }
    return doc;
  },

  addDocument: function(document, collection) {
    var collectionName = collection._name;

    if (!this.documents[collectionName]) {
      this.documents[collectionName] = [];
      this.collections[collectionName] = collection;
    }

    this.documents[collectionName].push(document);
  },

  createAll: function() {
    var self = this;

    _.each(self.documents, function(docs, collectionName) {
      _.each(docs, function(doc) {
        self.collections[collectionName].insert(doc);
      });
    });
  },

  get: function(collectionName, id) {
    // XXX: this could be a lot more efficient if we used a collection from the beginning
    const doc = _.find(this.documents[collectionName], function(d) { return d._id === id; });
    const transform = this.collections[collectionName]._transform;
    if (transform) {
      return transform(doc);
    }
    return doc;
  },

  getTargetDoc: function() {
    return this.get(this.targetDocCollection._name, this.targetDocId);
  },

  getAsCollection: function(collectionName) {
    // NOTE: this should be something more featured like StubCollections.stubCollection
    //  as it should clone the schema etc also. Maybe it doesn't matter...
    var collection = new Mongo.Collection(null, {
      transform: this.collections[collectionName]._transform
    });

    _.each(this.documents[collectionName], function(doc) {
      collection.insert(doc);
    });

    return collection;
  },

  getAsCursor: function(collectionName) {
    var collection = this.getAsCollection(collectionName);
    return collection.find();
  }
});

Factory.Dataset = Dataset;

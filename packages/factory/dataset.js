/* global Factory */

function Dataset() {
  this.documents = {};
  this.collections = {};
}

_.extend(Dataset.prototype, {
  add(nameOrFactory, properties, opts) {
    const options = opts || {};

    let factory;
    if (_.isString(nameOrFactory)) {
      factory = Factory.get(nameOrFactory);
    } else {
      factory = nameOrFactory;
    }

    let doc = factory.build(this, properties, _.pick(options || {}, 'noRelations'));
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

  addDocument(document, collection) {
    const collectionName = collection._name;

    if (!this.documents[collectionName]) {
      this.documents[collectionName] = [];
      this.collections[collectionName] = collection;
    }

    this.documents[collectionName].push(document);
  },

  createAll() {
    const self = this;

    _.each(self.documents, function(docs, collectionName) {
      _.each(docs, function(doc) {
        self.collections[collectionName].insert(doc);
      });
    });
  },

  get(collectionName, id) {
    // XXX: this could be a lot more efficient if we used a collection from the beginning
    const doc = _.find(this.documents[collectionName], function(d) { return d._id === id; });
    const transform = this.collections[collectionName]._transform;
    if (transform) {
      return transform(doc);
    }
    return doc;
  },

  getTargetDoc() {
    return this.get(this.targetDocCollection._name, this.targetDocId);
  },

  getAsCollection(collectionName) {
    // NOTE: this should be something more featured like StubCollections.stubCollection
    //  as it should clone the schema etc also. Maybe it doesn't matter...
    const collection = new Mongo.Collection(null, {
      transform: this.collections[collectionName]._transform
    });

    _.each(this.documents[collectionName], function(doc) {
      collection.insert(doc);
    });

    return collection;
  },

  getAsCursor(collectionName) {
    const collection = this.getAsCollection(collectionName);
    return collection.find();
  }
});

Factory.Dataset = Dataset;

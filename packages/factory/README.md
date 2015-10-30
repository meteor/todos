# Factory

A factory package for Meteor.

This version is very similar to https://atmospherejs.com/dburles/factory although internally it's implementation is quite different.

## Usage

To define a factory:

```
Factory.define("app", Apps, {
  name: function() { return Faker.name(); }
});
```

To create an app and insert it into the collection
(usually for things like unit tests):
```
Factory.create("app");
```


To build an app, appropriate for `Apps.insert` (or other purposes, e.g. styleguide):
```
Factory.build("app")
```

### Relationships

A key thing is relationships between factories.

```
Factory.define("appVersion", AppVersions, {
  app: Factory.get("app")
});
```

If we call `Factory.create("appVersion")`, it will return a single version, but *will also insert an app into the `Apps`*. The `app` key on the version will allow you to find it.

If you call `Factory.build("appVersion")` *no app* will be created and the `app` key will be set to a random id (NOTE: this may be a bad idea and quite confusing).

There is a more useful method for this case:

```
Factory.compile("appVersion")
```

This returns an object with *collection names* as keys and an array of build documents as values, for instance:
```
{
  appVersions: [{...}],
  apps: [{...}]
}
```

This is useful for styleguide specs for instance, as the component will usually need some or all of this data.

## TODO

- JSdocs
- Support mutators/validation for insert
- afterCreate / decide on what after does
- make extend a little saner?
- decide if we'll send a PR to dburles or call this a separate package.
- Allow "runtime" dependencies between packages
- Seed approach for unit test consistency and speed.

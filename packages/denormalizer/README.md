## Denormalizer

This is a simple pattern for wrapping up the logic of denormalizing field `x` from collection `A` onto collection `B`, where `B` "belongs to" `A`.

There are many other types of typical denormalization that could be similarly codified into a package like this.

We should look at https://atmospherejs.com/jeanfredrik/denormalize and see if we can share code (that package uses collection-hooks, but the core logic is the same, simply the method of integration with mutations is different).

### API

```js
xDenormalizer = new Denormalizer({
  source: () => A,
  target: () => B,
  field: 'x',
  foreignKey: 'aId'
});

// This would be nice, but requires quite a complex implementation of `sourceUpdate` to get right.
// A = new Collection2('A', {
//   update(selector, modifier) {
//    // updates all dependent Bs if x is changing
//    xDenormalizer.sourceUpdate(selector, modifier);
//    super(selector, modifier);
//  }
//});

// Instead, whenever updating A[field], ensure you call one of `xDenormalizer.[un]set()`:
A.update(selector, {$set: {[field]: fieldValue}});
xDenormalizer.set(selector, fieldValue);

B = new Collection2('B', {
  insert(doc) {
    // sets doc.x from linked A
    xDenormalizer.insert(doc);
    super(doc);
  },
  update(selector, modifier) {
    // updates modifier to change x if linked A has changed
    xDenormalizer.update(selector, modifier);
    super(selector, modifier);
  }
});
```

### Limitations

This version is really just a proof of concept, we should ensure a more complete version exists

- Assumes that `B[A.name + 'Id']` is the linking field
- Doesn't actually implement `.update()` yet
- `sourceUpdate` is by no means bulletproof
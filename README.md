[![Circle CI](https://circleci.com/gh/meteor/todos.svg?style=svg)](https://circleci.com/gh/meteor/todos)

This is a Todos example app built on the principles described in the [Meteor Guide](http://guide.meteor.com/structure.html). This app uses the module functionality from the upcoming Meteor 1.3, but everything else should be applicable to Meteor 1.2 as well.

## Versions

This version (the `master`) branch uses the [Blaze](http://guide.meteor.com/blaze.html) rendering library, with code written in ES2015 JavaScript.

The [`react`](https://github.com/meteor/todos/tree/react) branch implements the same application using [React](http://guide.meteor.com/react.html)

The [`coffeescript`](https://github.com/meteor/todos/tree/coffeescript) branch implements this (the Blaze) version of the app in CoffeeScript.

Note that attempts will be made to keep the branches up to date but this isn't guaranteed.

### Running the app

```bash
npm install
meteor
```

### Scripts

To lint:

```bash
npm run lint
```

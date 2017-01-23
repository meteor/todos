[![Circle CI](https://circleci.com/gh/meteor/todos.svg?style=svg)](https://circleci.com/gh/meteor/todos)

This is a Todos example app built on the principles described in the [Meteor Guide](http://guide.meteor.com/structure.html). This branch (`coffeescript`) is a port of the app into [CoffeeScript](http://docs.meteor.com/#/full/coffeescript). It uses the latest features of CoffeeScript, including native support for `import` and `export` and classes.

### Running the app

```bash
meteor npm install
meteor
```

### Where to look

Within the `imports` folder, the original ES2015 version of each file (as of commit [db48dfd](https://github.com/meteor/todos/commit/a3bc010e7ecddb1ff7aa8f77ea2b14634d85e9ae)) is alongside its CoffeeScript port. Since `imports` is a special folder in Meteor, these `.js` files are never used, since no code ever imports them. (The former `client/main.js` and `server/main.js` are one-liners that are included as comments in `client/main.coffee` and `server/main.coffee`.) Tests aren’t run as part of the core app and haven’t been ported.

For a single file that showcases how to accomplish writing most of the new ES2015 features in CoffeeScript, compare the original [`todos.js`](https://github.com/meteor/todos/blob/coffeescript/imports/api/todos/todos.js) with the new [`todos.coffee`](https://github.com/meteor/todos/blob/coffeescript/imports/api/todos/todos.coffee).

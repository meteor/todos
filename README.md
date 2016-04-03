[![Circle CI](https://circleci.com/gh/meteor/todos.svg?style=svg)](https://circleci.com/gh/meteor/todos)

This is a Todos example app built on the principles described in the Meteor Guide. This branch (`coffeescript`) is a port of the app into [CoffeeScript](http://docs.meteor.com/#/full/coffeescript). The point of this port is to demonstrate how to use ES2015 modules and classes, introduced in Meteor 1.3, with CoffeeScript. There are many examples across the app for how to translate various ES2015 `import` and `export` and `class ... extends` statements into CoffeeScript equivalents without backticks.

### Running the app

```bash
npm install
meteor
```

### Where to look

Within the `imports` folder, the original ES2015 version of each file (as of commit [db48dfd](https://github.com/meteor/todos/commit/db48dfdaed427d78ccf7843f57649cbec62fec4e)) is alongside its CoffeeScript port. Since `imports` is a special folder in Meteor, these `.js` files are never used, since no code ever imports them. (The former `client/main.js` and `server/main.js` are one-liners that are included as comments in `client/main.coffee` and `server/main.coffee`.) Tests aren’t run as part of the core app and haven’t been ported.

For a single file that showcases how to accomplish writing most of the new ES2015 features in CoffeeScript, compare the original [`todos.js`](https://github.com/meteor/todos/blob/coffeescript/imports/api/todos/todos.js) with the new [`todos.coffee`](https://github.com/meteor/todos/blob/coffeescript/imports/api/todos/todos.coffee).
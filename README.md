[![Circle CI](https://circleci.com/gh/meteor/todos.svg?style=svg)](https://circleci.com/gh/meteor/todos)

### Tests

To run the tests:

```bash
meteor test-packages --driver-package practicalmeteor:mocha
```

### Scripts

To check package dependency versions:

```bash
# In the root of the project
npm install -g packagecheck
packagecheck
```

To lint:

```bash
npm install -g eslint babel-eslint
eslint .
```

Pass the `--quiet` flag to ignore warnings.

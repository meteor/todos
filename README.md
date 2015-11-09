### Tests

To run the tests:

```bash
meteor test-packages --driver-package=practicalmeteor:mocha lists-show
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
npm install -g eslint
eslint .
```

Pass the `--quiet` flag to ignore warnings.

// E2E tests for creating, editing and removing lists

const countLists = () => {
  browser.waitForExist('.list-todo');
  var elements = browser.elements('.list-todo');
  return elements.value.length;
}

describe('list ui', () => {
  beforeEach(() => {
    browser.url('http://localhost:3000');
  });

  it('can create a list @watch', () => {
    var initialCount = countLists();
    browser.click('.js-new-list');

    assert.equal(countLists(), initialCount + 1);
  });
});

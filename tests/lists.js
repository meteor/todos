// E2E tests for creating, editing and removing lists

function countLists() {
  browser.waitForExist('.list-todo');
  var elements = browser.elements('.list-todo');
  return elements.value.length;
}

describe('list ui', function () {
  beforeEach(function() {
    browser.url('http://localhost:3000');
  });

  it('can create a list @watch', function() {
    var initialCount = countLists();
    browser.click('.js-new-list');

    assert.equal(countLists(), initialCount + 1);
  });
});

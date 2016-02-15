// E2E tests for creating, editing and removing lists

function countLists() {
  browser.waitForExist('.list-todo');
  var elements = browser.elements("selector");
  return elements.value.length;
}

describe('list ui', function () {
  it('can create a list @watch', function() {
    // XXX: why is this line needed?
    browser.url('http://localhost:3000');

    var initialCount = countLists();
    browser.click('.js-new-list');
    setTimeout(function() {
      assert.equal(countLists(), initialCount + 1);
    }, 100);
  });
});

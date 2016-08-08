/* eslint-env mocha */
// These are Chimp globals */
/* globals browser assert */

const countLists = () => {
  browser.waitForVisible('.list-todo', 5000);
  const elements = browser.elements('.list-todo');
  return elements.value.length;
};

describe('list ui', () => {
  beforeEach(() => {
    browser.url('http://localhost:3100');
  });

  it('can create a list', () => {
    const initialCount = countLists();

    browser.click('.js-new-list');

    assert.equal(countLists(), initialCount + 1);
  });
});

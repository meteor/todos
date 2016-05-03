/* eslint-env mocha */
// These are Chimp globals */
/* globals browser assert */

const countLists = () => {
  browser.waitForExist('.list-todo');
  const elements = browser.elements('.list-todo');
  return elements.value.length;
};

describe('list ui', () => {
  beforeEach(() => {
    browser.url('http://localhost:3000');
  });

  it('can create a list @watch', () => {
    const initialCount = countLists();

    browser.click('.link-list-new');

    assert.equal(countLists(), initialCount + 1);
  });
});

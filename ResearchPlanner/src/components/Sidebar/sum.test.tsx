const { sum } = require('./sum'); // Change to require() syntax

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 3)).toBe(4);
});
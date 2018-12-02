const hello = require('../src/api/hello.js');

test('hello', () => {
    expect(hello.contrl({})).toEqual({
        body:'hello'
    });
  });
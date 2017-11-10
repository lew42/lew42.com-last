// https://www.npmjs.com/package/thenable

/*
The purpose of this library evaded me, but I think it's so that you can return a thenable from a promise callback, and avoid it being wired into the mix.
*/

promise
  .then(function () {
    return thenable.wrap(A); // return { wrapped: A }
  })
  .then(function (a) {
    assert(thenable.unwrap(a) === A); // a.wrapped === A
    assert(a.unwrap() === A);
    return 'foo';
  })
  .then(function (foo) {
    assert(thenable.unwrap(foo) === 'foo');
  });

// maybe he wanted to always unwrap...
// but the necessity to thenable.wrap() in the first place is a little awkward (but potentially necessary)
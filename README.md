# Simple Fixture

The `<simple-fixture>` element can simplify the exercise of consistently
reseting a test suite's DOM. To use it, wrap the test suite's DOM as a template:

```html
<simple-fixture id="SomeElementFixture">
  <template>
    <some-element id="SomeElementForTesting"></some-element>
  </template>
</simple-fixture>
```

Now, the `<simple-fixture>` element can be used to generate a copy if its
template:

```html
<script>
describe('<some-element>', function () {
  var someElement;

  beforeEach(function () {
    document.getElementById('SomeElementFixture').create();
    someElement = document.getElementById('SomeElementForTesting');
  });
});
</script>
```

Fixtured elements can be cleaned up by calling `restore` on the `<simple-fixture>`:

```javascript
  afterEach(function () {
    document.getElementById('SomeElementFixture').restore();
    // <some-element id='SomeElementForTesting'> has been removed
  });
```

`<simple-fixture>` will create fixtures from all of its immediate `<template>`
children. The DOM structure of fixture templates can be as simple or as complex
as the situation calls for.

## Even simpler usage in Mocha

In Mocha, usage can be simplified even further. Include `simple-fixture-mocha.js`
after Mocha in the `<head>` of your document and then fixture elements like so:

```html
<script>
describe('<some-element>', function () {
  var someElement;

  beforeEach(function () {
    someElement = fixture('SomeElementFixture');
  });
});
</script>
```

Fixtured elements will be automatically restored in the `afterEach` phase of the
current Mocha `Suite`.

## The problem being addressed

Consider the following `web-component-tester` test suite:

```html
<!doctype html>
<html>
<head>
  <title>some-element test suite</title>
  <!-- ... -->
  <link rel="import" href="../some-element.html">
</head>
<body>
  <some-element id="SomeElementForTesting"></some-element>
  <script>
describe('<some-element>', function () {
  var someElement;

  beforeEach(function () {
    someElement = document.getElementById('SomeElementForTesting');
  });

  it('can receive property `foo`', function () {
    someElement.foo = 'bar';
    expect(someElement.foo).to.be.equal('bar');
  });

  it('has a default `foo` value of `undefined`', function () {
    expect(someElement.foo).to.be.equal(undefined);
  });
});
  </script>
</body>
</html>
```

In this contrived example, the suite will pass or fail depending on which order
the tests are run in. It is non-deterministic because `someElement` has
internal state that is not properly reset at the end of each test.

It would be trivial in the above example to simple reset `someElement.foo` to
the expected default value of `undefined` in an `afterEach` hook. However, for
non-contrived test suites that target complex elements, this can result in a
large quantity of ever-growing set-up and tear-down boilerplate.



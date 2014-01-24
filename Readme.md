
# dom-iterator

  Iterate over DOM nodes. A better [NodeIterator](https://developer.mozilla.org/en-US/docs/Web/API/NodeIterator). Travels in both directions.

## Installation

  Install with [component(1)](http://component.io):

    $ component install matthewmueller/dom-iterator

## Example

```js
var it = iterator(node).filter(Node.TEXT_NODE);
var next;

while (next = it.next()) {
  console.log(next.nodeValue) // next textnodes after node
}
```

## API

### `iterator(node)`

Initialize an iterator starting on the `node`.

### `iterator.filter(type)`

Only select nodes of `type`. Pass additional arguments for each type.

```js
// using numbers
it.filter(1, 2)

// using enums
it.filter(Node.COMMENT_NODE, Node.TEXT_NODE)
```

### `iterator#next()`

Gets the next DOM `node`. If no `node` exists, return `null`.

```js
var node = it.next()
var next = it.next()
```

### `iterator#prev()`, `iterator#previous()`

Gets the previous DOM `node`. If no `node` exists, return `null`.

```js
var node = it.prev()
var prev = it.prev()
```

### `iterator.peak([n])`

Sometimes you want to peak on the following or previous node without actually visiting it. With `peak` you can peak forward or backwards `n` steps. If no `n` is given, peak forward 1 step. Peaking chains until you run `it.next()` or `it.prev()`.

Peaking forward:

```js
it.peak(); // peak forward 1
it.peak(3); // peak forward 3 steps
```

Peaking backwards:

```js
it.peak(-3) // peak backwards 3 steps
```

Chaining:

```js
var node;
while (node = it.peak()) {
  // ...
}
```

### `iterator.reset([newNode])`

Reset the iterator to the original `node`. Optionally pass a `newNode` to start at.

```js
it.reset();
```

## Run Tests

```js
npm install component-test
make test
```

## License

  MIT

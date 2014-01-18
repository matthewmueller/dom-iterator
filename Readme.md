
# dom-iterator

  iterate through DOM nodes

## Installation

  Install with [component(1)](http://component.io):

    $ component install matthewmueller/dom-iterator

## Example

```js
var it = iterator(node).filter(Node.TEXT_COMMENT);
var next;

while (next = it.next()) {
  console.log(next.nodeValue) // next textnodes after node
}
```

## API

### `iterator(node, [root])`

Initialize an iterator starting on the `node`. Optionally pass `root` to for the traversal to stay within the subtree. `root` defaults to `document.body`.

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

### `iterator.reset()`

Reset the iterator to the original `node`

```js
it.reset();
```

## License

  MIT

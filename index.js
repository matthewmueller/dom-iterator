/**
 * Module Dependencies
 */

var xor = require('xor');
var slice = Array.prototype.slice;

/**
 * Export `iterator`
 */

module.exports = iterator;

/**
 * Initialize `iterator`
 *
 * @param {Node} node
 * @param {Node} root
 * @return {iterator} self
 * @api public
 */

function iterator(node, root) {
  if (!(this instanceof iterator)) return new iterator(node, root);
  this.node = this.start = this.peaked = node;
  this.root = root;
  this.types = false;
  this.closingTag = false;
  this._revisit = true;

  if (this.higher(node)) {
    throw new Error('root must be a parent or ancestor to node');
  }
}

/**
 * Filter on the type
 *
 * @param {Number, ...} filters
 * @return {iterator} self
 * @api public
 */

iterator.prototype.filter = function() {
  var args = slice.call(arguments);
  var types = this.types = this.types || {};

  for (var i = 0, len = args.length; i < len; i++) {
    types[args[i]] = true;
  }

  return this;
};

/**
 * Reset the iterator
 *
 * @param {Node} node (optional)
 * @return {iterator} self
 * @api public
 */

iterator.prototype.reset = function(node) {
  this.node = node || this.start;
  return this;
};

/**
 * Revisit element nodes. Defaults to `true`
 */

iterator.prototype.revisit = function(revisit) {
  this._revisit = undefined == revisit ? true : revisit;
  return this;
}

/**
 * Jump to the opening tag
 */

iterator.prototype.opening = function() {
  if (1 == this.node.nodeType) this.closingTag = false;
  return this;
};

/**
 * Jump to the closing tag
 */

iterator.prototype.atOpening = function() {
  return !this.closingTag;
};


/**
 * Jump to the closing tag
 */

iterator.prototype.closing = function() {
  if (1 == this.node.nodeType) this.closingTag = true;
  return this;
};

/**
 * Jump to the closing tag
 */

iterator.prototype.atClosing = function() {
  return this.closingTag;
};

/**
 * Next node
 *
 * @param {Number} type
 * @return {Node|null}
 * @api public
 */

iterator.prototype.next = traverse('nextSibling', 'firstChild');

/**
 * Previous node
 *
 * @param {Number} type
 * @return {Node|null}
 * @api public
 */

iterator.prototype.previous =
iterator.prototype.prev = traverse('previousSibling', 'lastChild');

/**
 * Make traverse function
 *
 * @param {String} dir
 * @param {String} child
 * @return {Function}
 * @api private
 */

function traverse(dir, child) {
  var next = dir == 'nextSibling';
  return function walk(i, peak) {
    var node = (peak) ? this.peaked : this.peaked = this.node;
    var types = this.types;
    var closing = this.closingTag;
    var revisit = this._revisit;

    while (node) {
      if (xor(next, closing) && node[child]) {
        // element with children: <em>...</em>
        node = node[child];
        closing = !next;
        if (!revisit) continue;
      } else if (1 == node.nodeType && !node[child] && xor(next, closing)) {
        // empty element tag: <em></em>
        closing = next;
      } else if (node[dir]) {
        // element has a neighbor: ...<em></em>...
        node = node[dir];
        closing = !next;
      } else {
        // done with current layer, move up.
        node = node.parentNode;
        closing = next;
        if (!revisit) continue;
      }

      if (!node || this.higher(node, this.root)) break;

      if (!types || types[node.nodeType]) {
        if (peak) this.peaked = node;
        else this.node = node;
        this.closingTag = closing;
        return node;
      }
    }

    return null;
  };
};

/**
 * Check if node is higher
 * than root.
 *
 * @param {Node} node
 * @param {Node} root
 * @return {Boolean}
 * @api private
 */

iterator.prototype.higher = function(node) {
  var root = this.root;
  if (!root) return false;
  var node = node.parentNode;
  while (node && node != root) node = node.parentNode;
  return node != root;
}

/**
 * Peak in either direction
 * `n` nodes. Peak backwards
 * using negative numbers.
 *
 * @param {Number} n (optional)
 * @return {Node|null}
 * @api public
 */

iterator.prototype.peak = function(n) {
  n = undefined == n ? 1 : n;
  var node;

  if (!n) return this.node;
  else if (n > 0) while(n--) node = this.next(0, true);
  else while(n++) node = this.prev(0, true);

  this.peaked = node;
  return node;
}

/**
 * Add a plugin
 *
 * @param {Function} fn
 * @return {iterator}
 * @api public
 */

iterator.prototype.use = function(fn) {
  fn(this);
  return this;
}

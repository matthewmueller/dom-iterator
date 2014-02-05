/**
 * Module Dependencies
 */

var slice = Array.prototype.slice;

/**
 * Export `iterator`
 */

module.exports = iterator;

/**
 * Initialize `iterator`
 *
 * @param {Node} node
 * @return {iterator} self
 * @api public
 */

function iterator(node) {
  if (!(this instanceof iterator)) return new iterator(node);
  this.node = this.start = this.peaked = node;
  this.types = false;
  this.visitClosing = false;
  this.climbing = false;
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
  this.climbing = false;
  return this;
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
 * Visit closing tags
 */

iterator.prototype.closing = function(close) {
  this.visitClosing = close;
  return this;
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

/**
 * Make traverse function
 *
 * @param {String} dir
 * @param {String} child
 * @return {Function}
 * @api private
 */

function traverse(dir, child) {
  return function walk(i, peak) {
    var node = (peak) ? this.peaked : this.peaked = this.node;
    var closing = this.visitClosing;
    var start = this.start;
    var types = this.types;
    var climbing = (closing) ? this.climbing : false;

    while (node) {
      if (!climbing && node[child]) {
        node = node[child];
      } else if (node[dir]) {
        node = node[dir];
        climbing = false;
      } else {
        node = node.parentNode;
        climbing = true;
        if (!closing) continue;
      }

      if (!node) break;

      this.climbing = climbing;

      if (!types || types[node.nodeType]) {
        if (peak) this.peaked = node;
        else this.node = node;
        return node;
      }
    }

    this.climbing = false;
    return null;
  };
}

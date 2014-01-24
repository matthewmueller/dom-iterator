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
 */

function iterator(node) {
  if (!(this instanceof iterator)) return new iterator(node);
  this.node = this.start = this.peaked = node;
  this.types = false;
}

/**
 * Filter on the type
 *
 * @param {Number, ...} filters
 * @return {iterator}
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
 * @return {iterator}
 * @api public
 */

iterator.prototype.reset = function(node) {
  this.node = node || this.start;
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
    var start = this.start;
    var types = this.types;
    var climbing = false;

    while (node) {
      if (!climbing && node[child]) {
        node = node[child];
      } else if (node[dir]) {
        node = node[dir];
        climbing = false;
      } else {
        node = node.parentNode;
        climbing = true;
        continue;
      }

      if (!types || types[node.nodeType]) {
        if (!peak) this.node = node;
        else this.peaked = node;
        return node;
      }
    }

    return null;
  };
}

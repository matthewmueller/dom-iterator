/**
 * Module Dependencies
 */

var props = require('props');
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
  this.exprs = [];
  this.types = false;
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
 * Watch for a specific expression
 *
 * @param {String|Function} expr
 * @param {Function} fn
 * @return {iterator} self
 * @api public
 */

iterator.prototype.watch = function(expr, fn) {
  fn = fn || function() {};

  if ('string' == typeof expr) {
    // compile expression
    expr = new Function('node', 'return ' + props(expr, 'node.'));
  }

  this.exprs.push([expr, fn]);
  return this;
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
    var exprs = this.exprs;
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
        if (peak) this.peaked = node;
        else this.node = node;

        // go through the expressions
        for (var i = 0, len = exprs.length; i < len; i++) {
          if (exprs[i][0](node)) exprs[i][1](node);
        }

        return node;
      }
    }

    return null;
  };
}

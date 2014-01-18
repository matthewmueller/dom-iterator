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
 * @param {Node} parent (optional)
 */

function iterator(node, parent) {
  if (!(this instanceof iterator)) return new iterator(node, parent);
  this.node = this.start = node;
  this.types = {};
  this.parent = parent || document.body;
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
  var types = this.types;

  for (var i = 0, len = args.length; i < len; i++) {
    types[args[i]] = true;
  }

  return this;
};

/**
 * Reset the iterator
 *
 * @return {iterator}
 * @api public
 */

iterator.prototype.reset = function() {
  this.node = this.start;
  return this;
};

/**
 * Next node
 *
 * @param {Number} type
 * @return {Element|null}
 * @api public
 */

iterator.prototype.next = traverse('nextSibling', 'firstChild');

/**
 * Previous node
 *
 * @param {Number} type
 * @return {Element|null}
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
  return function() {
    var node = this.node;
    var types = this.types;
    var parent = this.parent;
    var type;

    while (node && node != parent) {
      while (node[dir]) {
        node = node[dir];
        type = node.nodeType;

        if (1 == type) {
          node = node[child];
          type = node.nodeType;
        }

        if (types[type]) {
          this.node = node;
          return node;
        }
      }

      node = node.parentNode;
    }

    return null;
  };
}

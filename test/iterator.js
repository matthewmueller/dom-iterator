/**
 * Module Dependencies
 */

var iterator = require('dom-iterator');
var domify = require('domify');
var assert = require('assert');

/**
 * Tests
 */

describe('iterator', function() {
  var dom, i;

  beforeEach(function() {
    dom = domify('<body>hi<article><em>whatever</em>omg<strong></strong></article>bye</body>');
  });

  describe('elements', function() {

    it('should iterate from the top', function() {
      i = iterator(dom).filter(Node.ELEMENT_NODE);
      verify(i, 'next', ['ARTICLE', 'EM', 'STRONG', null])
      i.reset()
      verify(i, 'prev', ['ARTICLE', 'STRONG', 'EM', null])
    })

    it('should iterate from the middle', function() {
      i = iterator(dom.querySelector('article')).filter(Node.ELEMENT_NODE);
      verify(i, 'next', ['EM', 'STRONG', null])
      i.reset()
      verify(i, 'prev', ['STRONG', 'EM', null])
    })

    it('should iterate from the bottom', function() {
      i = iterator(dom.querySelector('em').firstChild).filter(Node.ELEMENT_NODE);
      verify(i, 'next', ['STRONG', null])
      i.reset()
      verify(i, 'prev', [null])
    })
  });

  describe('text nodes', function() {
    it('should iterate from the top', function() {
      i = iterator(dom).filter(Node.TEXT_NODE);
      verify(i, 'next', ['hi', 'whatever', 'omg', 'bye', null])
      i.reset()
      verify(i, 'prev', ['bye', 'omg', 'whatever', 'hi', null])
    })

    it('should iterate from the middle', function() {
      i = iterator(dom.querySelector('article')).filter(Node.TEXT_NODE);
      verify(i, 'next', ['whatever', 'omg', 'bye', null])
      i.reset()
      verify(i, 'prev', ['omg', 'whatever', 'hi', null])
    })

    it('should iterate from the bottom', function() {
      i = iterator(dom.querySelector('em').firstChild).filter(Node.TEXT_NODE);
      verify(i, 'next', ['omg', 'bye', null])
      i.reset()
      verify(i, 'prev', ['hi', null])
    })

    it('should work in both directions', function() {
      dom = domify('hi <strong>jimbo</strong>')
      i = iterator(dom).filter(Node.TEXT_NODE);
      assert('hi ' == i.next().nodeValue);
      assert('jimbo' == i.next().nodeValue);
      assert(null == i.next());
      assert('hi ' == i.prev().nodeValue);
      assert(null == i.prev());
    })
  })

  describe('all nodes', function() {

    it('should iterate from the top', function() {
      i = iterator(dom);
      verify(i, 'next', ['hi', 'ARTICLE', 'EM', 'whatever', 'omg', 'STRONG', 'bye', null]);
      i.reset();
      verify(i, 'prev', ['bye', 'ARTICLE', 'STRONG', 'omg', 'EM', 'whatever', 'hi', null]);
    });

    it('should iterate from middle', function() {
      i = iterator(dom.querySelector('article'));
      verify(i, 'next', ['EM', 'whatever', 'omg', 'STRONG', 'bye', null]);
      i.reset();
      verify(i, 'prev', ['STRONG', 'omg', 'EM', 'whatever', 'hi', null]);
    });

    it('should iterate from bottom', function() {
      i = iterator(dom.querySelector('em').firstChild);
      verify(i, 'next', ['omg', 'STRONG', 'bye', null])
      i.reset();
      verify(i, 'prev', ['hi', null]);
    })
  })

  describe('reset', function() {
    it('should allow you to pass a new node', function() {
      i = iterator(dom.querySelector('em').firstChild);
      verify(i, 'next', ['omg', 'STRONG', 'bye', null])
      i.reset(dom);
      verify(i, 'next', ['hi', 'ARTICLE', 'EM', 'whatever', 'omg', 'STRONG', 'bye', null]);
    })
  })

  describe('peak', function() {

    it('should allow you to peak in front', function() {
      i = iterator(dom);
      assert('hi' == i.peak().nodeValue);
      assert('BODY' == i.node.tagName);
      assert('hi' == i.next().nodeValue)
    })

    it('should allow you to peak behind', function() {
      i = iterator(dom.querySelector('article'));
      assert('STRONG' == i.peak(-1).tagName);
      assert('ARTICLE' == i.node.tagName);
      assert('STRONG' == i.prev().tagName)
    })

    it('should allow you to peak forward multiple nodes', function() {
      i = iterator(dom);
      assert('EM' == i.peak(3).tagName);
      assert('BODY' == i.node.tagName);
      assert('hi' == i.next().nodeValue)
    })

    it('should allow you to peak behind multiple nodes', function() {
      i = iterator(dom.querySelector('article'));
      assert('EM' == i.peak(-3).tagName);
      assert('ARTICLE' == i.node.tagName);
      assert('STRONG' == i.prev().tagName)
    })

    it('should support chaining, saving the peak offset', function() {
      i = iterator(dom);
      assert('hi' == i.peak().nodeValue)
      assert('ARTICLE' == i.peak().tagName)
      assert('BODY' == i.node.tagName);
      assert('hi' == i.next().nodeValue)
      assert('hi' == i.peak().nodeValue)
    })
  })

  describe('closing(true)', function() {
    it('should visit closing', function() {
      i = iterator(dom).closing(true);
      verify(i, 'next', ['hi', 'ARTICLE', 'EM', 'whatever', 'EM', 'omg', 'STRONG', 'ARTICLE', 'bye', 'BODY', null])
      verify(i, 'prev', ['bye', 'ARTICLE', 'STRONG', 'omg', 'EM', 'whatever', 'EM', 'ARTICLE', 'hi', 'BODY', null]);
      i.reset();

      assert('hi' == i.next().nodeValue)
      assert('ARTICLE' == i.next().nodeName)
      assert('EM' == i.next().nodeName)
      assert('whatever' == i.next().nodeValue)
      assert('EM' == i.prev().nodeName)
      assert('ARTICLE' == i.prev().nodeName)
      assert('hi' == i.prev().nodeValue)
      assert('BODY' == i.prev().nodeName)
      assert(null == i.prev())
    });
  })

  function verify(it, dir, expected) {
    expected.forEach(function(expect) {
      var n = it[dir]();
      if (null == expect) return assert(null == n, 'it.' + dir + '() should be null');
      assert(n, 'it.' + dir + '() should not be null. Expected: ' + expect)
      var prop = n.nodeType == 1 ? 'nodeName' : 'nodeValue';
      assert(expect == n[prop], 'expected ' + expect + ' got ' + n[prop]);
    });
  }

})

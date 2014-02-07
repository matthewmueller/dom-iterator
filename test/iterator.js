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
  var dom, i, article;

  beforeEach(function() {
    dom = domify('<body>hi<article><em>whatever</em>omg<strong></strong></article>bye</body>');
    article = dom.childNodes[1];
  });

  describe('(dom)', function() {

    it('should iterate from the top', function() {
      i = iterator(dom);
      assert('<body>' == format(i));
      assert('hi' == format(i.next(), i));
      assert('<article>' == format(i.next(), i));
      assert('<em>' == format(i.next(), i));
      assert('whatever' == format(i.next(), i));
      assert('</em>' == format(i.next(), i));
      assert('omg' == format(i.next(), i));
      assert('<strong>' == format(i.next(), i));
      assert('</strong>' == format(i.next(), i));
      assert('</article>' == format(i.next(), i));
      assert('bye' == format(i.next(), i));
      assert('</body>' == format(i.next(), i));
      assert(null == i.next());
      assert(null == i.next());
      assert(null == i.next());
      assert('</body>' == format(i))
      assert('bye' == format(i.prev(), i))
      assert('</article>' == format(i.prev(), i))
    })

    it('should iterate from the middle (opening)', function() {
      i = iterator(article)

      assert('<article>' == format(i))
      assert('hi' == format(i.prev(), i))
      assert('<body>' == format(i.prev(), i))
      assert(null == i.prev());

      i.reset();

      assert('<article>' == format(i))
      assert('<em>' == format(i.next(), i));
      assert('whatever' == format(i.next(), i));
      assert('</em>' == format(i.next(), i));
      assert('omg' == format(i.next(), i));
      assert('<strong>' == format(i.next(), i));
      assert('</strong>' == format(i.next(), i));
      assert('</article>' == format(i.next(), i));
      assert('bye' == format(i.next(), i));
      assert('</body>' == format(i.next(), i));
      assert(null == i.next());
    })


    it('should iterate from the middle (closing)', function() {
      i = iterator(article).closing();

      assert('</article>' == format(i));
      assert('bye' == format(i.next(), i));
      assert('</body>' == format(i.next(), i));
      assert(null == i.next());

      i.reset();

      assert('</article>' == format(i))
      assert('</strong>' == format(i.prev(), i))
      assert('<strong>' == format(i.prev(), i))
      assert('omg' == format(i.prev(), i))
      assert('</em>' == format(i.prev(), i))
      assert('whatever' == format(i.prev(), i))
      assert('<em>' == format(i.prev(), i))
      assert('<article>' == format(i.prev(), i))
      assert('hi' == format(i.prev(), i))
      assert('<body>' == format(i.prev(), i))
      assert(null == i.prev());
    })

    it('should iterate from the bottom', function() {
      i = iterator(dom).closing();
      assert('</body>' == format(i));
      assert('bye' == format(i.prev(), i))
      assert('</article>' == format(i.prev(), i))
      assert('</strong>' == format(i.prev(), i))
      assert('<strong>' == format(i.prev(), i))
      assert('omg' == format(i.prev(), i))
      assert('</em>' == format(i.prev(), i))
      assert('whatever' == format(i.prev(), i))
      assert('<em>' == format(i.prev(), i))
      assert('<article>' == format(i.prev(), i))
      assert('hi' == format(i.prev(), i))
      assert('<body>' == format(i.prev(), i))
      assert(null == i.prev());
      assert(null == i.prev());
      assert(null == i.prev());
      assert('<body>' == format(i))
      assert('hi' == format(i.next(), i))
      assert('<article>' == format(i.next(), i))
    })
  });

  describe('(dom, root)', function() {
    it('should support roots to limit iterator (opening)', function() {
      i = iterator(article.firstChild, article)
      assert('<em>' == format(i))
      assert(null == i.prev());
      assert(null == i.prev());
      assert('<em>' == format(i))
      assert('whatever' == format(i.next(), i));
      assert('</em>' == format(i.next(), i));
      assert('omg' == format(i.next(), i));
      assert('<strong>' == format(i.next(), i));
      assert('</strong>' == format(i.next(), i));
      assert(null == i.next());
      assert(null == i.next());
      assert('</strong>' == format(i));
    })

    it('should support roots to limit iterator (closing)', function() {
      i = iterator(article.lastChild, article).closing();
      assert('</strong>' == format(i))
      assert(null == i.next());
      assert(null == i.next());
      assert('<strong>' == format(i.prev(), i))
      assert('omg' == format(i.prev(), i))
      assert('</em>' == format(i.prev(), i))
      assert('whatever' == format(i.prev(), i))
      assert('<em>' == format(i.prev(), i))
      assert(null == i.prev());
      assert(null == i.prev());
      assert('<em>' == format(i))
    })
  });

  describe('atOpening() & atClosing()', function() {
    it('should accurately return atOpening() or atClosing()', function() {
      i = iterator(dom);
      assert(i.atOpening());
      i.next() // hi
      assert(i.atOpening());
      i.next() // article
      assert(i.atOpening());
      i.next() // em
      assert(i.atOpening());
      i.next() // whatever
      assert(i.atOpening());
      i.next() // /em
      assert(i.atClosing());
      i.next() // omg
      assert(i.atOpening());
      i.next() // strong
      assert(i.atOpening());
      i.next() // /strong
      assert(i.atClosing());
      i.next() // /article
      assert(i.atClosing());
      i.next() // bye
      assert(i.atOpening());
      i.next() // /body
      assert(i.atClosing());
      i.next() // /body
      assert(i.atClosing());
      i.next() // /body
      assert(i.atClosing());
    })
  })

  describe('revisit(false)', function() {
    it('from top: should ignore the element if you pass it again', function() {
      i = iterator(dom).revisit(false);
      assert('<body>' == format(i));
      assert('hi' == format(i.next(), i));
      assert('<article>' == format(i.next(), i));
      assert('<em>' == format(i.next(), i));
      assert('whatever' == format(i.next(), i));
      assert('omg' == format(i.next(), i));
      assert('<strong>' == format(i.next(), i));
      assert('bye' == format(i.next(), i));
      assert(null == i.next());
      assert(null == i.next());
      assert(null == i.next());
      assert('bye' == format(i));
      assert('</article>' == format(i.prev(), i));
      assert('</strong>' == format(i.prev(), i));
      assert('omg' == format(i.prev(), i));
    });

    it('from bottom: should ignore the element if you pass it again', function() {
      i = iterator(dom).revisit(false).closing();
      assert('</body>' == format(i));
      assert('bye' == format(i.prev(), i))
      assert('</article>' == format(i.prev(), i))
      assert('</strong>' == format(i.prev(), i))
      assert('omg' == format(i.prev(), i))
      assert('</em>' == format(i.prev(), i))
      assert('whatever' == format(i.prev(), i))
      assert('hi' == format(i.prev(), i))
      assert(null == i.prev());
      assert(null == i.prev());
      assert(null == i.prev());
      assert('hi' == format(i));
      assert('<article>' == format(i.next(), i));
      assert('<em>' == format(i.next(), i));
      assert('whatever' == format(i.next(), i));
    });
  });

  describe('peak', function() {

    it('should allow you to peak in front', function() {
      i = iterator(dom);
      assert('hi' == i.peak().nodeValue);
      assert('BODY' == i.node.tagName);
      assert('hi' == i.next().nodeValue)
    })

    it('should allow you to peak behind', function() {
      i = iterator(article).closing();
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
      i = iterator(article).closing();
      assert('omg' == i.peak(-3).nodeValue);
      assert('ARTICLE' == i.node.tagName);
      assert('STRONG' == i.prev().tagName)
    })
  })


  function format(node, it) {
    if (arguments.length == 1) it = node, node = it.node;
    var name = node.nodeName.toLowerCase();
    var type = node.nodeType;
    var closing = it.atClosing();
    var out = null;

    if (3 == type) {
      out = node.nodeValue;
    } else if (1 == type) {
      out = it.atClosing() ? '</' + name + '>' : '<' + name + '>';
    }

    return out;
  }

})

// ATTRIBUTION: fusionchess
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function$revision/1376

// TODO: modularize (mostly using it for arraize nodelists and htmlcollections)
// - parseArgs iteration in one mod

// TODO: select html elements by css property
// http://stackoverflow.com/questions/6338217/get-a-css-value-with-javascript
var s = (function() {

  function cherry(reserve){/*USE_007*/
    var callerArgs = cherry.caller.arguments,
        cherryArgs = [].slice.call(callerArgs, reserve),
        f = cherryArgs[0],
        c = this,
        n = c.nodes;

    if (f === undefined){
      var e = c.context.elem;
      return [ (e) ? e : c.last() ];
    }

    if (cherryArgs.length === 1){
      switch (typeof f){
        case 'function':
          return n.filter(f);
          break;
        case 'number':
          return n[f];
          break;
        case 'string':
          return n;
          break;
      }
    }

    var r = [];
      do {
        var pos = cherryArgs.pop();
        if (pos < n.length){
          r.push(n[pos])
        }
      } while (cherryArgs.length);
    return r;
  }

  function last() { return this.nodes[this.nodes.length-1]}

  // === wrapper inside operations ===
  function spawn(tag) {
    var c = this;
    c.nodes.push(document.createElement(tag));
    return c;
  }

  function proliferate(){//* as a supercharged +
  //*3p
  }
  // ======================================================================
  function lace() {
    var a = [].slice.call(arguments),
        c = this,
        pick = a[a.length-1],
        numPick = (typeof pick === 'number') ? true : false;

    if (a[0] instanceof Array){
      if (numPick)
        a[0] = a[0].concat([pick]); // push modifies in place
      return c.lace.apply(c, a[0]);
    }/*TEST_001*/

    var node = (numPick) ? cherry.call(this, a.length-1) : c.last();

    a.forEach(function(child){
      if (child.ELEMENT_NODE)
        Node.prototype.appendChild.call(node, child);
    });
    return c;
  }

  // TODO:
  // (1) insertAdjacent{HTML,Text,Element}
  function puff(str) { /*USE_006*/
    var c = this,
        n = cherry.call(c, 1);

    n.forEach(function(elem){
      elem.innerHTML = str;
    })
    return c;
  }

  // TODO: function to remove attribute (recursive?) proposed name: krab
  function bark(attribute, value) {
    var c = this,
        n = cherry.call(c,2),
        bArgs = arguments;

    if (bArgs.length < 2)
      return c.follow = parseArgs.apply(c,bArgs); /*USE_007*/

    n.forEach(function(elem){
      Element.prototype.setAttribute.apply(elem, bArgs);
    })

    c.follow = bark;
    return c;
  }
  // '+div!div-div-div!p-p;div-form'.match(/(\+|;|!|-)\w+/g)
  //> ["+div", "!div", "-div", "-div", "!p", "-p", ";div", "-form"]
  // '+div'.match(/(\+|;|!|-)\w+/g)
  //> ["+div"]
  function parseArgs(arg) {
    var c = this,
        x = c.context;

    if (arg instanceof Node) {
      x.elem = arg;
      c.nodes.push(arg);
    }

    if (typeof arg === 'string') {
      try {
        var elem  = (c.boundElem instanceof Window) ? document : c.boundElem,
            nlist = elem.querySelectorAll(arg);
        c.nodes = c.nodes.concat([].slice.call(nlist));
      } catch (e) {
        if (e instanceof DOMException){
          ops.call(c, arg);
        } else {
          throw e;
        }
      }
    }
    return c;
  }

function ops(str){debugger;
  var       c = this,
            x = c.context,
      opParse = str.match(/^(.)(.+)/); /* ["+div", "+", "div"] */

  switch (opParse[1]) {
    case '+':
      x.elem = spawn.call(c, opParse[2]).last();
      break;
    case '~':
      var child = spawn.call(c, opParse[2]).nodes.pop();
      x.elem = x.elem.parentElement.appendChild(child);
      break;
  }
}
/*TEST_002*/

  return function wrapper(arg) {

    function c(){  /*USE_002*/
      return c.follow.apply(c, arguments);
    };

    c.follow    = parseArgs; /*USE_006*/
    c.boundElem = this;      /*USE_001*/
    c.nodes     = [];        /*USE_003*/
    c.context   = {elem:   undefined,
                   prevOp: undefined};
    c.last      = last;
    c.puff      = puff;
    c.lace      = lace;
    c.bark      = bark;      /*USE_004*/
    c.toString  = function() {return 'chainer'};
    parseArgs.call(c, arg);
    return c;
  }
})()

// === most of the examples work on www.google.com
/*USE_001*/
/* div.headingcolor
   div
     div.indiv
     div.indiv6
     div.clear
     (... etc ...)
   div.headingcolor
   div
     div.indiv
     (... etc ...)

s('.headingcolor').nodes.map(function(e) {
  return s.bind(e.nextElementSibling)('[class^="indiv"]').nodes
})
//> [Array[3], Array[1]]
 */

/*USE_002*/
/*var a = s('p'), b = s('div');
  a === b;
  //> false
*/

/*USE_003*/
/* var a = s('p');                        // a.nodes === 1
   [].push.apply(a.nodes, s('div').nodes) // s('div').nodes === 176
   a.nodes
   //> 177
*/

/*USE_004   ids used as classes (calheers) */
/*
  var toSanitize = s();    // b.nodes === []
  toSanitize.nodes.push(node1, node2, etc);
  toSanitize.bark('class', 'id');
*/

/*USE_006*/
/*var b = s('+div')(hplogo)('.mv-tile')('gb_l');
  //  b.nodes.length = 11
  b.puff('lofa', 2,4,6,8,10);
*/

/*USE_007*/
/* s('+p').puff('balabab').bark('id','alcsi')('name','akarmi')
    ('+div').puff('aletta gyonyoru').bark('id','pittyputty').nodes
   //> ["<p id="pittyputty" name="akarmi">aletta gyonyoru</p>",
        "<div id="pittyputty">aletta gyonyoru</div>"]
   because puff() fills up all the elements by default

   s('+p').puff('balabab',0).bark('id','alcsi')('name','akarmi')
    ('+div').puff('aletta gyonyoru',1).bark('id','pittyputty').nodes
   //>["<p id="pittyputty" name="akarmi">balabab</p>",
       "<div id="pittyputty">aletta gyonyoru</div>"]
   the 0 after balabab can be omitted 
   */

// TESTS =============================================================

    /* TEST_001   lace test
    var a = s('+div').lace(s('+p').last());
    var b = s('+div')('+div').lace(s('+p').last());
    var c = s('+div')('+div').lace(s('+p').last(),0);
    var d = s('+div')('+div').lace(c.nodes);
    var e = s('+div')('+div').lace(d.nodes,0);
    [a,b,c,d,e].forEach(function(e) {console.log(e.nodes.map(function(e) {return e.outerHTML}))})
    */

    /* TEST 002   bark, puff tests
    [s('+p').bark('class','lofa').puff('balabab'),
     s('+div')('+p').bark('class','lofa').puff('balabab'),
     s('+div')('+p').bark('class','lofa','all').puff('balabab'),
     s('+div')('+p').bark('class','lofa','all').puff('balabab','all')]
     .map(function(a) {
       return a.nodes.map(function(b){
         return b.outerHTML;
       }).join();
     }).join('\n')
    */

    /*TEST_002   ops()
    s(lga)('~p').puff('lofa')
    */
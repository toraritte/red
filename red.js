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
        n = this.nodes;

    if (f === undefined)
      return n;

    if (cherryArgs.length === 1){
      if (typeof f === 'function'){
        return n.filter(f);
      }
      if (typeof f === 'number'){
        return n[f];
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
  var wrapOps = { "+": spawn,
                  ">": lace };

  // TODO: parse CSS selectors to add HTML structure
  //       (check use cases whether it is needed at all...)

  function spawn(tag) {
    var c = this;
  //TODO
  // (1) hide node calls. Instead of s('+p').node() lets use it s('+p') resolving nodes internally
  //  
  // (2) hierarchical call? s('+div')('+p') => <div><p></p><div> meg hogy van e ertelme...
  //s(lofa)('+p') - letezo elembe tenni egy ujat (vagy lace is eleg?)
    c.nodes.push(document.createElement(tag));
    return c;
  }

  function proliferate(){//# as a supercharged +
  //#3p
  }
  // ======================================================================
  function lace() {// s(lga).lace('+div') vagy inkabb s(lga)('>div').bark(...).puff(..)
    var a = [].slice.call(arguments),
        c = this, // chainer
        pick = a[a.length-1],
        numPick = (typeof pick === 'number') ? true : false;

    if (a[0] instanceof Array){
      if (numPick)
        // bugfix: .push(pick) modifies chainer.nodes in place
        //         nodes will be riddled with random numbers after
        //         multiple calls
        a[0] = a[0].concat([pick]);
      return c.lace.apply(c, a[0]);
    }
    /* lace test
    var a = s('+div').lace(s('+p').last());
    var b = s('+div')('+div').lace(s('+p').last());
    var c = s('+div')('+div').lace(s('+p').last(),0);
    var d = s('+div')('+div').lace(c.nodes);
    var e = s('+div')('+div').lace(d.nodes,0);
    [a,b,c,d,e].forEach(function(e) {console.log(e.nodes.map(function(e) {return e.outerHTML}))})
    */

    var node = (numPick) ? cherry.call(this, a.length-1) : c.last();

    a.forEach(function(child){
      if (child.ELEMENT_NODE)
        Node.prototype.appendChild.call(node, child);
    });
    return c;
  }

  // TODO:
  // (1) insertAdjacent{HTML,Text,Element}
  // (2) * - as in 'explode' with content
  function puff(str) { /*USE_006*/
    var n = cherry.call(this, 1),
        c = this;

    for (var i in n) {
        n[i].innerHTML = str;
    }
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

  function parseArgs(arg) {
    var c = this;

    if (arg instanceof Node) {
      c.nodes.push(arg);
    }

    if ((typeof arg     === 'function') &&
        (arg.toString() === 'chainer')){
      
    }

    if (typeof arg === 'string') {
      var opParse = arg.match(/^(.)(.+)/), /* ["+div", "+", "div"] */
          act     = (opParse) ? wrapOps[opParse[1]] : undefined;

      if (act) {
        return act.call(c,opParse[2]);
      }

      var elem  = (c.boundElem instanceof Window) ? document : c.boundElem,
          nlist = elem.querySelectorAll(arg);
      c.nodes = c.nodes.concat([].slice.call(nlist));
    }
    return c;
  }

  return function wrapper(arg) {

    function chainer(){  /*USE_002*/
      return chainer.follow.apply(chainer, arguments);
    };

    // This closure may be totally useless, although could
    //+ be useful for testing.
    // cherrypick functionality in order to store custom node in it
    function node(elem){ /*USE_005*/
      if (elem)
        chainer.nodes.push(elem);
      chainer.node = function(n) {
        return (n) ? node(n) : elem;
      }
      return chainer;
    }

    chainer.lace      = lace;
    chainer.bark      = bark;      /*USE_004*/
    chainer.follow    = parseArgs; /*USE_006*/
    chainer.boundElem = this;      /*USE_001*/
    chainer.nodes     = [];        /*USE_003*/
    chainer.last      = last;
    chainer.puff      = puff;
    chainer.toString  = function() {return 'chainer'};
    parseArgs.call(chainer, arg);
    return chainer;
  }
})()

/*
(function(){
  function a(){return c};
  function c(){};
  return function b() { return a}
})()()()()*/

/*
function a() {return this};
a();             //> window

function b() {};
a.bind(b)();     //> function b() {}
*/

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

/*USE_005*/
/*var a = s(lga);
  var b = s('+p');
  a.node(b.node()).nodes;
  //> [<div class id="lga">...</div>, <p></p>]
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

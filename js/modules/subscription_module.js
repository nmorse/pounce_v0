(function () {
  'use strict';

  function runSub(event) {
    // console.log(event);
    // console.log(`event: ${event.type} run ${lookup[event.type + event.target.id]}`, event);
    const x = event.offsetX;
    const y = event.offsetY;
    const evt = { x, y };
    //console.log(evt);
    const key = event.type + event.target.id;
    const [_, resultstack] = pounce.run([evt, ...lookup[key][0]], lookup[key][1], lookup[key][2]);
    // console.log(resultstack);
    pounce.resumable.stack = [...pounce.resumable.stack, ...pounce.cloneItem(resultstack)];
  }
  let lookup = {};

  // eventTypes: ['mousemove', 'click', 'mousedown', ...]
  // example: [{event:'mouse click' x:10 y:10 } { w:1 h:5 } merge box] [click] canvas subscribe
  const module_words = {
    'subscribe': {
      expects: [{ desc: 'word to run', ofType: 'list' }, 
      { desc: 'event name', ofType: 'list of one string' },
      { desc: 'id of DOM element', ofType: 'string'}], effects: [-3], tests: [], desc: 'set up a subscription to an event',
      definition: function (s, pl, wordstack) {
        //const [eventType, eventName] = s.pop();
        const eleId = s.pop();
        const [eventType] = s.pop();
        const definition = s.pop();
        lookup[eventType + eleId] = [definition, s, wordstack];
        const domEle = document.querySelector('#' + eleId);
        domEle.addEventListener(eventType, runSub, true);
        return [s];
      }
    },
    'unsubscribe': {
      expects: [{ desc: 'a', ofType: 'list' }, { desc: 'an item', ofType: 'any' }], effects: [-1], tests: [], desc: 'push an item on end of a list',
      definition: function (s) {
        const eleId = s.pop();
        const eventType = s.pop();
        const domEle = document.querySelector('#' + eleId);
        domEle.removeEventListener(eventType, runSub, true);
        return [s];
      }
    }
  };

  var exported = { words: module_words };

  if (typeof require === 'function' && typeof exports === 'object') {
    extend(exports, exported);
  } else {
    var namespace = typeof this !== 'undefined' ? this : window;
    namespace.subscription_module = exported;
  }
})();

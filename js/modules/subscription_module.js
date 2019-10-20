(function () {
  'use strict';

  function runMouse(event) {
    // console.log(event);
    // console.log(`event: ${event.type} run ${lookup[event.type]}`);
    const x = event.offsetX;
    const y = event.offsetY;
    const evt = { x, y };
    //console.log(evt);
    pounce.run([evt, ...lookup[event.type][0]], lookup[event.type][1], lookup[event.type][2]);
  }
  let lookup = {};

  // example: [{event:'mouse click' x:10 y:10 } { w:1 h:5 } merge box] [mouse click] subscribe
  const module_words = {
    'subscribe': {
      expects: [{ desc: 'word to run', ofType: 'list' }, { desc: 'event name', ofType: 'list of one string' }], effects: [-2], tests: [], desc: 'set up a subscription to an event',
      definition: function (s, pl, wordstack) {
        //const [eventType, eventName] = s.pop();
        const [eventName] = s.pop();
        const definition = s.pop();
        lookup[eventName] = [definition, s, wordstack];
        const canvas = document.querySelector('#canvas');
        canvas.removeEventListener('mousemove', runMouse, true);
        canvas.removeEventListener('click', runMouse, true);
        canvas.removeEventListener('mousedown', runMouse, true);
        canvas.addEventListener(eventName, runMouse, true);
        return [s];
      }
    },
    'unsubscribe': {
      expects: [{ desc: 'a', ofType: 'list' }, { desc: 'an item', ofType: 'any' }], effects: [-1], tests: [], desc: 'push an item on end of a list',
      definition: function (s) {
        const eventName = s.pop();
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

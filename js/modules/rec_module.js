
(function () {
  'use strict';

  const module_words = {
    'get': {
      expects: [{ desc: 'a', ofType: 'record' }, { desc: 'key', ofType: 'word' }], effects: [0], tests: [], desc: 'get the value of a property from a record',
      definition: function (s) {
        const key = s.pop();
        const rec = s[s.length - 1];
        if (rec) { s.push(pounce.cloneItem(rec[key])); }
        return [s];
      }
    },
    'set': {
      expects: [{ desc: 'a', ofType: 'record' }, { desc: 'key', ofType: 'word' }, { desc: 'value', ofType: 'any' }], effects: [-2], tests: [], desc: 'set the value of a property in a record',
      definition: function (s) {
        const key = s.pop();
        const value = s.pop();
        let rec = s[s.length - 1];
        if (rec) { rec[key] = pounce.cloneItem(value); }
        return [s];
      }
    },
    'get*': {
      expects: [{ desc: 'a', ofType: 'record' }, { desc: 'key', ofType: 'word' }], effects: [0], tests: [], desc: 'get the value of a property from a record',
      definition: function (s) {
        const key = s.pop();
        let i = s.length - 1;
        while (i >= 0 && !isObject(s[i])) {
          i--;
        }
        if (i >= 0 && isObject(s[i])) {
          const rec = s[i];
          s.push(pounce.cloneItem(rec[key]));
        }
        return [s];
      }
    },
    'set*': {
      expects: [{ desc: 'a', ofType: 'record' }, { desc: 'key', ofType: 'word' }, { desc: 'value', ofType: 'any' }], effects: [-2], tests: [], desc: 'set the value of a property in a record',
      definition: function (s) {
        const key = s.pop();
        const value = s.pop();
        let i = s.length - 1;
        while (i >= 0 && !isObject(s[i])) {
          i--;
        }
        if (i >= 0 && isObject(s[i])) {
          s[i][key] = pounce.cloneItem(value);
        }
        return [s];
      }
    },
    'merge': {
      expects: [{ desc: 'a', ofType: 'record' }, { desc: 'a', ofType: 'record' }], 
      effects: [-1], tests: [], desc: 'merge two records into one',
      definition: function (s) {
        const b = s.pop();
        const a = s.pop();
        const c = {...a, ...b};
        s.push(c);
        return [s];
      }
    }

  };

  var exported = { words: module_words };

  if (typeof require === 'function' && typeof exports === 'object') {
    extend(exports, exported);
  } else {
    var namespace = typeof this !== 'undefined' ? this : window;
    namespace.rec_module = exported;
  }
})();

(function () {
  'use strict';

  const module_words = {
    'push': {
      expects: [{ desc: 'a', ofType: 'list' }, { desc: 'an item', ofType: 'any' }], effects: [-1], tests: [], desc: 'push an item on end of a list',
      definition: function (s) {
        const item = s.pop();
        const top = s.length - 1;
        const list = s[top];
        list.push(item);
        return [s];
      }
    },
    'prepend': {
      expects: [{ desc: 'a', ofType: 'list' }, { desc: 'an item', ofType: 'any' }], effects: [-1], tests: [
        [`[6 7] 5 prepend`, [[5, 6, 7]]]
      ], desc: 'push an item on end of a list',
      definition: function (s) {
        const item = s.pop();
        const top = s.length - 1;
        const list = s[top];
        list.unshift(item);
        return [s];
      }
    },
    'pop': {
      expects: [{ desc: 'a', ofType: 'list' }], effects: [1], tests: [], desc: 'pop the last item off the end of a list',
      definition: function (s) {
        const top = s.length - 1;
        const list = s[top];
        if (Array.isArray(list)) {
          const item = pounce.cloneItem(list.pop());
          s.push(item);
        }
        else {
          console.log({ 'word': 'pop', 'error': "unable to 'pop' from non-Array" });
        }
        return [s];
      }
    },
    'list-length': {
      expects: [{ desc: 'source', ofType: 'list' }], effects: [0], tests: [
        [`[1 2 3] str-length`, [3]]
      ], desc: 'lenth of a list',
      definition: function (s) {
        const list = s.pop();
        if (Array.isArray(list)) { s.push(list.length); }
        return [s];
      }
    },
    'cons': {
      expects: [{ desc: 'an item', ofType: 'any' }, { desc: 'a', ofType: 'list' }], effects: [-1], tests: [], desc: 'add an item at the begining of a list',
      definition: function (s) {
        const list = s.pop();
        const item = s.pop();
        list.unshift(item);
        s.push(list);
        return [s];
      }
    }
  };

  var exported = { words: module_words };

  if (typeof require === 'function' && typeof exports === 'object') {
    extend(exports, exported);
  } else {
    var namespace = typeof this !== 'undefined' ? this : window;
    namespace.list_module = exported;
  }
})();

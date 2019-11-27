(function () {
  'use strict';

  const module_words = {
    'peek': {
      expects: [{ desc: 'a', ofType: 'list' }, { desc: 'an index', ofType: 'integer' }], effects: [0], tests: [], desc: 'peek (read) an item at index',
      definition: function (s) {
        const index = s.pop();
        const top = s.length - 1;
        const list = s[top];
        s.push(list[index]);
        return [s];
      }
    },
    'poke': {
      expects: [{ desc: 'a', ofType: 'list' }, { desc: 'an item', ofType: 'any' }, { desc: 'an index', ofType: 'integer' }], effects: [0], tests: [], desc: 'peek (read) an item at index',
      definition: function (s) {
        const index = s.pop();
        const item = s.pop();
        const top = s.length - 1;
        let list = s[top];
        list[index] = item;
        return [s];
      }
    },
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
    'fan-open': {
      'named-args': ['list'],
     // 'requires': 'list_module',
      'local-words': {
        'len': [],
        'record-len': ['list', 'list-length', [], 'cons', ['len'], 'local-def'],
        'fan-out': ['list', ['uncons'], 'len', 'repeat', 'drop']
      },
      'definition': ['record-len', 'fan-out']
    },

    'uncons': {
      expects: [{ desc: 'a', ofType: 'list' }], effects: [1], tests: [], desc: 'take the first item off the front of a list and leave it under the list',
      definition: function (s) {
        let list = s.pop();

        if (Array.isArray(list)) {
          if (list.length >= 1) {
            const item = pounce.cloneItem(list.splice(0, 1));
            s.push(item[0]);
            s.push(list);
          }
          else {
            console.log({ 'word': 'un-cons', 'error': "unable to 'un-cons' from an empty list" });
          }
        }
        else {
          console.log({ 'word': 'un-cons', 'error': "unable to 'un-cons' from a non-list" });
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
    ,
    'map': {
      expects: [{ desc: 'a', ofType: 'list' }, { desc: 'a', ofType: 'list' }], effects: [-1], tests: [], desc: 'map a function onto a list',
      definition: function (s, pl, wordstack) {
        const wds = s.pop();
        const list = s.pop();
        console.log(list, wds);
        const newlist = list.map((item) => {
          const pl1 = pounce.cloneItem(wds);
          console.log('pl1', pl1);
          const [pl, s] = pounce.run(pl1, [item], wordstack);
          return s[0];
        });
        console.log(newlist);
        s.push(newlist);
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

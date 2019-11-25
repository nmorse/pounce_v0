// Pounce Javascript runtime interpreter
var pounce = (function () {
  // run expects a parsed program list (pl).
  // a stack that usually would be empty, but may be primed with an existing state
  // a stack of dictionaries of words.
  // and optionaly a history array to record stack and pl state
  let imported = {};
  let resumable = { stack: [] };
  function tryConvertToNumber(w) {
    return number_or_str(w);
  }
  function toBoolean(s) {
    if (typeof s === 'string') {
      return (s === 'true')
    }
    return s;
  }
  function number_or_str(s) {
    var num;
    if (!isNaN(parseFloat(s))) {
      num = parseFloat(s);
      if (('' + num).length === s.length || s[s.length - 1] == '.' || s[s.length - 1] == '0' || s[0] == '.') {
        if (s.indexOf('.') === s.lastIndexOf('.')) {
          return num;
        }
      }
    }
    if (!isNaN(parseInt(s, 10))) {
      num = parseInt(s, 10);
      if (('' + num).length === s.length) {
        return num;
      }
    }
    return s;
  }

  var halt = false;
  var stack = [];
  var words = {
    'halt': {
      expects: [], effects: [], tests: [], desc: 'halts a running program',
      definition: function (s) {
        halt = true;
        return [s];
      }
    },
    'def': {
      expects: [{ ofType: 'list', desc: 'composition of words' }, { ofType: 'list', desc: 'name of this new word' }], effects: [-2], tests: [], desc: 'defines a word',
      definition: function (s, pl, wordstack) {
        const key = s.pop();
        const definition = s.pop();
        wordstack[0][key] = definition;
        return [s];
      }
    },
    'define': {
      expects: [{ ofType: 'record', desc: 'definition of word' }, { ofType: 'string', desc: 'word name' }], effects: [-2], tests: [], desc: 'defines a word given a record',
      definition: function (s, pl, wordstack) {
        const name = s.pop();
        wordstack[0][name] = s.pop();
        return [s];
      }
    },
    'local-def': {
      expects: [{ ofType: 'list', desc: 'composition of words' }, { ofType: 'list', desc: 'name of this new word' }], effects: [-2], tests: [], desc: 'defines a local word',
      definition: function (s, pl, wordstack) {
        const top = wordstack.length - 1;
        if (top > 0) {
          const key = s.pop();
          const definition = s.pop();
          wordstack[top][key] = definition;
        }
        return [s];
      }
    },
    'internal=>drop-local-words': {
      definition: function (s, pl, wordstack) {
        wordstack.pop();
        return [s];
      }
    },
    'import': {
      definition: function (s, pl, wordstack) {
        const importable = s.pop();
        if (typeof importable === 'string') {
          if (imported[importable]) {
            // already imported
            return [s];
          }

          // given a path to a dictionary load it or fetch and load
          // options are to extend the core dictionary or pushit on a stack
          // 1. Object.assign(window[importable].words, wordstack[0]);
          // 2. wordstack.push(window[importable].words);
          if (window[importable]) {
            imported[importable] = true;
            wordstack.push(window[importable].words);
          } else {
            console.log('TBD: code to load resourse:', importable)
          }
        } else {
          // given a dictionary
          wordstack.push(importable);
        }
        return [s];
      }
    },
    'apply': {
      expects: [{ desc: 'a runable', ofType: 'list' }], effects: [-1], tests: [], desc: 'run the contents of a list',
      definition: function (s, pl) {
        const block = s.pop();
        if (isArray(block)) {
          pl = block.concat(pl);
        }
        else {
          pl.unshift(block);
        }
        return [s, pl];
      }
    },
    'dip': {
      expects: [{ desc: 'a', ofType: 'list' }], effects: [-1], tests: [], desc: 'apply under the top of the stack (see apply)',
      definition: function (s, pl) {
        const block = s.pop();
        const item = s.pop();
        pl = [item].concat(pl);
        if (isArray(block)) {
          pl = block.concat(pl);
        }
        else {
          pl.unshift(block);
        }
        return [s, pl];
      }
    },
    'dip2': {
      expects: [{ desc: 'a', ofType: 'list' }, { desc: 'an item', ofType: 'any' }], effects: [-1], tests: [], desc: 'apply two under the top of the stack (see apply)',
      definition: function (s, pl) {
        const block = s.pop();
        const item1 = s.pop();
        const item2 = s.pop();
        pl = [item1].concat(pl);
        pl = [item2].concat(pl);
        if (isArray(block)) {
          pl = block.concat(pl);
        }
        else {
          pl.unshift(block);
        }
        return [s, pl];
      }
    },
    'log': {definition: (s) => {
      console.log(s);
      return [s];
     } 
    },
    'drop': {
      expects: [{ desc: 'some value', ofType: 'any' }], effects: [-1], tests: [], desc: 'remove one element from the top of the stack',
      definition: function (s) {
        s.pop();
        return [s];
      }
    },
    'dup': {
      expects: [{ desc: 'some item', ofType: 'any' }], effects: [1], tests: [], desc: 'duplicate the top element on the stack',
      definition: function (s) {
        const top = s.length - 1;
        const a = cloneItem(s[top]);
        s.push(a);
        return [s];
      }
    },
    'dup2': {
      expects: [{ desc: 'some item', ofType: 'any' }, { desc: 'another item', ofType: 'any' }], effects: [2], tests: [], desc: 'duplicate the top two elements on the stack',
      definition: [['dup'], 'dip', 'dup', ['swap'], 'dip']
      //function (s) {
      //  const top = s.length - 1;
      //  const a = cloneItem(s[top]);
      //  const b = cloneItem(s[top - 1]);
      //  s.push(b, a);
      //  return [s];
      //}
    },
    'swap': {
      expects: [{ desc: 'some item', ofType: 'any' }, { desc: 'another item', ofType: 'any' }], effects: [0], tests: [], desc: 'swap the top two elements on the stack',
      definition: function (s) {
        const a = s.pop();
        const b = s.pop();
        s.push(a, b);
        return [s];
      }
    },
    '+': {
      expects: [{ desc: 'a', ofType: 'number' }, { desc: 'b', ofType: 'number' }], effects: [-1], tests: [], desc: 'addition',
      definition: function (s) {
        const b = s.pop();
        const a = s.pop();
        s.push(a + b);
        return [s];
      }
    },
    '-': {
      expects: [{ desc: 'a', ofType: 'number' }, { desc: 'b', ofType: 'number' }], effects: [-1], tests: [], desc: 'subtraction',
      definition: function (s) {
        const b = s.pop();
        const a = s.pop();
        s.push(a - b);
        return [s];
      }
    },
    '/': {
      expects: [{ desc: 'a', ofType: 'number' }, { desc: 'b', ofType: 'number' }], effects: [-1], tests: [], desc: 'division',
      definition: function (s) {
        const b = s.pop();
        const a = s.pop();
        s.push(a / b);
        return [s];
      }
    },
    '%': {
      expects: [{ desc: 'a', ofType: 'number' }, { desc: 'b', ofType: 'number' }], effects: [-1], tests: [], desc: 'modulo',
      definition: function (s) {
        const b = s.pop();
        const a = s.pop();
        s.push(a % b);
        return [s];
      }
    },
    '*': {
      expects: [{ desc: 'a', ofType: 'number' }, { desc: 'b', ofType: 'number' }], effects: [-1], tests: [], desc: 'multiplication',
      definition: function (s) {
        const b = s.pop();
        const a = s.pop();
        s.push(a * b);
        return [s];
      }
    },
    'random': {
      definition: function (s) {
        s.push(Math.random());
        return [s];
      }
    },
    'round': {
      definition: function (s) {
        const pres = s.pop();
        const n = s.pop();
        s.push(Math.round(n / pres) * pres);
        return [s];
      }
    },
    'abs': {
      definition: function (s) {
        const n = s.pop();
        s.push(Math.abs(n));
        return [s];
      }
    },
    's2int': {
      expects: [{desc:'a number in a string', ofType:'string'}, {desc: 'radix', ofType: 'integer'}],
      definition: function (s) {
        const radix = s.pop();
        const str = s.pop();
        s.push(Number.parseInt(str, radix));
        return [s];
      }
    },
    'int2s': {
      expects: [{desc:'number', ofType:'integer'}, {desc: 'radix', ofType: 'integer'}],
      definition: function (s) {
        const radix = s.pop();
        const n = s.pop();
        s.push(n.toString(radix));
        return [s];
      }
    },
    '<<': {
      expects: [{desc:'number', ofType:'integer'}, {desc: 'shift', ofType: 'integer'}],
      definition: function (s) {
        const shift = s.pop();
        const n = s.pop();
        s.push(n << shift);
        return [s];
      }
    },
    '>>': {
      expects: [{desc:'number', ofType:'integer'}, {desc: 'shift', ofType: 'integer'}],
      definition: function (s) {
        const shift = s.pop();
        const n = s.pop();
        s.push(n >> shift);
        return [s];
      }
    },
    'XOR': {
      expects: [{desc:'number', ofType:'integer'}, {desc: 'shift', ofType: 'integer'}],
      definition: function (s) {
        const shift = s.pop();
        const n = s.pop();
        s.push(n ^ shift);
        return [s];
      }
    },
    'AND': {
      expects: [{desc:'number', ofType:'integer'}, {desc: 'shift', ofType: 'integer'}],
      definition: function (s) {
        const shift = s.pop();
        const n = s.pop();
        s.push(n & shift);
        return [s];
      }
    },
    'store.set': {
      definition: function (s) {
        const name = s.pop();
        localStorage.setItem(name, JSON.stringify(s.pop()));
        return [s];
      }
    },
    'store.get': {
      definition: function (s) {
        const name = s.pop();
        s.push(JSON.parse(localStorage.getItem(name)));
        return [s];
      }
    },
    'store.remove': {
      definition: function (s) {
        const name = s.pop();
        localStorage.removeItem(name);
        return [s];
      }
    },
    'depth': {
      expects: [], effects: [1], tests: [], desc: 'stack depth',
      definition: function (s, pl) {
        s.push(s.length);
        return [s];
      }
    },
    '==': {
      expects: [{ desc: 'a', ofType: 'comparable' }, { desc: 'b', ofType: 'comparable' }], effects: [-1], tests: [], desc: 'compare for equality',
      definition: function (s) {
        const b = s.pop();
        const a = s.pop();
        s.push(a === b);
        return [s];
      }
    },
    '>': {
      expects: [{ desc: 'a', ofType: 'comparable' }, { desc: 'b', ofType: 'comparable' }], effects: [-1], tests: [], desc: 'greater than',
      definition: function (s) {
        const b = s.pop();
        const a = s.pop();
        s.push(a > b);
        return [s];
      }
    },
    '>=': {
      expects: [{ desc: 'a', ofType: 'comparable' }, { desc: 'b', ofType: 'comparable' }], effects: [-1], tests: [], desc: 'greater than or equal',
      definition: function (s) {
        const b = s.pop();
        const a = s.pop();
        s.push(a >= b);
        return [s];
      }
    },
    '<': {
      expects: [{ desc: 'a', ofType: 'comparable' }, { desc: 'b', ofType: 'comparable' }], effects: [-1], tests: [], desc: 'less than',
      definition: function (s) {
        const b = s.pop();
        const a = s.pop();
        s.push(a < b);
        return [s];
      }
    },
    '<=': {
      expects: [{ desc: 'a', ofType: 'comparable' }, { desc: 'b', ofType: 'comparable' }], effects: [-1], tests: [], desc: 'less than or equal',
      definition: function (s) {
        const b = s.pop();
        const a = s.pop();
        s.push(a <= b);
        return [s];
      }
    },
    'and': {
      expects: [{ desc: 'a', ofType: 'boolean' }, { desc: 'b', ofType: 'boolean' }], effects: [-1], tests: [], desc: 'logical and',
      definition: function (s) {
        const b = toBoolean(s.pop());
        const a = toBoolean(s.pop());
        s.push(a && b);
        return [s];
      }
    },
    'or': {
      expects: [{ desc: 'a', ofType: 'boolean' }, { desc: 'b', ofType: 'boolean' }], effects: [-1], tests: [], desc: 'logical or',
      definition: function (s) {
        const b = toBoolean(s.pop());
        const a = toBoolean(s.pop());
        s.push(a || b);
        return [s];
      }
    },
    'not': {
      expects: [{ desc: 'a', ofType: 'boolean' }], effects: [0], tests: [], desc: 'logical not',
      definition: function (s) {
        const a = toBoolean(s.pop());
        s.push(!a);
        return [s];
      }
    },
    'bubble-up': {
      'requires': 'list_module',
      'named-args': ['c'],
      'local-words': {
      },
      'definition': [[], ['cons'], 'c', 'repeat', 'swap', [['uncons'], 'c', 'repeat', 'drop'], 'dip']
    },
    'repeat': {
      // 'requires':'list_module',
      'definition': ['dup', 0, '>', [1, '-', 'swap', 'dup', 'dip2', 'swap', 'repeat'], ['drop', 'drop'], 'if-else']
    },
    'case': {
      expects: [{ desc: 'key', ofType: 'word' }, { desc: 'a', ofType: 'record' }], effects: [-2], tests: [], desc: 'apply a matching case',
      definition: function (s, pl) {
        const case_record = s.pop();
        let key = s.pop();
        if (key === " ") {
          key = "' '";
        }
        if (case_record[key]) {
          if (isArray(case_record[key])) {
            pl = [case_record[key]].concat(pl);
          }
          else {
            pl.unshift(case_record[key]);
          }
        }
        else {
          s.push(false);
        }
        return [s, pl];
      }
    },
    'if': {
      expects: [{ desc: 'conditional', ofType: 'boolean' }, { desc: 'then clause', ofType: 'list' }], effects: [-2], tests: [], desc: 'conditionally apply a quotation',
      definition: function (s, pl) {
        const then_block = s.pop();
        const expression = toBoolean(s.pop());
        if (expression) {
          if (isArray(then_block)) {
            pl = then_block.concat(pl);
          }
          else {
            pl.unshift(then_block);
          }
        }
        return [s, pl];
      }
    },
    'if-else': {
      expects: [{ desc: 'conditional', ofType: 'boolean' }, { desc: 'then clause', ofType: 'list' }, { desc: 'then clause', ofType: 'list' }], effects: [-3], tests: [], desc: 'conditionally apply the first or second quotation',
      definition: function (s, pl) {
        const else_block = s.pop();
        const then_block = s.pop();
        const expression = toBoolean(s.pop());
        if (expression) {
          if (isArray(then_block)) {
            pl = then_block.concat(pl);
          }
          else {
            pl.unshift(then_block);
          }
        }
        else {
          if (isArray(else_block)) {
            pl = else_block.concat(pl);
          }
          else {
            pl.unshift(else_block);
          }
        }
        return [s, pl];
      }
    },
    'ifte': {
      expects: [{ desc: 'conditional', ofType: 'list' }, { desc: 'then clause', ofType: 'list' }, { desc: 'then clause', ofType: 'list' }], effects: [-3], tests: [], desc: 'conditionally apply the first or second quotation',
      definition: [['apply'], 'dip2', 'if-else']
    },
    'floor': ['dup', 1, '%', '-'],
    'rollup': {
      expects: [{ desc: 'a', ofType: 'any' }, { desc: 'b', ofType: 'any' }, { desc: 'c', ofType: 'any' }], effects: [0], tests: ['A B C rollup', ['C', 'A', 'B']], desc: 'roll up 3 elements on the stack, the top item ends up under the other two',
      definition: ['swap', ['swap'], 'dip']
    },
    'rolldown': {
      expects: [{ desc: 'a', ofType: 'any' }, { desc: 'b', ofType: 'any' }, { desc: 'c', ofType: 'any' }], effects: [0], tests: ['A B C rolldown', ['B', 'C', 'A']], desc: 'roll down 3 elements in the stack, the bottom item ends up at the top',
      definition: [['swap'], 'dip', 'swap']
    },
    'rotate': {
      expects: [{ desc: 'a', ofType: 'any' }, { desc: 'b', ofType: 'any' }, { desc: 'c', ofType: 'any' }], effects: [0], tests: ['A B C rotate', ['C', 'B', 'A']], desc: 'inverts the order of the top three elements',
      definition: ['swap', ['swap'], 'dip', 'swap']
    },
    'map-under': {
      'requires': 'list_module',
      'named-args': ['c', 'q'],
      'local-words': {
        'init-a': [[[]], ['a'], 'local-def'],
        'update-a': ['a', 'cons', [], 'cons', ['a'], 'local-def'],
        'destructive-first': ['c', 'pop', 'swap', [], 'cons', ['c'], 'local-def'],
        'maping': ['c', 'list-length', 0, '>',
          ['destructive-first', 'q', 'apply', 'update-a', 'maping'],
          [], 'if-else']
      },
      'definition': ['init-a', 'maping', 'a']
    },
    'map': {
      'local-words': {
        'setup-map': [[]],
        'process-map': [
          ['dup', 'list-length'], 'dip2', 'rolldown', 0, '>',
          ['rotate', 'pop', 'rolldown', 'dup', ['apply'], 'dip', ['swap'], 'dip2', ['prepend'], 'dip', 'swap', 'process-map'],
          [['drop', 'drop'], 'dip'], 'if-else']
      },
      'definition': ['list_module', 'import', 'setup-map', 'process-map']
    },
    'filter': {
      'requires': 'list_module',
      'local-words': {
        'setup-filter': [[]],
        'process-filter': [
          ["dup", "list-length"], "dip2", "rolldown", 0, ">",
          ["rotate", "pop", "rolldown", ["dup"], "dip", "dup", ["apply"], "dip", "swap",
            [["swap"], "dip2", ["prepend"], "dip"],
            [["swap"], "dip2", ["drop"], "dip"], "if-else", "swap", "process-filter"],
          [["drop", "drop"], "dip"], "if-else"]
      },
      'definition': ['setup-filter', 'process-filter']
    },
    'reduce': {
      'requires': 'list_module',
      'local-words': {
        'more?': ['rolldown', 'dup', 'list-length', 0, '>', ['rollup'], 'dip'],
        'process-reduce': ['more?', ['reduce-step', 'process-reduce'], 'if'],
        'reduce-step': [['pop'], 'dip2', 'dup', [['swap'], 'dip', 'apply'], 'dip'],
        'teardown-reduce': ['drop', ['drop'], 'dip'],
      },
      'definition': ['process-reduce', 'teardown-reduce']
    }
  };

  function cloneItem(item) {
    // return cloneObject(item);
    if (item !== undefined) {
      return JSON.parse(JSON.stringify(item));
    }
    return item;
  }

  function cloneObject(obj) {
    let clone = {};
    if (typeof obj !== "object") {
      return obj;
    }
    else {
      if (isArray(obj)) {
        clone = [];
      }
      for (let i in obj) {
        if (obj[i] !== null && typeof (obj[i]) === "object")
          clone[i] = cloneObject(obj[i]);
        else
          clone[i] = obj[i];
      }
      return clone;
    }
  }

  // alternate clone ?? merits ??
  function cloneAnyObj(o) {
    let newObj = (o instanceof Array) ? [] : {};
    let i;
    for (i in o) {
      if (i == 'clone') continue;
      if (o[i] && typeof o[i] == "object") {
        newObj[i] = cloneAnyObj(o[i]);
      } else {
        newObj[i] = o[i];
      }
    }
    return newObj;
  }

  function isInternalWord(term) {
    return (term === 'internal=>drop-local-words');
  }

  // a filter that filters out internal words 'internal=>drop-local-words'
  function ixnay(l) {
    const new_l = l.filter(element => !isInternalWord(element));
    return new_l;
  }

  function isArray(candidate) {
    return Array.isArray(candidate);
  }

  function isObject(candidate) {
    return (typeof candidate === 'object' && !isArray(candidate));
  }

  function isNumber(value) {
    return typeof value === 'number' && isFinite(value);
  }

  function cleanQuotedItems(stack) {
    return stack.map(e => {
      if (isArray(e) || typeof e === "object") {
        return unParse([e]);
      } else {
        return e;
      }
    });
  }

  function unParse(pl) {
    let ps = '';
    let spacer = '';
    for (let i in pl) {
      if (pl[i] && typeof pl[i] == "object") {
        if (isArray(pl[i])) {
          ps += spacer + '[' + unParse(pl[i]) + ']';
        }
        else {
          ps += spacer + '{' + unParseKeyValuePair(pl[i]) + '}';
        }
      }
      else {
        ps += spacer + pl[i];
      }
      spacer = ' ';
    }
    return ps;
  }

  function unParseKeyValuePair(pl) {
    let ps = '';
    let spacer = '';
    for (let i in pl) {
      if (pl.hasOwnProperty(i)) {
        if (pl[i] && typeof pl[i] == "object") {
          if (isArray(pl[i])) {
            ps += spacer + i + ':[' + unParse(pl[i]) + ']';
          }
          else {
            ps += spacer + i + ':{' + unParseKeyValuePair(pl[i]) + '}';
          }
        }
        else {
          ps += spacer + i + ':' + pl[i];
        }
        spacer = ' ';
      }
    }
    return ps;
  }

  return {
    words: words
    , halt: false
    , resumable
    , run:
      function run(pl = [], stack = [], wordstack = [], record_histrory = false) {
        if (resumable.stack.length > 0) {
          stack = cloneItem( resumable.stack );
          resumable.stack = [];
        }
        imported = {};
        let term;
        let reps = 0;
        const maxReps = 100000;
        const findWord = (term) => {
          let i = wordstack.length - 1;
          let w = wordstack[i][term];
          while (i >= 0 && !w) {
            i -= 1;
            if (i >= 0) {
              w = wordstack[i][term];
            }
          }
          if (i < 0) {
            return null;
          }
          return w;
        };

        halt = false;
        while (pl.length > 0 && !halt && reps < maxReps) {
          reps += 1;
          term = pl.shift();
          let num;
          let handled = false;
          if (typeof term === 'string') {
            let thisWord = findWord(term);
            if (isArray(thisWord)) {
              // console.log('unquote list ', stack, term, pl);
              pl = thisWord.concat(pl);
              // console.log('post-unquote ', stack, pl);
              handled = true;
            }
            if (thisWord && isArray(thisWord.definition)) {
              if (record_histrory !== false && !isInternalWord(term)) {
                record_histrory.unshift({ stack: cloneItem(cleanQuotedItems(stack)).reverse(), term: term, pl: ixnay(cloneItem(cleanQuotedItems(pl)).reverse()) });
              }
              if (thisWord.requires && !imported[thisWord.requires]) {
                stack.push(thisWord.requires);
                [stack] = wordstack[0].import.definition(stack, pl, wordstack);
              }
              if (thisWord['local-words'] || thisWord['named-args']) {
                if (thisWord['local-words']) {
                  wordstack.push(thisWord['local-words']);
                  pl = thisWord.definition.concat(['internal=>drop-local-words']).concat(pl);
                }
                if (thisWord['named-args'] && isArray(thisWord['named-args'])) {
                  const top = wordstack.length - 1;
                  for (let var_name of thisWord['named-args']) {
                    // [] swap push [c] local-def
                    pl = [[], 'cons', [var_name], 'local-def'].concat(pl);
                  }
                }
              }
              else {
                // console.log('unquote definition list ', stack, term, pl);
                pl = thisWord.definition.concat(pl);
                // console.log('post-unquote ', stack, pl);
              }
              handled = true;
            }
            if (thisWord && thisWord.definition && typeof thisWord.definition === 'function') {
              // console.log('pre-execute ', stack, term, pl);
              if (record_histrory !== false && !isInternalWord(term)) {
                record_histrory.unshift({ stack: cloneItem(cleanQuotedItems(stack)).reverse(), term: term, pl: ixnay(cloneItem(cleanQuotedItems(pl)).reverse()) });
              }
              [stack, pl = pl] = thisWord.definition(stack, pl, wordstack);
              // console.log('post-execute ', stack, pl );
              handled = true;
            }
            if (!handled) {
              num = tryConvertToNumber(term);
              stack.push(num);
              if (record_histrory && pl.length > 0) {
                if (record_histrory.length !== 0 && !record_histrory[0].term) {
                  record_histrory[0] = { stack: cloneItem(cleanQuotedItems(stack)).reverse(), pl: ixnay(cloneItem(pl).reverse()) };
                }
              }
            }
          }
          else {
            num = tryConvertToNumber(term);
            if (isArray(term) || !isNumber(num)) {
              stack.push(cloneItem(term));
            }
            else {
              stack.push(num);
            }
            if (record_histrory && pl.length > 0) {
              if (record_histrory.length !== 0 && !record_histrory[0].term) {
                record_histrory[0] = { stack: cloneItem(cleanQuotedItems(stack)).reverse(), pl: ixnay(cloneItem(pl).reverse()) };
              }
            }
          }
        }
        return [pl, stack];
      }

    , isArray: isArray
    , cloneItem: cloneItem
    , isNumber: isNumber

    // move to parse lib??
    , unParse: unParse

  };
})();

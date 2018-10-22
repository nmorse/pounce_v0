// Pounce Javascript runtime interpreter
var pounce = (function () {
  // run expects a parsed program list (pl).
  // a stack that usually would be empty, but may be primed with an existing state
  // a stack of dictionaries of words.
  // and optionaly a history array to record stack and pl state
  
  function tryConvertToNumber(w) {
    return number_or_str(w);
  }
  
  function number_or_str(s) {
    var num;
    if (!isNaN(parseFloat(s))) {
      num = parseFloat(s);
      if ((''+num).length === s.length || s[s.length - 1] == '.' || s[s.length - 1] == '0' || s[0] == '.') {
        if (s.indexOf('.') === s.lastIndexOf('.')) {
          return num;
        }
      }
    }
    if (!isNaN(parseInt(s, 10))) {
      num = parseInt(s, 10);
      if ((''+num).length === s.length) {
        return num;
      }
    }
    return s;
  }
  
  var halt = false;
  var stack = [];
  var words = {
    'halt': {expects: [], effects:[], tests: [], desc: 'halts a running program',
      definition: function(s) {
      halt = true;
      return [s];
    }},
    'def': {expects: [{ofType: 'list', desc: 'composition of words'}, {ofType: 'list', desc: 'name of this new word'}], effects:[-2], tests: [], desc: 'defines a word',
      definition: function(s, pl, wordstack) {
      const key = s.pop();
      const definition = s.pop();
      wordstack[0][key] = definition;
      return [s];
    }},
    'define': {expects: [{ofType: 'record', desc: 'definition of word'}, {ofType: 'string', desc: 'word name'}], effects:[-2], tests: [], desc: 'defines a word given a record',
      definition: function(s, pl, wordstack) {
      const name = s.pop();
      wordstack[0][name] = s.pop();
      return [s];
    }},
    'internal=>drop-local-words': {
      definition:function(s, pl, wordstack) {
      wordstack.pop();
      return [s];
    }},
    'str-first': {expects: [{desc: 'source', ofType: 'string'}], effects:[1], tests: [
      [`'hello' str-first`, ['ello', 'h']]
      ], desc: 'extract the first character from a string',
      definition: function(s) {
      const str = s.pop();
      const first = str.slice(0, 1);
      const last_part = str.slice(1);
      s.push(last_part, first);
      return [s];
    }},
    'str-last': {expects: [{desc: 'source', ofType: 'string'}], effects:[1], tests: [
      [`'hello' str-last`, ['hell', 'o']]
      ], desc: 'extract the last character from a string',
      definition: function(s) {
      const str = s.pop();
      const last = str.slice(-1);
      const first_part = str.slice(0, -1);
      s.push(first_part, last);
      return [s];
    }},
    'str-length': {expects: [{desc: 'source string', ofType: 'string'}], effects:[0], tests: [
      [`'hello' str-length`, [5]]
      ], desc: 'lenth of a string',
      definition: function(s) {
      const str = s.pop();
      s.push(str.length);
      return [s];
    }},
    'str-append': {expects: [{desc: 'source 1', ofType: 'string'}, {desc: 'source 2', ofType: 'string'}], effects:[-1], tests: [
      [`'hello' ' ' str-append 'world'`, ['hello world']]
      ], desc: 'append two strings together',
      definition: function(s) {
      const str = s.pop();
      s[s.length - 1] = s[s.length - 1] + str;
      return [s];
    }},
    'push': {expects: [{desc: 'a', ofType: 'list'}, {desc: 'an item', ofType: 'any'}], effects:[-1], tests: [], desc: 'push an item on end of a list',
      definition: function(s) {
      const item = s.pop();
      const top = s.length - 1;
      const list = s[top];
      list.push(item);
      return [s];
    }},
    'prepend': {expects: [{desc: 'a', ofType: 'list'}, {desc: 'an item', ofType: 'any'}], effects:[-1], tests: [
      [`[6 7] 5 prepend`, [[5, 6, 7]]]
      ], desc: 'push an item on end of a list',
      definition: function(s) {
      const item = s.pop();
      const top = s.length - 1;
      const list = s[top];
      list.unshift(item);
      return [s];
    }},
    'pop': {expects: [{desc: 'a', ofType: 'list'}], effects:[1], tests: [], desc: 'pop the last item off the end of a list',
      definition: function(s) {
      const top = s.length - 1;
      const list = s[top];
      if (isArray(list)) {
        const item = cloneItem(list.pop());
        s.push(item);
      }
      else {
        console.log({'word':'pop', 'error':"unable to 'pop' from non-Array"});
      }
      return [s];
    }},
    'list-length': {expects: [{desc: 'source', ofType: 'list'}], effects:[0], tests: [
      [`[1 2 3] str-length`, [3]]
      ], desc: 'lenth of a list',
      definition: function(s) {
      const list = s.pop();
      s.push(list.length);
      return [s];
    }},
    'cons': {expects: [{desc: 'a', ofType: 'list'}, {desc: 'an item', ofType: 'any'}], effects:[-1], tests: [], desc: 'add an item at the begining of a list',
      definition: function(s) {
      const list = s.pop();
      const item = s.pop();
      list.push(item);
      return [s];
    }},
    'apply': {expects: [{desc: 'a runable', ofType: 'list'}], effects:[-1], tests: [], desc: 'run the contents of a list',
      definition: function(s, pl) {
      const block = s.pop();
      if (isArray(block)) {
        pl = block.concat(pl);
      }
      else {
        pl.unshift(block);
      }
      return [s, pl];
    }},
    'un-apply': {expects: [{desc: 'an word', ofType: 'any'}], effects:[0], tests: [], desc: 'put a word into list form',
      definition: function(s, pl) {
      const item = s.pop();
      if (isArray(item)) {
        pl = [item].concat(pl);
      }
      else {
        pl.unshift([item]);
      }
      return [s, pl];
    }},
    'dip': {expects: [{desc: 'a', ofType: 'list'}], effects:[-1], tests: [], desc: 'apply under the top of the stack (see apply)',
      definition: function(s, pl) {
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
    }},
    'dip2': {expects: [{desc: 'a', ofType: 'list'}, {desc: 'an item', ofType: 'any'}], effects:[-1], tests: [], desc: 'apply two under the top of the stack (see apply)',
      definition: function(s, pl) {
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
    }},
    'drop': {expects: [{desc: 'some value', ofType: 'any'}], effects:[-1], tests: [], desc: 'remove one element from the top of the stack',
      definition: function(s) {
      s.pop();
      return [s];
    }},
    'dup': {expects: [{desc: 'some item', ofType: 'any'}], effects:[1], tests: [], desc: 'duplicate the top element on the stack',
      definition: function(s) {
      const top = s.length - 1;
      const a = cloneItem(s[top]);
      s.push(a);
      return [s];
    }},
    'dup2': {expects: [{desc: 'some item', ofType: 'any'}, {desc: 'another item', ofType: 'any'}], effects:[2], tests: [], desc: 'duplicate the top two elements on the stack',
      definition: function(s) {
      const top = s.length - 1;
      const a = cloneItem(s[top]);
      const b = cloneItem(s[top - 1]);
      s.push(b, a);
      return [s];
    }},
    'swap': {expects: [{desc: 'some item', ofType: 'any'}, {desc: 'another item', ofType: 'any'}], effects:[0], tests: [], desc: 'swap the top two elements on the stack',
      definition: function(s) {
      const a = s.pop();
      const b = s.pop();
      s.push(a, b);
      return [s];
    }},
    '+': {expects: [{desc: 'a', ofType: 'number'}, {desc: 'b', ofType: 'number'}], effects:[-1], tests: [], desc: 'addition',
      definition: function(s) {
      const b = s.pop();
      const a = s.pop();
      s.push(a + b);
      return [s];
    }},
    '-': {expects: [{desc: 'a', ofType: 'number'}, {desc: 'b', ofType: 'number'}], effects:[-1], tests: [], desc: 'subtraction',
      definition: function(s) {
      const b = s.pop();
      const a = s.pop();
      s.push(a - b);
      return [s];
    }},
    '/': {expects: [{desc: 'a', ofType: 'number'}, {desc: 'b', ofType: 'number'}], effects:[-1], tests: [], desc: 'division',
      definition: function(s) {
      const b = s.pop();
      const a = s.pop();
      s.push(a / b);
      return [s];
    }},
    '%': {expects: [{desc: 'a', ofType: 'number'}, {desc: 'b', ofType: 'number'}], effects:[-1], tests: [], desc: 'modulo',
      definition: function(s) {
      const b = s.pop();
      const a = s.pop();
      s.push(a % b);
      return [s];
    }},
    '*': {expects: [{desc: 'a', ofType: 'number'}, {desc: 'b', ofType: 'number'}], effects:[-1], tests: [], desc: 'multiplication',
      definition: function(s) {
      const b = s.pop();
      const a = s.pop();
      s.push(a * b);
      return [s];
    }},
    'depth': {expects: [], effects:[1], tests: [], desc: 'stack depth',
      definition: function(s, pl) {
      s.push(s.length);
      return [s];
    }},
    'n*': {expects: [], effects:[], tests: [], desc: 'multiply a stack numbers (depreceated)',
      definition: function(s, pl) {
      if (s.length >= 2) {
        const a = s.pop();
        const b = s.pop();
        if (isNumber(a) && isNumber(b)) {
          s.push(a * b);
          pl.unshift('n*');
          return [s, pl];
        }
        else {
          s.push(b, a);
        }
      }
      return [s];
    }},
    '==': {expects: [{desc: 'a', ofType: 'comparable'}, {desc: 'b', ofType: 'comparable'}], effects:[-1], tests: [], desc: 'compare for equality',
      definition: function(s) {
      const b = s.pop();
      const a = s.pop();
      s.push(a === b);
      return [s];
    }},
    '>': {expects: [{desc: 'a', ofType: 'comparable'}, {desc: 'b', ofType: 'comparable'}], effects:[-1], tests: [], desc: 'greater than',
      definition: function(s) {
      const b = s.pop();
      const a = s.pop();
      s.push(a > b);
      return [s];
    }},
    '>=': {expects: [{desc: 'a', ofType: 'comparable'}, {desc: 'b', ofType: 'comparable'}], effects:[-1], tests: [], desc: 'greater than or equal',
      definition: function(s) {
      const b = s.pop();
      const a = s.pop();
      s.push(a >= b);
      return [s];
    }},
    '<': {expects: [{desc: 'a', ofType: 'comparable'}, {desc: 'b', ofType: 'comparable'}], effects:[-1], tests: [], desc: 'less than',
      definition: function(s) {
      const b = s.pop();
      const a = s.pop();
      s.push(a < b);
      return [s];
    }},
    '<=': {expects: [{desc: 'a', ofType: 'comparable'}, {desc: 'b', ofType: 'comparable'}], effects:[-1], tests: [], desc: 'less than or equal',
      definition: function(s) {
      const b = s.pop();
      const a = s.pop();
      s.push(a <= b);
      return [s];
    }},
    'and': {expects: [{desc: 'a', ofType: 'boolean'}, {desc: 'b', ofType: 'boolean'}], effects:[-1], tests: [], desc: 'logical and',
      definition: function(s) {
      const b = s.pop();
      const a = s.pop();
      s.push(a && b);
      return [s];
    }},
    'or': {expects: [{desc: 'a', ofType: 'boolean'}, {desc: 'b', ofType: 'boolean'}], effects:[-1], tests: [], desc: 'logical or',
      definition: function(s) {
      const b = s.pop();
      const a = s.pop();
      s.push(a || b);
      return [s];
    }},
    'not': {expects: [{desc: 'a', ofType: 'boolean'}], effects:[0], tests: [], desc: 'logical not',
      definition: function(s) {
      const a = s.pop();
      s.push(!a);
      return [s];
    }},
    'bubble-up': {expects: [{desc: 'offset', ofType: 'integer'}], effects:[-1], tests: [], desc: 'move a stack element up to the top',
      definition: function(s) {
      const i = s.pop();
      const item = s.splice(-i-1, 1);
      s.push(item[0]);
      return [s];
    }},
    'get': {expects: [{desc: 'a', ofType: 'record'}, {desc: 'key', ofType: 'word'}], effects:[0], tests: [], desc: 'get the value of a property from a record',
      definition: function(s) {
      const key = s.pop();
      const rec = cloneItem(s[s.length - 1]);
      s.push(rec[key])
      return [s];
    }},
    'set': {expects: [{desc: 'a', ofType: 'record'}, {desc: 'key', ofType: 'word'}, {desc: 'value', ofType: 'any'}], effects:[-2], tests: [], desc: 'set the value of a property in a record',
      definition: function(s) {
      const key = s.pop();
      const value = s.pop();
      let rec = s[s.length - 1];
      rec[key] = value;
      return [s];
    }},
    'case': {expects: [{desc: 'key', ofType: 'word'}, {desc: 'a', ofType: 'record'}], effects:[-2], tests: [], desc: 'apply a matching case',
      definition: function(s, pl) {
      const case_record = s.pop();
      let key = s.pop();
      if (key === " ") {
        key = "' '";
      }
      if (case_record[key]) {
        if (isArray(case_record[key])) {
          pl = case_record[key].concat(pl);
        }
        else {
          pl.unshift(case_record[key]);
        }
      }
      else {
        s.push(false);
      }
      return [s, pl];
    }},
    'if': {expects: [{desc: 'conditional', ofType: 'boolean'}, {desc: 'then clause', ofType: 'list'}], effects:[-2], tests: [], desc: 'conditionally apply a quotation',
      definition: function(s, pl) {
      const then_block = s.pop();
      const expression = s.pop();
      if (expression) {
        if (isArray(then_block)) {
          pl = then_block.concat(pl);
        }
        else {
          pl.unshift(then_block);
        }
      }
      return [s, pl];
    }},
    'if-else': {expects: [{desc: 'conditional', ofType: 'boolean'}, {desc: 'then clause', ofType: 'list'}, {desc: 'then clause', ofType: 'list'}], effects:[-3], tests: [], desc: 'conditionally apply the first or second quotation',
      definition: function(s, pl) {
      const else_block = s.pop();
      const then_block = s.pop();
      const expression = s.pop();
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
    }},
    'ifte': {expects: [{desc: 'conditional', ofType: 'list'}, {desc: 'then clause', ofType: 'list'}, {desc: 'then clause', ofType: 'list'}], effects:[-3], tests: [], desc: 'conditionally apply the first or second quotation',
      definition: [[{toJSON: function(){return this.word;}, word:'apply'}], {toJSON: function(){return this.word;}, word:'dip2'}, {toJSON: function(){return this.word;}, word:'if-else'}]},
    'count-down': [{toJSON: function(){return this.word;}, word:'dup'}, 1, {toJSON: function(){return this.word;}, word:'-'}, [ {toJSON: function(){return this.word;}, word:'dup'}, 1, {toJSON: function(){return this.word;}, word:'-'}, {toJSON: function(){return this.word;}, word:'count-down'} ], {toJSON: function(){return this.word;}, word:'if'}],
    'fact': [{toJSON: function(){return this.word;}, word:'count-down'}, {toJSON: function(){return this.word;}, word:'n*'}],
    'floor': [{toJSON: function(){return this.word;}, word:'dup'}, 1, {toJSON: function(){return this.word;}, word:'%'}, {toJSON: function(){return this.word;}, word:'-'}],
    'rollup': {expects: [{desc: 'a', ofType: 'any'}, {desc: 'b', ofType: 'any'}, {desc: 'c', ofType: 'any'}], effects:[0], tests: ['A B C rollup', ['C', 'A', 'B']], desc: 'roll up 3 elements on the stack, the top item ends up under the other two',
      definition: [{toJSON: function(){return this.word;}, word:'swap'}, [{toJSON: function(){return this.word;}, word:'swap'}], {toJSON: function(){return this.word;}, word:'dip'}]},
    'rolldown': {expects: [{desc: 'a', ofType: 'any'}, {desc: 'b', ofType: 'any'}, {desc: 'c', ofType: 'any'}], effects:[0], tests: ['A B C rolldown', ['B', 'C', 'A']], desc: 'roll down 3 elements in the stack, the bottom item ends up at the top',
      definition: [[{toJSON: function(){return this.word;}, word:'swap'}], {toJSON: function(){return this.word;}, word:'dip'}, {toJSON: function(){return this.word;}, word:'swap'}]},
    'rotate': {expects: [{desc: 'a', ofType: 'any'}, {desc: 'b', ofType: 'any'}, {desc: 'c', ofType: 'any'}], effects:[0], tests: ['A B C rotate', ['C', 'B', 'A']], desc: 'inverts the order of the top three elements',
      definition: [{toJSON: function(){return this.word;}, word:'swap'}, [{toJSON: function(){return this.word;}, word:'swap'}], {toJSON: function(){return this.word;}, word:'dip'}, {toJSON: function(){return this.word;}, word:'swap'}]}
  };
  
  function cloneItem(item) {
    // return cloneObject(item);
    return JSON.parse(JSON.stringify(item));
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
      for(let i in obj) {
        if(obj[i] !== null &&  typeof(obj[i]) === "object")
          clone[i] = cloneObject(obj[i]);
        else
          clone[i] = obj[i];
      }
      return clone;
    }
  }
  
  // alternate clone ?? merits ??
  function cloneAnyObj (o) {
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

  // a filter that filters out internal words
  function ixnay(l) {
    const new_l = l.filter(e => e !== 'internal=>drop-local-words');
    return new_l;
  }
  
  function isArray(candidate) {
    return Array.isArray(candidate);
  }
  
  function isNumber (value) {
    return typeof value === 'number' && isFinite(value);
  }
  
  return {
      words: words
    , halt: false
    , run:
      function run(pl, stack, wordstack, record_histrory = false) {
        let term;
        let reps = 0;
        const maxReps = 10000000;
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
          if (term['word']) {
            let thisWord = findWord(term['word']);
            if (isArray(thisWord)) {
              // console.log('unquote list ', stack, term, pl);
              pl = thisWord.concat(pl);
              // console.log('post-unquote ', stack, pl);
              handled = true;
            }
            if (thisWord && isArray(thisWord.definition)) {
              if (thisWord['local-words']) {
                wordstack.push(thisWord['local-words']);
                pl = thisWord.definition.concat(['internal=>drop-local-words']).concat(pl);
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
              if (record_histrory !== false && ixnay([term]) !== []) {
                record_histrory.unshift({stack:cloneItem(stack).reverse(), term:term, pl:ixnay(cloneItem(pl).reverse())});
              }
              [stack, pl=pl] = thisWord.definition(stack, pl, wordstack);
              // console.log('post-execute ', stack, pl );
              handled = true;
            }
            if (!handled) {
              num = tryConvertToNumber(term);
              stack.push(num);
              if (record_histrory && pl.length > 0) {
                if (record_histrory.length !== 0 && !record_histrory[0].term) {
                  record_histrory[0] = {stack:cloneItem(stack).reverse(), pl:ixnay(cloneItem(pl).reverse())};
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
                record_histrory[0] = {stack:cloneItem(stack).reverse(), pl:ixnay(cloneItem(pl).reverse())};
              }
            }
          }
        }
        return stack;
      }
      
    , isArray: isArray

    , isNumber: isNumber

    // move to parse lib??
    , unParse:  function unParse (pl) {
        let ps = '';
        for (let i in pl) {
          if (pl[i] && typeof pl[i] == "object") {
            if (isArray(pl[i])) {
              ps += ' [' + unParse(pl[i]) + ']';
            }
            else {
              ps += ' {' + unParseKeyValuePair(pl[i]) + '}';
            }
          }
          else {
            ps += ' ' + pl[i];
          }
        }
        return ps;
      }
      
      , unParseKeyValuePair: function unParseKeyValuePair(pl) {
        let ps = '';
        for (let i in pl) {
          if (pl[i] && typeof pl[i] == "object") {
            if (isArray(pl[i])) {
              ps += i + ':[' + unParse(pl[i]) + ']';
            }
            else {
              ps += i + ':{' + unParseKeyValuePair(pl[i]) + '}';
            }
          }
          else {
            ps += ' ' + i + ':' + pl[i];
          }
        }
        return ps;
      }

  };
})();

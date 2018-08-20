// Pounce Javascript runtime interpreter

// run expects a parsed program list (pl).
// a stack that usually would be empty, but may be primed with an existing state
// a dictionary of words.
// and optionaly a history array to record stack and pl state
function run(pl, stack, words, record_histrory = false) {
  var term;
  var num;
  halt = false;
  while (pl.length > 0 && !halt) {
    term = pl.shift();
    if (typeof term === 'string' && isArray(words[term])) {
      console.log('unquote list ', stack, term, pl);
      pl = words[term].concat(pl);
      console.log('post-unquote ', stack, pl);
    }
    else if (typeof term === 'string' && words[term] && words[term].fn && typeof words[term].fn === 'function') {
      console.log('pre-execute ', stack, term, pl);
      if (record_histrory !== false) {
        record_histrory.unshift({stack:cloneItem(stack).reverse(), term:term, pl:cloneItem(pl).reverse()});
      }
      [stack, pl=pl] = words[term].fn(stack, pl);
      console.log('post-execute ', stack, pl );
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
          record_histrory[0] = {stack:cloneItem(stack).reverse(), pl:cloneItem(pl).reverse()};
        }
      }
    }
  }
  return stack;
}

function unParse (pl) {
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

function unParseKeyValuePair(pl) {
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

function isArray(candidate) {
  return Array.isArray(candidate);
}

function isNumber (value) {
  return typeof value === 'number' && isFinite(value);
}

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
  'halt': {fn: function(s) {
    halt = true;
    return [s];
  }},
  'def': {fn: function(s) {
    const key = s.pop();
    const fn = s.pop();
    words[key] = fn;
    return [s];
  }},
  'str-first': {fn: function(s) {
    const str = s.pop();
    const first = str.slice(0, 1);
    const last_part = str.slice(1);
    s.push(last_part, first);
    return [s];
  }},
  'str-last': {fn: function(s) {
    const str = s.pop();
    const last = str.slice(-1);
    const first_part = str.slice(0, -1);
    s.push(first_part, last);
    return [s];
  }},
  'str-length': {fn: function(s) {
    const str = s.pop();
    s.push(str.length);
    return [s];
  }},
  'str-append': {fn: function(s) {
    const str = s.pop();
    s[s.length - 1] = s[s.length - 1] + str;
    return [s];
  }},
  'push': {fn: function(s) {
    const item = s.pop();
    const top = s.length - 1;
    const list = s[top];
    list.push(item);
    return [s];
  }},
  'pop': {fn: function(s) {
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
  'apply': {fn: function(s, pl) {
    const block = s.pop();
    if (isArray(block)) {
      pl = block.concat(pl);
    }
    else {
      pl.unshift(block);
    }
    return [s, pl];
  }},
  'un-apply': {fn: function(s, pl) {
    const item = s.pop();
    if (isArray(item)) {
      pl = [item].concat(pl);
    }
    else {
      pl.unshift([item]);
    }
    return [s, pl];
  }},
  'dip': {fn: function(s, pl) {
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
  'dip2': {fn: function(s, pl) {
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
  'drop': {fn: function(s) {
    s.pop();
    return [s];
  }},
  'dup': {fn: function(s) {
    const top = s.length - 1;
    const a = cloneItem(s[top]);
    s.push(a);
    return [s];
  }},
  'dup2': {fn: function(s) {
    const top = s.length - 1;
    const a = cloneItem(s[top]);
    const b = cloneItem(s[top - 1]);
    s.push(b, a);
    return [s];
  }},
  'swap': {fn: function(s) {
    const a = s.pop();
    const b = s.pop();
    s.push(a, b);
    return [s];
  }},
  '+': {fn: function(s) {
    const a = s.pop();
    const b = s.pop();
    s.push(a + b);
    return [s];
  }},
  '-': {fn: function(s) {
    const a = s.pop();
    const b = s.pop();
    s.push(b - a);
    return [s];
  }},
  '/': {fn: function(s) {
    const a = s.pop();
    const b = s.pop();
    s.push(b / a);
    return [s];
  }},
  '*': {fn: function(s) {
    const a = s.pop();
    const b = s.pop();
    s.push(a * b);
    return [s];
  }},
  'depth': {fn: function(s, pl) {
    s.push(s.length);
    return [s];
  }},
  'n*': {fn: function(s, pl) {
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
  '==': {fn: function(s) {
    const a = s.pop();
    const b = s.pop();
    s.push(a === b);
    return [s];
  }},
  '>': {fn: function(s) {
    const a = s.pop();
    const b = s.pop();
    s.push(b > a);
    return [s];
  }},
  '>=': {fn: function(s) {
    const a = s.pop();
    const b = s.pop();
    s.push(b >= a);
    return [s];
  }},
  '<': {fn: function(s) {
    const a = s.pop();
    const b = s.pop();
    s.push(b < a);
    return [s];
  }},
  '<=': {fn: function(s) {
    const a = s.pop();
    const b = s.pop();
    s.push(b <= a);
    return [s];
  }},
  'and': {fn: function(s) {
    const a = s.pop();
    const b = s.pop();
    s.push(b && a);
    return [s];
  }},
  'or': {fn: function(s) {
    const a = s.pop();
    const b = s.pop();
    s.push(b || a);
    return [s];
  }},
  'not': {fn: function(s) {
    const a = s.pop();
    s.push(!a);
    return [s];
  }},
  'bubble-up': {fn: function(s) {
    const i = s.pop();
    const item = s.splice(-i-1, 1);
    s.push(item[0]);
    return [s];
  }},
  'get': {fn: function(s) {
    const key = s.pop();
    const rec = cloneItem(s[s.length - 1]);
    s.push(rec[key])
    return [s];
  }},
  'set': {fn: function(s) {
    const key = s.pop();
    const value = s.pop();
    let rec = s[s.length - 1];
    rec[key] = value;
    return [s];
  }},
  'case': {fn: function(s, pl) {
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
  'if': {fn: function(s, pl) {
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
  'if-else': {fn: function(s, pl) {
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
  'count-down': ['dup', 1, '-', [ 'dup', 1, '-', 'count-down' ], 'if'],
  'fact': ['count-down', 'n*']
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

// Pounce runtime interpreter

// run expects the a program list (pl) in list form,
// a stack that usually would be empty, but may be primed with an existing state
// and a dictionary of words.
function run(pl, stack, words) {
  var term;
  var num;
  while (pl.length > 0) {
    term = pl.shift();
    if (typeof term === 'string' && typeof words[term] === 'function') {
      console.log('pre-execute ', stack, term, pl);
      [stack, pl=pl] = words[term](stack, pl);
      console.log('post-execute ', stack, pl);
    }
    else if (typeof term === 'string' && typeof words[term] === 'object') {
      console.log('unquote list ', stack, term, pl);
      pl = words[term].concat(pl);
      console.log('post-unquote ', stack, pl);
    }
    else {
      num = tryConvertToNumber(term);
      if (isArray(term) || !isNumber(num)) {
        stack.push(term);
      }
      else {
        stack.push(num);
      }
    }
  }
  return stack;
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


var stack = [];
var words = {
  'def': function(s) {
    const key = s.pop();
    const fn = s.pop();
    words[key] = fn;
    return [s];
  },
  'split-last': function(s) {
    const str = s.pop();
    const last = str.slice(-1);
    const first_part = str.slice(0, -1);
    s.push(first_part, last);
    return [s];
  },
  'length': function(s) {
    const str = s.pop();
    s.push(str.length);
    return [s];
  },
  'push': function(s) {
    const item = s.pop();
    const top = s.length - 1;
    const list = s[top];
    list.push(item);
    return [s];
  },
  'pop': function(s) {
    const top = s.length - 1;
    const list = s[top];
    const item = list.pop();
    s.push(item);
    return [s];
  },
  'dup': function(s) {
    const top = s.length - 1;
    const a = s[top];
    s.push(a);
    return [s];
  },
  'dup2': function(s) {
   const top = s.length - 1;
    const a = s[top];
    const b = s[top - 1];
    s.push(b, a);
    return [s];
  },
  'swap': function(s) {
    const a = s.pop();
    const b = s.pop();
    s.push(a, b);
    return [s];
  },
  'drop': function(s) {
    s.pop();
    return [s];
  },
  '+': function(s) {
    const a = s.pop();
    const b = s.pop();
    s.push(a + b);
    return [s];
  },
  '-': function(s) {
    const a = s.pop();
    const b = s.pop();
    s.push(b - a);
    return [s];
  },
  '/': function(s) {
    const a = s.pop();
    const b = s.pop();
    s.push(b / a);
    return [s];
  },
  '*': function(s) {
    const a = s.pop();
    const b = s.pop();
    s.push(a * b);
    return [s];
  },
  'n*': function(s, pl) {
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
  },
  '==': function(s) {
    const a = s.pop();
    const b = s.pop();
    s.push(a === b);
    return [s];
  },
  '>': function(s) {
    const a = s.pop();
    const b = s.pop();
    s.push(b > a);
    return [s];
  },
  '>=': function(s) {
    const a = s.pop();
    const b = s.pop();
    s.push(b >= a);
    return [s];
  },
  '<': function(s) {
    const a = s.pop();
    const b = s.pop();
    s.push(b < a);
    return [s];
  },
  '<=': function(s) {
    const a = s.pop();
    const b = s.pop();
    s.push(b <= a);
    return [s];
  },
  'case': function(s, pl) {
    const case_record = s.pop();
    const expression = s.pop();
    if (case_record[expression]) {
      if (isArray(case_record[expression])) {
        pl = case_record[expression].concat(pl);
      }
      else {
        pl.unshift(case_record[expression]);
      }
    }
    return [s, pl];
  },
  'if': function(s, pl) {
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
  },
  'if-else': function(s, pl) {
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
  },
  'count-down': ['dup', 1, '-', [ 'dup', 1, '-', 'count-down' ], 'if'],
  'fact': ['count-down', 'n*']
};


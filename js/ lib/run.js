


function run(pl, stack, words) {
  var term;
  var num;
  while (pl.length > 0) {
    [term, pl] = getNextGrouping(pl);
    if (typeof term === 'string' && typeof words[term] === 'function') {
      console.log('pre-execute ', stack, term, pl);
      [stack, pl=pl] = words[g](stack, pl);
      console.log('post-execute ', stack, pl);
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
  if (isNumber(parseFloat(w))) {
    return parseFloat(w);
  }
  else if (isNumber(parseInt(w, 10))) {
    return parseInt(w, 10);
  }
  else {
    return w;
  }
}


var stack = [];
var words = {
  'dup': function(s) {
    var a = s.pop();
    s.push(a, a);
    return [s];
  },
  '+': function(s) {
    var a = s.pop();
    var b = s.pop();
    s.push(a + b);
    return [s];
  },
  '-': function(s) {
    var a = s.pop();
    var b = s.pop();
    s.push(b - a);
    return [s];
  },
  '*': function(s) {
    var a = s.pop();
    var b = s.pop();
    s.push(a * b);
    return [s];
  },
  'n*': function(s, pl) {
    if (s.length >= 2) {
      let a = s.pop();
      let b = s.pop();
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
    var a = s.pop();
    var b = s.pop();
    s.push(a === b);
    return [s];
  },
  'if': function(s, pl) {
    var then_block = s.pop();
    var expression = s.pop();
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
    var else_block = s.pop();
    var then_block = s.pop();
    var expression = s.pop();
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
  'count-down': ['dup', 1, '-', [ 'dup', 1, '-', 'count-down' ]. 'if'],
  'fact': ['count-down', 'n*']
};


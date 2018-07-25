let runtime_tests = [
  ['9 7 + 2.5 *', [40]],
  ['9 7 + 2.5 /', [6.4]],
  ['9 7 2.4 +', [9, 9.4]],
  ['a 7 2.4 -', ['a', 4.6]],
  ['9 7 swap', [7, 9]],
  ['1 2 3 swap', [1, 3, 2]],
  ['1 2 3 dup', [1, 2, 3, 3]],
  ['9 7 swap dup', [7, 9, 9]],
  ['1 {1:one 2:two} case', ['one']],
  ['alpha {beta:b alpha:a} case', ['a']],
  ['[0] {0:[wow] +:[555]} case', ['wow']],
  ['[+] {0:[wow] +:[555]} case', [555]],
  ['2 6 dup2', [2, 6, 2, 6]],
  ['abc str-last', ['ab', 'c']],
  ["'abc ' str-last", ['abc', ' ']],
  ["'abc ' str-first", ['bc ', 'a']],
  ['abcdef str-length', [6]],
  ['"1a1" str-length', [3]],
  ['[a 1] 3 push', [['a', 1, 3]]],
  ['[a 1 3] pop', [['a', 1], 3]],
  ['[] str-length', [0]],
  ['[[]] str-length', [1]],
  ['[a b 5] str-length', [3]],
  ['7 [dup +] apply', [14]],
  ['[B] [A] dip', ['A', ['B']]],
  ['[C] [B] [A] dip2', ['A', ['C'], ['B']]],
  ['3 [A] [B] [2 +] dip2', [5, ['A'], ['B']]],
  ['[A] apply', ['A']],
  ['A un-apply', [['A']]],
  ['1 1 [dup2 +] dup dip dup dip', [1, 1, 2, 3, ['dup2', '+']]],
  ['1 1 15 [dup2 +] dup dip2 swap 1 - swap dup dip2', [1, 1, 2, 3, 14, ['dup2', '+']]],
  ['[ dup 0 > [1 - swap dup dip2 swap repeat] [drop drop] if-else ] [repeat] def', []],
  ['1 [3 +] 6 repeat', [19]],
  ['', []]
];

console.log('Starting runtime tests:');
let RTtestCount = 0;
let RTtestsFailed = 0;
runtime_tests.forEach((test, i) => {
    const ps = test[0];
    const expected_stack = test[1];
    
    //console.log('starting parse test for: ', ps);
    const result_pl = run(parse(ps), [], words);
    RTtestCount += 1;
    if (!deepCompare(result_pl, expected_stack)) {
        RTtestsFailed += 1;
        console.log(result_pl, ' expected:', expected_stack);
        console.log('---- Failed parse test for: ', ps);
        runtime_tests[i][2] = false;
        runtime_tests[i][3] = result_pl;
    }
    else {
        runtime_tests[i][2] = true;
    }
});

if (RTtestsFailed === 0) {
    console.log('All', RTtestCount, 'tests passed.');
}

function deepCompare () {
  var i, l, leftChain, rightChain;

  function compare2Objects (x, y) {
    var p;

    // remember that NaN === NaN returns false
    // and isNaN(undefined) returns true
    if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
         return true;
    }

    // Compare primitives and functions.
    // Check if both arguments link to the same object.
    // Especially useful on the step where we compare prototypes
    if (x === y) {
        return true;
    }

    // Works in case when functions are created in constructor.
    // Comparing dates is a common scenario. Another built-ins?
    // We can even handle functions passed across iframes
    if ((typeof x === 'function' && typeof y === 'function') ||
       (x instanceof Date && y instanceof Date) ||
       (x instanceof RegExp && y instanceof RegExp) ||
       (x instanceof String && y instanceof String) ||
       (x instanceof Number && y instanceof Number)) {
        return x.toString() === y.toString();
    }

    // At last checking prototypes as good as we can
    if (!(x instanceof Object && y instanceof Object)) {
        return false;
    }

    if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
        return false;
    }

    if (x.constructor !== y.constructor) {
        return false;
    }

    if (x.prototype !== y.prototype) {
        return false;
    }

    // Check for infinitive linking loops
    if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
         return false;
    }

    // Quick checking of one object being a subset of another.
    // todo: cache the structure of arguments[0] for performance
    for (p in y) {
        if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
            return false;
        }
        else if (typeof y[p] !== typeof x[p]) {
            return false;
        }
    }

    for (p in x) {
        if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
            return false;
        }
        else if (typeof y[p] !== typeof x[p]) {
            return false;
        }

        switch (typeof (x[p])) {
            case 'object':
            case 'function':

                leftChain.push(x);
                rightChain.push(y);

                if (!compare2Objects (x[p], y[p])) {
                    return false;
                }

                leftChain.pop();
                rightChain.pop();
                break;

            default:
                if (x[p] !== y[p]) {
                    return false;
                }
                break;
        }
    }

    return true;
  }

  if (arguments.length < 1) {
    return true; //Die silently? Don't know how to handle such case, please help...
    // throw "Need two or more arguments to compare";
  }

  for (i = 1, l = arguments.length; i < l; i++) {

      leftChain = []; //Todo: this can be cached
      rightChain = [];

      if (!compare2Objects(arguments[0], arguments[i])) {
          return false;
      }
  }

  return true;
}
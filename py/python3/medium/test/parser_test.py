#from ./../pounce import parser

parser_tests = [
  ['hello world', ['hello', 'world'],False,[]],
  ['"hello world"', ['hello world'],False,[]],
  ['abc def eee ', ['abc', 'def', 'eee'],False,[]],
  [' abc def  eee ', ['abc', 'def', 'eee'],False,[]],
  ['"abc def" "123 456"', ['abc def', "123 456"],False,[]],
  ['abc "def" "123 " 456', ['abc', 'def', "123 ", 456],False,[]],
  ['5.5 2.1 + 456', [5.5, 2.1, '+', 456],False,[]],
  ['[5.5 2.1] .456 +', [[5.5, 2.1], 0.456, '+'],False,[]],
  ['[[5.5 2.1] [1 2 3]] .456 +', [[[5.5, 2.1], [1, 2, 3]], 0.456, '+'],False,[]],
  [' [ [5.5 2.1]  [1 2 3] ]  .456  +   ', [[[5.5, 2.1], [1, 2, 3]], 0.456, '+'],False,[]],
  ['[["5.5" 2.1] [1 "2" 3]] .456 +', [[['5.5', 2.1], [1, '2', 3]], 0.456, '+'],False,[]],
  [' [ ["5.5" 2.1]  [1 "2" "3 3"] ]  .456  +   ', [[['5.5', 2.1], [1, '2', '3 3']], 0.456, '+'],False,[]],
  ['[4 5 +] ', [[4, 5, '+']],False,[]],
  ['[4 5 +] [4 5 +]', [[4, 5, '+'], [4, 5, '+']],False,[]],
  ['[4 5 +] [4 5 +] [4 5 +]', [[4, 5, '+'],[4, 5, '+'],[4, 5, '+']],False,[]],
  ['[4 5 +] foo [4 5 +]', [[4, 5, '+'], 'foo', [4, 5, '+']],False,[]],
  ['{a:5.5 b:2.1} .456 +', [{"a":5.5, "b":2.1}, 0.456, '+'],False,[]],
  [' {a:5.5 b:2.1} .456 +', [{"a":5.5, "b":2.1}, 0.456, '+'],False,[]],
  ['{ a:5.5 b:2.1} .456 +', [{"a":5.5, "b":2.1}, 0.456, '+'],False,[]],
  [' { a:5.5  b:2.1 } .456 + { a:5.5  b:2.1 } ', [{"a":5.5, "b":2.1}, 0.456, '+', {"a":5.5, "b":2.1}],False,[]],
  ['{a:[1 2 3] 3b_g:{a:1 y:3}}', [{"a":[1, 2, 3], "3b_g":{"a":1, "y":3}}],False,[]],
  ['[{a:[1 2 3] 3b_g:{a:1 y:3}} abc] cdef', [[{"a":[1, 2, 3], "3b_g":{"a":1, "y":3}}, 'abc'], 'cdef'],False,[]],
  ['.0.', ['.0.'],False,[]],
  ['.0', [0],False,[]],
  ['0.', [0],False,[]],
  ['.0..', ['.0..'],False,[]],
  ['5...', ['5...'],False,[]],
  ['5.', [5],False,[]],
  ['.5', [0.5] ,False,[]]
]

def isArray(a):
    return isinstance(a, (list,))

def isRecord(a):
    return isinstance(a, (dict,))

def cmp_elements(a, b):
    res = True
    for key, ele_a in enumerate(a):
        #print("debug cmp", ele_a, b[key])
        if isArray(ele_a):
            res &= cmp_elements(ele_a, b[key])
        elif isRecord(ele_a):
            res &= cmp_records(ele_a, b[key])
        else:
            #print("debug cmp ==", (ele_a == b[key]), res)
            if ele_a == b[key]:
                res &= True
            else:
                res = False
    return res;

def cmp_records(a, b):
    res = True
    for key, ele_a in a.items():
        if isArray(ele_a):
            res &= cmp_elements(ele_a, b[key])
        elif isRecord(ele_a):
            res &= cmp_records(ele_a, b[key])
        else:
            if ele_a == b[key]:
                res &= True
            else:
                res = False
    return res;

def runTests (parser):
    print('Starting parser tests:');
    testCount = 0;
    testsFailed = 0;
    for i,test in enumerate(parser_tests):
        ps = test[0];
        expected_stack = test[1];
        
        #print('starting parse test for: ', ps);
        result_pl = parser.parse(ps)
        testCount += 1
        if not cmp_elements(result_pl, expected_stack):
            testsFailed += 1
            print(result_pl, ' expected:', expected_stack)
            print('---- Failed parse test for: ', ps)
            parser_tests[i][2] = False
            parser_tests[i][3] = result_pl
        
        else:
            parser_tests[i][2] = True
        
    
    
    if testsFailed == 0:
        print('All', testCount, 'tests passed.');
    


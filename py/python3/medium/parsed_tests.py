from pounce import runtime as pounce

tests = [
#    [[2, 3, '+'], [5]], [[5, 2, '*'], [10]], [[6, 'dup', '*'], [36]], [[0, [6, 2, '*'], 42, 'if-else'], [42]], [[1, [6, 2, '*'], 42, 'if-else'], [12]], [[1, [2, 0, [3, 3, '*'], [2, 1, '+'], 'if-else', 7, '*', '+'], 'if'], [23]], [[1, [2.5, 0, [3, 2.999, '*'], [2, 1, '+'], 'if-else', 7.01, '*', '+'], 'if'], [23.53]], [[[1, 3, 2], [1, 3, 2], '=='], [True]], [[[1, 3, 2], [1, 3, 2], '==', 'true', 'false', 'if-else'], [True]], [[1, 1, 'if'], [1]], [['true', 5, 'if'], [5]], [['true', 'true', 'if'], [True]], [[0, 0, 'if'], []], [[10, 'count-down'], [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]], [[3, 'count-down'], [3, 2, 1]], [[1, 'count-down'], [1]], [[5, 'fact'], [120]], [['a', 1, 2, 3, 4, 'n*'], ['a', 24]], [['hello world', 1, 2, 3, 4, 'n*'], ['hello world', 24]], [["hello world 5 o'clock", 1, 2, 3, 4, 'n*'], ["hello world 5 o'clock", 24]], [['hello world 5" of rain', 4, 'count-down', 'n*'], ['hello world 5" of rain', 24]], [['hello world 5" of rain', 4, 'count-down', 'n*', 'hello world 5" of rain'], ['hello world 5" of rain', 24, 'hello world 5" of rain']], [['clock', 1, 2, 3, 4, 'n*'], ['clock', 24]], [[{'a': 2, 'b': 3}], [{'a': 2, 'b': 3}]], [[{'a': 2, 'b': 4}, 'a', 'get', 'swap', 'b', 'get', 'swap', 'drop'], [2, 4]], [[1, {'a': 2, 'b': 4}, 'a', 'get', 3, '*', 'swap', 'b', 'get', 'swap', 'drop'], [1, 6, 4]], [[1, {'a': 'hello world', 'b': 4}, 'a', 'get', 'swap', 'b', 'get', 'swap', 'drop'], [1, 'hello world', 4]], [[1, {'a': 'hello world', 'b': 4}, 'a', 'get', 'swap', 'b', 'get', 'swap', 'drop'], [1, 'hello world', 4]], [[5, {'a': 'hello', 'b': 'world'}, 'a', 'get', 'swap', 'b', 'get', 'swap', 'drop'], [5, 'hello', 'world']], [[5, {'a': 'hello', 'b': 'world'}, 'a', 'get', 'swap', 'b', 'get', 'swap', 'drop'], [5, 'hello', 'world']], [[1, {'a': 2, 'b': 4}, 'a', 'get', 3, '*', 'swap', 'b', 'get', 'swap', 'drop'], [1, 6, 4]], [[1, {'a': 2, 'b': 4}, 'a', 'get', 3, '*', 'swap', 'b', 'get', 'swap', 'drop'], [1, 6, 4]],
#    [[1, {'a': 2, 'b': 4}, 'a', 'get', 3, '*', 'a', 'set', 'b', 'get', 2, '*', 'b', 'set'], [1, {'a': 6, 'b': 8}]]
#    , [[1, {'a': 2, 'b': 4}, 'a', [3, '*'], 'app', 'b', [2, '*'], 'app'], [1, {'a': 6, 'b': 8}]]
    [[3, 4, 5, [4, '-'], 'dip'], [3, 0, 5]]
    ]


pounce.words['count-down'] = ['dup', 1, '-', [ 'dup', 1, '-', 'count-down' ], 'if']
pounce.words['fact'] = ['count-down', 'n*']


def cmpLists(a, b):
    same = True
    if len(a) == len(b):
        for i in range(len(a)):
            if a[i] != b[i]:
                same = False
    else:
        same = False
    return same

# test runner
def runTests(debug = False):
    print('Starting tests:')
    testCount = 0
    testsFailed = 0
    for test in tests:
        ps = test[0]
        expected_stack = test[1]
        result_stack = pounce.run(ps, debug)
        testCount += 1
        if not cmpLists(result_stack, expected_stack):
            testsFailed += 1
            print(result_stack, ' expected:', expected_stack)
            print('---- Failed test for: ', ps)
            break
    if testsFailed == 0:
        print('All', testCount, 'tests passed.')
        return True
    return False

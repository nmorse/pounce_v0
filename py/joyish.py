#import board
#import pulseio
# from analogio import AnalogIn
#from digitalio import DigitalInOut, Direction, Pull
#import time
# import random

import joyish_tests as testing
import joyish_parser as jp

    
# Digital input with pullup
#red = DigitalInOut(board.D13)
red = {}
red['value'] = 0
#red.direction = Direction.OUTPUT
#green = DigitalInOut(board.D2)
#green.direction = Direction.OUTPUT

# ToDo:
#       ui/repl

def _readIO(s, pl):
    global red
    s.append({'red': red['value']})
    return [s, pl]
def _writeIO(s, pl):
    global red
    a = s.pop()
    red['value'] = a['red']
    return [s, pl]
def _dup(s, pl):
    a = s.pop()
    s.append(a)
    s.append(a)
    return [s, pl]
def _add(s, pl):
    a = s.pop()
    b = s.pop()
    s.append(a + b)
    return [s, pl]
def _sub(s, pl):
    a = s.pop()
    b = s.pop()
    s.append(b - a)
    return [s, pl]
def _prod(s, pl):
    a = s.pop()
    b = s.pop()
    s.append(a * b)
    return [s, pl]
def _n_prod(s, pl):
    if len(s) >= 2:
        a = s.pop()
        b = s.pop()
        if isNumber(a) and isNumber(b):
            s.append(a * b)
            pl.insert(0, 'n*')
            return [s, pl]
        else:
            s.append(b)
            s.append(a)
    return [s, pl];
def _eq(s, pl):
    a = s.pop()
    b = s.pop()
    s.append(a == b)
    return [s, pl]
def _ift(s, pl):
    then_block = s.pop()
    expression = s.pop()
    if expression:
        if isArray(then_block):
            pl = then_block+pl
        else:
            pl.insert(0, then_block)
    return [s, pl]
def _ifte (s, pl):
    else_block = s.pop()
    then_block = s.pop()
    expression = s.pop()
    if expression:
        if isArray(then_block):
            #print(then_block)
            pl = then_block+pl
        else:
            pl.insert(0, then_block)
    else:
        if isArray(else_block):
            pl = else_block+pl
        else:
            pl.insert(0, else_block)
    return [s, pl]
def _get(s, l): # (dict key -- dict value)
    key = s.pop()
    dictionary = s[-1]
    s.append(dictionary[key])
    return [s, l]
def _set(s, l): # (dict value key -- dict)
    key = s.pop()
    value = s.pop()
    dictionary = s[-1]
    dictionary[key] = value
    return [s, l]
def _apply(s, l): # (dict key fun -- dict)
    fun = s.pop()
    key = s[-1]
    s, l = _get(s, l)
    s = run(fun, s)
    s.append(key)
    s, l = _set(s, l)
    return [s, l]
def _swap(s, l):
    a = s.pop()
    b = s.pop()
    s.append(a)
    s.append(b)
    return [s, l]
def _drop(s, l):
    a = s.pop()
    return [s, l]

words = {
  '>io': _readIO,
  '<io': _writeIO,
  'dup': _dup,
  '+': _add,
  '-': _sub,
  '*': _prod,
  'n*': _n_prod,
  '==': _eq,
  'if': _ift,
  'if-else': _ifte,
  'get': _get,
  'set': _set,
  'app': _apply,
  'swap': _swap,
  'drop': _drop,
  'toggle': '[0 1 if-else] app',
  'count-down': 'dup 1 - [ dup 1 - count-down ] if',
  'fact': 'count-down n*'
}

#program_list = '1 redLED 1 greenLED'
#program_list = '1 redLED 1.5 0 1--redLED timeOut'
#program_list = ' 1 redLED 1 0 1--redLED if-then 1 1 1--redLED if-then'
#program_list = ' 0 redLED 1 1 1--redLED if-then'
#program_list = ' 1 0 1--redLED 1 1--redLED if-then-else'

def isTrue(e):
    if e != 0 and e != False and e != 'False' and e != 'false':
        return True
    return False

def isValue(e, fun):
    return (isinstance(e, int)
            or isinstance(e, float)
            or isinstance(e, bool)
            or (isinstance(e, str) and not e in fun.keys()))

def isNumber(e):
    return isinstance(e, int) or isinstance(e, float)

def isArray(a):
    return isinstance(a, (list,))

def isDict(a):
    return isinstance(a, (dict,))

#from inspect import isfunction
def isfunction(candidate):
    return not (isinstance(candidate, str) or isinstance(candidate, (list,)))

#def number_or_str(s):
#    try:
#        return int(s)
#    except ValueError:
#        try:
#            return float(s)
#        except ValueError:
#            if s == 'True':
#                return 'True'
#            if s == 'False':
#                return 'False'
#            return s

def cmpLists(a, b):
    same = True
    if len(a) == len(b):
        for i in range(len(a)):
            if a[i] != b[i]:
                same = False
    else:
        same = False
    return same


def runScript(program_script, vs):
    pl = jp.parse(program_script)
    return run(pl, vs)

def run(pl, vs):
    global words
    while pl != None and len(pl) > 0:
        next = pl[0];
        pl = pl[1:]
        print(vs, next)
        if isValue(next, words) or isArray(next) or isDict(next):
            if next == 'true':
                vs.append(True)
            elif next == 'false':
                vs.append(False)
            else:
                vs.append(next)
        elif next in words.keys():
            #print(vs, next, pl)
            if isfunction(words[next]):
                (vs, pl) = words[next](vs, pl)
            else:
                if isinstance(words[next], str):
                    pl = jp.parse(words[next]) + pl
                else:
                    pl = words[next] + pl
        else:
            print('unknown term or word:', next)
    return vs

print('so far so good... ready to:')

# tests
def runTests():
    print('Starting tests:')
    testCount = 0
    testsFailed = 0
    for test in testing.tests:
        ps = test[0]
        expected_stack = test[1]
        result_stack = runScript(ps, [])
        testCount += 1
        if not cmpLists(result_stack, expected_stack):
            testsFailed += 1
            print(result_stack, ' expected:', expected_stack)
            print('---- Failed test for: ', ps)
            break
    if testsFailed == 0:
        print('All', testCount, 'tests passed.')

runTests()

#while True: #loop forever
    #print(red)
    #run(['>io', 'red', 'toggle', '<io'], [])
    #print (red)
    #rs = read_rotor()
    #if rs == 1 or rs == -1:
    #    stack.append(str(rs))
    #    stack.append('rotary')
    #    run(stack, words)
    

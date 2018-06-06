import time
# the pounce language runtime

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
def _gt(s, pl):
    a = s.pop()
    b = s.pop()
    s.append(b > a)
    return [s, pl]
def _lt(s, pl):
    a = s.pop()
    b = s.pop()
    s.append(b < a)
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
  'dup': _dup,
  '+': _add,
  '-': _sub,
  '*': _prod,
  'n*': _n_prod,
  '==': _eq,
  '<': _lt,
  '>': _gt,
  'if': _ift,
  'if-else': _ifte,
  'get': _get,
  'set': _set,
  'app': _apply,
  'swap': _swap,
  'drop': _drop
}


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


#def runScript(program_script, vs):
#    pl = jp.parse(program_script)
#    return run(pl, vs)

def run(pl, debug = False, vs = []):
    global words
    while pl != None and len(pl) > 0:
        next = pl[0];
        pl = pl[1:]
        if debug:
            print('about to', vs, next)
            time.sleep(1)
        
        if isValue(next, words) or isArray(next) or isDict(next):
            if next == 'true':
                vs.append(True)
            elif next == 'false':
                vs.append(False)
            else:
                vs.append(next)
        elif next in words.keys():
            if debug:
                print('   ---  applying ', vs, next, pl)
                time.sleep(1)
            
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


import time
# the pounce language runtime

def run(pl, debug = False, test_value_stack = []):
    global words
    vs = []
    while pl != None and len(pl) > 0:
        next = pl[0];
        pl = pl[1:]
        if debug:
            print('about to', vs, next)
            time.sleep(0.3)
        
        if isValue(next, words) or isArray(next) or isRecord(next):
            if next == 'true':
                vs.append(True)
            elif next == 'false':
                vs.append(False)
            else:
                vs.append(next)
        elif next in words.keys():
            if debug:
                print('applying', vs, next, pl)
                time.sleep(0.3)
            
            if isfunction(words[next]):
                (vs, pl) = words[next](vs, pl)
            elif isinstance(words[next], str):
                pl = jp.parse(words[next]) + pl
            elif isRecord(words[next]):
                if 'args' in words[next].keys():
                    arg_rec = {}
                    while len(words[next].args) > 0:
                        arg_rec[words[next].args.pop()] = s.pop()
                    (vs, pl) =  words[next].func(vs, pl, arg_rec)
            else:
                pl = words[next] + pl
        else:
            print('unknown term or word:', next)
    return vs

def isValue(e, fun):
    return (isinstance(e, int)
            or isinstance(e, float)
            or isinstance(e, bool)
            or (isinstance(e, str) and not e in fun.keys()))

def isNumber(e):
    return isinstance(e, int) or isinstance(e, float)

def isArray(a):
    return isinstance(a, (list,))

def isRecord(a):
    return isinstance(a, (dict,))

# from inspect import isfunction
def isfunction(candidate):
    return not (isinstance(candidate, str) or isinstance(candidate, (list,)))



def _halt(s, pl):
    global halt
    halt = True
    return [s, pl]
def _def(s, pl):
    global words
    # usage: [words that the define a new-function] new-funcion-name def
    new_word = s.pop()
    new_definition = s.pop()
    words[new_word] = new_definition
    return [s, pl]
def _define(s, pl):
    global words
    # [param1 param2] [words the define a new-function] new-funcion define
    new_word = s.pop()
    new_definition = s.pop()
    new_params = s.pop()
    words[new_word] = new_definition
    return [s, pl]
def _str_first(s, pl):
    a_str = s[-1]
    s.append(a_str[0:1])
    return [s, pl]
def _str_last(s, pl):
    a_str = s[-1]
    s.append(a_str[-2:-1])
    return [s, pl]
def _str_length(s, pl):
    a_str = s.pop()
    s.append(len(a_str))
    return [s, pl]
def _str_append(s, pl):
    a_str = s.pop()
    s[-1] = s[-1] + a_str
    return [s, pl]
def _push(s, pl):
    item = s.pop()
    list = s[-1]
    list.push(item)
    return [s, pl]
def _pop(s, pl):
    list = s[-1]
    if isArray(list):
      #item = cloneItem(list.pop())
      item = list.pop()
      s.push(item)
    else:
      runtime.log({'word':'pop', 'error':"unable to 'pop' from non-Array"})
    return [s, pl]
def _dup(s, pl):
    a = s[-1]
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
    #l.insert(0, ['get', fun, key, 'set'])
    l.insert(0, 'set')
    l.insert(0, key)
    l = fun+l                                     # concat arrays so that the program list (l) has words on it, not a list
    l.insert(0, 'get')
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
def _dip(s, l):
    f = s.pop()
    a = s.pop()
    l.insert(0, a)
    l = f+l
    return [s, l]

words = {
  'halt': _halt,
  'def': _def,
  'define': _define,
  'str-first': _str_first,
  'str-last': _str_last,
  'str-length': _str_length,
  'str-append': _str_append,
  'push': _push,
  'pop': _pop,
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
  'drop': _drop,
  'dip': _dip
}


#def runScript(program_script, vs):
#    pl = jp.parse(program_script)
#    return run(pl, vs)


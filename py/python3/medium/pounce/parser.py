
def parse_next(s, i, ls):
    while i < ls and s[i] == ' ':
        i += 1
    if i >= ls:
        return '', i
    
    if s[i] == '"' or s[i] == "'":
        return parse_string(s, i, ls)
    elif s[i] == '{':
        return parse_rec(s, i, ls)
    elif s[i] == '[':
        return parse_list(s, i, ls)
    else:
        return parse_word(s, i, ls)

def number_or_str(s):
    try:
        return int(s)
    except ValueError:
        try:
            return float(s)
        except ValueError:
            if s == 'True':
                return 'True'
            if s == 'False':
                return 'False'
            return s

def parse_word (s, i, ls):
    orig_i = i
    while i < ls and s[i] != ' ' and s[i] != ']' and s[i] != '}':
        i += 1
    word = number_or_str(s[orig_i:i])
    return word, i


def parse_string(s, i_orig, ls):
    i = int(i_orig)
    terminator = s[i]
    i += 1
    word_string = ''
    while i < ls and s[i] != terminator:
        if i+2 < ls and s[i] == '\\' and (s[i+1] == '"' or s[i+1] == "'"):
            i += 2
        else:
            i += 1
    word_string = s[i_orig+1:i].replace('\\', '')
    return word_string, i+1

def parse_key(s, i_orig, ls):
    i = int(i_orig)
    #i += 1
    key_string = ''
    while i < ls and s[i] != ':':
        i += 1
    key_string = s[i_orig:i]
    return key_string, i+1
    
# records (hashes, name-value-pairs or dictionaries)
# e.g. '{a:12 b:"hello world" b-52:band}'
def parse_rec(s, i, ls):
    dict = {}
    i += 1
    while i < ls and s[i] == ' ':
        i += 1
    while i+1 < ls and s[i] != '}':
        #print ('parse_rec', s, i, dict)
        k, i = parse_key(s, i, ls)
        #print ('parse_key', k)
        w, i = parse_next(s, i, ls)
        if k != '' and w != None:
            dict[k] = w
        while i < ls and s[i] == ' ':
            i += 1

    
    return dict, i+1

def parse_list(s, i, ls):
    l = []
    i += 1
    while i+1 < ls and s[i] != ']':
        #print (s, i, l)
        w, i = parse_next(s, i, ls)
        if w != '' and w != None:
            l.append(w)
        
    return l, i+1

def parse(s):
    l = []
    i = 0
    ls = len(s)
    w = ''
    while i < ls:
        #print ('parsing', s, i, ls)
        w, i = parse_next(s, i, ls)
        #print ('got ',w)
        if w != '' and w != None:
            l.append(w)
    
    return l

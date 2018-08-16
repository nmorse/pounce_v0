// Pounce parser
// (^("[^"]*")|^('[^']*')|\s("[^"]*")|\s('[^']*'))*(\s?(//.*)?)$ no nevermind
// Comments (single line) are 'C' type '//' double slash.
// Quoted strings are Javascript like (i.e. either single or double quote)
// List of data or code are square brackets.
// Records (i.e. hash-lists, dictionaries...) are in curly brackets.
// numbers are digits and optionally one decimal point (.) (no scientific notation at this time)
// all else is a word...

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

function parse_next(s, i, ls) {
  while (i < ls && s[i] == ' ') {
    i += 1;
  }
  if (i >= ls) {
    return ['', i];
  }
  
  if (s[i] === '"' || s[i] === "'") {
    return parse_string(s, i, ls);
  }
  else if (s[i] === '{') {
    return parse_dict(s, i, ls);
  }
  else if (s[i] === '[') {
    return parse_list(s, i, ls);
  }
  else {
    return parse_word(s, i, ls)
  }
}

function parse_word (s, i, ls) {
  const orig_i = i;
  while (i < ls && s[i] !== ' ' && s[i] !== '[' && s[i] !== ']' && s[i] !== '{' && s[i] !== '}') {
    i += 1;
  }
  const word = number_or_str(s.substring(orig_i, i));
  return [word, i];
}


function parse_string(s, i_orig, ls) {
  let i = +i_orig;
  const terminator = s[i];
  i += 1;
  let word_string = '';
  while (i < ls && s[i] !== terminator) {
    if (i+2 < ls && s[i] === '\\' && (s[i+1] === '"' || s[i+1] === "'")) {
      i += 2;
    }
    else {
      i += 1;
    }
  }
  word_string = s.substring(i_orig+1, i).replace('\\', '');
  return [word_string, i+1];
}

function parse_key(s, i_orig, ls) {
    let i = i_orig;
    ////i += 1
    let key_string = '';
    while (i < ls && s[i] != ':') {
        i += 1;
    }
    key_string = s.substring(i_orig, i)
    return [key_string, i+1];
}

function parse_dict(s, i, ls) {
  let dict = {};
  let k = '';
  let w = '';
  i += 1;
  while (i < ls && s[i] === ' ') {
    i += 1;
  }
  while (i+1 < ls && s[i] != '}') {
    //print ('parse_dict', s, i, dict)
    [k, i] = parse_key(s, i, ls);
    //print ('parse_key', k)
    [w, i] = parse_next(s, i, ls);
    if (k !== '' && w !== null && typeof w !== undefined) {
      dict[k] = w;
    }
    while (i < ls && s[i] === ' ') {
      i += 1;
    }
  }
  return [dict, i+1];
}

function parse_list(s, i, ls) {
  let l = [];
  i += 1;
  while (i+1 < ls && s[i] != ']') {
    //print (s, i, l)
    [w, i] = parse_next(s, i, ls);
    if (w !== '' && w !== null && typeof w !== undefined) {
      l.push(w);
    }
  }
  return [l, i+1];
}

function parse(s) {
  s = s.replace(/\s/gm, ' ');
  s = s.replace(/\n/gm, ' ');
  
  let l = [];
  let i = 0;
  let ls = s.length;
  let w = '';
  let word_count = 0;
  while (i < ls && word_count < 10000) {
    console.log('parsing--', s, i, ls);
    [w, i] = parse_next(s, i, ls);
    word_count += 1;
    console.log('parse-got',w);
    if (w !== '' && w !== null && typeof w !== undefined) {
      l.push(w);
    }
  }
  return l;
}
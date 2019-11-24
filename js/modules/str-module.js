(function (pounce) {
 'use strict';
 
  if (!pounce) {
    console.error('pounce add-ons must be after the pounce runtime is defined.')
    return;
  }

  function un_decorate_string(str) {
    const last_index = str.length - 1;
    let s = str;
    if (last_index > 0) {
      if (s[0] === "'" && s[last_index] === "'") {
        s = s.slice(1, -1);
        return {decor: "'", str: s};
      }
      if (s[0] === '"' && s[last_index] === '"') {
        s = s.slice(1, -1);
        return {decor: '"', str: s};
      }
      if (s[0] === "`" && s[last_index] === "`") {
        s = s.slice(1, -1);
        return {decor: "`", str: s};
      }
    }
    return {decor:'', str:s};
  }
  let coerse_to_string = (s) => {
    const t = typeof s;
    if (t === 'string') { return s; }
    // return JSON.stringify(s);
    return pounce.unParse([s]);
  }
  
  const str_words = {
    'str-first': {expects: [{desc: 'source', ofType: 'string'}], effects:[1], tests: [
      [`'hello' str-first`, ['ello', 'h']]
      ], desc: 'extract the first character from a string',
      definition: function(stack) {
      const ud = un_decorate_string(stack.pop());
      const first = ud.str.slice(0, 1);
      const last_part = ud.decor + ud.str.slice(1) + ud.decor;
      stack.push(last_part, first);
      return [stack];
    }},
    'str-last': {expects: [{desc: 'source', ofType: 'string'}], effects:[1], tests: [
      [`'hello' str-last`, ['hell', 'o']]
      ], desc: 'extract the last character from a string',
      definition: function(stack) {
      const ud = un_decorate_string(stack.pop());
      const last = ud.str.slice(-1);
      const first_part = ud.decor + ud.str.slice(0, -1) + ud.decor;
      stack.push(first_part, last);
      return [stack];
    }},
    'str-length': {expects: [{desc: 'source string', ofType: 'string'}], effects:[0], tests: [
      [`'hello' str-length`, [5]]
      ], desc: 'lenth of a string',
      definition: function(stack) {
      const ud = un_decorate_string(stack.pop());
      if (ud && typeof ud.str === 'string') { stack.push(ud.str.length); }
      return [stack];
    }},
    'str-append': {expects: [{desc: 'source 1', ofType: 'string'}, {desc: 'source 2', ofType: 'string'}], effects:[-1], tests: [
      [`'hello' ' world' str-append`, ['hello world']]
      ], desc: 'append two strings together',
      definition: function(stack) {
      const ud2 = un_decorate_string(coerse_to_string(stack.pop()));
      const ud1 = un_decorate_string(coerse_to_string(stack.pop()));
      stack.push(ud1.decor + ud1.str + ud2.str + ud1.decor);
      return [stack];
    }},
    'str-split': {expects: [{desc: 's', ofType: 'string'}, {desc: 'delimiter', ofType: 'string'}], effects:[-1], tests: [
      [`'hello' ' ' str-append 'world'`, ['hello world']]
      ], desc: 'splits a string',
      definition: function(stack) {
      const delimPobj = un_decorate_string(coerse_to_string(stack.pop()));
      const strPobj = un_decorate_string(coerse_to_string(stack.pop()));
      stack = [...stack, ...strPobj.str.split(delimPobj.str)];
      return [stack];
    }},
    'str-dequote': {expects: [{desc: 'source 1', ofType: 'string'}], effects:[0], 
      desc: 'remove quotes around a string',
      definition: function(stack) {
      const ud1 = un_decorate_string(coerse_to_string(stack.pop()));
      stack.push(ud1.str);
      return [stack];
    }}
  };
  
  pounce.words = Object.assign(str_words, pounce.words);
  
})((typeof pounce !== 'undefined')? pounce: false);

(function() {
  'use strict';

  var extend = function (destination, source) {
    if (!destination || !source) return destination;
    for (var key in source) {
      if (destination[key] !== source[key])
        destination[key] = source[key];
    }
    return destination;
  };

  const parser_actions = {
    make_pounce_empty: function(input, start, end, elements) {
      return [];
    },
    
    make_pounce_pl: function(input, start, end, elements) {
      var list = [elements[1]];
      elements[2].forEach(function(el) { list.push(el.value) });
      return list;
    },
    
    make_word: function(input, start, end, elements) {
      return input.substring(start, end);
    },
  
    make_map: function(input, start, end, elements) {
      var map = {};
      // console.log('making a map ',  elements.length);
      // console.log('elements ', elements);
      if (elements.length = 6) {
        map[elements[2][0]] = elements[2][1];
        elements[3].elements.forEach(function(el) {
          map[el.elements[2][0]] = el.elements[2][1];
        });
      }
      return map;
    },
  
    make_pair: function(input, start, end, elements) {
      // console.log('making a pair ',  elements.length);
      // console.log('--elements ', elements);
      return [elements[0], elements[4]];
    },
  
    make_string_s: function(input, start, end, elements) {
      return "'" + elements[1].text + "'";
    },
    make_string_d: function(input, start, end, elements) {
      return '"' + elements[1].text + '"';
    },
    make_string_t: function(input, start, end, elements) {
      return '`' + elements[1].text + '`';
    },
  
    make_list: function(input, start, end, elements) {
      var list = [elements[2]];
      elements[3].forEach(function(el) { list.push(el.value) });
      return list;
    },
  
    make_list_empty: function(input, start, end, elements) {
      return [];
    },
  
    make_integer: function(input, start, end, elements) {
      return parseInt(input.substring(start, end), 10);
    },
  
    make_float: function(input, start, end, elements) {
      return parseFloat(input.substring(start, end));
    },
  
    make_ws: function(input, start, end, elements) {
      return null;
    }
  };

  var exported = {parser_actions: parser_actions};

  if (typeof require === 'function' && typeof exports === 'object') {
    extend(exports, exported);
  } else {
    var namespace = typeof this !== 'undefined' ? this : window;
    namespace.parser_actions = exported;
  }
})();

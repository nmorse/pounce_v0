var simple_test = require('./Simple_test');

var actions = {
  make_map: function(input, start, end, elements) {
    var map = {};
    console.log('making a map ',  elements.length);
    console.log('elements ', elements);
    if (elements.length = 7) {
      map[elements[2][0]] = elements[2][1];
      elements[4].elements.forEach(function(el) {
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

  make_string: function(input, start, end, elements) {
    return elements[1].text;
  },

  make_list: function(input, start, end, elements) {
    var list = [elements[1]];
    elements[2].forEach(function(el) { list.push(el.value) });
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

var result = simple_test.parse("{'a':'test', 'b':[11,[],13,\"hi\"], 'c':3.14159, 'p':0, 's': [   ], 'x' : {'a':'a'}}", {actions: actions});
console.log(result);
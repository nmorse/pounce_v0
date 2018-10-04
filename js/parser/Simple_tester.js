var simple_test = require('./Simple_test');

var actions = {
  make_map: function(input, start, end, elements) {
    var map = {};
    console.log('making a map ',  elements.length);
    console.log('elements ', elements);
    if (elements.length = 4) {
      map[elements[1][0]] = elements[1][1];
      elements[2].elements.forEach(function(el) {
        map[el.elements[1][0]] = el.elements[1][1];
      });
    }
    return map;
  },

  make_pair: function(input, start, end, elements) {
    return [elements[0], elements[2]];
  },

  make_string: function(input, start, end, elements) {
    return elements[1].text;
  },

  make_list: function(input, start, end, elements) {
    var list = [elements[1]];
    elements[2].forEach(function(el) { list.push(el.value) });
    return list;
  },

  make_number: function(input, start, end, elements) {
    return parseInt(input.substring(start, end), 10);
  }
};

var result = simple_test.parse("{'a':'test', 'b':[11,12,13], 'c':3, 'p':0}", {actions: actions});
console.log(result);
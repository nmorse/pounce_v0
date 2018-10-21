var simple_test = require('./Simple_test');

var actions = {

  make_sq_string: function(input, start, end, elements) {
    return "'" + elements[1].text.replace("\\", "\\\\").replace("'", "\\'") + "'";
  },
  make_dq_string: function(input, start, end, elements) {
    return "'" + elements[1].text.replace("\\", "\\\\").replace('"', '\\"') + "'";
  },
  make_bt_string: function(input, start, end, elements) {
    return "'" + elements[1].text.replace("\\", "\\\\").replace("`", "\\`") + "'";
  }

};

var result;
result = simple_test.parse("'+'", {actions: actions});
console.log(result);
result = simple_test.parse("' x \\' '", {actions: actions});
console.log(result);
result = simple_test.parse("' + \\\' '", {actions: actions});
console.log(result);
result = simple_test.parse("' * \\\\' '", {actions: actions});
console.log(result);
result = simple_test.parse("' - \\\\\' '", {actions: actions});
console.log(result);
result = simple_test.parse("' ! \\\\\\' '", {actions: actions});
console.log(result);
result = simple_test.parse("' ! \\\\\\\' '", {actions: actions});
console.log(result);
result = simple_test.parse("' ! \\\\\\\\' '", {actions: actions});
console.log(result);
//result = simple_test.parse('\' x \' \'', {actions: actions});
//console.log(result);
//result = simple_test.parse('\' +  \' \'', {actions: actions});
//console.log(result);
result = simple_test.parse('\' * \\\' \'', {actions: actions});
console.log(result);
result = simple_test.parse('\' - \\\\\' \'', {actions: actions});
console.log(result);
result = simple_test.parse('\' ! \\\\\\\' \'', {actions: actions});
console.log(result);
result = simple_test.parse('\' ! \\\\\\\\\' \'', {actions: actions});
console.log(result);
result = simple_test.parse('\' ! \\\\\\\\\\\' \'', {actions: actions});
console.log(result);
result = simple_test.parse("'\'", {actions: actions});
console.log(result);
result = simple_test.parse("''", {actions: actions});
console.log(result);
result = simple_test.parse("'+\'", {actions: actions});
console.log(result);

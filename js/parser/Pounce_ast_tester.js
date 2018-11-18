const Pounce_ast = require('./Pounce_ast');
const Pounce_ast_actions = require('./Pounce_ast_actions');
const Pounce_test = require('../test/canopy_parser_test');
Pounce_test.run_parser_test(Pounce_ast, Pounce_ast_actions.parser_actions);
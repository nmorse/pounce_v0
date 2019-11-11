
const tutorials = ['introduction', 'strings', 'calculate', 'rearrange the stack', 'lists and records', 'higher order words', 'your own words', 'io on canvas'];
const examples = [
  ['', {
    summary: 'start here', desc: `
  ## Try 'Pounce' on this page.
  Here is the quick tour.
  1. The [top area](#tooltip-map) shows the definition of the word at your cursor. The top area also hosts a canvas for graphic output.
  2. The [Blue Box](#tooltip-pl) is for your code. As you click through the tutorials, code will appear in this text area. Also you may type in code to change the code. Experiment.
  3. The [Gray Area](#tooltip-stack) to the bottom left is the 'stack'. It represents the working memory of the Pounce program. Also, just to the right of that, when running in debug mode, you will see the history of the program and the stack as it ran.
  `, tutorial: 'introduction', level: 1
  }],
  ['', {
    summary: 'how to code differently', desc: `
  Pounce is a stack-based concatenative programming (CP) language. Pounce's goal is to encorage you 'jump in' and try this rather 'different' style of programming, don't be a fraidy cat.
  
  But, before you begin, two quick bits of 'info' about CP:
  1. 'words' are the most basic unit. Both data or functions are words, everything separated by spaces is a word. With the exceptions of '[', ']' for lists and '{', ':' and '}' rerserved for records, all else is, you guesed it... a word. 
  2. At first programming will seem backward to you. That's because CP languages use post-fix notation. CP programming is coded in a "Noun" then "Verb" pattern. For example: **\`4 2 *\`** multiplies 4 and 2 -- see how the nouns (data) come before the verb (function).


  So hopefully that did not scare you off and is enough to prepare you to jump in! *Click on the toutorials in the top navagation bar.* Have fun, learning and experimenting.
  `, tutorial: 'introduction', level: 2
  }],

  ['"hello " "world!" str-append', { summary: 'Working with strings', desc: '"Hello world!", The iconic example starts with two strings. These are pushed on to the stack, then the word "str-append" is applied and the result, a single string is left on the stack.', tutorial: 'strings', level: 1 }],
  ['`a` \'b\' "c" d str-append str-append str-append', { summary: 'Strings can be quoted or words with no spaces can be strings as well.', desc: 'Here is how concatenative programming works: Values are pushed on to a stack then verbs (the functions) act on the stack, you can see that two strings preceed "str-append", and the result is left on the stack.', tutorial: 'strings', level: 2 }],
  ['2 3 +', { summary: 'Sum of two numbers', desc: 'the operator \'+\' (for addition) comes after the two numbers being added.', level: 1, tutorial: 'calculate' }],
  ['2 3 *', { summary: 'same for multiplication', desc: 'the \'*\' is placed after the two numbers to be multiplied.', level: 2, tutorial: 'calculate' }],
  ['9 7 + 2.5 /', { summary: 'combining opererations', desc: 'To add and then divide, say (9 + 7) / 2.5. Notice how no parenthases are needed when the operators are after the numbers. ', level: 3, tutorial: 'calculate' }],
  ['9 7 2.5 + /', { summary: 'another combination', desc: 'To divide by a sum, say 9  / (7 + 2.5). Notice how no parenthases are needed when the operators are after the numbers.', level: 4, tutorial: 'calculate' }],
  ['9 7 swap', { summary: 'swap the two top', desc: '\'swap\' comes in handy when you want to swap the position of the top two items on the stack.', level: 1, tutorial: 'rearrange the stack' }],
  ['3 dup', { summary: 'duplicate the top', desc: '\'dup\' is short for duplicate and it makes a copy of what on the top of the stack leaving you with two of them.', level: 2, tutorial: 'rearrange the stack' }],
  ['9 7 swap dup', { summary: 'combine dup and swap', desc: 'Combining a couple stack rearranging words  together allows you to arrange the stack in a new order', level: 3, tutorial: 'rearrange the stack' }],
  ['rock paper scissors rollup', { summary: 'roll up', desc: 'To rearranging three items on the stack, you can use `rollup`, `rolldown` and `rotate`', level: 4, tutorial: 'rearrange the stack' }],
  ['rock paper scissors rolldown', { summary: 'roll down', desc: 'To rearranging three items on the stack, you can use `rollup`, `rolldown` and `rotate`', level: 5, tutorial: 'rearrange the stack' }],
  ['rock paper scissors rotate', { summary: 'rotate', desc: 'To rearranging three items on the stack, you can use `rollup`, `rolldown` and `rotate`', level: 6, tutorial: 'rearrange the stack' }],
  ['10 20 30 40 2 bubble-up', { summary: 'bubble-up', desc: 'bubble-up is a word that pulls an indexed element on the stack, up to the top.', level: 8, tutorial: 'rearrange the stack' }],

  [`list_module import
[5 6] 7 push`, { summary: 'push onto a list', desc: '\'push\' adds an item to the end of a list.', level: 0, tutorial: 'lists and records' }],
  [`list_module import
[5 6 7] pop`, { summary: 'pop off a list', desc: '\'pop\' removes an item from the end of a list.', level: 1, tutorial: 'lists and records' }],
  [`list_module import
5 [6 7] cons`, { summary: 'cons to the front', desc: '\'cons\' adds an item to the beginning of a list.', level: 2, tutorial: 'lists and records' }],
  [`list_module import
[5 6 7] uncons`, { summary: 'uncons off the front', desc: '\'uncons\' removes an item from the beginning of a list.', level: 3, tutorial: 'lists and records' }],
  [`rec_module import
  {a:3 b:7} 1 a set`, {
    summary: 'set a property in a record', desc: '\'set\' takes a key and value and sets the record below.',
    level: 4, tutorial: 'lists and records'
  }],
  [`rec_module import
  {a:3 b:7} b get`, {
    summary: 'get a value from a record', desc: '\'get\' takes a key and gets the value in the record below.',
    level: 5, tutorial: 'lists and records'
  }],

  ['7 [6 *] apply', {
    summary: 'apply', desc: '\'apply\' demonstraits that a list of words on the value stack, can be executed as code.',
    level: 1, tutorial: 'higher order words'
  }],
  ['"bottom" "top" ["-dollar" str-append] dip', {
    summary: 'dip (under)', desc: '\'dip\' is used to apply quotted words one place under the top of the stack.',
    level: 2, tutorial: 'higher order words'
  }],
  ['[0 1 2 3 4 5 6] [3 -] map', {
    summary: 'map', desc: '\'map\' a list.',
    level: 3, tutorial: 'higher order words'
  }],
  [`[2 % 0 ==] [even] def
[-3 -2 -1 0 1 2 3] [even] filter`,
    {
      summary: 'filter', desc: '**\`filter\`** a list. but first you may not have seen how to define a word using **\`def\`**. Using **\`def\`** a filter word is defined (named) **\`even\`*.  Then you can use that newly defined word, put it in a list (quoting it), and use it to filter a list of data.',
      level: 4, tutorial: 'higher order words'
    }],
  ['[10 8 3 5 18 -10 -12] 0 [+] reduce', {
    summary: 'reduce', desc: '\'reduce\' a list.',
    level: 5, tutorial: 'higher order words'
  }],
  [`[dup2 +] [fib] def
  0 1 fib 8 repeat`,
    {
      summary: 'define a word "fib"',
      desc: `[dup2 +] is two words in a list then use \`def\` is defined is as a word.
      Next, use it to produce the Fibinaci sequence`,
      level: 0, tutorial: 'your own words'
    }],

  [`list_module import
[ dup 0 > [1 - swap dup dip2 swap repeat] [drop drop] if-else ] [repeat] def
0 1 [] [[swap] dip [dup] dip2 [+] dip swap dup [push] dip swap] 8 repeat`,
    {
      summary: 'define a word "repeat" and use it to fill an array',
      desc: `\`repeat\` is defined in Pounce, but it's not too difficult to define your own and see how it works.`,
      level:1, tutorial: 'your own words'
    }],
  
  [`list_module import
[[] cons [p] def [2] [n] def [[]] [f] def] [set-up] def
[n 1 + [] cons [n] def] [inc-n] def
[p n % 0 == [n f cons [] cons [f] def p n / [] cons [p] def] [inc-n] if-else] [prime-fact] def
[p 1 <= [f] [prime-fact factorize] if-else] [factorize] def
210 set-up factorize
`, {
      summary: 'find prime factors v1', desc: `
Try _disabling_ debugging before factoring any large numbers, try 510510 (made of consecutive primes)
`, level: 11, tutorial: 'your own words'
    }],

      
  
  [`list_module import
    rec_module import
  { desc:'prime factors of a number'
    local-words:{
      package:[{n:2 f:[]} swap check-integer p set] # builds {n:2 f:[] p:210}
      p-n:[n get [p get] dip] # p-n pulls p and n out of the package
      n-f:[n get [f get] dip]
      n-inc:[n get 1 + n set]
      prime-factor?:[p-n % 0 == [n-f push f set p-n / p set] [n-inc] if-else]
      factorize:[p get 1 <= [f get] [prime-factor? factorize] if-else]
      check-integer:[dup 0 > not [drop 1] if]
      clean-up:[swap drop]
    }
    expects: [{desc: 'a positive' ofType: 'integer'}]
    effects: [0]
    definition:[package factorize clean-up]
  } [factor] define
  210 factor
  `, {
        summary: 'find prime factors v2', desc: `
        Version 2 uses \`define\` which takes a record and makes a new word.
        In this case the new word is called \`factor\` and it has a line in the record \`definition:[package factorize clean-up]\`

  Try _disabling_ debugging before factoring any large numbers, try 510510 (made of consecutive primes)
  `, level: 12, tutorial: 'your own words'
      }],
  
  
  
  [`
  list_module import
  {desc:'factors of a number'
   named-args:[p]
   local-words:{
    n:[2]
    f:[[]]
    store:[[[] cons] dip local-def]
    inc-n:[n 1 + [n] store]
    prime-factor?:[p n % 0 == [n f cons [f] store p n / [p] store] [inc-n] if-else]
    factorize:[p 1 <= [f] [prime-factor? factorize] if-else]
    check-integer:[p 0 > not [1 [p] store] if]
    clean-up:[swap drop]
   }
   expects: [{desc: 'a positive' ofType: 'integer'}]
   effects: [0]
   definition:[check-integer factorize]
  } [factor] define
  27 factor
  `, {
      summary: 'prime factors v3', desc: `
      Not best way but good to experiment, this version (3) makes use of local-def in the for me of the word \`store\`
Try _disabling_ debugging before factoring any large numbers, try 510510 (made of consecutive primes)
`, level: 13, tutorial: 'your own words'
    }],


  [`list_module import
[[dup] dip2 [dup] dip dup 4 bubble-up 3 bubble-up 2 bubble-up] [dup3] def
4 [15] 6 dup3
[4 push] dip`, {
      summary: 'duplicate 3', desc: `
## Duplicate the top 3 items on the stack
Each line on the program
 1. defined (dup3) duplicates the top 3 stack items.
 2. \`a [15] 6 dup3\` a quick test shows that it works
 3. \`[4 push] dip\` and to show that it is truely a copy and not just an array reference
`, level: 3, tutorial: 'your own words'
    }],
  [`{ named-args:[list1 list2]
  requires:list_module
  local-words:{
   len1:[]
   record-len1:[list1 list-length [] cons [len1] local-def]
   len2:[]
   record-len2:[list2 list-length [] cons [len2] local-def]
   fan-out1:[list1 [uncons] len1 repeat drop]
   fan-out2:[list2 [uncons] len2 repeat drop]
   collect-both:[[] [cons] len1 len2 + repeat]
  }
  definition:[record-len1 record-len2 fan-out1 fan-out2 collect-both]
 } [cat] define
 [1 2 +] [6 7 -] cat`,
    {
      summary: 'concatinate two lists', desc: `
\`cat\` (sort for concatinate) joins two lists.
`, level: 5, tutorial: 'your own words'
    }],

  [
    `canvas_basic_module import
  canvas cb-init cb-clear
  4 7 30 112 cb-line
  59 122 130 99 cb-line
  {color:{r:64 g:0 b:255 a:0.5} x:30 y:40 w:60 h:40} cb-box
  {color:{r:255 g:63 b:127 a:0.5} x:60 y:50 w:40 h:50} cb-box
  `, { summary: 'Draw some shapes', desc: 'Draws lines and rectangles on the canvas as a drawing demo', level: 1, tutorial: 'io on canvas' }],
  [
    `canvas_basic_module import
  canvas cb-init cb-clear
  30 45 cb-begin-path
  50 60 cb-line-to
  100 10 cb-line-to
  cb-end-path
  `, { summary: 'Draw a check-mark', desc: 'Draws a line on the canvas', level: 2, tutorial: 'io on canvas' }],
  [
    `canvas_basic_module import
    rec_module import
  {} [[x set] dip y set] [pack] def
  [y get [x get] dip] [unpack] def
  canvas cb-init cb-clear
  30 45 pack unpack cb-begin-path unpack [20 +] dip 20 + cb-line-to
  100 10 cb-line-to cb-end-path
  drop
  `, { summary: 'Turtle Graphics', desc: 'Draws a line, relative to possition', level: 3, tutorial: 'io on canvas' }],
  [
    `canvas_basic_module import
  canvas cb-init cb-clear
  images/pounce-cat1.png cb-load-image
  `, { summary: 'Image on the canvas', desc: 'Draws an image on the canvas', level: 4, tutorial: 'io on canvas' }]
  ,
  [
    `canvas_basic_module import
    canvas cb-init cb-clear
    # drawing a box just to set a color in this context
    {color:{r:18 g:16 b:125 a:0.3} x:0 y:0 w:1 h:1} cb-box
    
  subscription_module import
  [cb-box] [click] subscribe`, { summary: 'Input click on canvas', desc: 'setup a subscription to listen for click events and then draw a box on the canvas.', level: 5, tutorial: 'io on canvas' }]
  ,
  [
    `canvas_basic_module import
    canvas cb-init cb-clear
    # drawing a box just to set a color in this context
    {color:{r:18 g:163 b:25 a:0.3} x:0 y:0 w:1 h:1} cb-box
    
  subscription_module import
  [cb-box] [mousemove] subscribe`, { summary: 'Input event mousemove', desc: 'draws a box on canvas when a mousemove event fires.', level: 6, tutorial: 'io on canvas' }]
  ,
  [
    `canvas_basic_module import
    canvas cb-init cb-clear
    list_module import
    rec_module import
    
    []
[{x:0 y:0 w:0 h:0 color:{r:0 g:0 b:0 a:0.5}} 
      random 200 * 1 round x set
      x get 250 swap - random * 1 round w set 
      random 100 * 1 round y set
      y get 150 swap - random * 1 round h set 
      {r:180 g:150 b:150 a:0.5}
      random 255 * 1 round r set
      random 255 * 1 round g set
      random 255 * 1 round b set
      random 0.01 round a set
      color set
] [boxr] def
[boxr push] 7 repeat
    
[cb-box] map`
    , { summary: 'random composition', desc: 'draws random rectangles.', level: 7, tutorial: 'io on canvas' }]
];




















const sortBylevel = (e) => e.sort((a, b) => (level_order[a[1].tutorial] + (a[1].level * 0.01) > level_order[b[1].tutorial] + (b[1].level * 0.01)) ? 1 : -1);
const level_order = { "introduction": 1, "strings": 2, "calculate": 3, "rearrange the stack": 4, "lists and records": 5, "higher order words": 6, "your own words": 7, "io on canvas": 8, "advanced": 9 };


const tutorials = ['introduction', 'hello world', 'calculate', 'rearrange the stack', 'your own words', 'some I/O'];
const examples = [
  ['', {summary:'start here', desc:`
  ##  The page is layed out to help you understand how your 'Pounce' program works
  1. The [Blue Box](#tooltip-pl) is for program code (to be run). As you go through the tutorial, code will be entered for you or you can type in your own 'words' at any time.
  2. The [Gray Box](#tooltip-stack) to the left is the 'stack'. The working memory of the program will show up here. Also, just to the right, when running in debug mode, you will see the history of the program and the stack as it ran.
  3. The [top area](#tooltip-map) will show you the definition of words. When the cursor is on a word in the program code the definition of that word will pop up.
  `, tutorial: 'introduction', level:1}],
  ['', {summary:'using this tutorial', desc:'', tutorial: 'introduction', level:2}],
  ['', {summary:'how to code differently', desc:`
  Pounce is a programming language, with the goal of letting anyone try out this rather 'different' style of programming. Everything you need is right here.
  A word about 'words': Words are the basic unit of programming Pounce. In Pounce, words can be data or functions, but we thought you should know that everything in the Pounce language is refered to as a word.Its a "Noun then Verb" pattern
  `, tutorial: 'introduction', level:3}],
  
['"hello " "world!" str-append', {summary:'Working with strings', desc:'"hello world!", The iconic example starts with two strings. These are pushed on to the stack, then the word "str-append" is applied and the result, a single string is left on the stack.', tutorial: 'hello world', level:1}],
['`a` \'b\' "c" d str-append str-append str-append', {summary:'Strings can be quoted or words with no spaces can be strings as well.', desc:'Here is how concatenative programming works: Values are pushed on to a stack then verbs (the functions) act on the stack, you can see that two strings preceed "str-append", and the result is left on the stack.', tutorial: 'hello world', level:2}],
['2 3 +', {summary:'Sum of two numbers', desc:'the operator \'+\' (for addition) comes after the two numbers being added.', level: 1, tutorial: 'calculate'}],
['2 3 *', {summary:'same for multiplication', desc:'the \'*\' is placed after the two numbers to be multiplied.', level: 2, tutorial: 'calculate'}],
['9 7 + 2.5 /', {summary:'combining opererations', desc:'To add and then divide, say (9 + 7) / 2.5. Notice how no parenthases are needed when the operators are after the numbers. ', level: 3, tutorial: 'calculate'}],
['9 7 2.5 + /', {summary:'another combination', desc:'To divide by a sum, say 9  / (7 + 2.5). Notice how no parenthases are needed when the operators are after the numbers.', level: 4, tutorial: 'calculate'}],
['9 7 swap', {summary:'swap the two top', desc:'\'swap\' comes in handy when you want to swap the position of the top two items on the stack.', level:1, tutorial:'rearrange the stack'}],
['3 dup', {summary:'duplicate the top', desc:'\'dup\' is short for duplicate and it makes a copy of what on the top of the stack leaving you with two of them.', level:2, tutorial:'rearrange the stack'}],
['9 7 swap dup',{summary:'combine dup and swap', desc:'Combining a couple stack rearranging words  together allows you to arrange the stack in a new order', level:3, tutorial:'rearrange the stack'}],
['rock paper scissors rollup',{summary:'roll up', desc:'To rearranging three items on the stack, you can use `rollup`, `rolldown` and `rotate`', level:4, tutorial:'rearrange the stack'}],
['rock paper scissors rolldown',{summary:'roll down', desc:'To rearranging three items on the stack, you can use `rollup`, `rolldown` and `rotate`', level:5, tutorial:'rearrange the stack'}],
['rock paper scissors rotate',{summary:'rotate', desc:'To rearranging three items on the stack, you can use `rollup`, `rolldown` and `rotate`', level:6, tutorial:'rearrange the stack'}],
['10 20 30 40 2 bubble-up',{summary:'define your own stack changing words', desc:'To rearranging the stack your own way, you may write your own words, like this bubble-up', level:8, tutorial:'rearrange the stack'}],
[
`canvas_basic_module import
canvas cb-init cb-clear
4 7 30 112 cb-line
59 122 130 99 cb-line
{color:{r:64 g:0 b:255 a:0.5} x:30 y:40 w:60 h:40} cb-box
{color:{r:255 g:63 b:127 a:0.5} x:60 y:50 w:40 h:50} cb-box
drop
`,{summary:'Draw some shapes', desc:'Draws lines and rectangles on the canvas as a drawing demo', level:1, tutorial:'some I/O'}],
[
`canvas_basic_module import
canvas cb-init cb-clear
30 45 cb-begin-path
50 60 cb-line-to
100 10 cb-line-to
cb-end-path
drop
`, {summary:'Draw a check-mark', desc:'Draws a line on the canvas', level:2, tutorial:'some I/O'}],
[
`canvas_basic_module import
[[x set] dip y set] [pack] def
[y get [x get] dip] [unpack] def
canvas cb-init cb-clear
30 45 pack unpack cb-begin-path unpack [20 +] dip 20 + cb-line-to
100 10 cb-line-to cb-end-path
drop
`, {summary:'Turtle Graphics', desc:'Draws a line, relative to possition', level:3, tutorial:'some I/O'}],
[
`canvas_basic_module import
canvas cb-init cb-clear
images/pounce-cat1.png cb-load-image
`, {summary:'Image on the canvas', desc:'Draws an image on the canvas', level:4, tutorial:'some I/O'}],
[`list_module import
[ dup 0 > [1 - swap dup dip2 swap repeat] [drop drop] if-else ] [repeat] def
0 1 [] [[swap] dip [dup] dip2 [+] dip swap dup [push] dip swap] 8 repeat`, {summary:'define a word "repeat" and use it to fill an array', desc:'', level:1, tutorial:'your own words'}],
[`list_module import
{desc:'Prime factors of a number'
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
`, {summary:'find the prime factors of a number', desc:'', level:2, tutorial:'your own words'}],
[`list_module import
[[dup] dip2 [dup] dip dup 4 bubble-up 3 bubble-up 2 bubble-up] [dup3] def
4 [15] 6 dup3
[4 push] dip`, {summary:'duplicate 3', desc:`
## Duplicate the top 3 items on the stack
Each line on the program
 1. defined (dup3) duplicates the top 3 stack items.
 2. \`a [15] 6 dup3\` a quick test shows that it works
 3. \`[4 push] dip\` and to show that it is truely a copy and not just an array reference
`, level:3, tutorial:'your own words'}]
];

const sortBylevel = (e) => e.sort((a, b) => (level_order[a[1].tutorial]+(a[1].level*0.01) > level_order[b[1].tutorial]+(b[1].level*0.01))? 1: -1);
const level_order = {"introduction":1, "hello world":2, "calculate":3, "rearrange the stack":4, "canvas": 5, "advanced":6};

# Pounce v0, a concatenative programming language (inactive since 2020-01, see instead, @pounce-lang)

### @pounce-lang for new development of the Pounce programming language
[pounce-lang repo](https://github.com/pounce-lang) has a core language npm package and a few other supporting, learning, documenting and exhibiting projects. 

## This repo is now an archive of the initial Version 0

Pounce is a programming language that targets the Browser, and limited resource processors such as edge server and IoT.
The aim of Pounce is to help everyone explore stack-based, __conatenative__ programming. Since Pounce works in the browser, you can try it out easily (with zero installation). This [tutorial](https://nmorse.github.io/pounce/js/try_pounce.html) will get you coding in minutes. If you end up liking this style of programming, you may want to look at some other Pounce interpreters for Python and C that are in early planning / alpha development.

_language origins_
Pounce has roots in FORTH and Postscript, but other concatenative languages like Joy, Cat and Kitten are much closer relatives that acknowledge a functional paradigm. 

## Concatenative Programming is...
It's a different approach to programming, that is for sure. Concatenative programming (CP) is all about the __composition__ of functions, by concatenation.

CP uses a magic sauce in the form of __post-fix__ notation to make the composition of functions feel natural, so natural in fact, that there is no syntax needed to compose two functions together. Simply by placing functions, one after another (concatenating them with a space inbetween) you have indicated that these functions are to be composed into a single (new) function. Post-fix notiation has other advantages, such as eliminating the need for "parentheses", more on that later.

CP is famous for the simplicity of its virtual machine archetecture. Pounce keeps this archetecture as simple as possible with only three virtual machine elements. A dictionary of functions (called words), a list of words (the program to be executed) and a stack (of values). These are all that are needed to run a Pounce program. The state of a running program is defined by the stack and the program list. The dictionary usually remains static while executing.

There's a lot more to say about this concatenative style. One thing worth mentioning is that there are __no named variables__ in CP. This lack of variables is a shock to most programmers, but it is the philosophy of CP to "Name the _code_, not the _data_." Along with, the slightly derogatory quote, "Variables are 'GOTO' for data!",  these mottos differentiate CP from other programming paradigms. Sure CP deals with data, but data is not referenced by named variables __*__, instead it's stored on a stack. For this reason CP is also known as __stack-based__ programming. All functions take this stack as a single argument and return a modified copy. That consistency across function signatures gives CP programmers less to memorize and eases the mental overhead involved in coding.

   (__*__ Pounce also (optional) supports read-only named references to stack items)
   
Some CP languages (i.e. Joy, Cat, Kitten and Pounce) are 'pure' functional programming (FP) languages, but it comes as a shock to FP aficionados, just how different the CP style of problem solving is from FP.
A FP vs. CP comparison goes something like this:
 * FP involves the __application__ of functions to data. That is passing variables in, and gathering data returned by functions. FP makes this natural and effective, which is to say, if you pass in the right parameters to functions to solve a specific problem, then you have made a great FP application.
 * In CP the __composition__ of functions is central. The programmer composes functions to form (essentailly) one function that takes a stack of data as input and returns a stack as output. CP can do this because every function (consistantly) takes and returns a stack, making composition across all functions possible.

This only scratches the surface what CP is, so for more definitions and discussions, you should jump to some of these links: ... {links TBD}

The particular brand of CP that Pounce aims to deliver, has these goals:
 * To be simple and consistent;
 * Support a functional programming approch to problem solving;
 * To provide IDEs and help in learning and debugging;
 * To be portable to the major computing platforms.

## Simple and Consistent...
the aim is for Pounce to maintain a minimal core that only contains what is common to all applications (modules in the form of word maps will fill in application specific words). Consistency in post-fix notation is one thing that CP languages had failed to keep, switching over to prefix when defining functions, but Pounce supports a post-fix style consistency (other notations may be included, but post-fix is always the default).

## Support FP style problem solving
Core words "map", "filter" and "reduce" process lists, records or the stack as a whole. Additionally any words that you define will be part of the FP eco-system. Once the post-fix notation becomes natural, problem solving starts to flow with out syntactic impediments. Keeping a functioanl simplicity will be a win for progrmers and their developed solutions. 

## IDEs and help in learning and debugging...
For all dynamic languages, the REPL has survived the test of time and will continue to be alive and well, but IDEs have given programmers more power and productivity. Pounce has a browser based IDE (under development) that will help you interact with and visualize your code. The aim is to keep the edit-run-debug cycle as short as possible. Tests may be built into any word (function) definition so that testes may be run while you code. Offering visualizations of your code and its affect on the stack, is the business of the IDE.

## Portable to...
To be portable, Pounce (so far) has JavaScript, Python and Closjure interpreters capable of client and server side application. Also (in development) a "C" interpretor (or Python) for IoT platforms.
Future development could include assemblers and compilers, to improve efficiency over interpretation.
 
## Getting started...
First try Pounce in your browser to get a feel for the concatenative style of programming. The examples in the toutorial will help you start off small and then move into making larger applications. https://nmorse.github.io/pounce/js/try_pounce.html -- enjoy

## Copyright & License
Copyright © 2018 Nate Morse.
Distributed under the MIT License (see [LICENSE](./LICENSE)).

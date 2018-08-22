
# Pounce Programming Language
Pounce is a __concatenative__ programming language that works in the Browser, Server and IoT.
The aim of Pounce is to encourage programmers to try conatenative programming. Since Pounce works in your browser, you can try it out easily. If you like this style of programming, you can also try out other Pounce interpreters written in Python and C. Pounce interpreters are being developed in parallel, to be as consistent as possible across various platforms.
Pounce is currently in an Alpha development phase, so it's not production ready, but the core is fairly stable. Look for updates on development posted here.

## Concatenative Programming is... 
It's a different approach to programming, that is for sure. Concatenative programming (CP) is all about the __composition__ of functions, by concatenation.

CP uses a magic sauce in the form of __post-fix__ notation to make the composition of functions feel natural, so natural in fact, that there is no syntax needed to compose two functions together. Simply by placing functions, one after another (concatenating them) you have indicated that these functions are to be composed into a single (new) function. More on the advantages of post-fix notiation, such as "Parentheses be gone!", later.

There's a lot more to say about this concatenative style, also known as __stack-based__ programming. One thing worth mentioning is this: there are __no named variables__ in CP. This lack of variables is a shock to most programmers, but it is the philosophy of CP to "Name the code, not the Data." Along with, the slightly derogatory quote, "Variables are 'GOTO' for data!",  these mottos differentiate CP from other programming paradigms. Sure CP deals with data, but data is not referenced by named variables, instead it's stored in a single uniform data-structure (usually a stack). All functions take this stack as an argument and return a modified copy. That consistency across function signatures gives CP programmers less to memorize and eases the mental overhead involved in coding.

Also, most CP language are 'pure' functional languages, so that is cool for the 'functional programming' (FP) folks out there, but again, it comes as a shock to those FP aficionados, just how different the CP style of problem solving is.
The FP vs. CP comparison goes something like this:
 * FP involves the __application__ of functions to data. That is passing variables in, and gathering data returned by functions. FP makes this natural and effective, which is to say, if you pass in the right parameters to functions to solve a specific problem, then you have made a great FP application.
 * In CP the __composition__ of functions is central. The programmer composes functions to form (essentailly) one function that takes a stack of data as input and returns a stack as output. CP can do this because every function (consistantly) takes and returns a stack, making composition across all functions possible. 

This just scratches the surface what CP is, so for more definitions and discussions, you should jump to some of these links: ... {links TBD}

Pounce borrows from a long line of CP languages. These include Forth, Joy, Factor, Cat. The particular brand of CP that Pounce delivers, has these goals: 
 * To be simple and consistent; 
 * To provide IDEs and help in learning and debugging; 
 * To be portable to the major computing platforms.

## Simple and Consistent...
For simplicity sake in language design Pounce will maintain a minimal core that only contains what is common to all applications. The consistency of Pounce will also help maintain simplicity. One example is that Pounce will always follow post-fix notation. Historically, CP languages switch over to prefix when defining functions, but Pounce supports a post-fix style consistency (note that other notations are also offered, but post-fix is always supported).

## IDEs and help in learning and debugging... 
The REPL has survived the test of time and will continue to be alive and well, but IDEs have made programming more powerful and productive. Pounce has a browser based IDE that will help you visualize and interact with your code. The aim is to keep the edit-run-debug cycle as short as possible. Tests are built into the function definitions every word so that testes are run while you code. Visualizing your code and its affect on the stack, is the business of the IDE.  

## Portable to...
To be portable, Pounce (so far) has JavaScript and Python interpreters capable of client and server side coding, as well as (in development) a "C" interpretor (or Python) for IoT platforms. 
Future development will include assemblers and compilers, that will improve efficiency over interpretation.
 
## Getting started...
First try Pounce in your browser to get a feel for the concatenative style of programming. The examples will let you start off small and move into making our own larger applications. https://nmorse.github.io/pounce/js/try_pounce.html

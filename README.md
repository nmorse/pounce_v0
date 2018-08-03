# Introducing the Pounce Programming Language
Pounce is a concatenative programming language that works in the Browser, Server and IoT.
The aim of Pounce is encorage programers to try conatenative programming. A Pounce interprerer works in the browser, so you can try it out easily. If you like it, you can try other interpretors written in Python and C. Pounce interpretors are being developed in parallel to be as consistant as possible between platformes.
Pounce is currently in an Alpha development phase, so it's not production ready, but the Core is fairly stable. Look for updates on development posted here.

## Concatenative Programming is... 
It's a differnt approach from other programming approaches, that is for sure. Concatenative programming (CP) is all about the composition of functions, mostly by concatination.
The use of post-fix notation makes the compositions of functions natural, so natural that there is no syntax needed to indicate that you would like to compose two functions. Simply by placing one function after another (i.e. contatinate them) you have indicated that you want to compose the two together into a single function.
There is lots more to say about the concatenative style, such as, there are no variables to be named. this is a shock to most programmers,but it is the phylosphy of CP to 'Name the code, not the Data.' Sure CP deals with data, but it is always stored in a uniform datastructure (usually a stack) and all functions take this stack and return a modified copy.
Yes, a CP language can be a pure functional environment to code in, but again, it can be shocking to functional programming (FP) efficiantos just how differnet the CP style of problem solving is. 
The FP vs. CP comparison goes like this. 
FP involves the application of functions to data, passing variables in, and gather data returned bu functions is narutal in FP. 
In CP the composition of functions is central, the programmer composes functions to form one function that takes a stack of data as input and returns a stack as output. CP can do this because every function take and return a stack, so composition is nautural.
This just scratches the surface what CP is, so for more definitions and discussons, you should jump to some of these links: ... 
There have been many CP languages, but the particular brand of CP that Pounce delivers, has these goals: To be simple and consistent; To provide IDEs and help in learning and debugging; To be portable to the major programming destinations.


## Portable to...
To be portable, Pounce has Javascript and Python interpretors for client and server side coding, as well as "C" (or Python) for IoT platforms. 
Future development will include assemblers and compilers, that will add efficjientcy over interpretation.
 
## Getting started...
First try Pounce in your browser to get a feel for the concatinative style of programming. The examples will let you start off small and move into making our own larger applications.

# Pounce -> Python -> CircuitPy
Running a Pounce language interpreter on another interpreted environment seems a little crazy, but that is what this section of Pounce is up to.

In defense of this scheme, there are some interesting approaches that can be explored more easily in Python than in 'C' and for ease of exploration, CircuitPython (a dirivative of MicroPython) targets microprocessors such as the Arm M0 & M4 chips, making hardware interfacing code very much more accessable.

Python code in the folders below parses, tests and interprets Pounce scripting. The Python libraries come in three sizes and each is geared specifically to hardware specific capabilities.

No one is looking for speed or to run large complex algorithms here, but this is the place to be for experiments in language design, accessable hardware interfaces and the fun of running your code on a microprocessor.

## Three Pounce Environments Written in Python (getting progressivly larger and more capable)
Differing needs will steer you into one of these size environments, and it is easy to move up or down as your requiroment coaless.
The Middle one may be the best starting place as it provides a REPL and a powerfull interperetor, while being small enough to understand everything that is going on in your Pounce scripting and in the Python code that interprets your Pounce code.
Each size comes with getting started tutorials, tests and examples. Both the tests and the examples are good resources for learning the basics of coding in Pounce. The hope is that you will be launched on course of constructing some elegant applications of your own.

### Small
`Target: M0`
If you don't have much room on your microprocessor, but you still want to try out Pounce with Python, this small size code set may be enough for your needs. A subset of Pounce is limited to a stack interger values and basic functions. It is a simulation of what it would be like to run the small sized 'C' version of Pounce. The simplicity of the interpreter is supported by feeding it precompiled Pounce AST, which means that you will parse your scripts in a precompile step and run the result on your pettit hardware. You may write the AST form your self (it is not too difficult because Pounce is homoiconic).

### Meduim (possibly the best starting place, just the right size)
`Target: M0 express`
With more power and space on the target device, there is room for a parser and a larger variety of types that can be stored on the stack. This transformes by your Pounce scripts from being rudimentry into capable processing work horses. A Repl can be hosted on the device in the same fashon that CircutPython has a Python Repl. The capabilities of the interpretor add to the small version: floats; array handleing; records and all the functions needed to access those types. The Medium size offers an entry point beginners by offering a parser and REPL and lets experts happy by leaving room to include other libraries on your device.

### Large
`Target: M4 and other capable chips`

   
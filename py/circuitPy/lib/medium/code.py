import board
#import pulseio
# from analogio import AnalogIn
from digitalio import DigitalInOut, Direction, Pull
import time
# import random

from pounce import runtime as pounce
#from pounce import parsed_tests as testing

 
# Digital input with pullup
red = DigitalInOut(board.D13)
#red = {'value':0}
red.direction = Direction.OUTPUT
#green = DigitalInOut(board.D2)
#green.direction = Direction.OUTPUT
io = { 'red': red }



# ToDo:
#       ui/repl

def _readIO(s, pl):
    global io
    io_values = {}
    #s.append(io.copy())
    for key in io:
        io_values[key] = io[key].value
    s.append(io_values)
    return [s, pl]

def _writeIO(s, pl):
    global io
    nextio = s.pop()
    for key in io:
        if io[key].direction == Direction.OUTPUT:
            io[key].value = nextio[key]
    # red.value = a['red']
    return [s, pl]

def _milli(s, pl):
    s.append(time.monotonic())
    return [s, pl]

def _sleep(s, pl):
    seconds = s.pop()
    time.sleep(seconds)
    return [s, pl]


pounce.words['>io'] = _readIO
pounce.words['io>'] =  _writeIO
pounce.words['>milli'] =  _milli
pounce.words['sleep>'] =  _sleep
pounce.words['toggle'] = [False, True, 'if-else']
pounce.words['start-delay'] = [2, '+']
pounce.words['later'] = [0.5, '+']
pounce.words['flash'] = ['>io', 'red', 'get', 'toggle', 'red', 'set', 'io>']
pounce.words['blink'] = ['dup', '>milli', '<', ['later', 'flash'], 'if', 'blink']

print('Pounce loaded. Ready to:')

#testsPassed = testing.runTests()

print('After a ', pounce.run([0, 'start-delay'])[0], ' second delay "Toggle red LED every', pounce.run([0, 'later'])[0] ,'seconds."')


pounce.run(['>milli', 'start-delay', 'blink'])

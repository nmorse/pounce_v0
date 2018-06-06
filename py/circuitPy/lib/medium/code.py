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
pounce.words['later'] = [0.5, '+']
pounce.words['flash'] = ['>io', 'red', 'get', 'toggle', 'red', 'set', 'io>']

print('Pounce loaded. Ready to:')

#testsPassed = testing.runTests()
pounce.words['blink'] = ['dup', '>milli', '<', ['later', 'flash'], 'if', 'blink']

print('Running "Toggle red LED every 0.5 seconds."')
rate = 0.5
nt = time.monotonic() + rate

pounce.run(['>milli', 2, '+', 'blink'])
#pounce.run([0, 'blink'])


#while True: #loop forever
    #t = time.monotonic()
    #if nt < t:
    #    pounce.run([0, 'blink'])
    #    nt += rate
    # test for the case where we have fallen behind the schedualed timer.
    # this means the above process is spending too much time before the next timer
    # is due.
#    if nt+1.0 < t:
#        time.sleep(5)
#        nt = time.monotonic() + rate


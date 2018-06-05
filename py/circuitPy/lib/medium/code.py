import board
#import pulseio
# from analogio import AnalogIn
from digitalio import DigitalInOut, Direction, Pull
import time
# import random

from pounce import runtime as pounce
from pounce import parsed_tests as testing

 
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
    s.append(io.copy())
    return [s, pl]
def _writeIO(s, pl):
    global io
    nextio = s.pop()
    for key in io:
        if io[key].direction == Direction.OUTPUT:
            io[key].value = nextio[key]
    # red.value = a['red']
    return [s, pl]
    
def _value(s, pl):
    key = s.pop()
    rec = s[-1]
    s.append(rec[key].value)
    return [s, pl]

pounce.words['>io'] = _readIO
pounce.words['io>'] =  _writeIO
pounce.words['value'] = _value
pounce.words['toggle'] = [False, True, 'if-else']



print('Pounce loaded. Ready to:')

#testsPassed = testing.runTests()

print('Running "Toggle red LED every 0.5 seconds."')
rate = 0.5
nt = time.monotonic() + rate
while True: #loop forever
    t = time.monotonic()
    if nt < t:
        pounce.run(['>io', 'red', 'value', 'toggle', 'red', 'set', 'io>'])
        nt += rate
    # test for the case where we have fallen behind the schedualed timer.
    # this means the above process is spending too much time before the next timer
    # is due.
#    if nt+1.0 < t:
#        time.sleep(5)
#        nt = time.monotonic() + rate


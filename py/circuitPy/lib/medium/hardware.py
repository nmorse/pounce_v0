# connect hardware specific inputs and outputs to pounce words

import board
#import pulseio
# from analogio import AnalogIn
from digitalio import DigitalInOut, Direction, Pull
import time

#from pounce import runtime as pounce

# Digital input with pullup
red = DigitalInOut(board.D13)
red.direction = Direction.OUTPUT
#green = DigitalInOut(board.D2)
#green.direction = Direction.OUTPUT
io = {'red': red}
words = {}

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

def _seconds(s, pl):
    s.append(time.monotonic())
    #print('time.monotonic', time.monotonic())
    return [s, pl]

def _sleep(s, pl):
    seconds = s.pop()
    print('sleep', seconds)
    print('stack', s)
    time.sleep(seconds)
    return [s, pl]

words['>io'] = _readIO
words['io>'] =  _writeIO
words['>sec'] =  _seconds
words['sleep>'] =  _sleep

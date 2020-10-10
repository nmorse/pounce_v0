# connect hardware specific inputs and outputs to pounce words

import board
#import pulseio
# from analogio import AnalogIn
from digitalio import DigitalInOut, Direction, Pull
import time


i2c = board.I2C()

#color&proxsimity
import adafruit_apds9960.apds9960
apds9960 = adafruit_apds9960.apds9960.APDS9960(i2c)
apds9960.enable_proximity = True
apds9960.enable_color = True


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
            #print(key, nextio[key])
    # red.value = a['red']
    return [s, pl]

def _seconds(s, pl):
    s.append(time.monotonic())
    #print('time.monotonic', time.monotonic())
    return [s, pl]

def _sleep(s, pl):
    seconds = s.pop()
    
    #print('stack', s)
    if seconds > 0 :
        time.sleep(seconds)
    else:
        print('sleep', seconds)
    return [s, pl]
    
def _printColor(s, pl):
    print("Proximity:", apds9960.proximity)
    print("Red: {}, Green: {}, Blue: {}, Clear: {}".format(*apds9960.color_data))
    return [s, pl]

def _color(s, pl):
    s.append(apds9960.color_data[0])
    #print("Proximity:", apds9960.proximity)
    #print("Red: {}, Green: {}, Blue: {}, Clear: {}".format(*apds9960.color_data))
    return [s, pl]


words['>io'] = _readIO
words['io>'] =  _writeIO
words['>sec'] =  _seconds
words['sleep>'] =  _sleep
words['printColor'] = _printColor
words['color'] = _color

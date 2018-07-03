
from pounce import runtime as pounce
import environment as env
pounce.words.update(env.words)

#from pounce import parsed_tests as testing

pounce.words['delayS'] = [0.5]
pounce.words['nap'] = ['dup', '>sec', '-', 'dup', 0.1, '-', 'delayS', '<', ['sleep>'], 'if']
pounce.words['nap-for'] = [['dup', '>sec', '-', 'dup', 0.1, '-'], 'dip', '<', ['sleep>'], 'if']
pounce.words['toggle'] = [False, True, 'if-else']
pounce.words['start-delay'] = ['delayS', '+']
pounce.words['later'] = ['delayS', '+']
pounce.words['flash'] = ['>io', 'state', 'get', 'toggle', 'state', 'set', 'io>']
pounce.words['blink1'] = ['dup', '>sec', '<',
                            ['later', 'flash'],
                        'if',
                        'blink1']
pounce.words['blink2'] = ['dup', '>sec', '<',
                            ['later', 'flash'],
                            ['delayS', 'nap-for'],
                        'if-else',
                        'blink2']
#pounce.words['blink'] = ['dup', '>sec', '<', [60, '+', '>io', 'red', 'get', False, True, 'if-else', 'red', 'set', 'io>'], 'if', 'blink']

print('Pounce loaded. Ready to:')

#testsPassed = testing.runTests()

print('After a ', pounce.run([0, 'start-delay'])[0], ' second delay "Toggle red LED every', pounce.run([0, 'later'])[0] ,'seconds."')

pounce.run(['>sec', 'start-delay', 'blink2'])

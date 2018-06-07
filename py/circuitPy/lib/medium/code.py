import hardware

from pounce import runtime as pounce
#from pounce import parsed_tests as testing

 
pounce.words['toggle'] = [False, True, 'if-else']
pounce.words['start-delay'] = [2, '+']
pounce.words['later'] = [0.5, '+']
pounce.words['flash'] = ['>io', 'red', 'get', 'toggle', 'red', 'set', 'io>']
pounce.words['blink'] = ['dup', '>milli', '<', ['later', 'flash'], 'if', 'blink']

print('Pounce loaded. Ready to:')

#testsPassed = testing.runTests()

print('After a ', pounce.run([0, 'start-delay'])[0], ' second delay "Toggle red LED every', pounce.run([0, 'later'])[0] ,'seconds."')

pounce.run(['>milli', 'start-delay', 'blink'])

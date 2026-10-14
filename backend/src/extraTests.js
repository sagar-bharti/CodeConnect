// Extra test cases merged into the seed data (input: one argument per line)
export default {
  'two-sum': [{ input: '[3,2,4]\n6', expectedOutput: '[1,2]' }, { input: '[3,3]\n6', expectedOutput: '[0,1]' }],
  'reverse-a-string': [{ input: 'CodeConnect', expectedOutput: 'tcennoCedoC' }, { input: 'a', expectedOutput: 'a' }],
  'valid-parentheses': [{ input: '(]', expectedOutput: 'false' }, { input: '([{}])', expectedOutput: 'true' }, { input: '((', expectedOutput: 'false' }],
  'binary-search': [{ input: '[-1,0,3,5,9,12]\n2', expectedOutput: '-1' }, { input: '[5]\n5', expectedOutput: '0' }],
  'climbing-stairs': [{ input: '2', expectedOutput: '2' }, { input: '10', expectedOutput: '89' }, { input: '45', expectedOutput: '1836311903' }],
  'maximum-subarray': [{ input: '[1]', expectedOutput: '1' }, { input: '[5,4,-1,7,8]', expectedOutput: '23' }, { input: '[-3,-1,-2]', expectedOutput: '-1' }]
};
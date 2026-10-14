// More practice problems. Test-case rules:
//  - each line of `input` is ONE argument (JSON, or a plain string like: hello)
//  - `expectedOutput` is what the function should return (JSON, or plain string)
//  - JS function name = camelCase, Python function name = snake_case (keep names from starterCode)
const js = (sig) => `function ${sig} {\n  // Write your solution\n}`;
const py = (sig) => `def ${sig}:\n    pass`;
const t = (input, expectedOutput) => ({ input, expectedOutput });

export default [
  { title: 'Palindrome Number', slug: 'palindrome-number', difficulty: 'Easy', topic: 'Math',
    description: 'Given an integer x, return true if x reads the same forward and backward, otherwise false. Negative numbers are never palindromes.',
    examples: [{ input: 'x = 121', output: 'true' }, { input: 'x = -121', output: 'false', explanation: 'It reads 121- backward.' }],
    constraints: ['-2^31 <= x <= 2^31 - 1'],
    starterCode: { javascript: js('isPalindrome(x)'), python: py('is_palindrome(x)') },
    testCases: [t('121', 'true'), t('-121', 'false'), t('10', 'false'), t('0', 'true'), t('12321', 'true')] },

  { title: 'FizzBuzz', slug: 'fizzbuzz', difficulty: 'Easy', topic: 'Math',
    description: 'Given n, return an array of strings from 1 to n. Use "FizzBuzz" for multiples of 3 and 5, "Fizz" for multiples of 3, "Buzz" for multiples of 5, otherwise the number as a string.',
    examples: [{ input: 'n = 5', output: '["1","2","Fizz","4","Buzz"]' }],
    constraints: ['1 <= n <= 10^4'],
    starterCode: { javascript: js('fizzBuzz(n)'), python: py('fizz_buzz(n)') },
    testCases: [t('3', '["1","2","Fizz"]'), t('5', '["1","2","Fizz","4","Buzz"]'), t('15', '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]')] },

  { title: 'Contains Duplicate', slug: 'contains-duplicate', difficulty: 'Easy', topic: 'Hashing',
    description: 'Given an integer array nums, return true if any value appears at least twice, and false if every element is distinct.',
    examples: [{ input: 'nums = [1,2,3,1]', output: 'true' }, { input: 'nums = [1,2,3,4]', output: 'false' }],
    constraints: ['1 <= nums.length <= 10^5'],
    starterCode: { javascript: js('containsDuplicate(nums)'), python: py('contains_duplicate(nums)') },
    testCases: [t('[1,2,3,1]', 'true'), t('[1,2,3,4]', 'false'), t('[1,1,1,3,3,4,3,2,4,2]', 'true'), t('[7]', 'false')] },

  { title: 'Valid Anagram', slug: 'valid-anagram', difficulty: 'Easy', topic: 'Strings',
    description: 'Given two strings s and t, return true if t is an anagram of s (same letters with the same counts), otherwise false.',
    examples: [{ input: 's = "anagram", t = "nagaram"', output: 'true' }, { input: 's = "rat", t = "car"', output: 'false' }],
    constraints: ['1 <= s.length, t.length <= 5 * 10^4', 'Lowercase English letters only.'],
    starterCode: { javascript: js('isAnagram(s, t)'), python: py('is_anagram(s, t)') },
    testCases: [t('anagram\nnagaram', 'true'), t('rat\ncar', 'false'), t('listen\nsilent', 'true'), t('aab\nabb', 'false')] },

  { title: 'Merge Two Sorted Arrays', slug: 'merge-two-sorted-arrays', difficulty: 'Easy', topic: 'Arrays',
    description: 'Given two sorted arrays a and b, return a single sorted array that contains all elements of both.',
    examples: [{ input: 'a = [1,2,4], b = [1,3,4]', output: '[1,1,2,3,4,4]' }],
    constraints: ['0 <= a.length, b.length <= 10^4'],
    starterCode: { javascript: js('mergeSorted(a, b)'), python: py('merge_sorted(a, b)') },
    testCases: [t('[1,2,4]\n[1,3,4]', '[1,1,2,3,4,4]'), t('[]\n[1]', '[1]'), t('[5,6]\n[1,2]', '[1,2,5,6]')] },

  { title: 'Best Time to Buy and Sell Stock', slug: 'best-time-to-buy-and-sell-stock', difficulty: 'Easy', topic: 'Arrays',
    description: 'prices[i] is the price of a stock on day i. Choose one day to buy and a later day to sell. Return the maximum profit, or 0 if no profit is possible.',
    examples: [{ input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Buy at 1, sell at 6.' }],
    constraints: ['1 <= prices.length <= 10^5'],
    starterCode: { javascript: js('maxProfit(prices)'), python: py('max_profit(prices)') },
    testCases: [t('[7,1,5,3,6,4]', '5'), t('[7,6,4,3,1]', '0'), t('[1,2]', '1'), t('[2,4,1]', '2')] },

  { title: 'Move Zeroes', slug: 'move-zeroes', difficulty: 'Easy', topic: 'Arrays',
    description: 'Given an array nums, return an array where all 0s are moved to the end while the order of the non-zero elements stays the same.',
    examples: [{ input: 'nums = [0,1,0,3,12]', output: '[1,3,12,0,0]' }],
    constraints: ['1 <= nums.length <= 10^4'],
    starterCode: { javascript: js('moveZeroes(nums)'), python: py('move_zeroes(nums)') },
    testCases: [t('[0,1,0,3,12]', '[1,3,12,0,0]'), t('[0]', '[0]'), t('[1,2]', '[1,2]'), t('[0,0,1]', '[1,0,0]')] },

  { title: 'Missing Number', slug: 'missing-number', difficulty: 'Easy', topic: 'Math',
    description: 'Given an array nums containing n distinct numbers in the range [0, n], return the only number in that range that is missing.',
    examples: [{ input: 'nums = [3,0,1]', output: '2' }],
    constraints: ['n == nums.length', '1 <= n <= 10^4'],
    starterCode: { javascript: js('missingNumber(nums)'), python: py('missing_number(nums)') },
    testCases: [t('[3,0,1]', '2'), t('[0,1]', '2'), t('[9,6,4,2,3,5,7,0,1]', '8'), t('[1]', '0')] },

  { title: 'Single Number', slug: 'single-number', difficulty: 'Easy', topic: 'Hashing',
    description: 'In an array where every element appears twice except one, return the element that appears only once.',
    examples: [{ input: 'nums = [4,1,2,1,2]', output: '4' }],
    constraints: ['1 <= nums.length <= 3 * 10^4', 'Every element appears twice except one.'],
    starterCode: { javascript: js('singleNumber(nums)'), python: py('single_number(nums)') },
    testCases: [t('[2,2,1]', '1'), t('[4,1,2,1,2]', '4'), t('[1]', '1'), t('[-1,-1,-2]', '-2')] },

  { title: 'Longest Common Prefix', slug: 'longest-common-prefix', difficulty: 'Easy', topic: 'Strings',
    description: 'Given an array of strings, return the longest common prefix shared by all of them.',
    examples: [{ input: 'strs = ["flower","flow","flight"]', output: 'fl' }],
    constraints: ['1 <= strs.length <= 200', 'A common prefix of at least one character exists in every test.'],
    starterCode: { javascript: js('longestCommonPrefix(strs)'), python: py('longest_common_prefix(strs)') },
    testCases: [t('["flower","flow","flight"]', 'fl'), t('["interview","internet","interval"]', 'inter'), t('["a"]', 'a'), t('["abc","abcd","ab"]', 'ab')] },

  { title: 'Product of Array Except Self', slug: 'product-of-array-except-self', difficulty: 'Medium', topic: 'Arrays',
    description: 'Return an array answer where answer[i] equals the product of all elements of nums except nums[i]. Try to do it without using division.',
    examples: [{ input: 'nums = [1,2,3,4]', output: '[24,12,8,6]' }],
    constraints: ['2 <= nums.length <= 10^5'],
    starterCode: { javascript: js('productExceptSelf(nums)'), python: py('product_except_self(nums)') },
    testCases: [t('[1,2,3,4]', '[24,12,8,6]'), t('[-1,1,0,-3,3]', '[0,0,9,0,0]'), t('[2,3]', '[3,2]')] },

  { title: 'Longest Substring Without Repeating Characters', slug: 'longest-substring-without-repeating', difficulty: 'Medium', topic: 'Strings',
    description: 'Given a string s, return the length of the longest substring that contains no repeated characters.',
    examples: [{ input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc".' }],
    constraints: ['0 <= s.length <= 5 * 10^4'],
    starterCode: { javascript: js('lengthOfLongestSubstring(s)'), python: py('length_of_longest_substring(s)') },
    testCases: [t('abcabcbb', '3'), t('bbbbb', '1'), t('pwwkew', '3'), t('au', '2')] },

  { title: 'Coin Change', slug: 'coin-change', difficulty: 'Medium', topic: 'Dynamic Programming',
    description: 'Given coin denominations and a target amount, return the fewest coins needed to make that amount, or -1 if it is impossible. You have unlimited coins of each type.',
    examples: [{ input: 'coins = [1,2,5], amount = 11', output: '3', explanation: '11 = 5 + 5 + 1.' }],
    constraints: ['1 <= coins.length <= 12', '0 <= amount <= 10^4'],
    starterCode: { javascript: js('coinChange(coins, amount)'), python: py('coin_change(coins, amount)') },
    testCases: [t('[1,2,5]\n11', '3'), t('[2]\n3', '-1'), t('[1]\n0', '0'), t('[186,419,83,408]\n6249', '20')] },

  { title: 'House Robber', slug: 'house-robber', difficulty: 'Medium', topic: 'Dynamic Programming',
    description: 'Each house holds some money, but you cannot rob two adjacent houses. Given the amounts, return the maximum money you can rob.',
    examples: [{ input: 'nums = [2,7,9,3,1]', output: '12', explanation: 'Rob houses with 2, 9 and 1.' }],
    constraints: ['1 <= nums.length <= 100'],
    starterCode: { javascript: js('rob(nums)'), python: py('rob(nums)') },
    testCases: [t('[1,2,3,1]', '4'), t('[2,7,9,3,1]', '12'), t('[5]', '5'), t('[2,1,1,2]', '4')] },

  { title: 'Search in Rotated Sorted Array', slug: 'search-in-rotated-sorted-array', difficulty: 'Medium', topic: 'Searching',
    description: 'A sorted array of distinct integers was rotated at an unknown pivot. Given the array and a target, return the index of the target or -1. Aim for O(log n).',
    examples: [{ input: 'nums = [4,5,6,7,0,1,2], target = 0', output: '4' }],
    constraints: ['1 <= nums.length <= 5000', 'All values are distinct.'],
    starterCode: { javascript: js('searchRotated(nums, target)'), python: py('search_rotated(nums, target)') },
    testCases: [t('[4,5,6,7,0,1,2]\n0', '4'), t('[4,5,6,7,0,1,2]\n3', '-1'), t('[1]\n0', '-1'), t('[3,1]\n1', '1')] },

  { title: 'Count Primes', slug: 'count-primes', difficulty: 'Medium', topic: 'Math',
    description: 'Given an integer n, return the number of prime numbers that are strictly less than n.',
    examples: [{ input: 'n = 10', output: '4', explanation: 'The primes are 2, 3, 5, 7.' }],
    constraints: ['0 <= n <= 5 * 10^6'],
    starterCode: { javascript: js('countPrimes(n)'), python: py('count_primes(n)') },
    testCases: [t('10', '4'), t('0', '0'), t('1', '0'), t('20', '8'), t('100', '25')] }
];
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type LanguageId = 'javascript' | 'typescript' | 'python' | 'java';

export type ProblemExample = {
  input: string;
  output: string;
  explanation?: string;
};

export type ProblemTestCase = {
  input: string;
  expectedOutput: string;
};

/**
 * Each problem can ship starter code and a runner ("harness") for any subset
 * of the supported languages. We use `Partial` so individual problems can
 * opt in to languages independently — e.g. older problems only support JS /
 * TS / Python while the new ones add Java.
 */
export type StarterCode = Partial<Record<LanguageId, string>>;

/**
 * Per-language runner that wraps the user's code. The runner reads stdin,
 * invokes the user's `Solution`, and prints the result. Different problems
 * use different stdin formats (some line-based, some JSON) — each harness
 * matches its own `testCases`.
 */
export type ProblemHarness = Partial<Record<LanguageId, string>>;

export type Problem = {
  id: string;
  title: string;
  difficulty: Difficulty;
  acceptance: number;
  tags: string[];
  description: string;
  examples: ProblemExample[];
  constraints: string[];
  starterCode: StarterCode;
  harness: ProblemHarness;
  testCases: ProblemTestCase[];
};

const minAbsDifferenceHarness: ProblemHarness = {
  javascript: `
const __stdin = require('fs').readFileSync(0, 'utf-8');
const __input = JSON.parse(__stdin);
const __sol = new Solution();
const __out = __sol.closestNumberPairs(__input.arr);
console.log(JSON.stringify(__out));
`,
  typescript: `
declare const require: any;
const __stdin: string = require('fs').readFileSync(0, 'utf-8');
const __input = JSON.parse(__stdin);
const __sol = new Solution();
const __out = __sol.closestNumberPairs(__input.arr);
console.log(JSON.stringify(__out));
`,
  python: `
import sys, json
_data = json.loads(sys.stdin.read())
print(json.dumps(Solution().closestNumberPairs(_data["arr"])))
`,
};

const addBinaryHarness: ProblemHarness = {
  javascript: `
const __stdin = require('fs').readFileSync(0, 'utf-8');
const __input = JSON.parse(__stdin);
console.log(new Solution().addBinary(__input.a, __input.b));
`,
  typescript: `
declare const require: any;
const __stdin: string = require('fs').readFileSync(0, 'utf-8');
const __input = JSON.parse(__stdin);
console.log(new Solution().addBinary(__input.a, __input.b));
`,
  python: `
import sys, json
_data = json.loads(sys.stdin.read())
print(Solution().addBinary(_data["a"], _data["b"]))
`,
};

const decodeWaysHarness: ProblemHarness = {
  javascript: `
const __stdin = require('fs').readFileSync(0, 'utf-8');
const __input = JSON.parse(__stdin);
console.log(new Solution().numDecodings(__input.s));
`,
  typescript: `
declare const require: any;
const __stdin: string = require('fs').readFileSync(0, 'utf-8');
const __input = JSON.parse(__stdin);
console.log(new Solution().numDecodings(__input.s));
`,
  python: `
import sys, json
_data = json.loads(sys.stdin.read())
print(Solution().numDecodings(_data["s"]))
`,
};

const houseRobberHarness: ProblemHarness = {
  javascript: `
const __stdin = require('fs').readFileSync(0, 'utf-8');
const __input = JSON.parse(__stdin);
console.log(new Solution().rob(__input.nums));
`,
  typescript: `
declare const require: any;
const __stdin: string = require('fs').readFileSync(0, 'utf-8');
const __input = JSON.parse(__stdin);
console.log(new Solution().rob(__input.nums));
`,
  python: `
import sys, json
_data = json.loads(sys.stdin.read())
print(Solution().rob(_data["nums"]))
`,
};

const integerBreakHarness: ProblemHarness = {
  javascript: `
const __stdin = require('fs').readFileSync(0, 'utf-8');
const __input = JSON.parse(__stdin);
console.log(new Solution().integerBreak(__input.n));
`,
  typescript: `
declare const require: any;
const __stdin: string = require('fs').readFileSync(0, 'utf-8');
const __input = JSON.parse(__stdin);
console.log(new Solution().integerBreak(__input.n));
`,
  python: `
import sys, json
_data = json.loads(sys.stdin.read())
print(Solution().integerBreak(_data["n"]))
`,
};

/* -------------------------------------------------------------------------- */
/*  Line-based harnesses (used by the Two Sum / Climbing Stairs / Valid       */
/*  Parentheses problems below). Java doesn't have JSON in the stdlib, so we  */
/*  use simple line-based stdin formats that are easy to parse in any lang.   */
/* -------------------------------------------------------------------------- */

const twoSumHarness: ProblemHarness = {
  javascript: `
const __lines = require('fs').readFileSync(0, 'utf-8').split('\\n');
const __nums = __lines[0].trim().split(/\\s+/).map(Number);
const __target = parseInt(__lines[1].trim(), 10);
const __res = new Solution().twoSum(__nums, __target).slice().sort((a, b) => a - b);
console.log(__res.join(' '));
`,
  typescript: `
declare const require: any;
const __lines: string[] = require('fs').readFileSync(0, 'utf-8').split('\\n');
const __nums: number[] = __lines[0].trim().split(/\\s+/).map(Number);
const __target: number = parseInt(__lines[1].trim(), 10);
const __res = new Solution().twoSum(__nums, __target).slice().sort((a: number, b: number) => a - b);
console.log(__res.join(' '));
`,
  python: `
import sys
_lines = sys.stdin.read().split('\\n')
_nums = list(map(int, _lines[0].split()))
_target = int(_lines[1].strip())
_res = sorted(Solution().twoSum(_nums, _target))
print(' '.join(map(str, _res)))
`,
  java: `
public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader __br = new BufferedReader(new InputStreamReader(System.in));
        String[] __parts = __br.readLine().trim().split("\\\\s+");
        int[] __nums = new int[__parts.length];
        for (int __i = 0; __i < __parts.length; __i++) __nums[__i] = Integer.parseInt(__parts[__i]);
        int __target = Integer.parseInt(__br.readLine().trim());
        int[] __res = new Solution().twoSum(__nums, __target);
        Arrays.sort(__res);
        StringBuilder __sb = new StringBuilder();
        for (int __i = 0; __i < __res.length; __i++) {
            if (__i > 0) __sb.append(' ');
            __sb.append(__res[__i]);
        }
        System.out.println(__sb.toString());
    }
}
`,
};

const climbingStairsHarness: ProblemHarness = {
  javascript: `
const __input = require('fs').readFileSync(0, 'utf-8').trim();
const __n = parseInt(__input, 10);
console.log(new Solution().climbStairs(__n));
`,
  typescript: `
declare const require: any;
const __input: string = require('fs').readFileSync(0, 'utf-8').trim();
const __n: number = parseInt(__input, 10);
console.log(new Solution().climbStairs(__n));
`,
  python: `
import sys
_n = int(sys.stdin.read().strip())
print(Solution().climbStairs(_n))
`,
  java: `
public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader __br = new BufferedReader(new InputStreamReader(System.in));
        int __n = Integer.parseInt(__br.readLine().trim());
        System.out.println(new Solution().climbStairs(__n));
    }
}
`,
};

const validParenthesesHarness: ProblemHarness = {
  javascript: `
const __raw = require('fs').readFileSync(0, 'utf-8');
const __s = __raw.replace(/\\n$/, '');
console.log(new Solution().isValid(__s) ? 'true' : 'false');
`,
  typescript: `
declare const require: any;
const __raw: string = require('fs').readFileSync(0, 'utf-8');
const __s: string = __raw.replace(/\\n$/, '');
console.log(new Solution().isValid(__s) ? 'true' : 'false');
`,
  python: `
import sys
_s = sys.stdin.read()
if _s.endswith('\\n'):
    _s = _s[:-1]
print('true' if Solution().isValid(_s) else 'false')
`,
  java: `
public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader __br = new BufferedReader(new InputStreamReader(System.in));
        String __s = __br.readLine();
        if (__s == null) __s = "";
        System.out.println(new Solution().isValid(__s) ? "true" : "false");
    }
}
`,
};

export const PROBLEMS: Problem[] = [
  {
    id: '1',
    title: 'Minimum Absolute Difference',
    difficulty: 'Easy',
    acceptance: 13.8,
    tags: ['Array', 'Sorting'],
    description: `Given an array **arr** consisting of distinct integers, identify every pair of elements whose absolute difference is the smallest among all possible pairs in the array.

For each qualifying pair **[a, b]** the following must hold:
- **a** and **b** are elements of **arr**
- **a < b**
- **b - a** equals the minimum absolute difference that occurs between any two elements of **arr**

Return all such pairs sorted in ascending order based on the first element of each pair (and consequently the second element as well).`,
    examples: [
      {
        input: 'arr = [7, 3, 5, 9]',
        output: '[[3,5],[5,7],[7,9]]',
        explanation:
          'After sorting [3, 5, 7, 9], every consecutive pair has a difference of 2, which is the minimum.',
      },
      {
        input: 'arr = [4, 2, 1, 3]',
        output: '[[1,2],[2,3],[3,4]]',
      },
    ],
    constraints: [
      '2 <= arr.length <= 10^5',
      '-10^6 <= arr[i] <= 10^6',
      'All elements in arr are distinct.',
    ],
    starterCode: {
      javascript: `class Solution {
  /**
   * Finds all pairs with the minimum absolute difference.
   * @param {number[]} arr - array of distinct integers
   * @returns {number[][]} - list of pairs [a, b] where a < b
   */
  closestNumberPairs(arr) {
    // Your implementation here
    return [];
  }
}`,
      typescript: `class Solution {
  closestNumberPairs(arr: number[]): number[][] {
    // Your implementation here
    return [];
  }
}`,
      python: `class Solution:
    def closestNumberPairs(self, arr):
        # Your implementation here
        return []
`,
    },
    harness: minAbsDifferenceHarness,
    testCases: [
      {
        input: '{"arr":[7,3,5,9]}',
        expectedOutput: '[[3,5],[5,7],[7,9]]',
      },
      {
        input: '{"arr":[4,2,1,3]}',
        expectedOutput: '[[1,2],[2,3],[3,4]]',
      },
    ],
  },
  {
    id: '2',
    title: 'Add Binary',
    difficulty: 'Easy',
    acceptance: 30.5,
    tags: ['String', 'Math', 'Bit Manipulation'],
    description: `Given two binary strings **a** and **b**, return their sum as a binary string.

The strings only contain the characters **'0'** and **'1'** and have no leading zeros (except for the number 0 itself).`,
    examples: [
      {
        input: 'a = "11", b = "1"',
        output: '"100"',
      },
      {
        input: 'a = "1010", b = "1011"',
        output: '"10101"',
      },
    ],
    constraints: [
      '1 <= a.length, b.length <= 10^4',
      'Each character is either "0" or "1".',
    ],
    starterCode: {
      javascript: `class Solution {
  /**
   * @param {string} a
   * @param {string} b
   * @returns {string}
   */
  addBinary(a, b) {
    // Your implementation here
    return "";
  }
}`,
      typescript: `class Solution {
  addBinary(a: string, b: string): string {
    // Your implementation here
    return "";
  }
}`,
      python: `class Solution:
    def addBinary(self, a, b):
        # Your implementation here
        return ""
`,
    },
    harness: addBinaryHarness,
    testCases: [
      {
        input: '{"a":"11","b":"1"}',
        expectedOutput: '100',
      },
      {
        input: '{"a":"1010","b":"1011"}',
        expectedOutput: '10101',
      },
    ],
  },
  {
    id: '3',
    title: 'Decode Ways',
    difficulty: 'Medium',
    acceptance: 46.5,
    tags: ['String', 'Dynamic Programming'],
    description: `A message containing letters from **A-Z** can be encoded into numbers using the mapping:

\`\`\`
"A" -> "1"
"B" -> "2"
...
"Z" -> "26"
\`\`\`

Given a string **s** containing only digits, return the **number of ways** to decode it.

The answer is guaranteed to fit in a 32-bit integer.`,
    examples: [
      { input: 's = "12"', output: '2', explanation: '"AB" or "L"' },
      { input: 's = "226"', output: '3' },
      { input: 's = "06"', output: '0' },
    ],
    constraints: ['1 <= s.length <= 100', 's contains only digits.'],
    starterCode: {
      javascript: `class Solution {
  /**
   * @param {string} s
   * @returns {number}
   */
  numDecodings(s) {
    // Your implementation here
    return 0;
  }
}`,
      typescript: `class Solution {
  numDecodings(s: string): number {
    // Your implementation here
    return 0;
  }
}`,
      python: `class Solution:
    def numDecodings(self, s):
        # Your implementation here
        return 0
`,
    },
    harness: decodeWaysHarness,
    testCases: [
      { input: '{"s":"12"}', expectedOutput: '2' },
      { input: '{"s":"226"}', expectedOutput: '3' },
      { input: '{"s":"06"}', expectedOutput: '0' },
    ],
  },
  {
    id: '4',
    title: 'House Robber',
    difficulty: 'Medium',
    acceptance: 36.9,
    tags: ['Array', 'Dynamic Programming'],
    description: `You are a robber planning to loot houses along a street. Each house has a certain amount of money stashed. The only constraint is that **adjacent houses are connected to the same security system**, and triggering an alarm if two adjacent houses are robbed on the same night.

Given an integer array **nums** representing the amount of money at each house, return the **maximum amount of money** you can rob tonight without alerting the police.`,
    examples: [
      { input: 'nums = [1,2,3,1]', output: '4', explanation: 'Rob house 0 + house 2.' },
      { input: 'nums = [2,7,9,3,1]', output: '12' },
    ],
    constraints: ['1 <= nums.length <= 100', '0 <= nums[i] <= 400'],
    starterCode: {
      javascript: `class Solution {
  /**
   * @param {number[]} nums
   * @returns {number}
   */
  rob(nums) {
    // Your implementation here
    return 0;
  }
}`,
      typescript: `class Solution {
  rob(nums: number[]): number {
    // Your implementation here
    return 0;
  }
}`,
      python: `class Solution:
    def rob(self, nums):
        # Your implementation here
        return 0
`,
    },
    harness: houseRobberHarness,
    testCases: [
      { input: '{"nums":[1,2,3,1]}', expectedOutput: '4' },
      { input: '{"nums":[2,7,9,3,1]}', expectedOutput: '12' },
    ],
  },
  {
    id: '5',
    title: 'Integer Break',
    difficulty: 'Medium',
    acceptance: 55.4,
    tags: ['Math', 'Dynamic Programming'],
    description: `Given an integer **n**, break it into the sum of **k positive integers** where k >= 2 and maximize the product of those integers.

Return the **maximum product** you can get.`,
    examples: [
      { input: 'n = 2', output: '1', explanation: '2 = 1 + 1, 1 * 1 = 1.' },
      { input: 'n = 10', output: '36', explanation: '10 = 3 + 3 + 4, 3 * 3 * 4 = 36.' },
    ],
    constraints: ['2 <= n <= 58'],
    starterCode: {
      javascript: `class Solution {
  /**
   * @param {number} n
   * @returns {number}
   */
  integerBreak(n) {
    // Your implementation here
    return 0;
  }
}`,
      typescript: `class Solution {
  integerBreak(n: number): number {
    // Your implementation here
    return 0;
  }
}`,
      python: `class Solution:
    def integerBreak(self, n):
        # Your implementation here
        return 0
`,
    },
    harness: integerBreakHarness,
    testCases: [
      { input: '{"n":2}', expectedOutput: '1' },
      { input: '{"n":10}', expectedOutput: '36' },
    ],
  },
  {
    id: '6',
    title: 'Two Sum',
    difficulty: 'Easy',
    acceptance: 52.7,
    tags: ['Array', 'Hash Table'],
    description: `Given an array of integers **nums** and an integer **target**, return indices of the **two numbers** that add up to target.

You may assume that each input has **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order — for grading we sort the indices ascending.`,
    examples: [
      {
        input: 'nums = [2, 7, 11, 15], target = 9',
        output: '[0, 1]',
        explanation: 'Because nums[0] + nums[1] == 9.',
      },
      { input: 'nums = [3, 2, 4], target = 6', output: '[1, 2]' },
      { input: 'nums = [3, 3], target = 6', output: '[0, 1]' },
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.',
    ],
    starterCode: {
      javascript: `class Solution {
  /**
   * @param {number[]} nums
   * @param {number} target
   * @returns {number[]}
   */
  twoSum(nums, target) {
    // Your implementation here
    return [];
  }
}`,
      typescript: `class Solution {
  twoSum(nums: number[], target: number): number[] {
    // Your implementation here
    return [];
  }
}`,
      python: `class Solution:
    def twoSum(self, nums, target):
        # Your implementation here
        return []
`,
      java: `import java.util.*;
import java.io.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your implementation here
        return new int[0];
    }
}`,
    },
    harness: twoSumHarness,
    testCases: [
      { input: '2 7 11 15\n9', expectedOutput: '0 1' },
      { input: '3 2 4\n6', expectedOutput: '1 2' },
      { input: '3 3\n6', expectedOutput: '0 1' },
    ],
  },
  {
    id: '7',
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    acceptance: 51.9,
    tags: ['Dynamic Programming', 'Math', 'Memoization'],
    description: `You are climbing a staircase. It takes **n** steps to reach the top.

Each time you can climb either **1 step** or **2 steps**. In how many distinct ways can you climb to the top?

This is the canonical introductory **dynamic programming** problem — recognise the Fibonacci recurrence \`f(n) = f(n-1) + f(n-2)\`.`,
    examples: [
      { input: 'n = 2', output: '2', explanation: '1 + 1 or 2.' },
      { input: 'n = 3', output: '3', explanation: '1+1+1, 1+2, 2+1.' },
      { input: 'n = 5', output: '8' },
    ],
    constraints: ['1 <= n <= 45'],
    starterCode: {
      javascript: `class Solution {
  /**
   * @param {number} n
   * @returns {number}
   */
  climbStairs(n) {
    // Your implementation here
    return 0;
  }
}`,
      typescript: `class Solution {
  climbStairs(n: number): number {
    // Your implementation here
    return 0;
  }
}`,
      python: `class Solution:
    def climbStairs(self, n):
        # Your implementation here
        return 0
`,
      java: `import java.util.*;
import java.io.*;

class Solution {
    public int climbStairs(int n) {
        // Your implementation here
        return 0;
    }
}`,
    },
    harness: climbingStairsHarness,
    testCases: [
      { input: '2', expectedOutput: '2' },
      { input: '3', expectedOutput: '3' },
      { input: '5', expectedOutput: '8' },
      { input: '10', expectedOutput: '89' },
    ],
  },
  {
    id: '8',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    acceptance: 41.2,
    tags: ['String', 'Stack'],
    description: `Given a string **s** containing just the characters \`(\`, \`)\`, \`{\`, \`}\`, \`[\` and \`]\`, determine whether the input string is **valid**.

A string is valid if:
- Open brackets are closed by the same type of brackets.
- Open brackets are closed in the correct order.
- Every close bracket has a corresponding open bracket of the same type.

Classic **stack** problem — push opens, match closes against the top of the stack.`,
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' },
      { input: 's = "([)]"', output: 'false' },
      { input: 's = "{[]}"', output: 'true' },
    ],
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only \'()[]{}\'.',
    ],
    starterCode: {
      javascript: `class Solution {
  /**
   * @param {string} s
   * @returns {boolean}
   */
  isValid(s) {
    // Your implementation here
    return false;
  }
}`,
      typescript: `class Solution {
  isValid(s: string): boolean {
    // Your implementation here
    return false;
  }
}`,
      python: `class Solution:
    def isValid(self, s):
        # Your implementation here
        return False
`,
      java: `import java.util.*;
import java.io.*;

class Solution {
    public boolean isValid(String s) {
        // Your implementation here
        return false;
    }
}`,
    },
    harness: validParenthesesHarness,
    testCases: [
      { input: '()', expectedOutput: 'true' },
      { input: '()[]{}', expectedOutput: 'true' },
      { input: '(]', expectedOutput: 'false' },
      { input: '([)]', expectedOutput: 'false' },
      { input: '{[]}', expectedOutput: 'true' },
    ],
  },
];

export function getProblemById(id: string | undefined): Problem | undefined {
  if (!id) return undefined;
  return PROBLEMS.find((problem) => problem.id === id);
}

export function difficultyTint(difficulty: Difficulty) {
  switch (difficulty) {
    case 'Easy':
      return { fg: '#86efac', bg: 'rgba(134, 239, 172, 0.14)' };
    case 'Medium':
      return { fg: '#fdba74', bg: 'rgba(253, 186, 116, 0.14)' };
    case 'Hard':
      return { fg: '#fca5a5', bg: 'rgba(252, 165, 165, 0.14)' };
  }
}

export const LANGUAGE_LABEL: Record<LanguageId, string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  python: 'Python',
  java: 'Java',
};

export const LANGUAGE_TINT: Record<LanguageId, string> = {
  javascript: '#f7df1e',
  typescript: '#3178c6',
  python: '#3776ab',
  java: '#f89820',
};

/** Short 2-character badge used in the language picker chip. */
export const LANGUAGE_BADGE: Record<LanguageId, string> = {
  javascript: 'JS',
  typescript: 'TS',
  python: 'PY',
  java: 'JV',
};

/** Canonical display order for languages in the picker. */
export const LANGUAGE_ORDER: LanguageId[] = [
  'javascript',
  'typescript',
  'python',
  'java',
];

/**
 * Returns the languages a given problem ships starter code + a harness for,
 * preserving `LANGUAGE_ORDER`.
 */
export function getAvailableLanguages(problem: Problem): LanguageId[] {
  return LANGUAGE_ORDER.filter(
    (lang) =>
      typeof problem.starterCode[lang] === 'string' &&
      typeof problem.harness[lang] === 'string'
  );
}

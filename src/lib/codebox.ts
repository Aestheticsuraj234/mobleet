import Constants from 'expo-constants';

import type { LanguageId, Problem } from './problems';

/** Mapping from our language ids to CodeBox `language_id` values. */
const LANGUAGE_ID_MAP: Record<LanguageId, number> = {
  javascript: 63,
  typescript: 74,
  python: 71,
  java: 62,
};

export type RunOutcome = 'accepted' | 'wrong-answer' | 'error' | 'pending';

export type CaseResult = {
  index: number;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  stderr: string;
  status: { id: number; description: string };
  outcome: RunOutcome;
  timeSec: number | null;
  memoryKb: number | null;
};

type CodeBoxResponse = {
  stdout: string | null;
  stderr: string | null;
  status: { id: number; description: string };
  time: string | null;
  memory: number | null;
};

/** Resolves the URL of our local Expo dev server / API route handler. */
function resolveApiBaseUrl(): string {
  if (process.env.EXPO_PUBLIC_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_API_BASE_URL;
  }

  const hostUri =
    Constants.expoConfig?.hostUri ?? (Constants as any).manifest?.hostUri;

  if (hostUri) {
    const host = hostUri.split('/')[0];
    return `http://${host}`;
  }

  return 'http://localhost:8081';
}

/**
 * Build the full source code that gets sent to CodeBox: user's solution
 * followed by a per-problem harness that reads the test case from stdin and
 * prints the result.
 */
export function buildSourceCode(
  problem: Problem,
  language: LanguageId,
  userCode: string
): string {
  const harness = problem.harness[language];
  if (!harness) {
    throw new Error(
      `Problem "${problem.title}" does not support language "${language}".`
    );
  }
  return `${userCode}\n${harness}`;
}

/** Normalise output so trailing whitespace / newlines don't fail comparisons. */
function normalise(value: string | null | undefined): string {
  if (!value) return '';
  return value.replace(/\r\n/g, '\n').trim();
}

export async function runSingleCase(
  problem: Problem,
  language: LanguageId,
  userCode: string,
  testCase: { input: string; expectedOutput: string },
  index: number
): Promise<CaseResult> {
  const baseUrl = resolveApiBaseUrl();
  const sourceCode = buildSourceCode(problem, language, userCode);
  const languageId = LANGUAGE_ID_MAP[language];

  try {
    const response = await fetch(`${baseUrl}/api/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language_id: languageId,
        source_code: sourceCode,
        stdin: testCase.input,
        expected_output: testCase.expectedOutput,
      }),
    });

    if (!response.ok) {
      let detail = `HTTP ${response.status}`;
      try {
        const err = (await response.json()) as { error?: string; detail?: string };
        detail = err.error ?? err.detail ?? detail;
      } catch {
        /* noop */
      }
      return {
        index,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: '',
        stderr: detail,
        status: { id: -1, description: 'Network Error' },
        outcome: 'error',
        timeSec: null,
        memoryKb: null,
      };
    }

    const data = (await response.json()) as CodeBoxResponse;
    const actualOutput = normalise(data.stdout);
    const expectedOutput = normalise(testCase.expectedOutput);

    let outcome: RunOutcome;
    if (data.status.id === 3 && actualOutput === expectedOutput) {
      outcome = 'accepted';
    } else if (data.status.id === 3 || data.status.id === 4) {
      outcome = actualOutput === expectedOutput ? 'accepted' : 'wrong-answer';
    } else {
      outcome = 'error';
    }

    return {
      index,
      input: testCase.input,
      expectedOutput: testCase.expectedOutput,
      actualOutput,
      stderr: normalise(data.stderr),
      status: data.status,
      outcome,
      timeSec: data.time ? Number(data.time) : null,
      memoryKb: data.memory ?? null,
    };
  } catch (err) {
    return {
      index,
      input: testCase.input,
      expectedOutput: testCase.expectedOutput,
      actualOutput: '',
      stderr: err instanceof Error ? err.message : String(err),
      status: { id: -1, description: 'Network Error' },
      outcome: 'error',
      timeSec: null,
      memoryKb: null,
    };
  }
}

export async function runAllCases(
  problem: Problem,
  language: LanguageId,
  userCode: string
): Promise<CaseResult[]> {
  return Promise.all(
    problem.testCases.map((tc, index) =>
      runSingleCase(problem, language, userCode, tc, index)
    )
  );
}

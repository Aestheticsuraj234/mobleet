/**
 * Server-side proxy for the ChaiCode CodeBox execution API.
 *
 * Keeps `CODEBOX_TOKEN` off the client and centralises request shape.
 *
 * Docs: https://chaicode.net/docs
 */

const CODEBOX_BASE_URL = 'https://chaicode.net';

type RunRequest = {
  language_id: number;
  source_code: string;
  stdin?: string;
  expected_output?: string;
  cpu_time_limit?: number;
  memory_limit?: number;
};

type CodeBoxResponse = {
  stdout: string | null;
  stderr: string | null;
  status: { id: number; description: string };
  time: string | null;
  memory: number | null;
  token?: string;
};

export async function POST(request: Request) {
  const token = process.env.CODEBOX_TOKEN;

  if (!token) {
    return Response.json(
      { error: 'CODEBOX_TOKEN is not configured on the server.' },
      { status: 500 }
    );
  }

  let body: RunRequest;
  try {
    body = (await request.json()) as RunRequest;
  } catch {
    return Response.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  if (!body?.language_id || !body?.source_code) {
    return Response.json(
      { error: '`language_id` and `source_code` are required.' },
      { status: 400 }
    );
  }

  try {
    const upstream = await fetch(`${CODEBOX_BASE_URL}/api/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': token,
      },
      body: JSON.stringify({
        language_id: body.language_id,
        source_code: body.source_code,
        stdin: body.stdin ?? '',
        expected_output: body.expected_output,
        cpu_time_limit: body.cpu_time_limit ?? 5,
        memory_limit: body.memory_limit ?? 256000,
      }),
    });

    const text = await upstream.text();

    if (!upstream.ok) {
      return Response.json(
        {
          error: `CodeBox responded with ${upstream.status}`,
          detail: text,
        },
        { status: upstream.status }
      );
    }

    const data = JSON.parse(text) as CodeBoxResponse;
    return Response.json(data);
  } catch (err) {
    return Response.json(
      {
        error: 'Failed to reach CodeBox.',
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 502 }
    );
  }
}

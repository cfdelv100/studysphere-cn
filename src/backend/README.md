# StudySphere API

This small Express API keeps the LLM provider key on the server and generates activity-specific Chinese study questions with the Vercel AI SDK.

## Run locally

Use Node.js 22.13 or newer (the backend uses Node's built-in SQLite module).

1. Copy the repository's `.env.example` to `.env` and add your provider key.
2. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` for the administrator account you want. Use a unique password of at least 12 characters. The first backend startup creates this admin account if no admin exists. Leave these unset to run without an administrator account.
3. In one terminal, run `npm run dev:backend`.
4. In a second terminal, run `npm run dev` and open `http://localhost:8080`.

Vite forwards `/api/*` requests to the API on port 3001. `GET /api/health` checks the server; `POST /api/questions` generates a validated question set.

Vocabulary and accounts are stored in SQLite at `DATABASE_PATH` (default `data/studysphere.sqlite`). The seed set is inserted on first startup and includes a dedicated Food & Dining word group. New registrations get a regular user role; the admin account is created only from the server-side bootstrap variables. Admins can see the account list at **Accounts**.

Passwords are stored as salted scrypt hashes. Sign-in uses a random, server-validated, HTTP-only cookie; the database stores only a hash of the cookie token. Sessions are scoped to their owner. When deploying publicly, serve over HTTPS, use a private database volume, configure backups, and add email verification and password reset flows before accepting real user accounts.

## Connect OpenAI

Create an API key in your OpenAI project, then set `OPENAI_API_KEY` in the root `.env` file. Optionally set `OPENAI_MODEL` to a model available to that project and `API_PORT` to change the API port. Restart the backend after changing environment values. Never prefix the key with `VITE_`; Vite exposes `VITE_*` variables to browser code.

The endpoint uses `@ai-sdk/openai` to create an OpenAI model and Vercel AI SDK's `generateText` plus `Output.object()` to request and validate a Zod schema. To use another provider later, install its AI SDK provider package and replace the model construction in `server.ts`; the endpoint and question schema can stay the same.

## Request example

```json
{
  "activity": "story-reader",
  "excludeQuestions": ["Where did Xiaoming go?"]
}
```

Each request generates exactly five questions. The server supplies a built-in vocabulary set or story for the selected activity; the UI does not ask learners to enter a prompt. Each **Generate more Questions** click appends another set and sends recent question text so the model can avoid repeats. If no provider key is configured, the API returns a clear setup error while the built-in starter question remains usable.

For production, deploy this API behind the same origin as the frontend or configure a reverse proxy for `/api`. Add user authentication, request rate limits, and persistent session storage before exposing generation publicly.

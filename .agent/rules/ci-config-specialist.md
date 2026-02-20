# ⚙️ CI / Config Specialist — Rules & Patterns

**Scope:** `playwright.config.ts`, `.github/**`, `global-setup.ts`, `global-teardown.ts`, `src/config/**`

> First read `constitution.md`. These rules extend it for the infrastructure domain.

---

## 🔧 Playwright Configuration Rules

### Project Structure
```typescript
// ✅ Each project targets a specific directory and purpose
projects: [
    {
        name: 'app',
        testDir: './src/tests/app',        // Authenticated UI tests
        use: {
            ...devices['Desktop Chrome'],
            storageState: './auth/user.json',
        },
    },
    {
        name: 'no-auth',
        testDir: './src/tests/no-auth',    // Unauthenticated UI tests
        use: { ...devices['Desktop Chrome'] },
    },
    {
        name: 'api',
        testDir: './src/tests/api',        // API-only tests (no browser state needed)
        use: { ...devices['Desktop Chrome'] },
    },
    {
        name: 'security',
        testDir: './src/tests',
        testMatch: '**/ai-guard.spec.ts',  // Targeted security tests
        use: { ...devices['Desktop Chrome'] },
    },
],
```

### Parallel Safety
- **`workers: 1`** for the `app` project — authenticated tests share one logged-in user; parallel runs corrupt cart/session state.
- **API tests** can safely run with multiple workers (stateless HTTP calls).
- **No test** may write to a shared file or shared database row during execution.

### CI-Specific Flags
```typescript
// ✅ Required CI config
forbidOnly: !!process.env.CI,     // Fail build on stray .only
retries: process.env.CI ? 2 : 0,  // Retry only in CI, never locally
```

---

## 🌍 Environment Configuration Rules

All environment values must go through `src/config/env.config.ts` — never access `process.env` directly in tests.

```typescript
// ✅ src/config/env.config.ts — Zod-validated environment
import { z } from 'zod';
import dotenv from 'dotenv';
dotenv.config();

const envSchema = z.object({
    BASE_URL: z.string().url().default('https://automationexercise.com'),
    USER_EMAIL: z.string().email().default('testuser@antigravity.dev'),
    USER_PASSWORD: z.string().default('Test@1234'),
    USER_NAME: z.string().default('Antigravity Tester'),
    API_TOKEN: z.string().optional(),
    CI: z.string().optional(),
});

export const envConfig = envSchema.parse(process.env);
```

### Rules
- Env config must be Zod-validated — this catches missing/malformed vars at startup, not mid-test
- Use `.env` for local secrets, `.env.example` as the documentation template
- Never commit real credentials — `.env` is in `.gitignore`
- `API_TOKEN` and similar secrets must be optional (not required) to allow CI environments with different auth strategies

---

## 🔐 Global Auth Strategy

Authentication is handled **once** in `global-setup.ts` per run:

```typescript
// Pattern:
// 1. Register a fresh user (unique email per run — no account pollution)
// 2. Save storageState → auth/user.json
// 3. Save credentials → auth/user-credentials.json (read by DataFactory)

// ✅ Every test in 'app' project starts pre-authenticated — no UI login UI needed
// ✅ Tests focused on login/register use 'no-auth' project — fresh unauthenticated browser
```

### Auth Rules
- **Never authenticate in individual test bodies** (unless the test is explicitly testing auth)
- If you add a new role (admin, guest), add a separate setup block in `global-setup.ts` and save to a new state file (e.g., `auth/admin.json`)
- Auth state files go in `auth/` — they are gitignored

---

## 🚀 CI Pipeline Rules

```yaml
# .github/workflows/ci.yml — correct order
steps:
  - name: Install deps
  - name: Install browsers
  - name: Lint          # npm run lint — must pass before tests run
  - name: TypeCheck     # npx tsc --noEmit — catches type errors early
  - name: Test          # npm test — runs the full suite
  - name: Upload report # Upload allure-results as artifact on failure
```

### Pipeline Rules
- **Lint before test** — don't waste compute running tests with known linting errors
- **TypeCheck before test** — catches broken imports and type mismatches early
- **Never skip lint/typecheck** in CI to save time — these are your first line of defence
- Upload `allure-results` as a CI artifact on failure (needed for debug)
- Use `continue-on-error: false` — let the pipeline fail loudly, never hide failures

---

## 📦 Reporter Configuration

```typescript
// ✅ Local + CI reporters
reporter: [
    ['list'],              // Console output for local debugging
    ['allure-playwright'], // Rich HTML report for CI artifacts
],

// Use:
artifact:
  video: 'retain-on-failure'      // Record video, keep only on failure
  trace: 'retain-on-failure'      // Capture trace, keep only on failure
  screenshot: 'only-on-failure'   // Screenshot only on failure
```

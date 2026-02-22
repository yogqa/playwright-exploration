# 🔧 Fixture Helper Specialist — Rules & Patterns

**Scope:** `src/fixtures/**`

> First read `constitution.md`. These rules extend it for the fixture infrastructure domain.

---

## 🏛️ Fixture Architecture

The `src/fixtures/` folder follows a strict ownership model:

```
src/fixtures/
 ├── ui.fixture.ts      ← UI Specialist owns this (Page Objects only)
 ├── api.fixture.ts     ← API Specialist owns this (apiContext + API clients only)
 ├── test.fixture.ts    ← COMPOSER ONLY — never add logic here
 └── data/              ← DataFactory files (test data — no fixtures here)
```

**`test.fixture.ts` is the single import point for all test specs.**  
It uses `mergeTests()` to compose `ui.fixture` and `api.fixture` and re-exports `expect`.  
No business logic, no new fixtures, no teardown — it is a pure composer.

---

## ✅ Allowed Responsibilities

Fixtures exist to **prepare state**, not to verify truth.

| Responsibility | Owner File |
|---|---|
| Inject Page Object instances | `ui.fixture.ts` |
| Provide `APIRequestContext` | `api.fixture.ts` |
| Inject domain API clients | `api.fixture.ts` |
| Manage `APIRequestContext` lifecycle (dispose) | `api.fixture.ts` |
| Compose all fixtures into a single `test` export | `test.fixture.ts` |

---

## ❌ Hard Rules — Never Violate

### No Assertions in Fixtures

```typescript
// ❌ NEVER — fixtures must not verify anything
apiContext: async ({ }, use) => {
    const ctx = await request.newContext({ ... });
    expect(ctx).toBeDefined();       // ← VIOLATION
    await use(ctx);
};

// ✅ Fixtures only set up and tear down
apiContext: async ({ }, use) => {
    const ctx = await request.newContext({ ... });
    await use(ctx);
    await ctx.dispose();             // ← teardown only
};
```

### No API Calls for Verification

```typescript
// ❌ NEVER — fixtures must not call APIs to check state
authContext: async ({ apiContext }, use) => {
    const res = await apiContext.get('/api/auth/validate');  // ← VIOLATION
    await use(authContext);
};
```

### No UI Actions

```typescript
// ❌ NEVER — api.fixture.ts must not touch page or browser
apiContext: async ({ page }, use) => {     // ← VIOLATION: injecting `page`
    await page.goto('/login');
};
```

### No Shared Mutable State Between Workers

```typescript
// ❌ NEVER — breaks parallel execution
let sharedToken: string;
apiContext: async ({ }, use) => {
    sharedToken = await getToken();        // ← module-level mutation = VIOLATION
    await use(ctx);
};

// ✅ Each worker gets its own context from Playwright's `request` factory
apiContext: async ({ }, use) => {
    const ctx = await request.newContext({ ... });  // isolated per worker
    await use(ctx);
    await ctx.dispose();
};
```

---

## 📐 Adding a New Page Object Fixture

1. Create the Page Object in `src/pages/my-new.page.ts` (follow `ui-specialist.md`)
2. Open `src/fixtures/ui.fixture.ts`
3. Import the class and add a typed entry to `UiFixtures`:

```typescript
// In ui.fixture.ts
import { MyNewPage } from '../pages/my-new.page';

type UiFixtures = {
    // ... existing entries
    myNewPage: MyNewPage;    // ← add here
};

export const test = base.extend<UiFixtures>({
    // ... existing fixtures
    myNewPage: async ({ page }, use) => {
        await use(new MyNewPage(page));
    },
});
```

**Do NOT touch `test.fixture.ts` or `api.fixture.ts`.**

---

## 📐 Adding a New API Client Fixture

1. Create the client in `src/tests/api-clients/my-domain.client.ts` (follow `api-specialist.md`)
2. Open `src/fixtures/api.fixture.ts`
3. Import and add to `ApiFixtures`:

```typescript
// In api.fixture.ts
import { MyDomainApiClient } from '../tests/api-clients/my-domain.client';

type ApiFixtures = {
    // ... existing entries
    myDomainApi: MyDomainApiClient;    // ← add here
};

export const test = base.extend<ApiFixtures>({
    // ... existing fixtures
    myDomainApi: async ({ apiContext }, use) => {
        await use(new MyDomainApiClient(apiContext));
    },
});
```

**Do NOT touch `test.fixture.ts` or `ui.fixture.ts`.**

---

## 🔗 Fixture Dependency Rules

| From | Can depend on | Cannot depend on |
|---|---|---|
| `ui.fixture.ts` | Playwright `page` | `apiContext`, `request`, any API client |
| `api.fixture.ts` | Playwright `request` | `page`, any Page Object |
| `test.fixture.ts` | `mergeTests(withUi, withApi)` | Any direct fixture logic |

---

## Definition of Done (Fixture Changes)

- [ ] `npx tsc --noEmit` exits 0
- [ ] `npx eslint src/ --ext .ts` passes
- [ ] Fixture contains no `expect()` calls
- [ ] Fixture contains no API calls for verification
- [ ] Fixture contains no UI interactions
- [ ] New fixture belongs in the correct specialist file
- [ ] `test.fixture.ts` was NOT modified (unless it's a composer-level structural change)
- [ ] All existing tests still pass (`npm test`)

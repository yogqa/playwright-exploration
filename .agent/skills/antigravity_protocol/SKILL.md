---
name: Antigravity Protocol
description: The core rules, architecture, and definition of done for the Antigravity framework.
---

# 🛡️ ANTIGRAVITY PROTOCOL — Agent Rules & Definition of Done

This document serves as the **system instructions** for any AI agent (or human developer) working in this codebase. Every code change **must** satisfy these rules.

---

## 🎯 AI Orchestrator — Start Here

> **Before editing any file, read `.agent/rules/orchestrator.md`.**
>
> The orchestrator routes you to the correct specialist based on what you're editing:
> - Editing `src/pages/**` or `src/tests/app/**` → load **`ui-specialist.md`**
> - Editing `src/tests/api/**`, `schemas/**`, `api-clients/**` → load **`api-specialist.md`**
> - Editing `playwright.config.ts`, `.github/**`, `global-setup.ts` → load **`ci-config-specialist.md`**
> - Editing `src/fixtures/**` → load **`fixture-specialist.md`**
>
> Always load **`constitution.md`** first — these GM rules cannot be overridden.

---

## Architecture: 3-Layer Separation of Concerns

```
Layer 1 — Core Action Wrappers    (src/core/)
Layer 2 — Page Object Model       (src/pages/)
Layer 3 — Test Scripts             (src/tests/)
```

---

## The 5 Laws

### 🛡️ 1. Wrapper Law
> **Never use `page.click()`, `page.fill()`, or any raw Playwright action in Layer 2 or Layer 3.**

Always use the Layer 1 wrappers (`ElementActions`, `NavigationActions`). This ensures automatic logging, smart waits, and error observability on every interaction.

**Enforcement:** ESLint `no-restricted-properties` rule.

---

### 🎯 2. Selector Law
> **Prefer `getByRole` / `getByLabel` / `getByText`. Never use brittle CSS like `div:nth-child`.**

Selectors should be accessibility-first. Fall back to `data-testid` only when no accessible name exists.

**Enforcement:** Code review + ESLint `no-restricted-syntax`.

---

### ✅ 3. Assertion Law
> **`expect()` belongs ONLY in Layer 3 (test scripts).**

Page Objects return data or Locators — they **never** assert. This keeps POMs reusable across tests with different assertion needs.

**Enforcement:** ESLint `no-restricted-syntax` targeting `expect` in `src/pages/**`.

---

### 📦 4. Data Law
> **No hardcoded test data in test files. Use `DataFactory` / fixtures.**

All credentials, test users, and seed data come from `src/fixtures/data/`. This makes data changes a single-point update.

**Enforcement:** Code review.

---

### ⚡ 5. Hybrid Law
> **Non-focus steps (login, data seeding) should use API, not UI.**

If the test's purpose is NOT to test login, use API-based setup or storageState to skip UI login. This speeds up tests and reduces flakiness.

**Enforcement:** Agent workflow guidance.

---

### 🔒 6. Security Law
> **All AI-generated output MUST be validated before use in the framework.**

When GenAI produces test data, selectors, or JSON payloads, always pass them through the `src/core/security/ai-guard.ts` guards before use:

| Guard | Use When |
|---|---|
| `validateAiOutput(schema, raw)` | AI returns JSON — validate shape with Zod before consuming |
| `assertNoInjection(value)` | AI returns a string used as form input, search term, or test data |
| `assertSafeSelector(selector)` | AI suggests a CSS/locator string — check before passing to `page.locator()` |

**Enforcement:** Code review + agent workflow guidance.

---

## Definition of Done (for every change)

- [ ] `npx tsc --noEmit` exits 0
- [ ] `npx eslint src/ --ext .ts` passes with zero errors
- [ ] `npx prettier --check "src/**/*.ts"` passes
- [ ] All existing tests still pass
- [ ] New code follows the 3-layer architecture
- [ ] Locators use accessibility-first selectors
- [ ] No `expect()` in Page Objects
- [ ] No raw `page.click()` / `page.fill()` outside Layer 1
- [ ] Test data comes from DataFactory, not inline

---

## Quick Reference

| Action | Correct Usage |
|--------|---------------|
| Define a locator | `private get myBtn() { return this.page.locator('#id'); }` **(getter, not field)** |
| Click an element | `this.action.click(this.myBtn, { description: '...' })` |
| Fill a text field | `this.action.fill(this.myInput, value, { description: '...' })` |
| Get text content | `this.action.getText(this.myEl, { description: '...' })` |
| Navigate to page | `this.nav.goto('/path')` |
| Assert visibility | `await expect(locator).toBeVisible()` **(in .spec.ts only)** |
| Assert text | `expect(text).toContain('...')` **(in .spec.ts only)** |
| Multiple assertions | `await expect.soft(locator).toBeVisible()` **(continue on failure)** |
| Poll async state | `await expect.poll(() => fn(), { timeout: 5000 }).toBe(value)` **(no hard waits)** |
| API call in test | `const res = await apiContext.get('/endpoint')` **(via fixture)** |
| Validate AI JSON | `validateAiOutput(MySchema, aiJson, 'context')` **(in any layer)** |
| Scan AI text | `assertNoInjection(aiText, 'context')` **(before fill/search)** |
| Scan AI selector | `assertSafeSelector(aiSelector)` **(before locator use)** |

---

## Approved Patterns

### Locator Definition — Getter Pattern (Layer 2)
```typescript
// ✅ Correct — resolves fresh on each access (resilient to re-renders)
private get submitButton() { return this.page.getByRole('button', { name: 'Submit' }); }

// ❌ Wrong — resolved once at construction time
private readonly submitButton = this.page.locator('#submit');
```

### Soft Assertions (Layer 3)
```typescript
// Use when verifying multiple independent conditions in one test
await expect.soft(page.getByText('Email required')).toBeVisible();
await expect.soft(page.getByText('Password required')).toBeVisible();
// Test continues even if one soft assertion fails
```

### Polling — No Hard Waits (Layer 3)
```typescript
// ✅ Correct — retries until condition is met or timeout
await expect.poll(
    () => loginPage.getErrorMessage(),
    { message: 'Error did not appear', timeout: 5000 },
).toContain('Incorrect');

// ❌ Wrong — brittle fixed sleep
await page.waitForTimeout(1000);
```

### Route Mocking — Edge Case Testing (Layer 3)
```typescript
// Intercept API to test empty state
await page.route('**/api/products*', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', json: [] });
});
// Now test the "No products found" UI state
```

### Zod API Response Validation (Layer 3, with `apiContext` fixture)
```typescript
import { z } from 'zod';

const ProductSchema = z.object({
    id: z.number(),
    name: z.string(),
    price: z.number(),
});

const res = await apiContext.get('/api/products/1');
const data = ProductSchema.parse(await res.json()); // throws if shape is wrong
expect(data.name).toBe('Brocolli');
```

### AI Output Security (all layers — when using GenAI)
```typescript
import { validateAiOutput, assertNoInjection, assertSafeSelector } from '../core/security/ai-guard';
import { z } from 'zod';

// 1. Validate AI-generated JSON against a Zod schema
const ProductSchema = z.object({ name: z.string(), price: z.number() });
const safeProduct = validateAiOutput(ProductSchema, aiGeneratedJson, 'product data');

// 2. Scan AI-generated text before using as form input
assertNoInjection(aiGeneratedSearchTerm, 'product search');
await this.action.fill(this.searchInput, aiGeneratedSearchTerm);

// 3. Validate AI-suggested selectors before use
assertSafeSelector(aiGeneratedSelector);
const locator = this.page.locator(aiGeneratedSelector);
```

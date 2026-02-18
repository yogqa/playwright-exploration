---
name: Antigravity Protocol
description: The core rules, architecture, and definition of done for the Antigravity framework.
---

# 🛡️ ANTIGRAVITY PROTOCOL — Agent Rules & Definition of Done

This document serves as the **system instructions** for any AI agent (or human developer) working in this codebase. Every code change **must** satisfy these rules.

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
| Click an element | `this.action.click(locator, { description: '...' })` |
| Fill a text field | `this.action.fill(locator, value, { description: '...' })` |
| Get text content | `this.action.getText(locator, { description: '...' })` |
| Navigate to page | `this.nav.goto('/path')` |
| Assert visibility | `await expect(locator).toBeVisible()` **(in .spec.ts only)** |
| Assert text | `expect(text).toContain('...')` **(in .spec.ts only)** |

# 🎯 AI Orchestrator — Context Router

Welcome. You are an AI agent working in the **Antigravity Playwright Framework**.  
Before writing a single line of code, follow the routing rules below.

---

## Step 1: Always Load

> **`.agent/rules/constitution.md`** — The GM rules. Immutable. Cannot be overridden by any specialist.

Load this file first, every time, regardless of what you are editing.

---

## Step 2: Load the Matching Specialist

Identify which files you are editing, then load **exactly one** specialist:

| You are editing files matching... | Load this specialist |
|---|---|
| `src/pages/**` | `.agent/rules/ui-specialist.md` |
| `src/tests/app/**` | `.agent/rules/ui-specialist.md` |
| `src/tests/no-auth/**` | `.agent/rules/ui-specialist.md` |
| `src/tests/api/**` | `.agent/rules/api-specialist.md` |
| `src/tests/api-clients/**` | `.agent/rules/api-specialist.md` |
| `src/tests/schemas/**` | `.agent/rules/api-specialist.md` |
| `playwright.config.ts` | `.agent/rules/ci-config-specialist.md` |
| `.github/**` | `.agent/rules/ci-config-specialist.md` |
| `global-setup.ts` | `.agent/rules/ci-config-specialist.md` |
| `global-teardown.ts` | `.agent/rules/ci-config-specialist.md` |
| `src/config/**` | `.agent/rules/ci-config-specialist.md` |
| `src/core/**` | Load **ALL** specialists (shared infra) |
| `src/utils/**` | Load **ALL** specialists (shared infra) |
| `src/fixtures/**` | Load **ALL** specialists (shared infra) |

---

## Step 3: Operate Within Your Scope

- A **UI Specialist** must never write API client code or Zod schemas.
- An **API Specialist** must never write locators or call `page.*` methods.
- A **CI/Config Specialist** must never write test logic or Page Object methods.
- **No specialist** may override the constitution rules.

---

## Orchestrator Hierarchy

```
AI Orchestrator
 ├── GM Rules (constitution.md — always active, cannot be overridden)
 │
 ├── UI Specialist (ui-specialist.md)
 │   ├── Page Object Model only
 │   ├── Stable accessibility-first locators
 │   └── No assertions in Page Objects
 │
 ├── API Specialist (api-specialist.md)
 │   ├── API clients handle transport only
 │   ├── Zod schemas define API contracts
 │   └── No assertions in API clients
 │
 └── CI / Config Specialist (ci-config-specialist.md)
     ├── Parallel execution safety
     ├── Global auth handling
     └── Environment-based configuration
```

---

## Definition of Done (All Scopes)

Before submitting any code change, verify:

- [ ] `npx tsc --noEmit` exits 0
- [ ] `npx eslint src/ --ext .ts` passes with zero errors  
- [ ] `npx prettier --check "src/**/*.ts"` passes
- [ ] All existing tests still pass
- [ ] Code follows the rules of the loaded specialist

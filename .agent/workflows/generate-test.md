---
description: Generate a new Page Object + Test Script from a Codegen recording and test case description
---

# Generate Test — Antigravity AI Workflow

This workflow generates Layer 2 (Page Object) and Layer 3 (Test Script) code from inputs.

## Prerequisites
- The Antigravity Framework is set up (Layer 1 core wrappers exist)
- `ANTIGRAVITY_PROTOCOL.md` rules are understood

## Inputs Required
1. **Codegen Recording** — A `.ts` file from `npx playwright codegen` capturing the user journey
2. **DOM Snapshot / Live Page** — The actual page for selector validation
3. **Test Case Description** — Plain text describing what to test and expected outcomes

## Steps

### 1. Parse the Codegen Recording
- Read the codegen `.ts` file
- Extract the ordered list of user actions (click, fill, navigate, etc.)
- Note which pages/screens are visited

### 2. Map Selectors (Accessibility-First)
- For each action, determine the best selector:
  - **First choice:** `getByRole('button', { name: '...' })`, `getByLabel('...')`
  - **Second choice:** `getByText('...')`, `getByPlaceholder('...')`
  - **Last resort:** `locator('[data-testid="..."]')`
- **NEVER** use brittle CSS like `div:nth-child(2) > span`

### 3. Identify Pages & Check Existing POMs
- Group actions into logical pages/screens
- Check `src/pages/` for existing Page Objects
- If a POM exists, add new methods to it (don't duplicate)
- If no POM exists, create a new one extending `BasePage`

### 4. Determine Assertions
- Parse the test case description for expected outcomes
- Convert each expected outcome into an `expect()` call
- Assertions go ONLY in the `.spec.ts` file (Layer 3)

### 5. Determine Setup Strategy (Hybrid Law)
- If the test focus is NOT on login → use `storageState` or API setup
- If the test focus is NOT on data creation → use API to seed data
- Only use UI steps for the actual behavior being tested

### 6. Generate Code

#### Page Object (Layer 2)
```typescript
// src/pages/[name].page.ts
import { Page } from '@playwright/test';
import { BasePage } from './base.page';

export class [Name]Page extends BasePage {
  // Private locators (accessibility-first)
  private readonly someElement = this.page.getByRole('...');

  constructor(page: Page) {
    super(page);
  }

  // Action methods using Layer 1 wrappers
  async doSomething(): Promise<void> {
    await this.action.click(this.someElement, { description: '...' });
  }
}
```

#### Test Script (Layer 3)
```typescript
// src/tests/[name].spec.ts
import { test, expect } from '../fixtures/test.fixture';

test.describe('[Feature Name]', () => {
  test('should [expected behavior]', async ({ page }) => {
    // Arrange → Act → Assert
  });
});
```

### 7. Self-Validate
// turbo-all
Run these checks before presenting the code:

1. `npx tsc --noEmit` — TypeScript compilation must pass
2. `npx eslint src/ --ext .ts` — Zero ESLint errors
3. `npx playwright test --project=chromium [test-file]` — Test must be green

If any check fails, fix the issue and re-run.

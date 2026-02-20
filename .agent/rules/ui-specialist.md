# 🖥️ UI Specialist — Rules & Patterns

**Scope:** `src/pages/**`, `src/tests/app/**`, `src/tests/no-auth/**`

> First read `constitution.md`. These rules extend it for the UI domain.

---

## 🏛️ Page Object Model (Layer 2)

All UI interactions go through Page Objects. A Page Object:
- Lives in `src/pages/[name].page.ts`
- Extends `BasePage`
- Defines **locators as private getters** (not fields)
- Exposes **action methods** that use Layer 1 wrappers
- **Never** contains `expect()` calls

### Template
```typescript
import { Page } from '@playwright/test';
import { BasePage } from './base.page';

export class ProductsPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    // ✅ Getter pattern — re-resolves on every access (resilient to re-renders)
    private get searchInput() {
        return this.page.getByRole('textbox', { name: 'Search Product' });
    }

    private get searchButton() {
        return this.page.getByRole('button', { name: 'Submit' });
    }

    // ✅ Action method uses Layer 1 wrapper
    async searchProduct(query: string): Promise<void> {
        await this.action.fill(this.searchInput, query, { description: 'Search query' });
        await this.action.click(this.searchButton, { description: 'Submit search' });
    }

    // ✅ Returns data (no assertions)
    async getProductCount(): Promise<number> {
        return this.page.locator('.productinfo').count();
    }
}
```

---

## 🎯 Selector Hierarchy (Strict Order)

Apply selectors in this exact priority order:

| Priority | Selector | Example |
|----------|----------|---------|
| 1️⃣ | `getByRole` | `page.getByRole('button', { name: 'Add to Cart' })` |
| 2️⃣ | `getByLabel` | `page.getByLabel('Email address')` |
| 3️⃣ | `getByPlaceholder` | `page.getByPlaceholder('Search Product')` |
| 4️⃣ | `getByText` | `page.getByText('Subscription')` |
| 5️⃣ | `data-testid` | `page.locator('[data-qa="submit-btn"]')` |
| ❌ | XPath / nth-child / CSS | **Never use these** |

---

## ✅ Assertion Law

**`expect()` belongs ONLY in Layer 3 (`.spec.ts` files).**

```typescript
// ❌ WRONG — assertion inside a Page Object
async isLoggedIn(): Promise<void> {
    await expect(this.page.locator('.loggedIn')).toBeVisible(); // VIOLATION
}

// ✅ CORRECT — return data, assert in the test
async getLoggedInUser(): Promise<string> {
    return this.page.locator('a:has-text("Logged in as")').textContent() ?? '';
}
```

---

## 🔧 Layer 1 Wrapper Law

**Never use raw `page.*` methods in Layer 2 or Layer 3.**  
Always use `this.action.*` wrappers (auto-logging, smart waits, error observability):

```typescript
// ❌ Raw — no logging, no error context
await this.page.click('#submit');
await this.page.fill('#email', value);

// ✅ Layer 1 wrapper — logged and observable
await this.action.click(this.submitButton, { description: 'Submit login form' });
await this.action.fill(this.emailInput, value, { description: 'Enter email' });
```

ESLint will flag `page.click()`, `page.fill()`, `page.check()`, `page.hover()`, `page.selectOption()` with an ANTIGRAVITY VIOLATION error.

---

## ⏳ Wait Patterns (No Hard Waits)

```typescript
// ❌ Hard wait — NEVER
await page.waitForTimeout(2000);

// ✅ Playwright auto-wait — always preferred
await this.action.click(this.submitButton); // auto-waits for element

// ✅ Poll for async state
await expect.poll(
    () => this.getErrorMessage(),
    { message: 'Error did not appear', timeout: 5000 }
).toContain('Invalid credentials');
```

---

## 🧪 Test Script Patterns (Layer 3)

```typescript
import { test, expect } from '../../fixtures/test.fixture';

test.describe('Products', () => {
    // ✅ Arrange → Act → Assert
    test('TC8: Verify product detail page', async ({ productsPage, productDetailPage }) => {
        await productsPage.navigateTo();
        await productsPage.viewProduct(0);

        const name = await productDetailPage.getProductName();
        expect(name).toBeTruthy();
    });

    // ✅ Soft assertions for independent conditions
    test('TC21: Form validation errors', async ({ authPage }) => {
        await authPage.submitEmptyLoginForm();
        await expect.soft(page.getByText('Email required')).toBeVisible();
        await expect.soft(page.getByText('Password required')).toBeVisible();
    });
});
```

---

## 🚀 Hybrid Law (API for Non-Focus Steps)

If the test's purpose is **NOT** to test login or data creation, use API or storageState:

```typescript
// ✅ Test is about cart — use auth/user.json to skip login UI
// playwright.config.ts: storageState: './auth/user.json'

// ✅ Test needs data — seed via API, not UI
const item = await apiContext.post('/api/addToCart', { data: { productId: 1 } });
```

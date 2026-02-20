# 📜 GM Constitution — Immutable Global Rules

These rules are enforced by the **General Manager (GM)** and apply to **every file in the project**.  
No specialist rule can override or relax these constraints.

---

## 🏗️ Architectural Rules

1. **Maintain strict separation** — UI, API, schemas, fixtures, and config layers must never mix.
2. **Follow the defined folder structure** — do not introduce ad-hoc patterns or create files in wrong directories.
3. **Reuse existing utilities and fixtures** — never duplicate logic that already exists.
4. **Zod-first API testing is mandatory** — every API response MUST be validated with Zod before assertions.
5. **Framework structure must be respected** — the 3-layer architecture (Core → Pages → Tests) is non-negotiable.

---

## 🚫 Global Prohibitions

### No Hard Waits
```typescript
// ❌ NEVER — brittle, flaky, slow
await page.waitForTimeout(2000);
await sleep(1000);
setTimeout(() => { ... }, 500);

// ✅ Always — let Playwright's auto-wait handle it, or use:
await expect(locator).toBeVisible();
await expect.poll(() => fn(), { timeout: 5000 }).toBe(value);
```

### No Brittle Locators
```typescript
// ❌ NEVER
page.locator('div:nth-child(3) > span.title')
page.locator('//div[@class="product"]/h2')
page.getByText('Submit')   // text-only without role context

// ✅ Always
page.getByRole('button', { name: 'Submit' })
page.getByLabel('Email address')
page.locator('[data-testid="submit-btn"]')  // last resort only
```

### No Assertions in API Clients
```typescript
// ❌ NEVER — in src/tests/api-clients/**
expect(response.status).toBe(200);
if (!data.products) throw new Error('No products');

// ✅ API clients return raw data. Validation happens in the test.
return response.json();
```

### No API Assertions Without Schema Validation
```typescript
// ❌ NEVER — silent failure if API shape changes
const data = await productsApi.getAllProducts() as any;
expect(data.products.length).toBeGreaterThan(0);

// ✅ Always validate schema FIRST, then assert
const validated = validateSchema(ProductListResponseSchema, data, 'GET /api/productsList');
expect(validated.products.length).toBeGreaterThan(0);
```

### No Schema Definitions in Test Files
```typescript
// ❌ NEVER — in *.spec.ts files
const ProductSchema = z.object({ id: z.number(), name: z.string() });

// ✅ Import schemas from src/tests/schemas/
import { ProductListResponseSchema } from '../schemas/product.schema';
```

### No Business Logic in Test Specs
```typescript
// ❌ NEVER — in *.spec.ts
const discountedPrice = price * 0.9;
const isEligible = user.age >= 18 && user.verified;

// ✅ Business logic belongs in Page Objects or test data factories
const price = await productDetailPage.getPrice();
expect(price).toBeTruthy();
```

---

## ⚡ Zod-First Constitution

- **Zod schemas are the SINGLE SOURCE OF TRUTH** for API contracts
- **Every API response MUST be validated using Zod at runtime**
- **Silent API failures are unacceptable** — a schema mismatch must fail the test immediately
- **API contract drift must fail tests immediately** — no defensive `?.` chains to mask missing fields

---

## 🔒 Security Rules (AI-Generated Code)

When GenAI produces test data, selectors, or JSON payloads, always validate:

| Guard | Use When |
|---|---|
| `validateAiOutput(schema, raw)` | AI returns JSON — validate shape with Zod |
| `assertNoInjection(value)` | AI returns a string used as form input |
| `assertSafeSelector(selector)` | AI suggests a CSS/locator string |

---

## CI / Parallel Safety

- Tests must be **parallel-safe** — no shared mutable state between workers
- No test should depend on the execution order of another test
- Auth state must be set up via `globalSetup` or fixture, not inside test bodies

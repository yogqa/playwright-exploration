# 🔌 API Specialist — Rules & Patterns

**Scope:** `src/tests/api/**`, `src/tests/api-clients/**`, `src/tests/schemas/**`

> First read `constitution.md`. These rules extend it for the API testing domain.

---

## ⚖️ The Zod-First Law

Zod schemas are the **single source of truth** for every API contract.  
**Silent API failures are unacceptable.** Schema drift must fail tests immediately.

```
API Test Flow (MANDATORY — no exceptions):
  Step 1 → Call API client         (transport only, returns unknown)
  Step 2 → Validate with Zod       (schema defines the contract)
  Step 3 → Assert on typed data    (never on unvalidated raw data)
```

---

## 📁 Folder Responsibilities

| Folder | Purpose | Rules |
|--------|---------|-------|
| `src/tests/schemas/` | Zod schema definitions | No test logic, no `expect()`, no `describe()` |
| `src/tests/api-clients/` | HTTP transport wrappers | No Zod, no `expect()`, return raw `unknown` |
| `src/tests/api/` | API test specs | Import schemas + clients, validate then assert |

---

## 📐 Zod Schema Rules

Schemas live in `src/tests/schemas/` — one file per domain entity.

```typescript
// ✅ src/tests/schemas/product.schema.ts
import { z } from 'zod';

// Model schemas (reusable building blocks)
const CategorySchema = z.object({
    usertype: z.object({ usertype: z.string() }),
    category: z.string(),
});

export const ProductSchema = z.object({
    id: z.number(),
    name: z.string(),
    price: z.string(),
    brand: z.string(),
    category: CategorySchema,
});

// Response envelope schema (wraps model with API metadata)
export const ProductListResponseSchema = z.object({
    responseCode: z.number(),
    products: z.array(ProductSchema),
});

// Inferred TypeScript types (no separate interface needed)
export type Product = z.infer<typeof ProductSchema>;
export type ProductListResponse = z.infer<typeof ProductListResponseSchema>;
```

### Schema Rules
- One schema per API domain entity
- Validate required/optional fields, types, nested structures, enums
- Schemas contain **NO test logic** — no `describe()`, no `test()`, no `expect()`
- Export inferred TypeScript types with `z.infer<typeof Schema>` (avoid duplicate interfaces)
- Use `z.optional()` only for fields the API genuinely omits — don't hide contract drift

---

## 🚚 API Client Rules

API clients live in `src/tests/api-clients/` — one file per domain.

```typescript
// ✅ src/tests/api-clients/products.client.ts
import { APIRequestContext } from '@playwright/test';

export class ProductsApiClient {
    constructor(private readonly request: APIRequestContext) {}

    // ✅ Returns unknown — schema validation happens in the test
    async getAllProducts(): Promise<unknown> {
        const res = await this.request.get('/api/productsList');
        return res.json();
    }

    async searchProduct(query: string): Promise<unknown> {
        const res = await this.request.post('/api/searchProduct', {
            form: { search_product: query },
        });
        return res.json();
    }
}
```

### Client Rules
- Accept `APIRequestContext` as constructor argument (injected via fixture)
- Return `Promise<unknown>` — **never** a typed interface (keeps transport dumb)
- **Must NOT import** `zod` or `z`
- **Must NOT call** `expect()` or any assertion
- **Must NOT** validate, check, or interpret the response
- HTTP method + endpoint + params only — nothing else

---

## 🧪 API Test Rules

API tests live in `src/tests/api/`.

```typescript
// ✅ src/tests/api/products.api.spec.ts
import { test, expect } from '../../fixtures/test.fixture';
import { validateSchema } from '../../utils/schema-validator';
import { ProductListResponseSchema } from '../schemas/product.schema';

test.describe('Products API', () => {

    test('GET /api/productsList — validates schema and business rules', async ({ productsApi }) => {
        // Step 1: Call API client (raw unknown data)
        const rawData = await productsApi.getAllProducts();

        // Step 2: Validate schema — fails immediately if contract drifts
        const validated = validateSchema(
            ProductListResponseSchema,
            rawData,
            'GET /api/productsList'
        );

        // Step 3: Business assertions on fully-typed validated data ONLY
        expect(validated.responseCode).toBe(200);
        expect(validated.products.length).toBeGreaterThan(0);
        expect(validated.products[0]).toHaveProperty('id');
        expect(validated.products[0]).toHaveProperty('name');
    });

});
```

### Test Rules
- Schema import must come from `src/tests/schemas/` — **never** define inline
- `validateSchema()` call must come **before** any business assertion
- Never cast raw data with `as any` or `as SomeType` to bypass validation
- Test names should describe the endpoint and what is being validated

---

## 🔧 Schema Validator Utility

Use the shared helper from `src/utils/schema-validator.ts`:

```typescript
import { validateSchema } from '../../utils/schema-validator';

// Returns fully-typed data or throws with a descriptive message
const validated = validateSchema(MySchema, rawData, 'context for error message');
```

**Do NOT** use `schema.parse()` directly in tests — use `validateSchema()` for consistent error messages.  
**Do NOT** use `schema.safeParse()` without checking `result.success` — that is a silent failure.

---

## 🔗 Hybrid UI + API Tests

After UI actions, verify backend state via API (and validate with Zod):

```typescript
test('Hybrid: UI search results match API contract', async ({ productsPage, productsApi }) => {
    // UI action
    await productsPage.navigateTo();
    await productsPage.searchProduct('Top');
    const uiCount = await productsPage.getProductCount();

    // API verification (Zod-validated)
    const rawData = await productsApi.searchProduct('Top');
    const validated = validateSchema(ProductListResponseSchema, rawData, 'POST /api/searchProduct');

    // Cross-reference
    expect(validated.responseCode).toBe(200);
    expect(validated.products.length).toBeGreaterThan(0);
    expect(uiCount).toBeGreaterThan(0);
});
```

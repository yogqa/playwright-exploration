import { test as base, request, APIRequestContext } from '@playwright/test';
import { ProductsApiClient } from '../tests/api-clients/products.client';
import { UserApiClient } from '../tests/api-clients/user.client';
import { envConfig } from '../config/env.config';

/**
 * API Fixture Specialist — owned by the Fixture Helper Specialist.
 *
 * Responsibilities:
 *   ✅ Provide a pre-configured `APIRequestContext` (`apiContext`)
 *   ✅ Inject domain API clients (`productsApi`, `userApi`)
 *   ✅ Manage resource lifecycle — `apiContext` is disposed after each test
 *
 * Hard rules (enforced by fixture-specialist.md):
 *   ❌ No assertions (`expect()`)
 *   ❌ No Zod schemas or validation
 *   ❌ No Page Objects or `page.*` interactions
 *   ❌ No UI actions
 *   ✅ Parallel-safe — each test worker gets its own `APIRequestContext`
 */
type ApiFixtures = {
    /** Raw Playwright APIRequestContext — pre-configured with baseURL + auth headers. */
    apiContext: APIRequestContext;
    /** Products domain client — HTTP transport only, returns unknown. */
    productsApi: ProductsApiClient;
    /** User domain client — HTTP transport only, returns unknown. */
    userApi: UserApiClient;
};

export const test = base.extend<ApiFixtures>({

    // eslint-disable-next-line no-empty-pattern
    apiContext: async ({ }, use) => {
        const ctx = await request.newContext({
            baseURL: envConfig.BASE_URL,
            extraHTTPHeaders: {
                ...(envConfig.API_TOKEN && { Authorization: `Bearer ${envConfig.API_TOKEN}` }),
            },
        });
        await use(ctx);
        // Teardown — always runs after test completes (pass or fail)
        await ctx.dispose();
    },

    productsApi: async ({ apiContext }, use) => {
        await use(new ProductsApiClient(apiContext));
    },

    userApi: async ({ apiContext }, use) => {
        await use(new UserApiClient(apiContext));
    },
});

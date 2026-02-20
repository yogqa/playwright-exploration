import { test as base, request, APIRequestContext } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { AuthPage } from '../pages/auth.page';
import { ProductsPage } from '../pages/products.page';
import { ProductDetailPage } from '../pages/product-detail.page';
import { CartPage } from '../pages/cart.page';
import { CheckoutPage } from '../pages/checkout.page';
import { PaymentPage } from '../pages/payment.page';
import { ContactUsPage } from '../pages/contact-us.page';
import { ProductsApiClient } from '../tests/api-clients/products.client';
import { UserApiClient } from '../tests/api-clients/user.client';
import { envConfig } from '../config/env.config';

/**
 * Custom Playwright fixture that auto-injects Page Objects and API clients into tests.
 * Tests destructure only the fixtures they need — no manual instantiation.
 *
 * Layer architecture:
 *   UI fixtures     → inject Page Objects (src/pages/)
 *   API fixtures    → inject domain API clients (src/tests/api-clients/)
 *   apiContext      → raw APIRequestContext for ad-hoc API calls
 */
type AntigravityFixtures = {
    // ── UI Layer (Page Objects) ───────────────────────────────────────────────
    homePage: HomePage;
    authPage: AuthPage;
    productsPage: ProductsPage;
    productDetailPage: ProductDetailPage;
    cartPage: CartPage;
    checkoutPage: CheckoutPage;
    paymentPage: PaymentPage;
    contactUsPage: ContactUsPage;

    // ── Core API Context ──────────────────────────────────────────────────────
    apiContext: APIRequestContext;

    // ── API Layer (Domain Clients) ────────────────────────────────────────────
    productsApi: ProductsApiClient;
    userApi: UserApiClient;
};

export const test = base.extend<AntigravityFixtures>({

    // ── UI Fixtures ───────────────────────────────────────────────────────────

    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },

    authPage: async ({ page }, use) => {
        await use(new AuthPage(page));
    },

    productsPage: async ({ page }, use) => {
        await use(new ProductsPage(page));
    },

    productDetailPage: async ({ page }, use) => {
        await use(new ProductDetailPage(page));
    },

    cartPage: async ({ page }, use) => {
        await use(new CartPage(page));
    },

    checkoutPage: async ({ page }, use) => {
        await use(new CheckoutPage(page));
    },

    paymentPage: async ({ page }, use) => {
        await use(new PaymentPage(page));
    },

    contactUsPage: async ({ page }, use) => {
        await use(new ContactUsPage(page));
    },

    // ── Core API Context ──────────────────────────────────────────────────────

    /**
     * Raw APIRequestContext — Law #5 (Hybrid Law)
     * Pre-configured with baseURL and optional Authorization header.
     * Used as the injection point for domain API clients below.
     * Auto-disposes after each test to prevent connection leaks.
     */
    // eslint-disable-next-line no-empty-pattern
    apiContext: async ({ }, use) => {
        const ctx = await request.newContext({
            baseURL: envConfig.BASE_URL,
            extraHTTPHeaders: {
                ...(envConfig.API_TOKEN && { Authorization: `Bearer ${envConfig.API_TOKEN}` }),
            },
        });
        await use(ctx);
        await ctx.dispose();
    },

    // ── API Domain Client Fixtures ────────────────────────────────────────────

    /**
     * Products API client — transport only, no Zod, no assertions.
     * Validate responses with validateSchema() in the test spec.
     */
    productsApi: async ({ apiContext }, use) => {
        await use(new ProductsApiClient(apiContext));
    },

    /**
     * User API client — transport only, no Zod, no assertions.
     * Validate responses with validateSchema() in the test spec.
     */
    userApi: async ({ apiContext }, use) => {
        await use(new UserApiClient(apiContext));
    },
});

export { expect } from '@playwright/test';

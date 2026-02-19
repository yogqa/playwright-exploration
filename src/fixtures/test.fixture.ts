import { test as base, request, APIRequestContext } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { AuthPage } from '../pages/auth.page';
import { ProductsPage } from '../pages/products.page';
import { ProductDetailPage } from '../pages/product-detail.page';
import { CartPage } from '../pages/cart.page';
import { CheckoutPage } from '../pages/checkout.page';
import { PaymentPage } from '../pages/payment.page';
import { ContactUsPage } from '../pages/contact-us.page';
import { envConfig } from '../config/env.config';

/**
 * Custom Playwright fixture that auto-injects Page Objects into tests.
 * Tests destructure the POMs they need — no manual instantiation.
 */
type AntigravityFixtures = {
    homePage: HomePage;
    authPage: AuthPage;
    productsPage: ProductsPage;
    productDetailPage: ProductDetailPage;
    cartPage: CartPage;
    checkoutPage: CheckoutPage;
    paymentPage: PaymentPage;
    contactUsPage: ContactUsPage;
    apiContext: APIRequestContext;
};

export const test = base.extend<AntigravityFixtures>({
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

    /**
     * API Context Factory — Law #5 (Hybrid Law)
     * Provides a pre-configured APIRequestContext for API-based setup/teardown.
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
});

export { expect } from '@playwright/test';

import { test as base, request, APIRequestContext } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { CartPage } from '../pages/cart.page';
import { envConfig } from '../config/env.config';

/**
 * Custom Playwright fixture that auto-injects Page Objects into tests.
 * Tests destructure the POMs they need — no manual instantiation.
 */
type AntigravityFixtures = {
    loginPage: LoginPage;
    dashboardPage: DashboardPage;
    cartPage: CartPage;
    apiContext: APIRequestContext;
};

export const test = base.extend<AntigravityFixtures>({
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },

    dashboardPage: async ({ page }, use) => {
        const dashboardPage = new DashboardPage(page);
        await use(dashboardPage);
    },

    cartPage: async ({ page }, use) => {
        const cartPage = new CartPage(page);
        await use(cartPage);
    },

    /**
     * API Context Factory — Law #5 (Hybrid Law)
     * Provides a pre-configured APIRequestContext for API-based setup/teardown.
     * Use this in tests to seed data or assert API state without UI overhead.
     * Auto-disposes after each test to prevent connection leaks.
     */
    apiContext: async (_fixtures, use) => {
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

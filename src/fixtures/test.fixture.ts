import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { CartPage } from '../pages/cart.page';

/**
 * Custom Playwright fixture that auto-injects Page Objects into tests.
 * Tests destructure the POMs they need — no manual instantiation.
 */
type AntigravityFixtures = {
    loginPage: LoginPage;
    dashboardPage: DashboardPage;
    cartPage: CartPage;
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
});

export { expect } from '@playwright/test';

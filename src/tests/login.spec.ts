import { test, expect } from '../fixtures/test.fixture';
import { TestUsers } from '../fixtures/data/users.data';

test.describe('Login Flow - Rahul Shetty Academy', () => {
    test('should navigate to shop page on valid credentials', async ({ loginPage }) => {
        const dashboard = await loginPage.goto().then((lp) =>
            lp.login(TestUsers.admin.username, TestUsers.admin.password),
        );

        // Wait for navigation and verify shop page loaded
        await dashboard.page.waitForURL('**/angularpractice/shop');

        // Assertion in Layer 3 only
        await expect(dashboard.getNavbarLocator()).toBeVisible();
        expect(await dashboard.isShopLoaded()).toBe(true);
    });

    test('should display product cards after successful login', async ({ loginPage }) => {
        const dashboard = await loginPage.goto().then((lp) =>
            lp.login(TestUsers.admin.username, TestUsers.admin.password),
        );

        await dashboard.page.waitForURL('**/angularpractice/shop');

        const productCount = await dashboard.getProductCount();
        expect(productCount).toBeGreaterThan(0);
    });

    test('should show error on invalid credentials', async ({ loginPage }) => {
        await loginPage.goto();
        await loginPage.login(TestUsers.invalid.username, TestUsers.invalid.password);

        // Wait a moment for error to appear
        await loginPage.page.waitForTimeout(1000);

        const error = await loginPage.getErrorMessage();
        expect(error).toContain('Incorrect');
    });
});

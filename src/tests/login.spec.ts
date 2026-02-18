import { test, expect } from '../fixtures/test.fixture';
import { TestUsers } from '../fixtures/data/users.data';

test.describe('Login Flow - Rahul Shetty Academy', () => {
    test('should navigate to shop page on valid credentials', async ({ loginPage }) => {
        const dashboard = await loginPage.goto().then((lp) =>
            lp.login(TestUsers.admin.username, TestUsers.admin.password),
        );

        // Wait for navigation and verify shop page loaded
        await dashboard.page.waitForURL('**/angularpractice/shop');

        // Soft assertions — both checks run even if one fails
        await expect.soft(dashboard.getNavbarLocator()).toBeVisible();
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

        // Poll until the error message appears — no hard wait needed
        await expect.poll(
            () => loginPage.getErrorMessage(),
            { message: 'Error message did not appear after invalid login', timeout: 5000 },
        ).toContain('Incorrect');
    });
});

import { test, expect } from '../../fixtures/test.fixture';

/**
 * Layer 3 — Home Specs  [app project — pre-authenticated]
 * TC10: Verify Subscription in home page
 * TC11: Verify Subscription in Cart page
 * TC25: Verify Scroll Up using 'Arrow' button and Scroll Down functionality
 * TC26: Verify Scroll Up without 'Arrow' button and Scroll Down functionality
 */
test.describe('Home', () => {

    // ─── TC10: Verify Subscription in home page ───────────────────────────────
    test('TC10: Verify Subscription in home page', async ({ homePage }) => {
        await homePage.navigateTo();
        await homePage.scrollToFooter();

        await homePage.subscribeWithEmail(`sub+${Date.now()}@antigravity.dev`);

        const msg = await homePage.getSubscriptionSuccessMessage();
        expect(msg).toContain('You have been successfully subscribed!');
    });

    // ─── TC11: Verify Subscription in Cart page ───────────────────────────────
    test('TC11: Verify Subscription in Cart page', async ({ cartPage }) => {
        await cartPage.navigateTo();
        await cartPage.scrollToFooter();

        await cartPage.subscribeWithEmail(`sub+${Date.now()}@antigravity.dev`);

        const msg = await cartPage.getSubscriptionSuccessMessage();
        expect(msg).toContain('You have been successfully subscribed!');
    });

    // ─── TC25: Scroll Up using Arrow button ───────────────────────────────────
    test('TC25: Verify Scroll Up using Arrow button and Scroll Down', async ({ homePage }) => {
        await homePage.navigateTo();
        await homePage.scrollToFooter();

        await expect(homePage.page.locator('h2:has-text("Subscription")')).toBeVisible();

        await homePage.clickScrollUpArrow();

        const heroText = await homePage.getHeroText();
        expect(heroText).toContain('Full-Fledged practice website for Automation Engineers');
    });

    // ─── TC26: Scroll Up without Arrow button ─────────────────────────────────
    test('TC26: Verify Scroll Up without Arrow button and Scroll Down', async ({ homePage }) => {
        await homePage.navigateTo();
        await homePage.scrollToFooter();

        await expect(homePage.page.locator('h2:has-text("Subscription")')).toBeVisible();

        await homePage.page.keyboard.press('Home');

        const heroText = await homePage.getHeroText();
        expect(heroText).toContain('Full-Fledged practice website for Automation Engineers');
    });
});

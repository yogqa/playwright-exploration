import { Page } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Layer 2 — Home Page POM
 * URL: https://automationexercise.com/
 * Covers: TC10, TC11, TC22, TC25, TC26
 */
export class HomePage extends BasePage {
    constructor(page: Page) { super(page); }

    // ─── Locators ────────────────────────────────────────────────────────────
    private get navProducts() { return this.page.locator('a[href="/products"]').first(); }
    private get navCart() { return this.page.locator('a[href="/view_cart"]').first(); }
    private get navLogin() { return this.page.locator('a[href="/login"]').first(); }
    private get navContactUs() { return this.page.locator('a[href="/contact_us"]').first(); }
    private get navLoggedInAs() { return this.page.locator('a:has-text("Logged in as")'); }
    private get heroText() { return this.page.locator('.item.active h2').first(); }

    // Subscription (footer)
    private get subscriptionEmailInput() { return this.page.locator('#susbscribe_email'); }
    private get subscriptionArrowBtn() { return this.page.locator('#subscribe'); }
    private get subscriptionSuccessMsg() { return this.page.locator('#success-subscribe'); }

    // Scroll-up arrow button (bottom-right)
    private get scrollUpArrow() { return this.page.locator('#scrollUp'); }

    // Recommended items section
    private get recommendedSection() { return this.page.locator('.recommended_items'); }
    private get recommendedAddToCartBtns() {
        return this.page.locator('.recommended_items .add-to-cart');
    }
    private get viewCartModalBtn() { return this.page.locator('u:has-text("View Cart")'); }

    // ─── Methods ─────────────────────────────────────────────────────────────

    async navigateTo() {
        await this.nav.goto('/');
    }

    async navigateToProducts() {
        await this.action.click(this.navProducts, { description: 'Nav: Products' });
    }

    async navigateToCart() {
        await this.action.click(this.navCart, { description: 'Nav: Cart' });
    }

    async navigateToLogin() {
        await this.action.click(this.navLogin, { description: 'Nav: Signup/Login' });
    }

    async navigateToContactUs() {
        await this.action.click(this.navContactUs, { description: 'Nav: Contact Us' });
    }

    async getHeroText(): Promise<string> {
        return this.action.getText(this.heroText, { description: 'Hero heading' });
    }

    async getLoggedInUsername(): Promise<string> {
        const text = await this.action.getText(this.navLoggedInAs, { description: 'Logged in as' });
        return text.replace('Logged in as', '').trim();
    }

    async scrollToFooter() {
        await this.subscriptionEmailInput.scrollIntoViewIfNeeded();
    }

    async subscribeWithEmail(email: string): Promise<void> {
        await this.action.fill(this.subscriptionEmailInput, email, { description: 'Subscription email' });
        await this.action.click(this.subscriptionArrowBtn, { description: 'Subscribe button' });
    }

    async getSubscriptionSuccessMessage(): Promise<string> {
        return this.action.getText(this.subscriptionSuccessMsg, { description: 'Subscription success' });
    }

    async clickScrollUpArrow(): Promise<void> {
        await this.action.click(this.scrollUpArrow, { description: 'Scroll-up arrow' });
    }

    async addFirstRecommendedItemToCart(): Promise<void> {
        await this.recommendedSection.scrollIntoViewIfNeeded();
        await this.action.click(this.recommendedAddToCartBtns.first(), { description: 'Recommended: Add to cart' });
    }

    async clickViewCartFromModal(): Promise<void> {
        await this.action.click(this.viewCartModalBtn, { description: 'Modal: View Cart' });
    }
}

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
    private get navProducts() { return this.page.getByRole('link', { name: 'Products' }); }
    private get navCart() { return this.page.getByRole('link', { name: 'Cart' }); }
    private get navLogin() { return this.page.getByRole('link', { name: 'Signup / Login' }); }
    private get navContactUs() { return this.page.getByRole('link', { name: 'Contact us' }); }
    private get navLoggedInAs() { return this.page.getByText('Logged in as'); }
    // Fallback: the hero carousel uses .item.active which changes dynamically;
    // there is no stable testid or role to target the active slide's heading
    private get heroText() { return this.page.locator('.item.active h2').first(); }

    // Subscription (footer)
    private get subscriptionEmailInput() { return this.page.getByPlaceholder('Your email address'); }
    // Fallback: #subscribe is an icon-only arrow button with no accessible name or testid
    private get subscriptionArrowBtn() { return this.page.locator('#subscribe'); }
    // Fallback: #success-subscribe is a dynamic success banner with no testid or stable role
    private get subscriptionSuccessMsg() { return this.page.locator('#success-subscribe'); }

    // Fallback: #scrollUp is an icon-only floating button with no accessible name or testid
    private get scrollUpArrow() { return this.page.locator('#scrollUp'); }

    // Recommended items section
    // Fallback: .recommended_items is the only stable structural selector for this section
    private get recommendedSection() { return this.page.locator('.recommended_items'); }
    // Fallback: .recommended_items .add-to-cart — overlay buttons with no accessible name or testid;
    // scoped to the recommended section to avoid collisions with other product cards on the page
    private get recommendedAddToCartBtns() {
        return this.page.locator('.recommended_items .add-to-cart');
    }
    private get viewCartModalBtn() { return this.page.getByRole('link', { name: 'View Cart' }); }

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

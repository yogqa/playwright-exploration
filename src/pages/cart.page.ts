import { Page } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Layer 2 — Cart Page POM
 * URL: https://automationexercise.com/view_cart
 * Covers: TC11–17, TC20, TC22–24
 */
export class CartPage extends BasePage {
    constructor(page: Page) { super(page); }

    // ─── Locators ────────────────────────────────────────────────────────────

    private get cartRows() { return this.page.locator('#cart_info_table tbody tr'); }
    private get emptyCartMsg() { return this.page.locator('b:has-text("Cart is empty!")'); }
    private get proceedToCheckoutBtn() { return this.page.locator('.btn:has-text("Proceed To Checkout")'); }

    // Subscription (footer)
    private get subscriptionEmailInput() { return this.page.locator('#susbscribe_email'); }
    private get subscriptionArrowBtn() { return this.page.locator('#subscribe'); }
    private get subscriptionSuccessMsg() { return this.page.locator('#success-subscribe'); }

    // ─── Methods ─────────────────────────────────────────────────────────────

    async navigateTo() {
        await this.nav.goto('/view_cart');
    }

    async isCartEmpty(): Promise<boolean> {
        return this.emptyCartMsg.isVisible();
    }

    async getItemCount(): Promise<number> {
        return this.cartRows.count();
    }

    async getItemNames(): Promise<string[]> {
        return this.action.getAllTexts(
            this.cartRows.locator('td.cart_description h4 a'),
            { description: 'Cart item names' }
        );
    }

    async getItemQuantity(productName: string): Promise<string> {
        const row = this.cartRows.filter({ hasText: productName });
        return this.action.getText(
            row.locator('.cart_quantity button'),
            { description: `Quantity for ${productName}` }
        );
    }

    async getItemPrice(productName: string): Promise<string> {
        const row = this.cartRows.filter({ hasText: productName });
        return this.action.getText(
            row.locator('.cart_price p'),
            { description: `Price for ${productName}` }
        );
    }

    async getItemTotal(productName: string): Promise<string> {
        const row = this.cartRows.filter({ hasText: productName });
        return this.action.getText(
            row.locator('.cart_total p'),
            { description: `Total for ${productName}` }
        );
    }

    async removeItem(productName: string): Promise<void> {
        const row = this.cartRows.filter({ hasText: productName });
        await this.action.click(
            row.locator('.cart_quantity_delete'),
            { description: `Remove ${productName}` }
        );
        await this.action.waitForHidden(row, { description: `${productName} row hidden` });
    }

    async proceedToCheckout(): Promise<void> {
        await this.action.click(this.proceedToCheckoutBtn, { description: 'Proceed To Checkout' });
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
}

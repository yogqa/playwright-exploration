import { Page } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Layer 2 — Checkout Page POM
 * URL: https://automationexercise.com/checkout
 * Covers: TC14–16, TC23, TC24
 */
export class CheckoutPage extends BasePage {
    constructor(page: Page) { super(page); }

    // ─── Locators ────────────────────────────────────────────────────────────

    private get deliveryAddressBlock() { return this.page.locator('#address_delivery'); }
    private get billingAddressBlock() { return this.page.locator('#address_invoice'); }
    private get orderReviewRows() { return this.page.locator('#cart_info tbody tr'); }
    private get commentTextarea() { return this.page.locator('textarea[name="message"]'); }
    private get placeOrderBtn() { return this.page.locator('a:has-text("Place Order")'); }
    private get registerLoginLink() { return this.page.locator('a:has-text("Register / Login")'); }

    // ─── Methods ─────────────────────────────────────────────────────────────

    async getDeliveryAddress(): Promise<string> {
        return this.action.getText(this.deliveryAddressBlock, { description: 'Delivery address' });
    }

    async getBillingAddress(): Promise<string> {
        return this.action.getText(this.billingAddressBlock, { description: 'Billing address' });
    }

    async getOrderItemCount(): Promise<number> {
        return this.orderReviewRows.count();
    }

    async enterComment(text: string): Promise<void> {
        await this.action.fill(this.commentTextarea, text, { description: 'Order comment' });
    }

    async placeOrder(): Promise<void> {
        await this.action.click(this.placeOrderBtn, { description: 'Place Order button' });
    }

    async clickRegisterLogin(): Promise<void> {
        await this.action.click(this.registerLoginLink, { description: 'Register / Login link' });
    }
}

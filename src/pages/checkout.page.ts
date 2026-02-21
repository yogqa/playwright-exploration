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

    // Fallback: #address_delivery is the server-rendered ID for the delivery address block; no testid available
    private get deliveryAddressBlock() { return this.page.locator('#address_delivery'); }
    // Fallback: #address_invoice is the server-rendered ID for the billing address block; no testid available
    private get billingAddressBlock() { return this.page.locator('#address_invoice'); }
    // Fallback: #cart_info tbody — scoped table with no testid; getByRole('row') makes children accessible
    private get orderReviewRows() { return this.page.locator('#cart_info tbody').getByRole('row'); }
    // Fallback: textarea[name="message"] — DOM confirms no placeholder and no label; name attr is the only stable selector
    private get commentTextarea() { return this.page.locator('textarea[name="message"]'); }
    private get placeOrderBtn() { return this.page.getByRole('link', { name: 'Place Order' }); }
    private get registerLoginLink() { return this.page.getByRole('link', { name: 'Register / Login' }); }

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

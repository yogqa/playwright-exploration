import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { PaymentDetails } from '../fixtures/data/user.data';

/**
 * Layer 2 — Payment Page POM
 * URL: https://automationexercise.com/payment
 * Covers: TC14–16, TC24
 */
export class PaymentPage extends BasePage {
    constructor(page: Page) { super(page); }

    // ─── Locators ────────────────────────────────────────────────────────────

    private get nameOnCardInput() { return this.page.locator('[data-qa="name-on-card"]'); }
    private get cardNumberInput() { return this.page.locator('[data-qa="card-number"]'); }
    private get cvcInput() { return this.page.locator('[data-qa="cvc"]'); }
    private get expiryMonthInput() { return this.page.locator('[data-qa="expiry-month"]'); }
    private get expiryYearInput() { return this.page.locator('[data-qa="expiry-year"]'); }
    private get payConfirmBtn() { return this.page.locator('[data-qa="pay-button"]'); }
    private get orderSuccessMsg() { return this.page.locator('[data-qa="order-placed"]'); }
    private get downloadInvoiceBtn() { return this.page.locator('a:has-text("Download Invoice")'); }
    private get continueBtn() { return this.page.locator('[data-qa="continue-button"]'); }

    // ─── Methods ─────────────────────────────────────────────────────────────

    async fillPaymentDetails(details: PaymentDetails): Promise<void> {
        await this.action.fill(this.nameOnCardInput, details.nameOnCard, { description: 'Name on card' });
        await this.action.fill(this.cardNumberInput, details.cardNumber, { description: 'Card number' });
        await this.action.fill(this.cvcInput, details.cvc, { description: 'CVC' });
        await this.action.fill(this.expiryMonthInput, details.expiryMonth, { description: 'Expiry month' });
        await this.action.fill(this.expiryYearInput, details.expiryYear, { description: 'Expiry year' });
    }

    async confirmOrder(): Promise<void> {
        await this.action.click(this.payConfirmBtn, { description: 'Pay and Confirm Order' });
    }

    async getSuccessMessage(): Promise<string> {
        return this.action.getText(this.orderSuccessMsg, { description: 'Order success message' });
    }

    async downloadInvoice(): Promise<void> {
        await this.action.click(this.downloadInvoiceBtn, { description: 'Download Invoice' });
    }

    async clickContinue(): Promise<void> {
        await this.action.click(this.continueBtn, { description: 'Continue button' });
    }
}

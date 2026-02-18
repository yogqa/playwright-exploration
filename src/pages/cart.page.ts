import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * CartPage POM — models rahulshettyacademy.com/seleniumPractise/#/
 *
 * This models the Green Kart application.
 * Exposes locators and action methods — NO assertions.
 */
export class CartPage extends BasePage {
    // ── Locators (getters resolve fresh on each access — resilient to re-renders) ──
    private get searchInput() { return this.page.locator('.search-keyword'); }
    private get searchButton() { return this.page.locator('.search-button'); }
    private get products() { return this.page.locator('.product'); }
    private get cartIcon() { return this.page.locator('.cart-icon'); }
    private get checkoutButton() { return this.page.locator('button', { hasText: 'PROCEED TO CHECKOUT' }); }
    private get promoCodeInput() { return this.page.locator('.promoCode'); }
    private get promoButton() { return this.page.locator('.promoBtn'); }
    private get promoInfo() { return this.page.locator('.promoInfo'); }

    constructor(page: Page) {
        super(page);
    }

    /** Navigate to the Green Kart page */
    async goto(): Promise<this> {
        await this.nav.goto('/seleniumPractise/#/');
        return this;
    }

    /** Search for a vegetable */
    async search(productName: string): Promise<void> {
        await this.action.fill(this.searchInput, productName, { description: 'Search input' });
        await this.action.click(this.searchButton, { description: 'Search button' });
        // Poll until at least one matching product card is visible (replaces hard wait)
        await expect.poll(
            () => this.products.count(),
            { message: `No products found matching "${productName}"`, timeout: 5000 },
        ).toBeGreaterThan(0);
    }

    /** Add a specific product to cart by name */
    async addToCart(productName: string): Promise<void> {
        // Find product by text
        // Note: In real scenarios, iterating might be needed if structure is complex, 
        // but here we can try chaining locators or using specific text locator.
        // For Green Kart, products have a name in h4.product-name
        const productLocator = this.products.filter({ hasText: productName });
        const addButton = productLocator.locator('button').filter({ hasText: 'ADD TO CART' });

        await this.action.click(addButton, { description: `Add to cart: ${productName}` });
        // Wait for button state change to confirm action
        // Usually changes to "✔ ADDED"
        await productLocator.locator('button', { hasText: 'ADDED' }).waitFor();
    }

    /** Open the cart preview */
    async openCart(): Promise<void> {
        await this.action.click(this.cartIcon, { description: 'Cart icon' });
        // Wait for preview to be visible (using raw locator wait as action wrapper doesn't cover generic wait)
        await this.page.locator('.cart-preview.active').waitFor();
    }

    /** Proceed to checkout page */
    async proceedToCheckout(): Promise<void> {
        await this.openCart();
        await this.action.click(this.checkoutButton, { description: 'Proceed to checkout' });
    }

    /** Apply promo code */
    async applyPromoCode(code: string): Promise<void> {
        await this.action.fill(this.promoCodeInput, code, { description: 'Promo code input' });
        await this.action.click(this.promoButton, { description: 'Apply promo button' });
    }

    /** Get promo info text for assertion */
    async getPromoInfoText(): Promise<string> {
        return this.action.getText(this.promoInfo, { description: 'Promo info text' });
    }

    /** Get product names locator */
    getProductNamesLocator(): Locator {
        return this.products.locator('h4.product-name');
    }
}

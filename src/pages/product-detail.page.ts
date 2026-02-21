import { Page } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Layer 2 — Product Detail Page POM
 * URL: https://automationexercise.com/product_details/:id
 * Covers: TC8, TC13, TC21
 */
export class ProductDetailPage extends BasePage {
    constructor(page: Page) { super(page); }

    // ─── Locators ────────────────────────────────────────────────────────────

    // Fallback: scoped to .product-information to avoid collision with other headings on the page
    private get productName() { return this.page.locator('.product-information').getByRole('heading'); }
    // Fallback: .product-information p scoped with filter — no testid on metadata paragraphs
    private get productCategory() { return this.page.locator('.product-information p').filter({ hasText: 'Category' }); }
    // Fallback: .product-information span span — the price is rendered in nested spans with no testid;
    // scoped to .product-information to avoid matching other prices on the page
    private get productPrice() { return this.page.locator('.product-information span span'); }
    private get productAvailability() { return this.page.locator('.product-information p').filter({ hasText: 'Availability' }); }
    private get productCondition() { return this.page.locator('.product-information p').filter({ hasText: 'Condition' }); }
    private get productBrand() { return this.page.locator('.product-information p').filter({ hasText: 'Brand' }); }
    // Prefer getByRole('spinbutton') — quantity fields are numeric inputs with role=spinbutton
    private get quantityInput() { return this.page.getByRole('spinbutton'); }
    private get addToCartButton() { return this.page.getByRole('button', { name: 'Add to cart' }); }
    private get viewCartModalBtn() { return this.page.getByRole('link', { name: 'View Cart' }); }

    // Review form — use getByPlaceholder as the fields lack associated <label> elements
    // exact:true on email prevents partial match with the footer subscription input 'Your email address'
    private get reviewNameInput() { return this.page.getByPlaceholder('Your Name'); }
    private get reviewEmailInput() { return this.page.getByPlaceholder('Email Address', { exact: true }); }
    private get reviewTextarea() { return this.page.getByPlaceholder('Add Review Here!'); }
    private get submitReviewButton() { return this.page.getByRole('button', { name: 'Submit' }); }
    // Fallback: .alert-success span — dynamic success message with no testid or stable role
    private get reviewSuccessMsg() { return this.page.locator('.alert-success span'); }

    // ─── Methods ─────────────────────────────────────────────────────────────

    async navigateTo(productId: number) {
        await this.nav.goto(`/product_details/${productId}`);
    }

    async getProductName(): Promise<string> {
        return this.action.getText(this.productName, { description: 'Product name' });
    }

    async getCategory(): Promise<string> {
        return this.action.getText(this.productCategory, { description: 'Product category' });
    }

    async getPrice(): Promise<string> {
        return this.action.getText(this.productPrice, { description: 'Product price' });
    }

    async getAvailability(): Promise<string> {
        return this.action.getText(this.productAvailability, { description: 'Product availability' });
    }

    async getCondition(): Promise<string> {
        return this.action.getText(this.productCondition, { description: 'Product condition' });
    }

    async getBrand(): Promise<string> {
        return this.action.getText(this.productBrand, { description: 'Product brand' });
    }

    async setQuantity(quantity: number): Promise<void> {
        await this.action.clear(this.quantityInput, { description: 'Quantity input' });
        await this.action.fill(this.quantityInput, String(quantity), { description: 'Quantity input' });
    }

    async addToCart(): Promise<void> {
        await this.action.click(this.addToCartButton, { description: 'Add to cart button' });
    }

    async clickViewCart(): Promise<void> {
        await this.action.click(this.viewCartModalBtn, { description: 'Modal: View Cart' });
    }

    async submitReview(name: string, email: string, review: string): Promise<void> {
        await this.action.fill(this.reviewNameInput, name, { description: 'Review name' });
        await this.action.fill(this.reviewEmailInput, email, { description: 'Review email' });
        await this.action.fill(this.reviewTextarea, review, { description: 'Review text' });
        await this.action.click(this.submitReviewButton, { description: 'Submit review' });
    }

    async getReviewSuccessMessage(): Promise<string> {
        return this.action.getText(this.reviewSuccessMsg, { description: 'Review success message' });
    }
}

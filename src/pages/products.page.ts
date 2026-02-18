import { Page } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Layer 2 — Products Page POM
 * URL: https://automationexercise.com/products
 * Covers: TC8, TC9, TC12, TC18, TC19, TC20
 */
export class ProductsPage extends BasePage {
    constructor(page: Page) { super(page); }

    // ─── Locators ────────────────────────────────────────────────────────────

    private get allProductsHeading() { return this.page.locator('h2:has-text("All Products")'); }
    private get searchInput() { return this.page.locator('#search_product'); }
    private get searchButton() { return this.page.locator('#submit_search'); }
    private get searchedProductsHeading() { return this.page.locator('h2:has-text("Searched Products")'); }
    private get productCards() { return this.page.locator('.productinfo'); }
    private get viewProductLinks() { return this.page.locator('a[href*="/product_details/"]'); }

    // Add to cart overlay (appears on hover)
    private get addToCartOverlayBtns() { return this.page.locator('.product-overlay .add-to-cart'); }

    // Modal buttons after adding to cart
    private get continueShoppingBtn() { return this.page.locator('button:has-text("Continue Shopping")'); }
    private get viewCartModalBtn() { return this.page.locator('u:has-text("View Cart")'); }

    // Category sidebar
    private get womenCategory() { return this.page.locator('a[href="#Women"]'); }
    private get menCategory() { return this.page.locator('a[href="#Men"]'); }
    private get kidsCategory() { return this.page.locator('a[href="#Kids"]'); }

    // Brand sidebar
    private get brandLinks() { return this.page.locator('.brands-name a'); }

    // ─── Methods ─────────────────────────────────────────────────────────────

    async navigateTo() {
        await this.nav.goto('/products');
    }

    async isOnProductsPage(): Promise<boolean> {
        return this.allProductsHeading.isVisible();
    }

    async searchProduct(name: string): Promise<void> {
        await this.action.fill(this.searchInput, name, { description: 'Product search input' });
        await this.action.click(this.searchButton, { description: 'Search button' });
    }

    async isSearchedProductsVisible(): Promise<boolean> {
        return this.searchedProductsHeading.isVisible();
    }

    async getProductCount(): Promise<number> {
        return this.productCards.count();
    }

    async getAllProductNames(): Promise<string[]> {
        return this.action.getAllTexts(this.productCards.locator('p'), { description: 'Product names' });
    }

    async viewProduct(index = 0): Promise<void> {
        await this.action.click(this.viewProductLinks.nth(index), { description: `View product #${index}` });
    }

    async hoverAndAddToCart(index = 0): Promise<void> {
        const card = this.page.locator('.single-products').nth(index);
        const addBtn = this.addToCartOverlayBtns.nth(index);
        await this.action.hover(card, { description: `Hover product #${index}` });
        // Wait for the overlay button to become visible after hover
        await addBtn.waitFor({ state: 'visible', timeout: 5000 });
        await this.action.click(addBtn, { description: `Add to cart #${index}` });
    }

    async clickContinueShopping(): Promise<void> {
        await this.action.click(this.continueShoppingBtn, { description: 'Continue Shopping' });
    }

    async clickViewCart(): Promise<void> {
        await this.action.click(this.viewCartModalBtn, { description: 'Modal: View Cart' });
    }

    async clickCategory(parent: 'Women' | 'Men' | 'Kids', subCategory: string): Promise<void> {
        const parentLink = parent === 'Women' ? this.womenCategory
            : parent === 'Men' ? this.menCategory
                : this.kidsCategory;
        await this.action.click(parentLink, { description: `Category: ${parent}` });
        // Scope sub-category to the parent's own panel to avoid strict mode violations
        // when the same name (e.g. "Dress") exists under multiple categories
        const parentPanel = this.page.locator(`#${parent}`);
        await this.action.click(
            parentPanel.locator(`a:has-text("${subCategory}")`).first(),
            { description: `Sub-category: ${subCategory}` }
        );
    }

    async clickBrand(brandName: string): Promise<void> {
        await this.action.click(
            this.brandLinks.filter({ hasText: brandName }),
            { description: `Brand: ${brandName}` }
        );
    }

    async getBrandPageHeading(): Promise<string> {
        return this.action.getText(
            this.page.locator('.features_items h2.title'),
            { description: 'Brand page heading' }
        );
    }
}

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

    private get allProductsHeading() { return this.page.getByRole('heading', { name: 'All Products' }); }
    // Prefer getByPlaceholder — scopes to the specific search box by its visible placeholder text
    private get searchInput() { return this.page.getByPlaceholder('Search Product'); }
    // Fallback: #submit_search is an icon-only search button with no accessible name or label
    private get searchButton() { return this.page.locator('#submit_search'); }
    private get searchedProductsHeading() { return this.page.getByRole('heading', { name: 'Searched Products' }); }
    // Fallback: .productinfo is the only structural class wrapping each product card; no testid on the app
    private get productCards() { return this.page.locator('.productinfo'); }
    // Fallback: href-based selector — these links have no shared accessible name to distinguish them
    private get viewProductLinks() { return this.page.locator('a[href*="/product_details/"]'); }

    // Add to cart overlay (appears on hover)
    // Fallback: .product-overlay .add-to-cart — overlay buttons have no accessible name or testid;
    // scoped to .product-overlay to avoid matching other "Add to cart" buttons on the page
    private get addToCartOverlayBtns() { return this.page.locator('.product-overlay .add-to-cart'); }

    // Modal buttons after adding to cart
    private get continueShoppingBtn() { return this.page.getByRole('button', { name: 'Continue Shopping' }); }
    private get viewCartModalBtn() { return this.page.getByRole('link', { name: 'View Cart' }); }

    // Category sidebar — use href attr to target accordion triggers uniquely;
    // getByRole(name) fails because 'men' is a substring of 'women' in the accessible name
    private get womenCategory() { return this.page.locator('#accordian a[href="#Women"]'); }
    private get menCategory() { return this.page.locator('#accordian a[href="#Men"]'); }
    private get kidsCategory() { return this.page.locator('#accordian a[href="#Kids"]'); }

    // Brand sidebar
    private get brandLinks() { return this.page.locator('.brands-name').getByRole('link'); }

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
        // Use filter({ hasText }) rather than exact name match — sub-category links have leading icon
        // characters (e.g. " Tshirts") that cause exact accessible name mismatches
        const subCategoryLink = parentPanel.getByRole('link').filter({ hasText: subCategory }).first();
        await subCategoryLink.waitFor({ state: 'visible', timeout: 5000 });
        await this.action.click(
            subCategoryLink,
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
            // Fallback: .features_items h2.title — brand page heading has no testid or unique accessible name
            this.page.locator('.features_items h2.title'),
            { description: 'Brand page heading' }
        );
    }
}

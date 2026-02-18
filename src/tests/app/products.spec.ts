import { test, expect } from '../../fixtures/test.fixture';

/**
 * Layer 3 — Products Specs  [app project — pre-authenticated]
 * TC8:  Verify All Products and product detail page
 * TC9:  Search Product
 * TC18: View Category Products
 * TC19: View & Cart Brand Products
 * TC21: Add review on product
 */
test.describe('Products', () => {

    // ─── TC8: All Products and product detail page ────────────────────────────
    test('TC8: Verify All Products and product detail page', async ({ productsPage, productDetailPage }) => {
        await productsPage.navigateTo();
        expect(await productsPage.isOnProductsPage()).toBe(true);

        const count = await productsPage.getProductCount();
        expect(count).toBeGreaterThan(0);

        await productsPage.viewProduct(0);

        const name = await productDetailPage.getProductName();
        expect(name).toBeTruthy();

        const category = await productDetailPage.getCategory();
        expect(category).toContain('Category');

        const price = await productDetailPage.getPrice();
        expect(price).toBeTruthy();

        const availability = await productDetailPage.getAvailability();
        expect(availability).toContain('Availability');

        const condition = await productDetailPage.getCondition();
        expect(condition).toContain('Condition');

        const brand = await productDetailPage.getBrand();
        expect(brand).toContain('Brand');
    });

    // ─── TC9: Search Product ──────────────────────────────────────────────────
    test('TC9: Search Product', async ({ productsPage }) => {
        await productsPage.navigateTo();
        expect(await productsPage.isOnProductsPage()).toBe(true);

        await productsPage.searchProduct('Top');

        expect(await productsPage.isSearchedProductsVisible()).toBe(true);

        const count = await productsPage.getProductCount();
        expect(count).toBeGreaterThan(0);
    });

    // ─── TC18: View Category Products ────────────────────────────────────────
    test('TC18: View Category Products', async ({ page, productsPage }) => {
        await page.goto('/');

        await productsPage.clickCategory('Women', 'Dress');
        await expect(page.locator('.features_items h2.title')).toBeVisible();

        await productsPage.clickCategory('Men', 'Tshirts');
        await expect(page.locator('.features_items h2.title')).toBeVisible();
    });

    // ─── TC19: View & Cart Brand Products ────────────────────────────────────
    test('TC19: View & Cart Brand Products', async ({ productsPage }) => {
        await productsPage.navigateTo();

        await productsPage.clickBrand('Polo');
        const heading1 = await productsPage.getBrandPageHeading();
        expect(heading1.toUpperCase()).toContain('POLO');

        await productsPage.clickBrand('H&M');
        const heading2 = await productsPage.getBrandPageHeading();
        expect(heading2.toUpperCase()).toContain('H&M');
    });

    // ─── TC21: Add review on product ─────────────────────────────────────────
    test('TC21: Add review on product', async ({ productsPage, productDetailPage }) => {
        await productsPage.navigateTo();
        expect(await productsPage.isOnProductsPage()).toBe(true);

        await productsPage.viewProduct(0);

        await productDetailPage.submitReview(
            'Antigravity Tester',
            'tester@antigravity.dev',
            'Great product! Automated review from Antigravity framework.'
        );

        const successMsg = await productDetailPage.getReviewSuccessMessage();
        expect(successMsg).toContain('Thank you for your review');
    });
});

import { test, expect } from '../../fixtures/test.fixture';
import { validateSchema } from '../../utils/schema-validator';
import { ProductListResponseSchema } from '../schemas/product.schema';

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
    test('TC18: View Category Products', async ({ page, homePage, productsPage }) => {
        await homePage.navigateTo();

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

/**
 * Hybrid Tests — UI action + API contract verification (Zod-validated)
 * Demonstrates Law #5 (Hybrid Law): UI success alone is not sufficient.
 * After a UI action, verify backend state via a Zod-validated API call.
 *
 * AI Orchestrator: When editing this block, load BOTH:
 *   - ui-specialist.md  (for the UI productsPage actions)
 *   - api-specialist.md (for the Zod schema validation step)
 */
test.describe('Products — Hybrid UI + API Verification', () => {

    // ─── TC-H1: UI search results are backed by a valid API contract ──────────
    test('TC-H1: UI search matches Zod-validated API response', async ({
        productsPage,
        productsApi,
    }) => {
        const SEARCH_QUERY = 'Top';

        // ── UI action ─────────────────────────────────────────────────────────
        await productsPage.navigateTo();
        await productsPage.searchProduct(SEARCH_QUERY);

        const uiProductCount = await productsPage.getProductCount();
        expect(uiProductCount).toBeGreaterThan(0);

        // ── API verification (3-step Zod-first flow) ──────────────────────────

        // Step 1: Call API client (raw transport)
        const rawData = await productsApi.searchProduct(SEARCH_QUERY);

        // Step 2: Validate schema — fails immediately if API contract changes
        const validated = validateSchema(
            ProductListResponseSchema,
            rawData,
            `POST /api/searchProduct?query=${SEARCH_QUERY}`,
        );

        // Step 3: Business assertions on validated data
        expect(validated.responseCode).toBe(200);
        expect(validated.products.length).toBeGreaterThan(0);

        // Cross-reference: UI count should not exceed what the API returns
        expect(uiProductCount).toBeLessThanOrEqual(validated.products.length);
    });

});

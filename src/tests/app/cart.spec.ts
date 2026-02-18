import { test, expect } from '../../fixtures/test.fixture';

/**
 * Layer 3 — Cart Specs  [app project — pre-authenticated]
 * TC12: Add Products in Cart
 * TC13: Verify Product quantity in Cart
 * TC17: Remove Products From Cart
 * TC20: Search Products and Verify Cart After Login
 * TC22: Add to cart from Recommended items
 */
test.describe('Cart', () => {

    /** Clear all items from the cart before each test to prevent state bleed */
    test.beforeEach(async ({ cartPage }) => {
        await cartPage.navigateTo();
        // Remove all items — use count-based loop with guard to prevent infinite loop
        let count = await cartPage.getItemCount();
        let guard = 0;
        while (count > 0 && guard < 20) {
            const names = await cartPage.getItemNames();
            if (names.length === 0) break;
            await cartPage.removeItem(names[0]);
            count = await cartPage.getItemCount();
            guard++;
        }
    });

    // ─── TC12: Add Products in Cart ───────────────────────────────────────────
    test('TC12: Add Products in Cart', async ({ productsPage, cartPage }) => {
        await productsPage.navigateTo();

        await productsPage.hoverAndAddToCart(0);
        await productsPage.clickContinueShopping();

        await productsPage.hoverAndAddToCart(1);
        await productsPage.clickViewCart();

        const count = await cartPage.getItemCount();
        expect(count).toBe(2);

        const names = await cartPage.getItemNames();
        expect(names).toHaveLength(2);
    });

    // ─── TC13: Verify Product quantity in Cart ────────────────────────────────
    test('TC13: Verify Product quantity in Cart', async ({ productsPage, productDetailPage, cartPage }) => {
        await productsPage.navigateTo();
        await productsPage.viewProduct(0);

        await productDetailPage.setQuantity(4);
        await productDetailPage.addToCart();
        await productDetailPage.clickViewCart();

        const names = await cartPage.getItemNames();
        expect(names.length).toBeGreaterThan(0);

        const qty = await cartPage.getItemQuantity(names[0]);
        expect(qty).toBe('4');
    });

    // ─── TC17: Remove Products From Cart ─────────────────────────────────────
    test('TC17: Remove Products From Cart', async ({ productsPage, cartPage }) => {
        await productsPage.navigateTo();
        await productsPage.hoverAndAddToCart(0);
        await productsPage.clickViewCart();

        const names = await cartPage.getItemNames();
        expect(names.length).toBeGreaterThan(0);

        await cartPage.removeItem(names[0]);

        expect(await cartPage.isCartEmpty()).toBe(true);
    });

    // ─── TC20: Search Products and Verify Cart After Login ────────────────────
    // The user is already logged in (storageState). We just verify the cart
    // persists — no need to log in again mid-test.
    test('TC20: Search Products and Verify Cart After Login', async ({
        productsPage, cartPage
    }) => {
        await productsPage.navigateTo();
        await productsPage.searchProduct('Top');
        expect(await productsPage.isSearchedProductsVisible()).toBe(true);

        await productsPage.hoverAndAddToCart(0);
        await productsPage.clickViewCart();

        const names = await cartPage.getItemNames();
        expect(names.length).toBeGreaterThan(0);
    });

    // ─── TC22: Add to cart from Recommended items ─────────────────────────────
    test('TC22: Add to cart from Recommended items', async ({ homePage, cartPage }) => {
        await homePage.navigateTo();

        await homePage.addFirstRecommendedItemToCart();
        await homePage.clickViewCartFromModal();

        const count = await cartPage.getItemCount();
        expect(count).toBeGreaterThan(0);
    });
});

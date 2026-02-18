import { test, expect } from '../fixtures/test.fixture';

test.describe('Green Kart - Shopping Flow', () => {

    test('should add product to cart and verify', async ({ cartPage }) => {
        await cartPage.goto();

        // Search for a product
        await cartPage.search('Cucumber');

        // Add to cart
        // Locators might be tricky if multiple items. Assuming search returns 1 or we pick the first match.
        await cartPage.addToCart('Cucumber');

        // Check if cart icon shows items (optional, not implemented in POM yet but could be)
        await cartPage.openCart();

        // Verify we are in the cart preview (implicit if openCart succeeds)

        // Proceed to checkout
        await cartPage.proceedToCheckout();

        // Verify URL or page content
        await expect(cartPage.page).toHaveURL(/.*cart/);

        // In a real test, verify items in the table
    });

    test('should apply promo code', async ({ cartPage }) => {
        await cartPage.goto();
        await cartPage.search('Cucumber');
        await cartPage.addToCart('Cucumber');
        await cartPage.proceedToCheckout();

        // On checkout page, apply promo
        await cartPage.applyPromoCode('rahulshettyacademy');

        const promoInfo = await cartPage.getPromoInfoText();
        expect(promoInfo).toContain('Code applied');
    });

});

import { test, expect } from '../../fixtures/test.fixture';
import { UserData } from '../../fixtures/data/user.data';
import { ProductsPage } from '../../pages/products.page';

/**
 * Layer 3 — Checkout Login Flow  [app project — pre-authenticated]
 * TC16: Place Order: Login before Checkout
 *
 * The user is already logged in via storageState — no login step needed.
 */
test.describe('Checkout (Login Flow)', () => {

    async function addProductToCart(productsPage: ProductsPage) {
        await productsPage.navigateTo();
        await productsPage.hoverAndAddToCart(0);
        await productsPage.clickViewCart();
    }

    // ─── TC16: Place Order: Login before Checkout ─────────────────────────────
    test('TC16: Place Order: Login before Checkout', async ({
        productsPage, cartPage, checkoutPage, paymentPage
    }) => {
        const payment = UserData.payment();

        // Already logged in via storageState — go straight to shopping
        await addProductToCart(productsPage);
        await cartPage.proceedToCheckout();

        await checkoutPage.enterComment('Automated test order');
        await checkoutPage.placeOrder();

        await paymentPage.fillPaymentDetails(payment);
        await paymentPage.confirmOrder();

        const msg = await paymentPage.getSuccessMessage();
        expect(msg.toUpperCase()).toContain('ORDER PLACED!');
    });
});

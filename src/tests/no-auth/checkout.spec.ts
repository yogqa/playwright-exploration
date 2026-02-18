import { test, expect } from '../../fixtures/test.fixture';
import { UserData } from '../../fixtures/data/user.data';
import { ProductsPage } from '../../pages/products.page';

/**
 * Layer 3 — Checkout Specs  [no-auth project]
 * TC14: Place Order: Register while Checkout
 * TC15: Place Order: Register before Checkout
 * TC23: Verify address details in checkout page
 * TC24: Download Invoice after purchase order
 *
 * These tests register a throwaway user each time (unique email).
 * TC16 (Login before Checkout) lives in app/ since it uses the shared user.
 */
test.describe('Checkout (Register Flows)', () => {

    async function addProductToCart(productsPage: ProductsPage) {
        await productsPage.navigateTo();
        await productsPage.hoverAndAddToCart(0);
        await productsPage.clickViewCart();
    }

    // ─── TC14: Place Order: Register while Checkout ───────────────────────────
    test('TC14: Place Order: Register while Checkout', async ({
        productsPage, cartPage, checkoutPage, authPage, paymentPage
    }) => {
        const details = UserData.registration();
        const payment = UserData.payment();

        await addProductToCart(productsPage);
        await cartPage.proceedToCheckout();
        await checkoutPage.clickRegisterLogin();

        await authPage.signup(details.name, details.email);
        await authPage.fillAccountInfo(details);
        expect(await authPage.isAccountCreated()).toBe(true);
        await authPage.clickContinue();

        await cartPage.navigateTo();
        await cartPage.proceedToCheckout();
        await checkoutPage.enterComment('Automated test order');
        await checkoutPage.placeOrder();

        await paymentPage.fillPaymentDetails(payment);
        await paymentPage.confirmOrder();

        const msg = await paymentPage.getSuccessMessage();
        expect(msg.toUpperCase()).toContain('ORDER PLACED!');

        await authPage.deleteAccount();
        expect(await authPage.isAccountDeleted()).toBe(true);
    });

    // ─── TC15: Place Order: Register before Checkout ──────────────────────────
    test('TC15: Place Order: Register before Checkout', async ({
        authPage, productsPage, cartPage, checkoutPage, paymentPage
    }) => {
        const details = UserData.registration();
        const payment = UserData.payment();

        await authPage.navigateTo();
        await authPage.signup(details.name, details.email);
        await authPage.fillAccountInfo(details);
        expect(await authPage.isAccountCreated()).toBe(true);
        await authPage.clickContinue();

        await addProductToCart(productsPage);
        await cartPage.proceedToCheckout();
        await checkoutPage.enterComment('Automated test order');
        await checkoutPage.placeOrder();

        await paymentPage.fillPaymentDetails(payment);
        await paymentPage.confirmOrder();

        const msg = await paymentPage.getSuccessMessage();
        expect(msg.toUpperCase()).toContain('ORDER PLACED!');

        await authPage.deleteAccount();
        expect(await authPage.isAccountDeleted()).toBe(true);
    });

    // ─── TC23: Verify address details in checkout page ────────────────────────
    test('TC23: Verify address details in checkout page', async ({
        authPage, productsPage, cartPage, checkoutPage
    }) => {
        const details = UserData.registration();

        await authPage.navigateTo();
        await authPage.signup(details.name, details.email);
        await authPage.fillAccountInfo(details);
        expect(await authPage.isAccountCreated()).toBe(true);
        await authPage.clickContinue();

        await addProductToCart(productsPage);
        await cartPage.proceedToCheckout();

        const deliveryAddr = await checkoutPage.getDeliveryAddress();
        expect(deliveryAddr).toContain(details.firstName);

        const billingAddr = await checkoutPage.getBillingAddress();
        expect(billingAddr).toContain(details.firstName);

        await authPage.deleteAccount();
        expect(await authPage.isAccountDeleted()).toBe(true);
    });

    // ─── TC24: Download Invoice after purchase order ──────────────────────────
    test('TC24: Download Invoice after purchase order', async ({
        productsPage, cartPage, checkoutPage, authPage, paymentPage
    }) => {
        const details = UserData.registration();
        const payment = UserData.payment();

        await addProductToCart(productsPage);
        await cartPage.proceedToCheckout();
        await checkoutPage.clickRegisterLogin();

        await authPage.signup(details.name, details.email);
        await authPage.fillAccountInfo(details);
        expect(await authPage.isAccountCreated()).toBe(true);
        await authPage.clickContinue();

        await cartPage.navigateTo();
        await cartPage.proceedToCheckout();
        await checkoutPage.enterComment('Invoice download test');
        await checkoutPage.placeOrder();

        await paymentPage.fillPaymentDetails(payment);
        await paymentPage.confirmOrder();

        const msg = await paymentPage.getSuccessMessage();
        expect(msg.toUpperCase()).toContain('ORDER PLACED!');

        await paymentPage.downloadInvoice();
        await paymentPage.clickContinue();

        await authPage.deleteAccount();
        expect(await authPage.isAccountDeleted()).toBe(true);
    });
});

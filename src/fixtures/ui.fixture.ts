import { test as base } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { AuthPage } from '../pages/auth.page';
import { ProductsPage } from '../pages/products.page';
import { ProductDetailPage } from '../pages/product-detail.page';
import { CartPage } from '../pages/cart.page';
import { CheckoutPage } from '../pages/checkout.page';
import { PaymentPage } from '../pages/payment.page';
import { ContactUsPage } from '../pages/contact-us.page';

/**
 * UI Fixture Specialist — owned by the Fixture Helper Specialist.
 *
 * Responsibilities:
 *   ✅ Inject Page Object instances into tests via `test.extend()`
 *   ✅ Manage Page Object lifecycle (construction per test)
 *
 * Hard rules (enforced by fixture-specialist.md):
 *   ❌ No assertions (`expect()`)
 *   ❌ No API calls or `APIRequestContext`
 *   ❌ No business logic
 *   ❌ No `beforeEach` hacks
 *   ✅ Parallel-safe by design (each test gets its own `page` from Playwright)
 */
type UiFixtures = {
    homePage: HomePage;
    authPage: AuthPage;
    productsPage: ProductsPage;
    productDetailPage: ProductDetailPage;
    cartPage: CartPage;
    checkoutPage: CheckoutPage;
    paymentPage: PaymentPage;
    contactUsPage: ContactUsPage;
};

export const test = base.extend<UiFixtures>({

    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },

    authPage: async ({ page }, use) => {
        await use(new AuthPage(page));
    },

    productsPage: async ({ page }, use) => {
        await use(new ProductsPage(page));
    },

    productDetailPage: async ({ page }, use) => {
        await use(new ProductDetailPage(page));
    },

    cartPage: async ({ page }, use) => {
        await use(new CartPage(page));
    },

    checkoutPage: async ({ page }, use) => {
        await use(new CheckoutPage(page));
    },

    paymentPage: async ({ page }, use) => {
        await use(new PaymentPage(page));
    },

    contactUsPage: async ({ page }, use) => {
        await use(new ContactUsPage(page));
    },
});

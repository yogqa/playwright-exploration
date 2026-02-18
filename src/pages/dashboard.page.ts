import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * DashboardPage POM — models rahulshettyacademy.com/angularpractice/shop
 *
 * This is the page users land on after successful login.
 * Exposes locators and data-fetching methods — NO assertions.
 */
export class DashboardPage extends BasePage {
    // ── Locators (getters resolve fresh on each access — resilient to re-renders) ──
    private get navbarBrand() { return this.page.locator('.navbar-brand'); }
    private get productCards() { return this.page.locator('.card'); }

    constructor(page: Page) {
        super(page);
    }

    /** Returns the navbar brand locator for assertion in Layer 3 */
    getNavbarLocator(): Locator {
        return this.navbarBrand;
    }

    /** Returns the count of product cards on the shop page */
    async getProductCount(): Promise<number> {
        return this.productCards.count();
    }

    /** Returns whether the shop page is loaded (has product cards) */
    async isShopLoaded(): Promise<boolean> {
        return (await this.productCards.count()) > 0;
    }
}

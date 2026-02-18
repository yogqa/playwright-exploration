import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { DashboardPage } from './dashboard.page';

/**
 * LoginPage POM — models rahulshettyacademy.com/loginpagePractise/
 *
 * Locators use ID selectors (this practice site uses #username, #password, #signInBtn).
 * All interactions go through Layer 1 wrappers.
 * Returns data or next Page Object — NEVER assertions.
 */
export class LoginPage extends BasePage {
    // ── Locators (getters resolve fresh on each access — resilient to re-renders) ──
    private get usernameInput() { return this.page.locator('#username'); }
    private get passwordInput() { return this.page.locator('#password'); }
    private get termsCheckbox() { return this.page.locator('#terms'); }
    private get loginButton() { return this.page.locator('#signInBtn'); }
    private get alertDanger() { return this.page.locator('.alert-danger'); }

    constructor(page: Page) {
        super(page);
    }

    /** Navigate to the login page */
    async goto(): Promise<this> {
        await this.nav.goto('/loginpagePractise/');
        return this; // fluent
    }

    /** Perform login → returns DashboardPage (fluent navigation) */
    async login(username: string, password: string): Promise<DashboardPage> {
        await this.action.fill(this.usernameInput, username, { description: 'Username field' });
        await this.action.fill(this.passwordInput, password, { description: 'Password field' });
        await this.action.check(this.termsCheckbox, { description: 'Terms checkbox' });
        await this.action.click(this.loginButton, { description: 'Sign In button' });
        return new DashboardPage(this.page); // fluent: navigation returns next POM
    }

    /** Returns the error message text (for Layer 3 assertion) */
    async getErrorMessage(): Promise<string> {
        return this.action.getText(this.alertDanger, { description: 'Error alert' });
    }
}

import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { RegistrationDetails } from '../fixtures/data/user.data';

/**
 * Layer 2 — Auth Page POM (Login + Signup + Registration)
 * URL: https://automationexercise.com/login
 * Covers: TC1–5
 */
export class AuthPage extends BasePage {
    constructor(page: Page) { super(page); }

    // ─── Locators ────────────────────────────────────────────────────────────

    // Login form
    private get loginEmailInput() { return this.page.locator('[data-qa="login-email"]'); }
    private get loginPasswordInput() { return this.page.locator('[data-qa="login-password"]'); }
    private get loginButton() { return this.page.locator('[data-qa="login-button"]'); }
    private get loginErrorMsg() { return this.page.locator('p:has-text("Your email or password is incorrect!")'); }

    // Signup form (step 1 — name + email)
    private get signupNameInput() { return this.page.locator('[data-qa="signup-name"]'); }
    private get signupEmailInput() { return this.page.locator('[data-qa="signup-email"]'); }
    private get signupButton() { return this.page.locator('[data-qa="signup-button"]'); }
    private get signupErrorMsg() { return this.page.locator('p:has-text("Email Address already exist!")'); }

    // Registration form (step 2 — account info)
    private get titleMrRadio() { return this.page.locator('#id_gender1'); }
    private get titleMrsRadio() { return this.page.locator('#id_gender2'); }
    private get passwordInput() { return this.page.locator('[data-qa="password"]'); }
    private get dobDaySelect() { return this.page.locator('[data-qa="days"]'); }
    private get dobMonthSelect() { return this.page.locator('[data-qa="months"]'); }
    private get dobYearSelect() { return this.page.locator('[data-qa="years"]'); }
    private get newsletterCheckbox() { return this.page.locator('#newsletter'); }
    private get offersCheckbox() { return this.page.locator('#optin'); }
    private get firstNameInput() { return this.page.locator('[data-qa="first_name"]'); }
    private get lastNameInput() { return this.page.locator('[data-qa="last_name"]'); }
    private get companyInput() { return this.page.locator('[data-qa="company"]'); }
    private get address1Input() { return this.page.locator('[data-qa="address"]'); }
    private get address2Input() { return this.page.locator('[data-qa="address2"]'); }
    private get countrySelect() { return this.page.locator('[data-qa="country"]'); }
    private get stateInput() { return this.page.locator('[data-qa="state"]'); }
    private get cityInput() { return this.page.locator('[data-qa="city"]'); }
    private get zipcodeInput() { return this.page.locator('[data-qa="zipcode"]'); }
    private get mobileInput() { return this.page.locator('[data-qa="mobile_number"]'); }
    private get createAccountButton() { return this.page.locator('[data-qa="create-account"]'); }

    // Confirmation headings
    private get accountCreatedHeading() { return this.page.locator('[data-qa="account-created"]'); }
    private get accountDeletedHeading() { return this.page.locator('[data-qa="account-deleted"]'); }
    private get continueButton() { return this.page.locator('[data-qa="continue-button"]'); }

    // Navbar elements (post-login)
    private get loggedInAsLink() { return this.page.locator('a:has-text("Logged in as")'); }
    private get logoutLink() { return this.page.locator('a[href="/logout"]'); }
    private get deleteAccountLink() { return this.page.locator('a[href="/delete_account"]'); }

    // ─── Methods ─────────────────────────────────────────────────────────────

    async navigateTo() {
        await this.nav.goto('/login');
    }

    async login(email: string, password: string): Promise<void> {
        await this.action.fill(this.loginEmailInput, email, { description: 'Login email' });
        await this.action.fill(this.loginPasswordInput, password, { description: 'Login password' });
        await this.action.click(this.loginButton, { description: 'Login button' });
    }

    async signup(name: string, email: string): Promise<void> {
        await this.action.fill(this.signupNameInput, name, { description: 'Signup name' });
        await this.action.fill(this.signupEmailInput, email, { description: 'Signup email' });
        await this.action.click(this.signupButton, { description: 'Signup button' });
    }

    async fillAccountInfo(details: RegistrationDetails): Promise<void> {
        // Title
        if (details.title === 'Mr') {
            await this.action.click(this.titleMrRadio, { description: 'Title: Mr' });
        } else {
            await this.action.click(this.titleMrsRadio, { description: 'Title: Mrs' });
        }

        // Password & DOB
        await this.action.fill(this.passwordInput, details.password, { description: 'Password' });
        await this.action.selectOption(this.dobDaySelect, details.day, { description: 'DOB day' });
        await this.action.selectOption(this.dobMonthSelect, details.month, { description: 'DOB month' });
        await this.action.selectOption(this.dobYearSelect, details.year, { description: 'DOB year' });

        // Checkboxes
        if (details.newsletter) await this.action.check(this.newsletterCheckbox, { description: 'Newsletter' });
        if (details.offers) await this.action.check(this.offersCheckbox, { description: 'Offers' });

        // Address details
        await this.action.fill(this.firstNameInput, details.firstName, { description: 'First name' });
        await this.action.fill(this.lastNameInput, details.lastName, { description: 'Last name' });
        await this.action.fill(this.companyInput, details.company, { description: 'Company' });
        await this.action.fill(this.address1Input, details.address1, { description: 'Address 1' });
        await this.action.fill(this.address2Input, details.address2, { description: 'Address 2' });
        await this.action.selectOption(this.countrySelect, details.country, { description: 'Country' });
        await this.action.fill(this.stateInput, details.state, { description: 'State' });
        await this.action.fill(this.cityInput, details.city, { description: 'City' });
        await this.action.fill(this.zipcodeInput, details.zipcode, { description: 'Zipcode' });
        await this.action.fill(this.mobileInput, details.mobile, { description: 'Mobile' });

        await this.action.click(this.createAccountButton, { description: 'Create Account button' });
    }

    async clickContinue(): Promise<void> {
        await this.action.click(this.continueButton, { description: 'Continue button' });
    }

    async getLoginError(): Promise<string> {
        return this.action.getText(this.loginErrorMsg, { description: 'Login error message' });
    }

    async getSignupError(): Promise<string> {
        return this.action.getText(this.signupErrorMsg, { description: 'Signup error message' });
    }

    async getLoggedInUsername(): Promise<string> {
        const text = await this.action.getText(this.loggedInAsLink, { description: 'Logged in as' });
        return text.replace('Logged in as', '').trim();
    }

    async isAccountCreated(): Promise<boolean> {
        return this.accountCreatedHeading.isVisible();
    }

    async isAccountDeleted(): Promise<boolean> {
        return this.accountDeletedHeading.isVisible();
    }

    async logout(): Promise<void> {
        await this.action.click(this.logoutLink, { description: 'Logout link' });
    }

    async deleteAccount(): Promise<void> {
        await this.action.click(this.deleteAccountLink, { description: 'Delete Account link' });
    }

    async isOnLoginPage(): Promise<boolean> {
        return this.page.locator('h2:has-text("Login to your account")').isVisible();
    }
}

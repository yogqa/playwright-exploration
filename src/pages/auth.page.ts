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
    private get loginEmailInput() { return this.page.getByTestId('login-email'); }
    private get loginPasswordInput() { return this.page.getByTestId('login-password'); }
    private get loginButton() { return this.page.getByRole('button', { name: 'Login' }); }
    private get loginErrorMsg() { return this.page.getByText('Your email or password is incorrect!'); }

    // Signup form (step 1 — name + email)
    private get signupNameInput() { return this.page.getByTestId('signup-name'); }
    private get signupEmailInput() { return this.page.getByTestId('signup-email'); }
    private get signupButton() { return this.page.getByRole('button', { name: 'Signup' }); }
    private get signupErrorMsg() { return this.page.getByText('Email Address already exist!'); }

    // Registration form (step 2 — account info)
    // Radio inputs are selected via their visible label text using getByRole
    private get titleMrRadio() { return this.page.getByRole('radio', { name: 'Mr.' }); }
    private get titleMrsRadio() { return this.page.getByRole('radio', { name: 'Mrs.' }); }
    private get passwordInput() { return this.page.getByTestId('password'); }
    private get dobDaySelect() { return this.page.getByTestId('days'); }
    private get dobMonthSelect() { return this.page.getByTestId('months'); }
    private get dobYearSelect() { return this.page.getByTestId('years'); }
    // Checkboxes use getByLabel — the visible label text is the accessible name
    private get newsletterCheckbox() { return this.page.getByRole('checkbox', { name: /newsletter/i }); }
    private get offersCheckbox() { return this.page.getByRole('checkbox', { name: /offers/i }); }
    private get firstNameInput() { return this.page.getByTestId('first_name'); }
    private get lastNameInput() { return this.page.getByTestId('last_name'); }
    private get companyInput() { return this.page.getByTestId('company'); }
    private get address1Input() { return this.page.getByTestId('address'); }
    private get address2Input() { return this.page.getByTestId('address2'); }
    private get countrySelect() { return this.page.getByTestId('country'); }
    private get stateInput() { return this.page.getByTestId('state'); }
    private get cityInput() { return this.page.getByTestId('city'); }
    private get zipcodeInput() { return this.page.getByTestId('zipcode'); }
    private get mobileInput() { return this.page.getByTestId('mobile_number'); }
    private get createAccountButton() { return this.page.getByRole('button', { name: 'Create Account' }); }

    // Confirmation headings
    private get accountCreatedHeading() { return this.page.getByText('Account Created!'); }
    private get accountDeletedHeading() { return this.page.getByText('Account Deleted!'); }
    private get continueButton() { return this.page.getByRole('link', { name: 'Continue' }); }

    // Navbar elements (post-login)
    private get loggedInAsLink() { return this.page.getByText('Logged in as'); }
    private get logoutLink() { return this.page.getByRole('link', { name: 'Logout' }); }
    private get deleteAccountLink() { return this.page.getByRole('link', { name: 'Delete Account' }); }

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
        return this.page.getByRole('heading', { name: 'Login to your account' }).isVisible();
    }
}

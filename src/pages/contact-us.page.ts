import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { ContactFormDetails } from '../fixtures/data/user.data';

/**
 * Layer 2 — Contact Us Page POM
 * URL: https://automationexercise.com/contact_us
 * Covers: TC6
 */
export class ContactUsPage extends BasePage {
    constructor(page: Page) { super(page); }

    // ─── Locators ────────────────────────────────────────────────────────────

    private get getInTouchHeading() { return this.page.locator('h2:has-text("Get In Touch")'); }
    private get nameInput() { return this.page.locator('[data-qa="name"]'); }
    private get emailInput() { return this.page.locator('[data-qa="email"]'); }
    private get subjectInput() { return this.page.locator('[data-qa="subject"]'); }
    private get messageTextarea() { return this.page.locator('[data-qa="message"]'); }
    private get fileUploadInput() { return this.page.locator('input[name="upload_file"]'); }
    private get submitButton() { return this.page.locator('[data-qa="submit-button"]'); }
    private get successMsg() { return this.page.locator('.status.alert-success'); }
    private get homeButton() { return this.page.locator('a:has-text("Home")').first(); }

    // ─── Methods ─────────────────────────────────────────────────────────────

    async navigateTo() {
        await this.nav.goto('/contact_us');
    }

    async isGetInTouchVisible(): Promise<boolean> {
        return this.getInTouchHeading.isVisible();
    }

    async fillContactForm(details: ContactFormDetails): Promise<void> {
        await this.action.fill(this.nameInput, details.name, { description: 'Contact name' });
        await this.action.fill(this.emailInput, details.email, { description: 'Contact email' });
        await this.action.fill(this.subjectInput, details.subject, { description: 'Contact subject' });
        await this.action.fill(this.messageTextarea, details.message, { description: 'Contact message' });
    }

    async uploadFile(filePath: string): Promise<void> {
        await this.fileUploadInput.setInputFiles(filePath);
    }

    async submit(): Promise<void> {
        // Register a non-blocking dialog handler — accepts if a confirm dialog appears,
        // but does NOT fail if no dialog is shown (headless vs headed can differ)
        this.page.once('dialog', dialog => dialog.accept());
        await this.action.click(this.submitButton, { description: 'Submit contact form' });
        // Wait for success message to become visible after form submission
        await this.successMsg.waitFor({ state: 'visible', timeout: 15000 });
    }

    async getSuccessMessage(): Promise<string> {
        return this.action.getText(this.successMsg, { description: 'Contact success message' });
    }

    async clickHome(): Promise<void> {
        await this.action.click(this.homeButton, { description: 'Home button' });
    }
}

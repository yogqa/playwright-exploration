import { test, expect } from '../../fixtures/test.fixture';
import { UserData } from '../../fixtures/data/user.data';
import * as path from 'path';

/**
 * Layer 3 — Contact Us Spec  [no-auth project]
 * TC6: Contact Us Form
 */
test.describe('Contact Us', () => {

    // ─── TC6: Contact Us Form ─────────────────────────────────────────────────
    test('TC6: Contact Us Form', async ({ homePage, contactUsPage }) => {
        await homePage.navigateTo();
        await homePage.navigateToContactUs();

        expect(await contactUsPage.isGetInTouchVisible()).toBe(true);

        const formData = UserData.contactForm();
        await contactUsPage.fillContactForm(formData);

        const dummyFile = path.resolve('c:/coding projects/playwright-exploration/.env.example');
        await contactUsPage.uploadFile(dummyFile);

        await contactUsPage.submit();

        const successMsg = await contactUsPage.getSuccessMessage();
        expect(successMsg).toContain('Success! Your details have been submitted successfully.');

        await contactUsPage.clickHome();
        const heroText = await homePage.getHeroText();
        expect(heroText).toBeTruthy();
    });
});

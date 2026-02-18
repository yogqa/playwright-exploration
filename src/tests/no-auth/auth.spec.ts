import { test, expect } from '../../fixtures/test.fixture';
import { UserData } from '../../fixtures/data/user.data';

/**
 * Layer 3 — Auth Test Specs  [no-auth project]
 * TC1: Register User
 * TC2: Login User with correct email and password
 * TC3: Login User with incorrect email and password
 * TC4: Logout User
 * TC5: Register User with existing email
 */
test.describe('Authentication', () => {

    test.beforeEach(async ({ authPage }) => {
        await authPage.navigateTo();
    });

    // ─── TC1: Register User ───────────────────────────────────────────────────
    test('TC1: Register User', async ({ authPage }) => {
        const details = UserData.registration();

        expect(await authPage.isOnLoginPage()).toBe(true);

        await authPage.signup(details.name, details.email);
        await authPage.fillAccountInfo(details);

        expect(await authPage.isAccountCreated()).toBe(true);
        await authPage.clickContinue();

        const username = await authPage.getLoggedInUsername();
        expect(username).toBe(details.name);

        await authPage.deleteAccount();
        expect(await authPage.isAccountDeleted()).toBe(true);
    });

    // ─── TC2: Login with correct credentials ─────────────────────────────────
    test('TC2: Login User with correct email and password', async ({ authPage }) => {
        const { email, password } = UserData.validLogin();

        await authPage.login(email, password);

        const username = await authPage.getLoggedInUsername();
        expect(username).toBeTruthy();
    });

    // ─── TC3: Login with incorrect credentials ────────────────────────────────
    test('TC3: Login User with incorrect email and password', async ({ authPage }) => {
        const { email, password } = UserData.invalidLogin();

        await authPage.login(email, password);

        const errorMsg = await authPage.getLoginError();
        expect(errorMsg).toContain('Your email or password is incorrect!');
    });

    // ─── TC4: Logout User ─────────────────────────────────────────────────────
    test('TC4: Logout User', async ({ authPage }) => {
        const { email, password } = UserData.validLogin();

        await authPage.login(email, password);
        expect(await authPage.getLoggedInUsername()).toBeTruthy();

        await authPage.logout();

        expect(await authPage.isOnLoginPage()).toBe(true);
    });

    // ─── TC5: Register with existing email ────────────────────────────────────
    test('TC5: Register User with existing email', async ({ authPage }) => {
        // Use the shared user's email — it already exists
        const { email } = UserData.validLogin();

        await authPage.signup('Existing User', email);

        const errorMsg = await authPage.getSignupError();
        expect(errorMsg).toContain('Email Address already exist!');
    });
});

import { chromium, FullConfig } from '@playwright/test';
import { envConfig } from './src/config/env.config';
import * as fs from 'fs';

/**
 * Global Setup — Register + Authenticate a shared test user
 *
 * Strategy:
 *   1. Register a fresh user on automationexercise.com (unique email per run)
 *   2. Save the browser storageState → auth/user.json  (used by the `chromium` project)
 *   3. Write the credentials → auth/user-credentials.json  (read by UserData.validLogin())
 *
 * This means tests NEVER need a pre-existing account. Every CI run gets a
 * clean user. Tests that test registration itself (TC1, TC5) create their
 * own throwaway accounts with separate unique emails.
 */

const CREDENTIALS_PATH = './auth/user-credentials.json';
const STATE_PATH = './auth/user.json';

async function globalSetup(_config: FullConfig) {
    // Ensure auth directory exists
    if (!fs.existsSync('./auth')) {
        fs.mkdirSync('./auth', { recursive: true });
    }

    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    // Generate a unique email for this run
    const email = `tester+${Date.now()}@antigravity.dev`;
    const password = envConfig.USER_PASSWORD;
    const name = envConfig.USER_NAME;

    try {
        // ── Step 1: Navigate to login page ──────────────────────────────────
        await page.goto(`${envConfig.BASE_URL}/login`);

        // ── Step 2: Fill signup form (name + email) ──────────────────────────
        await page.locator('[data-qa="signup-name"]').fill(name);
        await page.locator('[data-qa="signup-email"]').fill(email);
        await page.locator('[data-qa="signup-button"]').click();

        // ── Step 3: Fill account info form ───────────────────────────────────
        await page.locator('#id_gender1').check();                              // Title: Mr
        await page.locator('[data-qa="password"]').fill(password);
        await page.locator('[data-qa="days"]').selectOption('15');
        await page.locator('[data-qa="months"]').selectOption('June');
        await page.locator('[data-qa="years"]').selectOption('1990');
        await page.locator('#newsletter').check();
        await page.locator('#optin').check();
        await page.locator('[data-qa="first_name"]').fill('Antigravity');
        await page.locator('[data-qa="last_name"]').fill('Tester');
        await page.locator('[data-qa="company"]').fill('Antigravity QA');
        await page.locator('[data-qa="address"]').fill('123 Test Street');
        await page.locator('[data-qa="address2"]').fill('Suite 456');
        await page.locator('[data-qa="country"]').selectOption('India');
        await page.locator('[data-qa="state"]').fill('Maharashtra');
        await page.locator('[data-qa="city"]').fill('Mumbai');
        await page.locator('[data-qa="zipcode"]').fill('400001');
        await page.locator('[data-qa="mobile_number"]').fill('9876543210');
        await page.locator('[data-qa="create-account"]').click();

        // ── Step 4: Confirm account created ──────────────────────────────────
        await page.waitForSelector('[data-qa="account-created"]', { timeout: 10000 });
        await page.locator('[data-qa="continue-button"]').click();

        // ── Step 5: Verify logged in ──────────────────────────────────────────
        await page.waitForSelector('a:has-text("Logged in as")', { timeout: 8000 });
        console.log(`✓ Global setup: Registered and logged in as ${email}`);

        // ── Step 6: Save storageState + credentials ───────────────────────────
        await context.storageState({ path: STATE_PATH });
        fs.writeFileSync(CREDENTIALS_PATH, JSON.stringify({ email, password, name }, null, 2));
        console.log(`✓ Global setup: Saved auth state → ${STATE_PATH}`);
        console.log(`✓ Global setup: Saved credentials → ${CREDENTIALS_PATH}`);

    } catch (error) {
        console.error(
            `✗ Global setup: Registration failed. Error: ${(error as Error).message}\n` +
            `  Current URL: ${page.url()}`
        );
        // Write empty state so files always exist and tests can fail gracefully
        fs.writeFileSync(STATE_PATH, JSON.stringify({ cookies: [], origins: [] }));
        fs.writeFileSync(CREDENTIALS_PATH, JSON.stringify({ email, password, name }, null, 2));
    } finally {
        await context.close();
        await browser.close();
    }
}

export default globalSetup;

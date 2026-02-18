import { chromium, FullConfig } from '@playwright/test';
import { envConfig } from './src/config/env.config';
import * as fs from 'fs';

/**
 * Global Setup — Multi-Role Authentication
 *
 * Logs in as each persona (admin, standard_user) and saves the browser
 * storageState to auth/*.json. Tests reference these files to skip
 * re-authenticating on every run.
 *
 * Updated for rahulshettyacademy.com/loginpagePractise/
 */

interface UserPersona {
    username: string;
    password: string;
    statePath: string;
}

const personas: UserPersona[] = [
    {
        username: envConfig.ADMIN_USER,
        password: envConfig.ADMIN_PASS,
        statePath: './auth/admin.json',
    },
    {
        username: envConfig.STANDARD_USER,
        password: envConfig.STANDARD_PASS,
        statePath: './auth/standard_user.json',
    },
];

async function globalSetup(_config: FullConfig) {
    // Ensure auth directory exists
    if (!fs.existsSync('./auth')) {
        fs.mkdirSync('./auth', { recursive: true });
    }

    const browser = await chromium.launch();

    for (const persona of personas) {
        const context = await browser.newContext();
        const page = await context.newPage();

        try {
            await page.goto(envConfig.BASE_URL + '/loginpagePractise/');

            // Fill username and password
            await page.locator('#username').fill(persona.username);
            await page.locator('#password').fill(persona.password);

            // Check the terms checkbox (critical step!)
            await page.locator('#terms').check();

            // Click the Sign In button
            await page.locator('#signInBtn').click();

            // Wait for navigation to the shop page
            // Note: The practice site sometimes redirects via JS, so waitForURL is key
            try {
                await page.waitForURL('**/angularpractice/shop', { timeout: 5000 });
            } catch (e) {
                console.warn(`Global setup: Login redirect to shop failed or timed out. Current URL: ${page.url()}`);
            }

            await context.storageState({ path: persona.statePath });
            // console.log(`✓ Authenticated persona: ${persona.username}`); // Logging handled by console.warn if failed, or success implied.
        } catch (error) {
            console.warn(
                `⚠ Global setup: Could not authenticate persona "${persona.username}". ` +
                `Tests requiring this role may fail. Error: ${(error as Error).message}\n` +
                `Current URL: ${page.url()}`
            );
        } finally {
            await context.close();
        }
    }

    await browser.close();
}

export default globalSetup;

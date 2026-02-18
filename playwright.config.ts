import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Antigravity Test Automation Framework — Playwright Configuration
 *
 * Key decisions:
 * - testDir points to src/tests (Layer 3)
 * - globalSetup handles multi-role auth (admin + standard_user)
 * - Allure + list reporters for rich reporting
 * - Video/trace/screenshot captured only on failure (lean CI artifacts)
 */
export default defineConfig({
  testDir: './src/tests',

  /* Global setup/teardown for multi-role auth */
  globalSetup: require.resolve('./global-setup'),
  globalTeardown: require.resolve('./global-teardown'),

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Opt out of parallel tests on CI */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter: list for console + Allure for rich HTML dashboard */
  reporter: [
    ['list'],
    ['allure-playwright'],
  ],

  /* Shared settings for all projects */
  use: {
    /* Base URL — actions like page.goto('/login') resolve against this */
    baseURL: process.env.BASE_URL || 'https://rahulshettyacademy.com',

    /* Capture artifacts only on failure to keep CI lean */
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  /* Configure projects */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: './auth/admin.json',
      },
    },

    // Uncomment to add multi-browser coverage:
    // {
    //   name: 'firefox',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //     storageState: './auth/admin.json',
    //   },
    // },
    // {
    //   name: 'webkit',
    //   use: {
    //     ...devices['Desktop Safari'],
    //     storageState: './auth/admin.json',
    //   },
    // },
  ],
});

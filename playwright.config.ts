import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Antigravity Test Automation Framework — Playwright Configuration
 * Target: https://automationexercise.com
 *
 * Projects:
 *   chromium  → src/tests/app/     (pre-authenticated via auth/user.json)
 *   no-auth   → src/tests/no-auth/ (fresh browser — register/login/contact-us flows)
 *   security  → src/tests/         (ai-guard.spec.ts — no auth needed)
 */
export default defineConfig({
  /* Global setup registers a fresh user and saves auth/user.json */
  globalSetup: require.resolve('./global-setup'),
  globalTeardown: require.resolve('./global-teardown'),

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Serial execution — app/ tests share one logged-in user, parallel runs corrupt cart state */
  workers: 1,

  /* Reporter: list for console + Allure for rich HTML dashboard */
  reporter: [
    ['list'],
    ['allure-playwright'],
  ],

  /* Shared settings for all projects */
  use: {
    baseURL: process.env.BASE_URL || 'https://automationexercise.com',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  projects: [
    /**
     * App project — authenticated tests.
     * global-setup registers a user and saves storageState → auth/user.json.
     * Every test in app/ starts already logged in.
     */
    {
      name: 'app',
      testDir: './src/tests/app',
      use: {
        ...devices['Desktop Chrome'],
        storageState: './auth/user.json',
      },
    },

    /**
     * No-auth project — tests that must start unauthenticated.
     * Registration, login flows, contact us, checkout-with-register.
     */
    {
      name: 'no-auth',
      testDir: './src/tests/no-auth',
      use: {
        ...devices['Desktop Chrome'],
      },
    },

    /**
     * Security project — AI guard tests (no auth needed).
     */
    {
      name: 'security',
      testDir: './src/tests',
      testMatch: '**/ai-guard.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
});


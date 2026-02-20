import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Antigravity Test Automation Framework — Playwright Configuration
 * Target: https://automationexercise.com
 *
 * Projects:
 *   app       → src/tests/app/      (pre-authenticated via auth/user.json)
 *   no-auth   → src/tests/no-auth/  (fresh browser — register/login/contact-us flows)
 *   api       → src/tests/api/      (Zod-validated API contract tests)
 *   security  → src/tests/          (ai-guard.spec.ts — no auth needed)
 *
 * AI Orchestrator Rules:
 *   Always read: .agent/rules/orchestrator.md (routes to specialist)
 *   CI/Config specialist: .agent/rules/ci-config-specialist.md
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

  /* Consolidated output directory for Playwright artifacts (traces, videos, screenshots) */
  outputDir: 'test-results',

  /* Reporter: list for console + Allure for rich HTML dashboard */
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'html-report' }],
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
     * App project — authenticated UI tests.
     * global-setup registers a user and saves storageState → auth/user.json.
     * Every test in app/ starts already logged in.
     *
     * AI Orchestrator: Load ui-specialist.md when editing these tests.
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
     *
     * AI Orchestrator: Load ui-specialist.md when editing these tests.
     */
    {
      name: 'no-auth',
      testDir: './src/tests/no-auth',
      use: {
        ...devices['Desktop Chrome'],
      },
    },

    /**
     * API project — Zod-validated API contract tests.
     * No browser state needed. Tests follow the mandatory 3-step flow:
     *   call client → validate schema → business assertions.
     *
     * AI Orchestrator: Load api-specialist.md when editing these tests.
     */
    {
      name: 'api',
      testDir: './src/tests/api',
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

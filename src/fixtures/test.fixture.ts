import { mergeTests } from '@playwright/test';
import { test as withUi } from './ui.fixture';
import { test as withApi } from './api.fixture';

/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  Antigravity Fixture Composer — Thin Entry Point            ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * This file is the SINGLE import point for all test specs.
 * It composes two specialist fixture files — do NOT add logic here.
 *
 *   ui.fixture.ts   → Page Object factories (UI Specialist)
 *   api.fixture.ts  → apiContext + API domain clients (API Specialist)
 *
 * To add a new fixture:
 *   - Page Object  → edit src/fixtures/ui.fixture.ts
 *   - API client   → edit src/fixtures/api.fixture.ts
 *   - Never add fixture logic directly into this file.
 *
 * See .agent/rules/fixture-specialist.md for full ownership rules.
 */
export const test = mergeTests(withUi, withApi);

export { expect } from '@playwright/test';


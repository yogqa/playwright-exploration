import { test, expect } from '../../fixtures/test.fixture';
import { validateSchema } from '../../utils/schema-validator';
import {
    AuthResponseSchema,
    UserDetailResponseSchema,
} from '../schemas/user.schema';
import { envConfig } from '../../config/env.config';
import * as fs from 'fs';

/**
 * API Specialist — User / Auth API Tests
 *
 * Mandatory 3-step flow (enforced by api-specialist.md):
 *   Step 1: Call API client    → returns raw unknown
 *   Step 2: Validate schema    → fails immediately if contract drifts
 *   Step 3: Business assertions → on fully-typed validated data only
 *
 * Target: https://automationexercise.com/api_list
 */
test.describe('User API', () => {

    // ─── Verify Login (valid credentials) ────────────────────────────────────

    test('POST /api/verifyLogin — valid credentials return success', async ({ userApi }) => {
        // Read credentials saved by globalSetup (fresh per-run user)
        const credentialsPath = './auth/user-credentials.json';
        const credentials = fs.existsSync(credentialsPath)
            ? JSON.parse(fs.readFileSync(credentialsPath, 'utf-8'))
            : { email: envConfig.USER_EMAIL, password: envConfig.USER_PASSWORD };

        // Step 1: Call client
        const rawData = await userApi.verifyLogin(credentials.email, credentials.password);

        // Step 2: Validate schema
        const validated = validateSchema(
            AuthResponseSchema,
            rawData,
            'POST /api/verifyLogin (valid)',
        );

        // Step 3: Business assertions
        expect(validated.responseCode).toBe(200);
        expect(validated.message).toContain('User exists');
    });

    // ─── Verify Login (invalid credentials) ──────────────────────────────────

    test('POST /api/verifyLogin — invalid credentials return 404', async ({ userApi }) => {
        const rawData = await userApi.verifyLoginWithInvalidCredentials(
            'nonexistent@antigravity.dev',
            'WrongPass123',
        );

        const validated = validateSchema(
            AuthResponseSchema,
            rawData,
            'POST /api/verifyLogin (invalid)',
        );

        expect(validated.responseCode).toBe(404);
        expect(validated.message).toBeTruthy();
    });

    // ─── Get User By Email ────────────────────────────────────────────────────

    test('GET /api/getUserDetailByEmail — returns user detail for valid email', async ({ userApi }) => {
        const credentialsPath = './auth/user-credentials.json';
        const credentials = fs.existsSync(credentialsPath)
            ? JSON.parse(fs.readFileSync(credentialsPath, 'utf-8'))
            : { email: envConfig.USER_EMAIL };

        const rawData = await userApi.getUserByEmail(credentials.email);

        const validated = validateSchema(
            UserDetailResponseSchema,
            rawData,
            'GET /api/getUserDetailByEmail',
        );

        expect(validated.responseCode).toBe(200);
        expect(validated.user).toBeDefined();
        expect(validated.user?.email).toBe(credentials.email);
    });

    test('GET /api/getUserDetailByEmail — unknown email returns 404', async ({ userApi }) => {
        const rawData = await userApi.getUserByEmail('ghost@nowhere.dev');

        const validated = validateSchema(
            UserDetailResponseSchema,
            rawData,
            'GET /api/getUserDetailByEmail (unknown)',
        );

        expect(validated.responseCode).toBe(404);
    });

});

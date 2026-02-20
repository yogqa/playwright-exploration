import { APIRequestContext } from '@playwright/test';

/**
 * User API Client — Transport Layer Only
 *
 * This class handles HTTP transport for user/auth-related endpoints.
 * It returns raw unknown data — NO Zod imports, NO assertions.
 *
 * Validation and assertions happen in the test spec (src/tests/api/).
 * See: api-specialist.md for the mandatory 3-step API test flow.
 */
export class UserApiClient {
    constructor(private readonly request: APIRequestContext) { }

    /**
     * Get user details by email address.
     * Endpoint: GET /api/getUserDetailByEmail?email=<email>
     */
    async getUserByEmail(email: string): Promise<unknown> {
        const res = await this.request.get('/api/getUserDetailByEmail', {
            params: { email },
        });
        return res.json();
    }

    /**
     * Verify login credentials.
     * Endpoint: POST /api/verifyLogin
     */
    async verifyLogin(email: string, password: string): Promise<unknown> {
        const res = await this.request.post('/api/verifyLogin', {
            form: { email, password },
        });
        return res.json();
    }

    /**
     * Verify that login fails with invalid credentials (negative test).
     * Endpoint: POST /api/verifyLogin
     */
    async verifyLoginWithInvalidCredentials(email: string, password: string): Promise<unknown> {
        const res = await this.request.post('/api/verifyLogin', {
            form: { email, password },
        });
        return res.json();
    }
}

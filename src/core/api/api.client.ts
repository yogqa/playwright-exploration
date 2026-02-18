import { APIRequestContext, request } from '@playwright/test';
import { logger } from '../logger';
import { envConfig } from '../../config/env.config';
import { TIMEOUTS } from '../../config/constants';

/**
 * Thin wrapper around Playwright's APIRequestContext for API-first test setup.
 * Provides logging and error observability for all API calls.
 */
export class ApiClient {
    private context!: APIRequestContext;

    async init(): Promise<this> {
        this.context = await request.newContext({
            baseURL: envConfig.BASE_URL,
            extraHTTPHeaders: {
                'Accept': 'application/json',
            },
        });
        logger.info('API     ▸ initialized API client');
        return this;
    }

    async get(endpoint: string): Promise<Record<string, unknown>> {
        logger.info(`API     ▸ GET    → ${endpoint}`);
        try {
            const response = await this.context.get(endpoint, { timeout: TIMEOUTS.API });
            const body = await response.json();
            logger.info(`API     ◂ GET    ← ${response.status()}`);
            return body;
        } catch (error) {
            logger.error(`FAILED  ▸ GET    → ${endpoint} | Error: ${(error as Error).message}`);
            throw error;
        }
    }

    async post(endpoint: string, data?: Record<string, unknown>): Promise<Record<string, unknown>> {
        logger.info(`API     ▸ POST   → ${endpoint}`);
        try {
            const response = await this.context.post(endpoint, {
                data,
                timeout: TIMEOUTS.API,
            });
            const body = await response.json();
            logger.info(`API     ◂ POST   ← ${response.status()}`);
            return body;
        } catch (error) {
            logger.error(`FAILED  ▸ POST   → ${endpoint} | Error: ${(error as Error).message}`);
            throw error;
        }
    }

    async dispose(): Promise<void> {
        await this.context.dispose();
        logger.info('API     ▸ disposed API client');
    }
}

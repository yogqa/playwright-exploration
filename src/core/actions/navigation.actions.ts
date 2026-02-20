import { Page } from '@playwright/test';
import { logger } from '../logger';
import { envConfig } from '../../config/env.config';
import { TIMEOUTS } from '../../config/constants';

export class NavigationActions {
    constructor(private readonly page: Page) { }

    /**
     * Navigate to a path relative to BASE_URL.
     */
    async goto(path: string): Promise<void> {
        const url = `${envConfig.BASE_URL}${path}`;
        logger.info(`NAV     ▸ goto   → ${url}`);
        try {
            await this.page.goto(url, { timeout: TIMEOUTS.NAVIGATION, waitUntil: 'domcontentloaded' });
        } catch (error) {
            logger.error(`FAILED  ▸ goto   → ${url} | Error: ${(error as Error).message}`);
            throw error;
        }
    }

    /**
     * Reload the current page.
     */
    async reload(): Promise<void> {
        logger.info(`NAV     ▸ reload → ${this.page.url()}`);
        try {
            await this.page.reload({ timeout: TIMEOUTS.NAVIGATION, waitUntil: 'domcontentloaded' });
        } catch (error) {
            logger.error(`FAILED  ▸ reload | Error: ${(error as Error).message}`);
            throw error;
        }
    }

    /**
     * Wait for a URL pattern to match.
     */
    async waitForURL(urlPattern: string | RegExp): Promise<void> {
        logger.info(`NAV     ▸ waitForURL → ${urlPattern}`);
        try {
            await this.page.waitForURL(urlPattern, { timeout: TIMEOUTS.NAVIGATION });
        } catch (error) {
            logger.error(`FAILED  ▸ waitForURL → ${urlPattern} | Error: ${(error as Error).message}`);
            throw error;
        }
    }
}

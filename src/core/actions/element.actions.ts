import { Locator, Page } from '@playwright/test';
import { logger } from '../logger';
import { smartWait } from '../waits/smart-wait';
import { TIMEOUTS } from '../../config/constants';

/** Options bag for Layer 1 actions */
export interface ActionOptions {
    description?: string;
    /** Enable aggressive bounding-box stability check for flaky elements */
    aggressiveStability?: boolean;
}

export class ElementActions {
    constructor(private readonly page: Page) { }

    /**
     * Smart Click — logs, optional stability wait, try/catch error observability.
     */
    async click(locator: Locator, opts?: ActionOptions): Promise<void> {
        const label = opts?.description ?? locator.toString();
        logger.info(`ACTION  ▸ click  → ${label}`);
        try {
            await smartWait(locator, { aggressiveStability: opts?.aggressiveStability });
            await locator.click({ timeout: TIMEOUTS.ACTION });
        } catch (error) {
            logger.error(`FAILED  ▸ click  → ${label} | Error: ${(error as Error).message}`);
            throw error;
        }
    }

    /**
     * Safe Fill — clears existing value, fills, with error observability.
     */
    async fill(locator: Locator, value: string, opts?: ActionOptions): Promise<void> {
        const label = opts?.description ?? locator.toString();
        logger.info(`ACTION  ▸ fill   → ${label}  value="${value}"`);
        try {
            await smartWait(locator, { aggressiveStability: opts?.aggressiveStability });
            await locator.fill(value, { timeout: TIMEOUTS.ACTION });
        } catch (error) {
            logger.error(`FAILED  ▸ fill   → ${label} | Error: ${(error as Error).message}`);
            throw error;
        }
    }

    /**
     * Get Text — returns trimmed inner text, with error observability.
     */
    async getText(locator: Locator, opts?: ActionOptions): Promise<string> {
        const label = opts?.description ?? locator.toString();
        logger.info(`ACTION  ▸ getText → ${label}`);
        try {
            await smartWait(locator, { aggressiveStability: opts?.aggressiveStability });
            const text = (await locator.innerText({ timeout: TIMEOUTS.ACTION })).trim();
            logger.info(`         ◂ result  = "${text}"`);
            return text;
        } catch (error) {
            logger.error(`FAILED  ▸ getText → ${label} | Error: ${(error as Error).message}`);
            throw error;
        }
    }

    /**
     * Hover — moves cursor over element, with error observability.
     */
    async hover(locator: Locator, opts?: ActionOptions): Promise<void> {
        const label = opts?.description ?? locator.toString();
        logger.info(`ACTION  ▸ hover  → ${label}`);
        try {
            await smartWait(locator, { aggressiveStability: opts?.aggressiveStability });
            await locator.hover({ timeout: TIMEOUTS.ACTION });
        } catch (error) {
            logger.error(`FAILED  ▸ hover  → ${label} | Error: ${(error as Error).message}`);
            throw error;
        }
    }

    /**
     * Check — checks a checkbox/radio, with error observability.
     */
    async check(locator: Locator, opts?: ActionOptions): Promise<void> {
        const label = opts?.description ?? locator.toString();
        logger.info(`ACTION  ▸ check  → ${label}`);
        try {
            await smartWait(locator, { aggressiveStability: opts?.aggressiveStability });
            await locator.check({ timeout: TIMEOUTS.ACTION });
        } catch (error) {
            logger.error(`FAILED  ▸ check  → ${label} | Error: ${(error as Error).message}`);
            throw error;
        }
    }

    /**
     * Uncheck — unchecks a checkbox, with error observability.
     */
    async uncheck(locator: Locator, opts?: ActionOptions): Promise<void> {
        const label = opts?.description ?? locator.toString();
        logger.info(`ACTION  ▸ uncheck → ${label}`);
        try {
            await smartWait(locator, { aggressiveStability: opts?.aggressiveStability });
            await locator.uncheck({ timeout: TIMEOUTS.ACTION });
        } catch (error) {
            logger.error(`FAILED  ▸ uncheck → ${label} | Error: ${(error as Error).message}`);
            throw error;
        }
    }

    /**
     * Select Option — selects from a dropdown, with error observability.
     */
    async selectOption(
        locator: Locator,
        value: string | { label?: string; value?: string },
        opts?: ActionOptions,
    ): Promise<void> {
        const label = opts?.description ?? locator.toString();
        logger.info(`ACTION  ▸ selectOption → ${label}  value="${JSON.stringify(value)}"`);
        try {
            await smartWait(locator, { aggressiveStability: opts?.aggressiveStability });
            await locator.selectOption(value, { timeout: TIMEOUTS.ACTION });
        } catch (error) {
            logger.error(`FAILED  ▸ selectOption → ${label} | Error: ${(error as Error).message}`);
            throw error;
        }
    }

    /**
     * Is Visible — returns whether element is visible (does NOT throw on not-found).
     */
    async isVisible(locator: Locator, opts?: ActionOptions): Promise<boolean> {
        const label = opts?.description ?? locator.toString();
        logger.info(`ACTION  ▸ isVisible → ${label}`);
        return locator.isVisible();
    }
}

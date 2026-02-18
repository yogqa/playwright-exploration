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
     * Double Click — for elements requiring double-click interaction.
     */
    async dblClick(locator: Locator, opts?: ActionOptions): Promise<void> {
        const label = opts?.description ?? locator.toString();
        logger.info(`ACTION  ▸ dblClick → ${label}`);
        try {
            await smartWait(locator, { aggressiveStability: opts?.aggressiveStability });
            await locator.dblclick({ timeout: TIMEOUTS.ACTION });
        } catch (error) {
            logger.error(`FAILED  ▸ dblClick → ${label} | Error: ${(error as Error).message}`);
            throw error;
        }
    }

    /**
     * Right Click — opens context menu on an element.
     */
    async rightClick(locator: Locator, opts?: ActionOptions): Promise<void> {
        const label = opts?.description ?? locator.toString();
        logger.info(`ACTION  ▸ rightClick → ${label}`);
        try {
            await smartWait(locator, { aggressiveStability: opts?.aggressiveStability });
            await locator.click({ button: 'right', timeout: TIMEOUTS.ACTION });
        } catch (error) {
            logger.error(`FAILED  ▸ rightClick → ${label} | Error: ${(error as Error).message}`);
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
     * Clear — clears the value of an input field without filling.
     */
    async clear(locator: Locator, opts?: ActionOptions): Promise<void> {
        const label = opts?.description ?? locator.toString();
        logger.info(`ACTION  ▸ clear  → ${label}`);
        try {
            await smartWait(locator, { aggressiveStability: opts?.aggressiveStability });
            await locator.clear({ timeout: TIMEOUTS.ACTION });
        } catch (error) {
            logger.error(`FAILED  ▸ clear  → ${label} | Error: ${(error as Error).message}`);
            throw error;
        }
    }

    /**
     * Press — presses a keyboard key on a focused element (e.g. 'Enter', 'Tab', 'Escape').
     */
    async press(locator: Locator, key: string, opts?: ActionOptions): Promise<void> {
        const label = opts?.description ?? locator.toString();
        logger.info(`ACTION  ▸ press  → ${label}  key="${key}"`);
        try {
            await smartWait(locator, { aggressiveStability: opts?.aggressiveStability });
            await locator.press(key, { timeout: TIMEOUTS.ACTION });
        } catch (error) {
            logger.error(`FAILED  ▸ press  → ${label} | Error: ${(error as Error).message}`);
            throw error;
        }
    }

    /**
     * Press Sequentially — types text character-by-character (for inputs that reject fill,
     * e.g. OTP fields, autocomplete inputs with key listeners).
     */
    async pressSequentially(locator: Locator, text: string, opts?: ActionOptions): Promise<void> {
        const label = opts?.description ?? locator.toString();
        logger.info(`ACTION  ▸ pressSequentially → ${label}  text="${text}"`);
        try {
            await smartWait(locator, { aggressiveStability: opts?.aggressiveStability });
            await locator.pressSequentially(text, { timeout: TIMEOUTS.ACTION });
        } catch (error) {
            logger.error(`FAILED  ▸ pressSequentially → ${label} | Error: ${(error as Error).message}`);
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
     * Get All Texts — returns trimmed inner text of all matching elements.
     * Useful for asserting list contents (e.g. product names, table rows).
     */
    async getAllTexts(locator: Locator, opts?: ActionOptions): Promise<string[]> {
        const label = opts?.description ?? locator.toString();
        logger.info(`ACTION  ▸ getAllTexts → ${label}`);
        try {
            const texts = await locator.allInnerTexts();
            const trimmed = texts.map(t => t.trim());
            logger.info(`         ◂ result  = [${trimmed.join(', ')}]`);
            return trimmed;
        } catch (error) {
            logger.error(`FAILED  ▸ getAllTexts → ${label} | Error: ${(error as Error).message}`);
            throw error;
        }
    }

    /**
     * Get Attribute — returns the value of a DOM attribute (e.g. 'href', 'value', 'aria-label').
     * Returns null if the attribute does not exist on the element.
     */
    async getAttribute(locator: Locator, attribute: string, opts?: ActionOptions): Promise<string | null> {
        const label = opts?.description ?? locator.toString();
        logger.info(`ACTION  ▸ getAttribute → ${label}  attr="${attribute}"`);
        try {
            await smartWait(locator, { aggressiveStability: opts?.aggressiveStability });
            const value = await locator.getAttribute(attribute, { timeout: TIMEOUTS.ACTION });
            logger.info(`         ◂ result  = "${value}"`);
            return value;
        } catch (error) {
            logger.error(`FAILED  ▸ getAttribute → ${label} | Error: ${(error as Error).message}`);
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
     * Upload File — sets file(s) on a file input element.
     * @param filePaths - absolute path(s) to the file(s) to upload.
     */
    async uploadFile(locator: Locator, filePaths: string | string[], opts?: ActionOptions): Promise<void> {
        const label = opts?.description ?? locator.toString();
        logger.info(`ACTION  ▸ uploadFile → ${label}  files="${JSON.stringify(filePaths)}"`);
        try {
            await locator.setInputFiles(filePaths);
        } catch (error) {
            logger.error(`FAILED  ▸ uploadFile → ${label} | Error: ${(error as Error).message}`);
            throw error;
        }
    }

    /**
     * Drag To — drags this element and drops it onto the target element.
     */
    async dragTo(source: Locator, target: Locator, opts?: ActionOptions): Promise<void> {
        const label = opts?.description ?? source.toString();
        logger.info(`ACTION  ▸ dragTo → ${label}`);
        try {
            await smartWait(source, { aggressiveStability: opts?.aggressiveStability });
            await source.dragTo(target, { timeout: TIMEOUTS.ACTION });
        } catch (error) {
            logger.error(`FAILED  ▸ dragTo → ${label} | Error: ${(error as Error).message}`);
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

    /**
     * Wait For Hidden — waits until an element is hidden or detached from DOM.
     * Use for loaders, modals, toasts disappearing after an action.
     */
    async waitForHidden(locator: Locator, opts?: ActionOptions): Promise<void> {
        const label = opts?.description ?? locator.toString();
        logger.info(`ACTION  ▸ waitForHidden → ${label}`);
        try {
            await locator.waitFor({ state: 'hidden', timeout: TIMEOUTS.WAIT });
        } catch (error) {
            logger.error(`FAILED  ▸ waitForHidden → ${label} | Error: ${(error as Error).message}`);
            throw error;
        }
    }
}

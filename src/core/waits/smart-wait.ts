import { Locator } from '@playwright/test';
import { TIMEOUTS } from '../../config/constants';

export interface SmartWaitOptions {
    /** Enable aggressive bounding-box stability check (adds ~100ms). Default: false */
    aggressiveStability?: boolean;
}

/**
 * Default: Relies on Playwright's native auto-wait (actionability checks).
 * Opt-in `aggressiveStability`: visible → enabled → bounding-box stable.
 */
export async function smartWait(
    locator: Locator,
    options?: SmartWaitOptions,
): Promise<void> {
    // Always ensure visible (fast — Playwright caches this)
    await locator.waitFor({ state: 'visible', timeout: TIMEOUTS.WAIT });

    // Aggressive mode: bounding-box stability for flaky/animating elements
    if (options?.aggressiveStability) {
        await locator.isEnabled();
        const box1 = await locator.boundingBox();
        await new Promise(r => setTimeout(r, 100));
        const box2 = await locator.boundingBox();
        if (box1 && box2 && (box1.x !== box2.x || box1.y !== box2.y)) {
            await locator.waitFor({ state: 'visible', timeout: TIMEOUTS.WAIT });
        }
    }
}

import { FullConfig } from '@playwright/test';
import * as fs from 'fs';

/**
 * Global Teardown — cleanup after all tests complete.
 * Removes auth state files to avoid stale sessions on next run.
 */
async function globalTeardown(_config: FullConfig) {
    const authDir = './auth';
    if (fs.existsSync(authDir)) {
        const files = fs.readdirSync(authDir);
        for (const file of files) {
            fs.unlinkSync(`${authDir}/${file}`);
        }
        console.log(`🧹 Cleaned up ${files.length} auth state file(s).`);
    }
}

export default globalTeardown;

/**
 * Shared utility functions — date formatters, random generators, etc.
 */

/**
 * Generates a random string of given length (alphanumeric).
 */
export function randomString(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * Returns a formatted timestamp string (ISO-like, filesystem safe).
 * Example: "2026-02-16_11-45-30"
 */
export function timestamp(): string {
    return new Date()
        .toISOString()
        .replace(/[:.]/g, '-')
        .replace('T', '_')
        .slice(0, 19);
}

/**
 * Waits for a given number of milliseconds (explicit pause — use sparingly).
 */
export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

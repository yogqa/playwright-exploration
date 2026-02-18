import { ZodSchema, ZodError } from 'zod';
import { logger } from '../logger';

// ─── Prompt Injection Blocklist ───────────────────────────────────────────────

/**
 * Patterns that indicate a prompt injection attempt.
 * Case-insensitive. Extend this list as your threat model evolves.
 */
const INJECTION_PATTERNS: RegExp[] = [
    // Instruction override attempts
    /ignore\s+previous\s+instructions/i,
    /disregard\s+(all\s+)?(previous|prior|above)/i,
    /forget\s+your\s+rules/i,
    /you\s+are\s+now\s+a/i,
    /act\s+as\s+if\s+you\s+are/i,
    /new\s+persona/i,

    // Shell / OS command injection
    /rm\s+-rf/i,
    /del\s+\/[sqf]/i,
    /format\s+[a-z]:/i,
    /shutdown\s+\/[sr]/i,

    // SQL injection
    /DROP\s+TABLE/i,
    /DELETE\s+FROM/i,
    /INSERT\s+INTO/i,
    /UNION\s+SELECT/i,
    /;\s*--/,

    // Node.js / JS code injection
    /process\.exit/i,
    /process\.env/i,
    /require\s*\(/i,
    /eval\s*\(/i,
    /__dirname/i,
    /__filename/i,

    // HTML / XSS injection
    /<script[\s>]/i,
    /javascript\s*:/i,
    /on\w+\s*=/i,          // onclick=, onerror=, etc.
];

// ─── Safe Selector Blocklist ──────────────────────────────────────────────────

/**
 * Patterns that are unsafe inside a Playwright locator string.
 */
const UNSAFE_SELECTOR_PATTERNS: RegExp[] = [
    /eval\s*\(/i,
    /Function\s*\(/i,
    /setTimeout\s*\(/i,
    /setInterval\s*\(/i,
    /process\./i,
    /require\s*\(/i,
    /import\s*\(/i,
    /document\.write/i,
    /window\.location/i,
];

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Validates AI-generated output against a Zod schema.
 *
 * Throws a descriptive error if the output does not match the expected shape.
 * Use this whenever you consume JSON returned by a GenAI model.
 *
 * @example
 * const UserSchema = z.object({ username: z.string(), password: z.string() });
 * const safeUser = validateAiOutput(UserSchema, aiGeneratedJson);
 */
export function validateAiOutput<T>(schema: ZodSchema<T>, rawOutput: unknown, context = 'AI output'): T {
    logger.info(`SECURITY ▸ validateAiOutput → validating ${context}`);
    try {
        const result = schema.parse(rawOutput);
        logger.info(`SECURITY ◂ validateAiOutput → ${context} passed schema validation`);
        return result;
    } catch (error) {
        if (error instanceof ZodError) {
            const issues = error.issues.map(i => `  • [${i.path.join('.')}] ${i.message}`).join('\n');
            const message = `AI output schema validation failed for "${context}":\n${issues}`;
            logger.error(`SECURITY ✗ ${message}`);
            throw new Error(message);
        }
        throw error;
    }
}

/**
 * Scans a string for known prompt injection patterns.
 *
 * Throws if any injection pattern is detected.
 * Use this before passing AI-generated text into form fields, search inputs,
 * or any other user-facing interaction.
 *
 * @example
 * assertNoInjection(aiGeneratedSearchTerm, 'product search input');
 * await this.action.fill(this.searchInput, aiGeneratedSearchTerm);
 */
export function assertNoInjection(value: string, context = 'value'): void {
    logger.info(`SECURITY ▸ assertNoInjection → scanning ${context}`);
    for (const pattern of INJECTION_PATTERNS) {
        if (pattern.test(value)) {
            const message = `Prompt injection detected in "${context}": matched pattern ${pattern}`;
            logger.error(`SECURITY ✗ ${message}`);
            throw new Error(message);
        }
    }
    logger.info(`SECURITY ◂ assertNoInjection → ${context} is clean`);
}

/**
 * Validates that an AI-generated CSS/accessibility selector is safe to use
 * as a Playwright locator argument.
 *
 * Throws if the selector contains dangerous JavaScript patterns.
 *
 * @example
 * assertSafeSelector(aiGeneratedSelector);
 * const locator = this.page.locator(aiGeneratedSelector);
 */
export function assertSafeSelector(selector: string): void {
    logger.info(`SECURITY ▸ assertSafeSelector → scanning selector`);
    for (const pattern of UNSAFE_SELECTOR_PATTERNS) {
        if (pattern.test(selector)) {
            const message = `Unsafe selector detected: matched pattern ${pattern} in "${selector}"`;
            logger.error(`SECURITY ✗ ${message}`);
            throw new Error(message);
        }
    }
    logger.info(`SECURITY ◂ assertSafeSelector → selector is safe`);
}

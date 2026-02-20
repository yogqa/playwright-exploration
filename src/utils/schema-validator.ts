import { ZodSchema } from 'zod';

/**
 * Shared schema validation utility — Zod-first API testing.
 *
 * This is the MANDATORY step between calling an API client and making
 * business assertions. It enforces Zod as the single source of truth
 * for every API contract.
 *
 * Usage:
 *   const raw = await myApiClient.getData();              // Step 1: transport
 *   const validated = validateSchema(MySchema, raw, '...');  // Step 2: validate
 *   expect(validated.field).toBe('expected');             // Step 3: assert
 *
 * NOTE: This utility is SEPARATE from ai-guard.ts's validateAiOutput(),
 *       which is for AI security scanning. This is for API contract enforcement.
 */
export function validateSchema<T>(schema: ZodSchema<T>, data: unknown, context: string): T {
    const result = schema.safeParse(data);

    if (!result.success) {
        const issues = result.error.issues
            .map((i) => `  • [${i.path.join('.')}] ${i.message}`)
            .join('\n');

        throw new Error(
            `[API Contract Violation] Schema validation failed for "${context}":\n${issues}\n\n` +
            `Raw data received:\n${JSON.stringify(data, null, 2)}`,
        );
    }

    return result.data;
}

/**
 * Type-safe helper to extract the inferred type from a Zod schema.
 * Use this to annotate variables without importing the schema type separately.
 *
 * @example
 * import { z } from 'zod';
 * import { ProductListResponseSchema } from '../tests/schemas/product.schema';
 * type ProductList = Infer<typeof ProductListResponseSchema>;
 */
export type Infer<T extends ZodSchema> = T['_output'];

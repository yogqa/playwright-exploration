import { z } from 'zod';

/**
 * Zod Schemas — Product Domain
 * Source: https://automationexercise.com/api_list
 *
 * These schemas are the SINGLE SOURCE OF TRUTH for product API contracts.
 * They contain NO test logic — no describe(), test(), or expect().
 * They are imported by tests in src/tests/api/ for runtime validation.
 */

// ─── Building Block Schemas ───────────────────────────────────────────────────

const UserTypeSchema = z.object({
    usertype: z.string(),
});

const CategorySchema = z.object({
    usertype: UserTypeSchema,
    category: z.string(),
});

// ─── Entity Schemas ───────────────────────────────────────────────────────────

/**
 * A single product as returned by the AutomationExercise API.
 */
export const ProductSchema = z.object({
    id: z.number(),
    name: z.string(),
    price: z.string(),       // API returns price as string e.g. "Rs. 500"
    brand: z.string(),
    category: CategorySchema,
});

// ─── Response Envelope Schemas ────────────────────────────────────────────────

/**
 * Response for GET /api/productsList and POST /api/searchProduct.
 */
export const ProductListResponseSchema = z.object({
    responseCode: z.number(),
    products: z.array(ProductSchema),
});

/**
 * Response for POST /api/searchProduct when no results are found
 * or for generic API message responses.
 */
export const ApiMessageResponseSchema = z.object({
    responseCode: z.number(),
    message: z.string(),
});

// ─── Inferred TypeScript Types ────────────────────────────────────────────────

export type Product = z.infer<typeof ProductSchema>;
export type ProductListResponse = z.infer<typeof ProductListResponseSchema>;
export type ApiMessageResponse = z.infer<typeof ApiMessageResponseSchema>;

import { z } from 'zod';

/**
 * Zod Schemas — User / Auth Domain
 * Source: https://automationexercise.com/api_list
 *
 * These schemas are the SINGLE SOURCE OF TRUTH for user API contracts.
 * They contain NO test logic — no describe(), test(), or expect().
 */

// ─── Building Block Schemas ───────────────────────────────────────────────────

const UserAddressSchema = z.object({
    address1: z.string().nullable().optional(),
    address2: z.string().nullable().optional(),
    city: z.string().nullable().optional(),
    country: z.string().nullable().optional(),
    email: z.string().email().optional(),
    firstname: z.string().optional(),
    lastname: z.string().optional(),
    mobile_number: z.string().nullable().optional(),
    state: z.string().nullable().optional(),
    zipcode: z.string().nullable().optional(),
});

// ─── Entity Schemas ───────────────────────────────────────────────────────────

/**
 * A single user object returned in user detail responses.
 */
export const UserSchema = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string().email(),
    title: z.string().nullable().optional(),
    birth_day: z.string().nullable().optional(),
    birth_month: z.string().nullable().optional(),
    birth_date: z.string().nullable().optional(),
    first_name: z.string().nullable().optional(),
    last_name: z.string().nullable().optional(),
    company: z.string().nullable().optional(),
    address1: z.string().nullable().optional(),
    address2: z.string().nullable().optional(),
    country: z.string().nullable().optional(),
    state: z.string().nullable().optional(),
    city: z.string().nullable().optional(),
    zipcode: z.string().nullable().optional(),
    UserAddress: UserAddressSchema.optional(),
});

// ─── Response Envelope Schemas ────────────────────────────────────────────────

/**
 * Response for GET /api/getUserDetailByEmail.
 */
export const UserDetailResponseSchema = z.object({
    responseCode: z.number(),
    user: UserSchema.optional(),
    message: z.string().optional(),
});

/**
 * Response for POST /api/verifyLogin — success: { responseCode: 200, message: 'User exists!' }
 * and failure: { responseCode: 404, message: 'User not found!' }
 */
export const AuthResponseSchema = z.object({
    responseCode: z.number(),
    message: z.string(),
});

/**
 * Response for POST /api/createAccount.
 */
export const CreateAccountResponseSchema = z.object({
    responseCode: z.number(),
    message: z.string(),
});

// ─── Inferred TypeScript Types ────────────────────────────────────────────────

export type User = z.infer<typeof UserSchema>;
export type UserDetailResponse = z.infer<typeof UserDetailResponseSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export type CreateAccountResponse = z.infer<typeof CreateAccountResponseSchema>;

import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
    BASE_URL: z.string().url().default('https://automationexercise.com'),
    /** Email used for the pre-authenticated test user (saved in auth/user.json) */
    USER_EMAIL: z.string().email().default('testuser@antigravity.dev'),
    USER_PASSWORD: z.string().default('Test@1234'),
    /** Full name used during signup */
    USER_NAME: z.string().default('Antigravity Tester'),
    API_TOKEN: z.string().optional(),
    CI: z.string().optional(),
});

export const envConfig = envSchema.parse(process.env);

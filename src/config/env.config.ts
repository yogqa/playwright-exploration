import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
    BASE_URL: z.string().url().default('https://rahulshettyacademy.com'),
    ADMIN_USER: z.string().default('rahulshettyacademy'),
    ADMIN_PASS: z.string().default('learning'),
    STANDARD_USER: z.string().default('rahulshettyacademy'),
    STANDARD_PASS: z.string().default('learning'),
    API_TOKEN: z.string().optional(),
    CI: z.string().optional(),
});

export const envConfig = envSchema.parse(process.env);

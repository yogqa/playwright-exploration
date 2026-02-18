/**
 * Centralised test data factory for automationexercise.com tests.
 * All test data lives here — never hardcode in spec files (Data Law).
 */
import * as fs from 'fs';
import * as path from 'path';

/** Path to the credentials file written by global-setup.ts */
const CREDENTIALS_PATH = path.resolve('./auth/user-credentials.json');

interface SharedCredentials {
    email: string;
    password: string;
    name: string;
}

/** Read the shared user credentials registered by global-setup */
function readSharedCredentials(): SharedCredentials {
    if (fs.existsSync(CREDENTIALS_PATH)) {
        return JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf-8')) as SharedCredentials;
    }
    // Fallback to env vars if global-setup hasn't run yet (e.g. unit tests)
    return {
        email: process.env.USER_EMAIL ?? 'testuser@antigravity.dev',
        password: process.env.USER_PASSWORD ?? 'Test@1234',
        name: process.env.USER_NAME ?? 'Antigravity Tester',
    };
}

export interface RegistrationDetails {
    title: 'Mr' | 'Mrs';
    name: string;
    email: string;
    password: string;
    day: string;
    month: string;
    year: string;
    newsletter: boolean;
    offers: boolean;
    firstName: string;
    lastName: string;
    company: string;
    address1: string;
    address2: string;
    country: string;
    state: string;
    city: string;
    zipcode: string;
    mobile: string;
}

export interface PaymentDetails {
    nameOnCard: string;
    cardNumber: string;
    cvc: string;
    expiryMonth: string;
    expiryYear: string;
}

export interface ContactFormDetails {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export const UserData = {
    /** Default registration details for TC1, TC14, TC15, TC23, TC24 */
    registration: (): RegistrationDetails => ({
        title: 'Mr',
        name: 'Antigravity Tester',
        email: `tester+${Date.now()}@antigravity.dev`,  // unique per run
        password: 'Test@1234',
        day: '15',
        month: 'June',
        year: '1990',
        newsletter: true,
        offers: true,
        firstName: 'Antigravity',
        lastName: 'Tester',
        company: 'Antigravity QA',
        address1: '123 Test Street',
        address2: 'Suite 456',
        country: 'India',
        state: 'Maharashtra',
        city: 'Mumbai',
        zipcode: '400001',
        mobile: '9876543210',
    }),

    /**
     * Login credentials for TC2, TC4, TC16, TC20.
     * Reads from auth/user-credentials.json written by global-setup.ts —
     * the same account that was registered at the start of the test run.
     */
    validLogin: () => readSharedCredentials(),

    /** Invalid credentials for TC3 */
    invalidLogin: () => ({
        email: 'invalid@notexist.com',
        password: 'wrongpassword',
    }),

    /** Payment details for TC14, TC15, TC16, TC24 */
    payment: (): PaymentDetails => ({
        nameOnCard: 'Antigravity Tester',
        cardNumber: '4111111111111111',
        cvc: '123',
        expiryMonth: '12',
        expiryYear: '2027',
    }),

    /** Contact form data for TC6 */
    contactForm: (): ContactFormDetails => ({
        name: 'Antigravity Tester',
        email: 'tester@antigravity.dev',
        subject: 'Automated Test Submission',
        message: 'This is an automated test message from the Antigravity framework.',
    }),
};

/**
 * DataFactory — typed test user objects.
 * No hardcoded credentials in test files. All data comes from here.
 */
export interface TestUser {
    username: string;
    password: string;
}

export const TestUsers = {
    /** Valid user for rahulshettyacademy.com practice site */
    admin: {
        username: 'rahulshettyacademy',
        password: 'learning',
    } satisfies TestUser,

    /** Invalid user for negative test cases */
    invalid: {
        username: 'bad_user',
        password: 'bad_pass',
    } satisfies TestUser,
} as const;

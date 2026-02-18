// @ts-check

/** @type {import('eslint').Linter.Config} */
module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
    ],
    rules: {
        // ── Antigravity Wrapper Law ──
        // Prevents raw Playwright page methods in Layer 2 & 3.
        // Use Layer 1 wrappers (ElementActions, NavigationActions) instead.
        'no-restricted-properties': [
            'error',
            {
                object: 'page',
                property: 'click',
                message: 'ANTIGRAVITY VIOLATION: Use elementActions.click()',
            },
            {
                object: 'page',
                property: 'fill',
                message: 'ANTIGRAVITY VIOLATION: Use elementActions.fill()',
            },
            {
                object: 'page',
                property: 'check',
                message: 'ANTIGRAVITY VIOLATION: Use elementActions.check()',
            },
            {
                object: 'page',
                property: 'selectOption',
                message: 'ANTIGRAVITY VIOLATION: Use elementActions.selectOption()',
            },
            {
                object: 'page',
                property: 'type',
                message: 'ANTIGRAVITY VIOLATION: Use elementActions.fill()',
            },
            {
                object: 'page',
                property: 'hover',
                message: 'ANTIGRAVITY VIOLATION: Use elementActions.hover()',
            },
        ],
        // General best practices
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-explicit-any': 'warn',
    },
    overrides: [
        {
            // ── Assertion Law: no expect() in Page Objects (Layer 2) ──
            files: ['src/pages/**/*.ts'],
            rules: {
                'no-restricted-syntax': [
                    'error',
                    {
                        selector: "CallExpression[callee.name='expect']",
                        message: 'ANTIGRAVITY VIOLATION: expect() belongs ONLY in Layer 3 (test scripts).',
                    },
                ],
            },
        },
    ],
    ignorePatterns: ['node_modules/', 'dist/', 'test-results/', 'playwright-report/', 'allure-results/'],
};

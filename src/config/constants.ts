export const TIMEOUTS = {
    /** Default global timeout for tests (30s) */
    TEST: 30 * 1000,
    /** Default timeout for actions like click/fill (10s) */
    ACTION: 10 * 1000,
    /** Default explicit wait timeout (10s) */
    WAIT: 10 * 1000,
    /** API request timeout (15s) */
    API: 15 * 1000,
};

export const RETRIES = {
    /** Number of retries for flaky API calls */
    API: 2,
};

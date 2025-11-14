# Plan: Overhaul of Authentication Logic (`proxy.js`)

This plan incorporates the user's detailed suggestions to refactor and harden the authentication logic currently in `src/proxy.js`. The goal is to improve security, performance, testability, and maintainability.

## Phase 1: Core Logic Refactoring & Local Verification

1.  **Investigate Core Auth Logic:**
    -   Read `src/app/api/auth/verify-token/route.js` to understand the complete current refresh token logic.
    -   Read `src/models/refreshToken.js` to understand the database schema for refresh tokens.
    -   Read `src/lib/logger.js` to see if a structured logger is available.

2.  **Create Centralized Auth Library (`src/lib/auth.js`):**
    -   Create a new file `src/lib/auth.js`.
    -   **Move Token Verification Logic:** Create a function `verifyAccessToken(accessToken)` that contains the `verifyToken` logic.
    -   **Create Token Rotation Logic:** Create a function `rotateRefreshToken(refreshToken)`. This function will contain the core logic from the `verify-token` API route:
        -   It will verify the provided refresh token.
        -   It will implement **secure refresh token rotation**. This includes checking for token reuse by looking it up in the database. If a token is reused, all sessions for that user should be invalidated for security.
        -   If valid, it will generate a new access token and a new refresh token.
        -   It will update the database with the new refresh token, invalidating the old one.
    -   **Create Main Verification Function:** Create a main function `verifyAuth(reqCookies)` that:
        -   Accepts a plain object of cookies `{ accessToken, refreshToken }` for testability.
        -   Tries to verify the `accessToken`.
        -   If that fails, calls `rotateRefreshToken` with the `refreshToken`.
        -   Returns a consistent object: `{ ok, userId?, newAccessToken?, newRefreshToken?, reason?, clearCookies? }`.

3.  **Refactor `proxy.js` to use `auth.js`:**
    -   Update `proxy.js` to import `verifyAuth` from `src/lib/auth.js`.
    -   In the `proxy` function, extract cookies from the `req` object and call `verifyAuth({ accessToken, refreshToken })`. **Do not use `fetch` to call the API route.**
    -   Based on the result from `verifyAuth` and the request path, use simple helper functions (or clean inline logic) to determine the response.
    -   **Improve Cookie Security:** When setting cookies, add `path: '/'` and `sameSite: 'lax'` to the existing options.

4.  **Update API Route (`verify-token`):**
    -   The API route at `src/app/api/auth/verify-token/route.js` will now be simplified to just call the `rotateRefreshToken` function from `src/lib/auth.js`. This is for backwards compatibility if any other part of the system uses it, but the middleware will no longer call it.

## Phase 2: Improving Robustness

5.  **Structured Logging:**
    -   Throughout the new functions in `src/lib/auth.js` and in `proxy.js`, replace all `console.log` statements with the logger from `src/lib/logger.js`.
    -   Ensure no sensitive data (like tokens) is logged.

6.  **Unit Testing:**
    -   Identify the testing framework used in the project (by checking `package.json` and for config files).
    -   Create a new test file, e.g., `src/lib/auth.test.js`.
    -   Write unit tests for the `verifyAuth` function covering various scenarios:
        -   Valid access token.
        -   Expired access token, valid refresh token (successful rotation).
        -   Invalid/expired refresh token.
        -   Missing tokens.
        -   Attempted reuse of a refresh token.

## Phase 3: Documentation and Future Work

7.  **Update `README.md`:**
    -   Update the description of `proxy.js` and the authentication system.
    -   Document the new `src/lib/auth.js` module.
    -   Mark the refactoring task as **RESOLVED**.

8.  **Document Future Improvements:**
    -   Add a new section to `README.md` for "Future Security Improvements" and suggest:
        -   Migrating the codebase to **TypeScript** for improved type safety.
        -   Implementing **CSRF protection** for all state-changing API endpoints.
        -   Adding **rate limiting** to authentication endpoints to prevent brute-force attacks.

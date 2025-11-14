# Plan for Refactoring Token Handling

1.  **Create `PLAN.md`**: Create a `PLAN.md` file in the root directory to document the refactoring plan.
2.  **Fix Hashing Inconsistency**:
    *   [ ] Read `src/app/api/auth/verify-otp/route.js`.
    *   [ ] Replace the existing `sha256` function in `src/app/api/auth/verify-otp/route.js` with one that uses `crypto.createHash('sha256').update(string).digest('hex')`.
    *   [ ] Add `import crypto from 'crypto';` to `src/app/api/auth/verify-otp/route.js`.
3.  **Consolidate Token Logic in `src/lib/utils.js`**:
    *   [ ] Read `src/lib/utils.js`.
    *   [ ] Update the `sha256` function in `src/lib/utils.js` to use `crypto.createHash`.
    *   [ ] Create a `generateAccessToken(userId)` function in `utils.js` that uses `jose` to sign a new access token.
    *   [ ] Create a `generateRefreshToken(userId)` function in `utils.js` that uses `jose` to sign a new refresh token.
    *   [ ] Create a `verifyToken(token, tokenType)` function in `utils.js` that uses `jose` to verify a token.
    *   [ ] Remove the `sha256` function from `src/app/api/auth/verify-otp/route.js` and import it from `utils.js`.
4.  **Refactor API Routes**:
    *   [ ] Read `src/app/api/auth/verify-otp/route.js`.
    *   [ ] Replace the token generation logic with calls to the new functions in `utils.js`.
    *   [ ] Read `src/app/api/auth/verify-token/route.js`.
    *   [ ] Replace the token verification and generation logic with calls to the new functions in `utils.js`.
5.  **Refactor Middleware**:
    *   [ ] Read `src/proxy.js`.
    *   [ ] Replace the token verification logic with a call to the new `verifyToken` function in `utils.js`.
6.  **Update `README.md`**:
    *   [ ] Read `README.md`.
    *   [ ] Update the descriptions of the authentication API routes to reflect the refactoring.
    *   [ ] Add a description of the new token-related functions in `src/lib/utils.js`.
    *   [ ] Update the "Inconsistent Hashing Algorithm" issue in the "Known Issues" section to "Resolved".

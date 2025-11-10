# Plan to Replace Logging Library

The current logging library, `pino`, is causing issues in the deployment environment, leading to the "worker has exited" error. This plan outlines the steps to replace `pino` with a more stable and lightweight logging solution.

## 1. Remove `pino` and `pino-pretty`

The first step is to remove the existing logging libraries to avoid any further conflicts.

-   Uninstall `pino` and `pino-pretty` from the project dependencies.
-   Update `package.json` to reflect these changes.

## 2. Implement a Custom Lightweight Logger

Instead of introducing another third-party dependency, we will create a simple, custom logger utility that uses the native `console` object. This approach guarantees compatibility with any JavaScript environment (Node.js, Vercel Edge, etc.) and avoids any issues with worker threads or file system access.

The logger will be created in `src/lib/logger.js` and will have the following features:

-   **Structured JSON Output:** Logs will be formatted as JSON strings for easy parsing and analysis in production.
-   **Log Levels:** It will support standard log levels (`info`, `debug`, `warn`, `error`).
-   **Environment-Aware:**
    -   In **development**, it will output colorized, human-readable logs to the console.
    -   In **production**, it will output JSON-formatted logs. `debug` logs will be suppressed in production to reduce noise.
-   **Consistent API:** The logger will maintain the same API as the previous one (`logger.info({ ... }, 'message')`) to ensure a smooth transition.

## 3. Update the Codebase

All files that currently import and use the `pino` logger will be updated to use the new custom logger. This will be a straightforward process due to the consistent API.

## 4. Verification

After implementing the new logger, we will run the application and verify that:

-   The "worker has exited" error is resolved.
-   Logs are being correctly output in both development and production environments.
-   The authentication flow and other parts of the application function as expected.

By following this plan, we will have a robust and reliable logging solution that is tailored to the needs of this project and its deployment environment.

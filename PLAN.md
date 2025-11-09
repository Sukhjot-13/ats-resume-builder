# UI/UX Overhaul and Theming Plan

This document outlines the plan to completely redesign the application's user interface, implement a modern design system with light and dark modes, and improve the overall user experience.

## Phase 1: Design System and Theming Foundation (✓ Done)

This phase focuses on setting up the core styling infrastructure using Tailwind CSS.

1.  **Initialize Tailwind CSS Configuration:** (✓ Done)
    -   Created a `tailwind.config.mjs` file.
    -   Populated it with a complete configuration, including paths to all component and page files in the `content` array.

2.  **Define Color Palette and Theme:** (✓ Done)
    -   In `tailwind.config.mjs`, defined a comprehensive color palette with primary, secondary, and accent colors for both light and dark modes using CSS variables.

3.  **Update Global Styles:** (✓ Done)
    -   Refactored `src/app/globals.css` to use the standard Tailwind directives and define the color variables for the themes.

4.  **Implement Theme Switching:** (✓ Done)
    -   Installed the `next-themes` package.
    -   Created a `ThemeProvider` component that wraps the application in `src/app/layout.js`.

## Phase 2: Core Component Library (shadcn/ui) (✓ Done)

To accelerate development and ensure consistency, we will use `shadcn/ui`, a collection of reusable UI components built on Tailwind CSS and Radix UI.

1.  **Initialize `shadcn/ui`:** (✓ Done)
    -   `npx shadcn@latest init` has been executed.

2.  **Add Core Components:** (✓ Done)
    -   Added the necessary components from `shadcn/ui` that will be used throughout the application.
    -   `npx shadcn@latest add button card input dropdown-menu label sheet`

## Phase 3: Navigation and Layout Redesign (✓ Done)

This phase focuses on creating a new, modern navigation and updating the main application layout.

1.  **Create a `Header` Component:** (✓ Done)
    -   Built a new `Header` component in `src/components/layout/Header.js`.
    -   This component is a sticky navigation bar at the top of the page.
    -   It includes the application logo on the left.

2.  **Implement User Profile Dropdown:** (✓ Done)
    -   On the right side of the header, created a user profile button.
    -   When clicked, it uses the `DropdownMenu` component from `shadcn/ui` to show a menu with the following items:
        -   "Profile" (links to `/profile`)
        -   "Logout" (triggers the logout logic)
        -   A theme toggle switch (Light/Dark).

3.  **Update Main Layout:** (✓ Done)
    -   In `src/app/layout.js`, added the new `Header` component.
    -   Structured the layout to have the header at the top and the main content area below.

## Phase 4: Homepage Redesign (`/`) (✓ Done)

The current homepage is basic. We will redesign it to be a modern, engaging landing page.

1.  **Hero Section:** (✓ Done)
    -   A large, welcoming section at the top with a clear headline, sub-headline, and a primary call-to-action (CTA) button.

2.  **Features Section:** (✓ Done)
    -   A section that highlights the key features of the application.

3.  **How It Works Section:** (✓ Done)
    -   A step-by-step guide.

4.  **Footer:** (✓ Done)
    -   A simple footer with copyright information.

## Phase 5: Page-by-Page UI Update (✓ Done)

With the design system and core components in place, we will update each page of the application.

1.  **Login Page (`/login`):** (✓ Done)
    -   Redesigned the login page to be centered, with a clean card containing the email input and OTP form, using `shadcn/ui` components.

2.  **Dashboard Page (`/dashboard`):** (✓ Done)
    -   Updated the dashboard to use the new `Card` components from `shadcn/ui` for displaying resume history or other information.

3.  **Profile Page (`/profile`):** (✓ Done)
    -   Rebuilt the profile forms using the new `Input`, `Label`, and `Button` components from `shadcn/ui`.

4.  **Other Pages:** (✓ Done)
    -   Applied the new design system to all other pages (`/onboarding`, `/resume-history`, etc.) for a consistent look and feel.

## Phase 6: Final Touches and Cleanup (✓ Done)

1.  **Review and Refine:** (✓ Done)
    -   Go through the entire application to check for any inconsistencies in styling or layout.

2.  **Remove Old Styles:** (✓ Done)
    -   Delete any old, unused CSS files or inline styles.
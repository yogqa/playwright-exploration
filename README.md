# 🚀 Playwright Framework

![Playwright](https://img.shields.io/badge/-Playwright-45ba4b?style=for-the-badge&logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![ESLint](https://img.shields.io/badge/-ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Allure](https://img.shields.io/badge/-Allure%20Report-ffcf00?style=for-the-badge&logo=TestingLibrary&logoColor=black)

An enterprise-grade, next-generation browser automation framework built on **Playwright + TypeScript**. It features a strict multi-layer architecture, robust multi-role authentication, Zod-powered API testing, and a zero-dependency reporting pipeline. It is also designed from the ground up to be fully **AI-Agent Ready**.

---

## 📋 Table of Contents
- [✨ Key Features](#-key-features)
- [🏗️ Architecture](#️-architecture)
- [🚀 Getting Started](#-getting-started)
- [🛠️ Usage](#️-usage)
  - [Standard CLI](#running-tests-standard-cli)
  - [Agentic CLI](#agentic-exploration-agent-cli)
  - [MCP Integration](#external-ai-client-mcp)
- [📊 Reporting & CI](#-reporting--ci)
- [🛡️ The Laws of Antigravity](#️-the-laws-of-antigravity)
- [🤝 Contributing](#-contributing)

---

## ✨ Key Features

*   **Strict Multi-Layer Architecture**: Clean separation between Low-Level Wrappers, Page Object Models, and Test Scripts.
*   **AI Orchestrator Ready**: Native support for AI agents through specialized `.agent/skills/` bridging UI, API, and Config tasks. Includes `npx @playwright/cli` and MCP support.
*   **Multi-Role Authentication**: Scalable `global-setup.ts` implementation that pre-authenticates user personas (Admin, Standard) once per test run, dramatically reducing execution time.
*   **Zod-First API Testing**: Runtime contract validation using strict Zod schemas to immediately catch silent API drift.
*   **Zero-Dependency Reporting**: Native auto-cleanup scripts permanently fix duplicate folders and ghost failures in Allure reports.
*   **Automated CI/CD**: Seamless GitHub Actions integration generating dual HTML reports (Playwright & Allure) and perfectly isolated failure artifacts (traces & videos).

---

## 🏗️ Architecture

The codebase follows strict architectural guidelines, ensuring scalable and reliable automation:

```text
src/
├── core/
│   ├── api/            # Layer 1: API Clients (Raw Transport) & Zod Schemas
│   ├── wrappers/       # Layer 1: Low-level UI wrappers (click, filling, logging)
│   └── utils/          # Shared helpers (Schema Validation, Global Loggers)
├── pages/              # Layer 2: Page Object Models (Locators & Workflows, NO assertions)
├── tests/              
│   ├── ui/             # Layer 3: UI-driven Functional Tests (POM only)
│   └── api/            # Layer 3: API Contract & Hybrid Tests (Zod validated)
├── fixtures/           # Dependency Injection & Test Data Factory
└── config/             # Environment Configuration & Constants
```

---

## 🚀 Getting Started

### Prerequisites
*   [Node.js](https://nodejs.org/) (v18 or higher)
*   npm (v9 or higher)

### Installation
Clone the repository, then install dependencies and the necessary Playwright browsers:

```bash
npm install
npx playwright install --with-deps chromium
```

### Configuration
1.  Copy the environment template:
    ```bash
    cp .env.example .env
    ```
2.  Update the `BASE_URL`, `API_TOKEN`, and default credentials inside the newly created `.env` file to match your target environment.

---

## 🛠️ Usage

### Running Tests (Standard CLI)
We utilize a pre-test hook (`scripts/clean-reports.js`) that automatically scrubs old artifacts to ensure clean results locally:

```bash
# Clean & Run all tests (headless by default)
npm test

# Run tests in headed browser mode
npm run test:headed

# Run tests with the Playwright UI Inspector
npm run test:ui

# Run a specific test suite or file
npx playwright test src/tests/ui/cart.spec.ts
```

### Agentic Exploration (Agent CLI)
For AI Agents needing real-time DOM interaction and debugging:
```bash
# Open a browser for exploration
npm run agent-cli -- open https://rahulshettyacademy.com/seleniumPractise/#/

# Issue natural language or strict commands
npm run agent-cli -- click "text=PROCEED TO CHECKOUT"
```

### External AI Client (MCP)
To connect an external AI tool (like Claude Desktop) directly to Playwright via the Model Context Protocol:
```bash
npm run mcp
```

---

## 📊 Reporting & CI

This framework embraces a fast, tri-layer reporting strategy ensuring maximum observability.

### Local Reporting
*   **Playwright HTML**: Zero-config static HTML reporting (`html-report/`).
*   **Allure Report**: An executive-level visual dashboard (`allure-report/`).
    ```bash
    npm run allure:generate  # Process raw results into HTML
    npm run allure:open      # Spin up local server to view
    ```

### CI/CD (GitHub Actions)
On every push or pull request, the CI pipeline perfectly catalogs results securely:
1.  **Dual HTML Artifacts**: Publishes both the Playwright HTML and Allure HTML reports as viewable ZIP artifacts.
2.  **Failure Isolation**: Packages screenshots, videos, and trace viewers for failed tests into a solitary `failure-artifacts.zip` to eliminate clutter.

---

## 🛡️ Core Automation Laws

To maintain framework integrity, all PRs must adhere to these governing rules:

1.  **Wrapper Law**: Never use raw `page.click()` directly. All UI interactions must route through `this.action.*` wrappers to ensure logging and auto-waiting stability.
2.  **Selector Law**: Rely exclusively on user-centric locators (`getByRole`, `getByLabel`, `getByTestId`). Brittle CSS and XPath are strictly prohibited.
3.  **Assertion Law**: `expect()` belongs ONLY in Layer 3 (`Test Scripts`). Page Objects and API Clients must never assert.
4.  **Zod Law**: API responses must be aggressively validated against a schema before business logic assertions take place.
5.  **Data Law**: Limit test hardcoding. Utilize the `DataFactory` for synthetic generation, and rely on `.env` configuration.
6.  **Hybrid Law**: Bypass UI setup steps via API requests to accelerate test execution times.

---

## 🤝 Contributing
Welcome to the team! Before writing code, please review the complete definition of done located at `.agent/skills/antigravity_protocol/SKILL.md`. Ensure all branch changes pass the pre-commit linting configuration.

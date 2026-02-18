# 🚀 Playwright Framework

A next-generation browser automation framework built on **Playwright + TypeScript**, featuring a strict 3-layer architecture, AI-ready tooling strategy, and robust multi-role authentication.

## ✨ Key Features
- **3-Layer Architecture**: Strict separation of Core Wrappers, Page Objects, and Test Scripts.
- **AI-Agent Ready**: Includes `npx @playwright/cli` for agentic exploration and `antigravity_protocol` for AI coding rules.
- **Multi-Role Auth**: `global-setup.ts` pre-authenticates multiple user personas (Admin, Standard) once per run.
- **Resilient Actions**: Layer 1 wrappers (`element.actions.ts`) handled logging, stability checks, and error observability.
- **Rich Reporting**: Integrated **Allure Report** for visual test insights.

---

## 🏗️ Architecture

The codebase follows the **Antigravity Protocol** (see `.agent/skills/antigravity_protocol/SKILL.md`):

```
src/
├── core/           # Layer 1: Low-level wrappers (ElementActions, NavigationActions)
├── pages/          # Layer 2: Page Objects (Locators & Actions, NO assertions)
├── tests/          # Layer 3: Test Scripts (Assertions & Logic)
├── fixtures/       # Test Data & Custom Fixtures
└── config/         # Environment Configuration (zod-validated)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation
```bash
npm install
npx playwright install
```

### Configuration
1. Copy `.env.example` to `.env`.
   ```bash
   cp .env.example .env
   ```
2. Update the credentials in `.env` if testing against a custom environment.

---

## 🛠️ Usage

### Running Tests (Standard CLI)
Use these commands for verifying code:
```bash
# Run all tests (headless)
npm test

# Run tests in headed mode
npm run test:headed

# Run a specific test file
npx playwright test src/tests/cart.spec.ts

# Run tests with UI debugger
npm run test:ui
```

### Agentic Exploration (Agent CLI)
Use this command for AI Agents to efficiently control the browser:
```bash
# Open a browser for exploration
npm run agent-cli -- open https://rahulshettyacademy.com/seleniumPractise/#/

# Click an element
npm run agent-cli -- click "text=PROCEED TO CHECKOUT"
```

### External AI Client (MCP)
To connect an external AI tool (like Claude Desktop) via the Model Context Protocol:
```bash
npm run mcp
```

---

## 📊 Reporting

We use **Allure Report** for detailed test execution visualization.

```bash
# Generate report after a test run
npm run allure:generate

# Open the dashboard
npm run allure:open
```

---

## 🛡️ The 5 Laws of Antigravity
1.  **Wrapper Law**: Never use `page.click()` directly in Page Objects. Use `this.action.click()`.
2.  **Selector Law**: Prefer `getByRole`, `getByLabel`. Avoid brittle CSS.
3.  **Assertion Law**: `expect()` belongs ONLY in Test Scripts (Layer 3).
4.  **Data Law**: No hardcoded data in tests. Use `DataFactory`.
5.  **Hybrid Law**: Use API for non-focus steps (like creating seed data).

---

## 🤝 Contributing
Please read `.agent/skills/antigravity_protocol/SKILL.md` before adding new code. All changes must pass the Definition of Done.

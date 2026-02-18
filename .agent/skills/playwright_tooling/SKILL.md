---
name: Playwright Tooling Strategy
description: Guidelines for using Standard Playwright CLI (high efficiency) vs Agentic Playwright CLI (browser control) vs MCP.
---

# 🎭 Playwright Tooling Strategy

This project provides **three** primary interfaces for interacting with Playwright. Choosing the right one is critical for agent performance and cost.

| Interface | Command | Token Efficiency | Primary Use Case |
|---|---|---|---|
| **1. Standard CLI** | `npm test` | ⭐⭐⭐⭐⭐ (Excellent) | Bulk test execution & validation. |
| **2. Agentic CLI** | `npm run agent-cli` | ⭐⭐⭐⭐ (Very Good) | Direct browser control for exploration/debugging. |
| **3. MCP Protocol** | `npm run mcp` | ⭐ (Low) | Rich state streaming to external MCP clients. |

---

## 1. Standard CLI (`npx playwright`)

**Default for Verification.** Use this when running pre-written *tests*.

### Capabilities
- **Run Tests**: `npm test` checks pass/fail status.
- **Run Specific Test**: `npx playwright test src/tests/login.spec.ts`.
- **Lint**: `npm run lint`.
- **Codegen**: `npx playwright codegen`.

### Best For
- **Regression Testing**: "Run all tests."
- **Syntax Checking**: "Does it compile?"
- **CI/CD Simulation**: "Will this pass in the pipeline?"

---

## 2. Agentic CLI (`npx @playwright/cli`)

**Default for Exploration.** This is the specialized CLI for AI agents to control the browser efficiently.

### Capabilities
- **Open Page**: `npm run agent-cli open https://example.com`
- **Click**: `npm run agent-cli click "text=Login"`
- **Type**: `npm run agent-cli fill "#username" "admin"`
- **Inspect**: `npm run agent-cli snapshot` (Returns element refs without massive DOM dumps).

### Why use this over MCP?
- **Stateless & Concise**: Commands are atomic (`click`, `fill`).
- **Low Token Cost**: It returns short confirmations or specific data, not the entire accessibility tree every step.
- **Shell-Friendly**: Perfect for agents with shell access (like you).

### Best For
- **New Feature Exploration**: "Go to the new page and tell me what buttons are there."
- **Visual Debugging**: "Open the failed URL and click the button to see if it works."
- **Ad-hoc Tasks**: "Log in and check the dashboard title."

---

## 3. MCP Protocol (`npx @playwright/mcp`)

**Specialized Protocol.** This runs a server that streams full browser state via JSON-RPC.

### Capabilities
- **Full State Streaming**: Sends the entire accessibility tree, console logs, and network events to the client context.
- **Client-Driven**: Intended for tools like **Claude Desktop** or **Cursor** that implement the MCP client.

### Best For
- **External Agents**: If you are connecting an external tool to this project.
- **Deep Introspection**: When you need to monitor *everything* happening in the browser in real-time.

---

## Decision Matrix

| Task | Recommended Tool | Command |
|---|---|---|
| **"Run the test suite"** | ✅ **Standard CLI** | `npm test` |
| **"Debug a failure"** | ✅ **Standard CLI** (logs) -> **Agentic CLI** (interact) | `npm test` -> `npm run agent-cli` |
| **"Explore a new URL"** | ✅ **Agentic CLI** | `npm run agent-cli -- open <url>` |
| **"Connect Claude Desktop"** | ✅ **MCP Protocol** | `npm run mcp` |

### 🛑 Anti-Pattern
**Do NOT** use `npm run mcp` internally if you have shell access. Use `npm run agent-cli` instead to save massive amounts of tokens.

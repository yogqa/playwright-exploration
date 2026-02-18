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

### Two Variants
| Script | Command | Use When |
|---|---|---|
| `agent-cli` | `npm run agent-cli -- <cmd>` | Exploring public/unauthenticated pages |
| `agent-cli:auth` | `npm run agent-cli:auth -- <cmd>` | Exploring pages that require login (pre-loads `auth/admin.json`) |

> ⚠️ **The `--` separator is required** when passing arguments through npm scripts. Without it, npm swallows the args.

### Capabilities

#### Navigation & Interaction
- **Open Page**: `npm run agent-cli -- open https://example.com`
- **Navigate**: `npm run agent-cli:auth -- goto /angularpractice/shop`
- **Click**: `npm run agent-cli -- click "text=Login"`
- **Type**: `npm run agent-cli -- fill "#username" "admin"`
- **Inspect**: `npm run agent-cli -- snapshot` (Returns element refs without massive DOM dumps).

#### 🎬 Video Recording
Record a full video of a browser session for debugging or documentation:
```bash
# Start recording
npm run agent-cli -- video-start

# ... perform actions (open, click, fill, snapshot) ...

# Stop and save the video
npm run agent-cli -- video-stop
# → Saves to .playwright-cli/video-*.webm

# Open the recorded video to review it
npm run agent-cli -- video-open
```

#### 🔍 Tracing
Capture a full Playwright trace (timeline, screenshots, network, console) for deep debugging:
```bash
# Start tracing
npm run agent-cli -- tracing-start

# ... perform actions ...

# Stop and save the trace
npm run agent-cli -- tracing-stop
# → Saves to .playwright-cli/traces/*.trace

# Open the Playwright Trace Viewer
npm run agent-cli -- tracing-open
```
The trace viewer shows: timeline of all actions, before/after screenshots, console logs, network requests, and element locators used.

#### 📊 Visual Dashboard
When running multiple browser sessions simultaneously, use the dashboard for a bird's-eye view:
```bash
npm run agent-cli -- dashboard
```
- See live previews of every active browser session
- Click into any session to watch it full-size
- Take over mouse/keyboard control if needed, then press `Escape` to hand back to the agent

### Why use this over MCP?
- **Stateless & Concise**: Commands are atomic (`click`, `fill`).
- **Low Token Cost**: It returns short confirmations or specific data, not the entire accessibility tree every step.
- **Shell-Friendly**: Perfect for agents with shell access (like you).

### Best For
- **New Feature Exploration**: "Go to the new page and tell me what buttons are there."
- **Visual Debugging**: "Open the failed URL and click the button to see if it works."
- **Ad-hoc Tasks**: "Log in and check the dashboard title."
- **Recording Evidence**: "Record a video of the checkout flow for the bug report."
- **Deep Debugging**: "Capture a trace of the failing interaction so I can inspect network calls."

---

## 3. MCP Protocol (`npx @playwright/mcp`)

**Specialized Protocol.** This runs a server that streams full browser state via JSON-RPC.

### Capabilities
- **Full State Streaming**: Sends the entire accessibility tree, console logs, and network events to the client context.
- **Client-Driven**: Intended for tools like **Claude Desktop** or **Cursor** that implement the MCP client.

### MCP Configuration Files
The MCP server is pre-configured in two locations:
- **`.agent/mcp.json`** — Agent MCP config (Gemini / Antigravity agent)
- **`.vscode/mcp.json`** — VS Code MCP config (GitHub Copilot agent)

Both configs launch Playwright MCP with **Chromium + headless + admin storageState** so the agent starts already authenticated.

### Best For
- **External Agents**: If you are connecting an external tool to this project.
- **Deep Introspection**: When you need to monitor *everything* happening in the browser in real-time.

---

## Decision Matrix

| Task | Recommended Tool | Command |
|---|---|---|
| **"Run the test suite"** | ✅ **Standard CLI** | `npm test` |
| **"Debug a failure"** | ✅ **Standard CLI** (logs) → **Agentic CLI** (interact) | `npm test` → `npm run agent-cli:auth -- goto <url>` |
| **"Explore a public URL"** | ✅ **Agentic CLI** | `npm run agent-cli -- open <url>` |
| **"Explore an authenticated page"** | ✅ **Agentic CLI (auth)** | `npm run agent-cli:auth -- open <url>` |
| **"Record a video of a flow"** | ✅ **Agentic CLI** | `npm run agent-cli -- video-start` → actions → `video-stop` |
| **"Capture a trace for debugging"** | ✅ **Agentic CLI** | `npm run agent-cli -- tracing-start` → actions → `tracing-stop` |
| **"Monitor multiple sessions"** | ✅ **Agentic CLI** | `npm run agent-cli -- dashboard` |
| **"Connect Claude Desktop"** | ✅ **MCP Protocol** | `npm run mcp` |

### 🛑 Anti-Pattern
**Do NOT** use `npm run mcp` internally if you have shell access. Use `npm run agent-cli` instead to save massive amounts of tokens.

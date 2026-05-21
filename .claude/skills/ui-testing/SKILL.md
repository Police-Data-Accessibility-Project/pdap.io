---
name: ui-test
description: Visually inspect and interact with the running app using playwright-cli. Use when you need to verify UI rendering, test interactions, check styling, or debug visual issues.
argument-hint: "[url-or-description]"
allowed-tools: Bash(npx @playwright/cli *), Read
---

# UI Testing with Playwright CLI

You have access to `@playwright/cli`, a headless browser automation tool designed for AI agents. Use it to visually verify UI changes, test interactions, and debug styling issues without requiring the user to take screenshots.

**Important**: All `npx @playwright/cli` commands MUST be run with `dangerouslyDisableSandbox: true` because they launch browser processes.

## Core Workflow

### 1. Navigate to a page (opens browser automatically)
```bash
npx @playwright/cli goto http://localhost:8888/annotate
```
This opens a headless browser session and navigates to the URL. The dev server must be running first.

### 2. Take a snapshot to get element refs
```bash
npx @playwright/cli snapshot
```
Returns a compact YAML page structure with element reference IDs (e.g., `e21`, `e98`). Use `--filename /tmp/snapshot.yml` to save to file for reading.

### 3. Take a screenshot and view it
```bash
npx @playwright/cli screenshot --filename /tmp/ui-check.png
```
Then use the **Read tool** on the PNG to visually inspect the page.

### 4. Interact with elements using refs from snapshot
```bash
npx @playwright/cli click e98        # Click a button
npx @playwright/cli fill e42 "text"  # Fill an input
npx @playwright/cli hover e15        # Hover over element
npx @playwright/cli press Enter      # Press a key
```

### 5. Screenshot again to verify the result
```bash
npx @playwright/cli screenshot --filename /tmp/ui-after.png
```

## Common Tasks

### Visual QA after CSS changes
1. `goto` the page
2. `screenshot` to verify current state
3. If something looks wrong, `snapshot` to find element refs
4. `eval "el => getComputedStyle(el).backgroundColor" e21` to check computed styles

### Check responsive layout
```bash
npx @playwright/cli resize 375 812
npx @playwright/cli screenshot --filename /tmp/mobile.png
npx @playwright/cli resize 1280 800
npx @playwright/cli screenshot --filename /tmp/desktop.png
```

### Walk through a multi-step flow
```bash
npx @playwright/cli goto http://localhost:8888/annotate
npx @playwright/cli snapshot                          # Find the button ref
npx @playwright/cli click e98                         # Click "Relevant Data Source"
npx @playwright/cli screenshot --filename /tmp/step2.png  # Verify step 2
```

## Session Management

```bash
npx @playwright/cli list        # List active browser sessions
npx @playwright/cli close       # Close current session
npx @playwright/cli close-all   # Close all sessions
npx @playwright/cli kill-all    # Force kill stale sessions
```

## Tips

- **Click timeouts are normal** when the click triggers navigation. The click still succeeds. Just take a screenshot afterward to verify.
- Element refs change after DOM updates. Re-run `snapshot` to get fresh refs.
- Use `--full-page` with `screenshot` to capture the entire scrollable page.
- The browser is headless by default. Add `--headed` to `goto` or `open` to see it visually.
- Always `close-all` or `kill-all` when done to clean up browser processes.

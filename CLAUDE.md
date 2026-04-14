# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> Cross-repo system map lives in `~/.claude/CLAUDE.md` (user-level, not committed).

## Overview

Qonic Excel Add-In — an Office Add-in that lets users query model data and push modifications back to Qonic directly from within Microsoft Excel. Built with React and the Office.js API.

## Tech Stack

- **React** + **TypeScript** — UI components
- **Webpack** — bundler (Office Add-in template)
- **Fluent UI** (`@fluentui/react-components`, `@fluentui/react-icons`) — Microsoft design system
- **Headless UI** — additional component primitives
- **TanStack React Query 5** — server state management
- **Auth0** (`@auth0/auth0-spa-js`) — OAuth PKCE authentication
- **Axios** — HTTP client
- **Tailwind CSS** — utility-first styling
- **Office.js** — Excel API integration
- **Node.js** — development server

## Commands

```bash
npm install                # Install dependencies
npm run dev-server         # Dev server on https://localhost:3000
npm run server             # Production-mode dev server
npm run build              # Production build
npm run build:dev          # Development build
npm run lint               # Lint check
npm run lint:fix           # Auto-fix lint issues
npm start                  # Start add-in in Excel (desktop)
npm run start:web          # Start add-in in Excel Online
npm run validate           # Validate manifest.xml
```

## Project Structure

```
src/
├── taskpane/          # Main task pane UI
│   ├── components/    # React components
│   ├── excel/         # Excel-specific utilities (cell reads/writes)
│   └── utils/         # General utilities
├── commands/          # Excel ribbon command handlers
└── login/             # Login page/flow
assets/                # Static assets (images, icons)
manifest.xml           # Office Add-in manifest (defines capabilities, URLs)
webpack.config.js      # Webpack configuration
```

## Key Conventions

- The add-in uses OAuth PKCE flow via Auth0 — credentials are configured via `.env` files
- `manifest.xml` defines the add-in's capabilities and must be valid — run `npm run validate` to check
- The dev server runs on HTTPS (required by Office Add-ins) at `https://localhost:3000`
- Environment variables: `QONIC_CLIENT_ID`, `QONIC_CLIENT_SECRET` (from `.env`)
- Multiple env configs: `.env` (default), `.env.develop`, `.env.rc`, `.env.example`

## How This Repo Interfaces With Others

- **Consumes**: Qonic Public API for model data queries and modifications
- **Authentication**: Auth0 (same domain as dashboard-frontend, different client credentials)
- **Public repo**: Hosted at `github.com/QonicOpen/QonicExcel` (not on GitHub Enterprise)

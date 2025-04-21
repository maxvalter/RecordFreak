# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- Build: `npm run build` (tsc -b && vite build)
- Dev server: `npm run dev` (vite)
- Lint: `npm run lint` (eslint .)
- Preview build: `npm run preview`

## Code Style
- TypeScript with strict mode
- React 19 with functional components and hooks
- Import order: React, libraries, local components, utilities, styles
- Error handling: Use httpErrorHandler from src/error/
- Naming: PascalCase for components, camelCase for variables/functions
- Types: Always use TypeScript types, prefer interfaces for objects
- State management: React hooks (useState, useEffect)
- Formatting: No trailing semicolons, double quotes for strings
- Always handle API errors explicitly with error boundaries or try/catch blocks
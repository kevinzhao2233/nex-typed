# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this
repository.

## Project Overview

This is a TypeScript library for creating typing animations in the browser. The library provides a
typing effect that displays text character by character, similar to terminal typing effects or
typing simulators. It supports multiple strings, cursor customization, pause/resume functionality,
and callback hooks for animation events.

## Architecture

The codebase follows a modular architecture with clear separation of concerns:

### Core Modules

**`src/createTyped.ts`** - Main entry point and animation controller

- `createTyped()` function is the primary API entry point
- Manages the typing animation state machine (running, paused, completed)
- Handles DOM manipulation for text rendering
- Coordinates with cursor controller
- Implements the core typing loop using `setTimeout` for character-by-character animation
- Supports multiple strings with automatic progression between them

**`src/cursor.ts`** - Cursor management

- `createCursor()` function creates and manages the blinking cursor
- Handles cursor mounting/unmounting to the DOM
- Manages cursor visibility states (show/hide)
- Implements blinking animation using `setInterval`
- Supports custom cursor characters and blink behavior

**`src/types.ts`** - Type definitions

- `TypedTarget` - Union type for DOM element or CSS selector
- `TypedState` - Internal state management interface
- `TypedOptions` - Configuration options for typing behavior
- `CursorOptions` - Cursor configuration interface
- `TypedController` - Public API interface for controlling animation

**`src/index.ts`** - Public API exports

- Single export: `createTyped` function
- Serves as the library's main entry point

### Data Flow

1. **Initialization**: `createTyped(target, options)` → resolves DOM element → creates state
2. **Setup**: Creates internal DOM structure (root span, text span) and optional cursor
3. **Animation Loop**: `tick()` function processes one character per timeout cycle
4. **State Management**: Centralized state object tracks current string index, character position,
   running/paused status
5. **Cleanup**: `destroy()` removes all DOM elements and clears timers

### DOM Structure

```
[target element]
└── [span data-nex-typed-root]
    ├── [span data-nex-typed-text] (text content here)
    └── [span data-nex-typed-cursor] (optional cursor)
```

## Development Commands

**Build the library:**

```bash
pnpm run build
```

**Development mode (watch):**

```bash
pnpm run dev
```

**Run tests:**

```bash
pnpm run test
```

**Type checking:**

```bash
pnpm run typecheck
```

**Single test file:**

```bash
pnpm run test -- tests/index.test.ts
```

## Testing Setup

- Uses **Vitest** as the test runner
- Test files are located in `tests/` directory
- Current test file `tests/index.test.ts` appears to be a template (references a non-existent `fn`
  function)
- Tests can be run in watch mode during development

## Build Configuration

- **Bundler**: tsdown (Rollup-based TypeScript bundler)
- **Type System**: TypeScript 5.9.3 with strict mode enabled
- **Output**: ESM format (`.mjs` files) with TypeScript declarations (`.d.mts`)
- **Target**: ES Next with DOM and ES2023 lib support
- **Declaration files**: Generated separately via `emitDeclarationOnly: true`

## Key Implementation Details

### Animation Timing

- Uses `window.setTimeout()` for character-by-character timing
- Default `typeSpeed`: 50ms per character
- Supports `startDelay` for initial delay before typing begins
- All timeouts are properly cleared to prevent memory leaks

### State Management

- Single state object tracks: running status, pause state, current indices, timeout IDs
- State is mutable but centralized in the `createTyped` closure
- No external state management libraries used

### Error Handling

- Basic error handling for DOM element resolution (throws if selector not found)
- Defensive checks for state transitions (prevent double-start, etc.)

### Browser APIs Used

- `document.querySelector()` for element resolution
- `window.setTimeout()` / `window.clearTimeout()` for timing
- `window.setInterval()` / `window.clearInterval()` for cursor blinking
- DOM manipulation (createElement, appendChild, textContent, etc.)

## Development Notes

### Adding New Features

- Types should be added to `src/types.ts`
- Core logic goes in `src/createTyped.ts` for typing behavior
- Cursor-specific features go in `src/cursor.ts`
- Update exports in `src/index.ts` if adding new public APIs

### Testing New Features

- Add test cases to `tests/` directory
- Use Vitest's `expect`, `test` APIs
- Consider adding DOM testing utilities if testing browser-specific behavior

### Build Process

- tsdown handles TypeScript compilation and bundling
- Output goes to `dist/` directory
- Package exports are configured in `package.json` and `tsdown.config.ts`

### Browser Compatibility

- Uses modern DOM APIs (ES2023 + DOM lib)
- No polyfills included - target environments should support modern browsers
- No framework dependencies - vanilla JavaScript/TypeScript only

## Common Issues

### DOM APIs in Node.js

- This library is browser-only and uses DOM APIs directly
- Tests may need to mock DOM environment if running in Node.js
- Consider using `jsdom` or similar for testing if needed

### Type Safety

- Strict TypeScript mode is enabled
- All options and interfaces are properly typed
- No `any` types should be introduced

### Memory Management

- All timers are properly cleared in `destroy()` and `stop()` functions
- DOM elements are removed on destroy
- No memory leaks from event listeners or timers

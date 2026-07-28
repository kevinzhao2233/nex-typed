# nex-typed

**A modern TypeScript typing animation library for the browser**

[![npm version](https://badge.fury.io/js/nex-typed.svg)](https://badge.fury.io/js/nex-typed)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)

nex-typed is a lightweight, feature-rich library for creating terminal-style typing animations with
full control over animation behavior, cursor customization, and callback hooks.

## 🚀 Quick Start

```typescript
import { createTyped } from 'nex-typed';

const controller = createTyped('#terminal', {
  strings: ['Hello World!', 'Welcome to nex-typed.', 'A modern typing animation library.'],
  typeSpeed: 50,
  cursor: { enabled: true, char: '█' },
});

controller.start();
```

## 📦 Installation

```bash
npm install nex-typed
# or
pnpm add nex-typed
# or
yarn add nex-typed
```

## 🎯 Key Features

- ✅ **Modern TypeScript** - Full type safety with TypeScript 5.9
- ✅ **Lightweight** - Zero dependencies, ~12KB minified (~2.8KB gzipped)
- ✅ **Feature Rich** - Backspace, loops, speed control, callbacks
- ✅ **Customizable** - Flexible cursor and animation options
- ✅ **Browser Native** - Vanilla JavaScript, no framework required
- ✅ **Memory Safe** - Proper cleanup and timer management

## 📚 Documentation

### [🔧 API Reference](./docs/API.md)

Detailed API documentation for all interfaces, options, and methods.

### [📝 Usage Guide](./docs/USAGE.md)

Practical usage examples and best practices.

### [🎨 Examples](./docs/EXAMPLES.md)

Real-world examples and use cases.

## 🎮 Basic Usage

```html
<div id="terminal"></div>

<script type="module">
  import { createTyped } from 'nex-typed';

  const terminal = document.getElementById('terminal');

  const typing = createTyped(terminal, {
    strings: [
      'Welcome to nex-typed!',
      'A modern typing animation library.',
      'Built with TypeScript.',
      'Zero dependencies.',
    ],
    typeSpeed: 50,
    startDelay: 1000,
    cursor: {
      enabled: true,
      char: '▌',
      blink: true,
      blinkSpeed: 500,
    },
    onBegin: () => console.log('Animation started!'),
    onComplete: () => console.log('Animation complete!'),
  });

  typing.start();
</script>
```

## 🎮 Control Methods

```typescript
const controller = createTyped('#target', { strings: ['Hello', 'World'] });

controller.start(); // Start animation
controller.pause(); // Pause animation
controller.resume(); // Resume animation
controller.stop(); // Stop animation
controller.destroy(); // Clean up and remove DOM elements

// Advanced controls
controller.backspace(); // Trigger backspace effect
controller.deleteString(); // Delete current string
controller.skip(); // Skip to next string
controller.goTo(2); // Jump to specific string index
controller.setSpeed(30); // Change typing speed dynamically
```

## 🔧 Configuration Options

### Basic Options

- `strings` - Array of strings to type
- `typeSpeed` - Typing speed in milliseconds (default: 50)
- `startDelay` - Initial delay before typing starts (default: 0)
- `loop` - Loop through strings indefinitely (default: false)

### Cursor Options

- `enabled` - Enable/disable cursor (default: true)
- `char` - Cursor character (default: '|')
- `blink` - Enable blinking (default: true)
- `blinkSpeed` - Blink speed in milliseconds (default: 500)
- `hideWhenComplete` - Hide cursor when done (default: false)

### Advanced Options

- `backspaceSpeed` - Backspace animation speed (default: 30)
- `deleteStrings` - Auto-delete strings after typing (default: false)
- `deleteDelay` - Delay before deleting (default: 1000)
- `humanTypeDelay` - Random typing delays for realism
- `typeSpeedVariance` - Speed variation percentage (0-100)
- `shuffle` - Randomize string order (default: false)
- `speedProfile` - Animation curve: 'linear', 'easeIn', 'easeOut', 'easeInOut'
- `pauseOnPunctuation` - Extra pause on punctuation (default: false)
- `stringPauseDelay` - Delay between strings (default: 500)

### Callback Events

- `onBegin` - Animation starts
- `onStringStart(index, text)` - String starts typing
- `onStringEnd(index, text)` - String finishes typing
- `onComplete` - All strings complete
- `onPause(index, charIndex)` - Animation paused
- `onResume(index, charIndex)` - Animation resumed
- `onBackspaceStart(index, text)` - Backspace starts
- `onBackspaceEnd(index, text)` - Backspace ends
- `onLoop(index)` - Loop iteration
- `onShuffle(original, shuffled)` - String shuffle complete

## 🎯 Use Cases

- **Terminal/Console Emulators** - Command line interfaces
- **Chat Interfaces** - Message typing simulation
- **Code Editors** - Animated code demonstrations
- **Typewriter Effects** - Classic writing simulation
- **Loading States** - Progress indicators
- **Interactive Tutorials** - Step-by-step instructions

## 📊 Performance

- **Bundle Size**: ~12KB minified, ~2.8KB gzipped (zero runtime dependencies)
- **Memory**: Proper cleanup, no memory leaks
- **Browser Support**: Modern browsers (ES2023 + DOM APIs)
- **Framework Support**: Works with React, Vue, Svelte, Angular

## 🎨 Example: Terminal Emulator

```html
<div
  id="terminal"
  style="background: #000; color: #0f0; font-family: monospace; padding: 20px; border-radius: 8px;"
></div>

<script type="module">
  import { createTyped } from 'nex-typed';

  const terminal = createTyped('#terminal', {
    strings: [
      '$ whoami',
      'guest',
      '$ ls -la',
      'total 16',
      'drwxr-xr-x  2 guest  staff   64 Jan 26 15:30 .',
      'drwxr-xr-x  5 guest  staff  160 Jan 26 15:29 ..',
      '-rw-r--r--  1 guest  staff  1234 Jan 26 15:30 welcome.txt',
      '$ cat welcome.txt',
      'Welcome to the terminal!',
      '$ ',
    ],
    typeSpeed: 30,
    cursor: {
      enabled: true,
      char: '█',
      blink: true,
      blinkSpeed: 400,
    },
    stringPauseDelay: 300,
  });

  terminal.start();
</script>
```

## 🎨 Example: Typewriter Effect

```html
<div
  id="typewriter"
  style="background: #f4f1e8; padding: 40px; border-radius: 4px; font-family: 'Courier New', monospace; font-size: 18px; line-height: 1.8;"
></div>

<script type="module">
  import { createTyped } from 'nex-typed';

  const typewriter = createTyped('#typewriter', {
    strings: [
      'Dear Reader,',
      '',
      'This is a classic typewriter effect.',
      'Each character appears one by one,',
      'creating a nostalgic feeling.',
      '',
      'Sincerely,',
      'The Author',
    ],
    typeSpeed: 80,
    humanTypeDelay: { min: 60, max: 120 },
    stringPauseDelay: 1000,
    pauseOnPunctuation: true,
    cursor: {
      enabled: true,
      char: '|',
      blink: true,
      blinkSpeed: 600,
      style: { color: '#8b4513' },
    },
  });

  typewriter.start();
</script>
```

## 🎨 Example: Chat Interface

```html
<div id="chat" style="background: #f0f0f0; padding: 20px; border-radius: 8px;"></div>

<script type="module">
  import { createTyped } from 'nex-typed';

  const messages = [
    { user: 'Alice', text: 'Hey there! 👋' },
    { user: 'Bob', text: 'Hi Alice! How are you?' },
    { user: 'Alice', text: "I'm great, thanks!" },
  ];

  async function typeMessage(elementId, message, delay = 0) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const controller = createTyped(elementId, {
          strings: [`${message.user}: ${message.text}`],
          typeSpeed: 50,
          cursor: { enabled: true, char: '▌', blink: true, blinkSpeed: 300 },
          onComplete: resolve,
        });
        controller.start();
      }, delay);
    });
  }

  async function chatSimulation() {
    await typeMessage('#chat', messages[0], 0);
    await typeMessage('#chat', messages[1], 1500);
    await typeMessage('#chat', messages[2], 1500);
  }

  chatSimulation();
</script>
```

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

## 🔗 Links

- [GitHub Repository](https://github.com/kevinzhao2233/nex-typed)
- [npm Package](https://www.npmjs.com/package/nex-typed)
- [Issue Tracker](https://github.com/kevinzhao2233/nex-typed/issues)

---

**Built with ❤️ using TypeScript**

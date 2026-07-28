# API Reference

Complete API documentation for nex-typed.

## Core Function

### `createTyped(target, options)`

Creates a new typing animation controller.

**Parameters:**

- `target` - DOM element or CSS selector string
- `options` - Configuration options object

**Returns:** `TypedController`

**Example:**

```typescript
const controller = createTyped('#terminal', {
  strings: ['Hello World'],
  typeSpeed: 50,
});
```

---

## Type Definitions

### `TypedTarget`

Target element for typing animation.

```typescript
type TypedTarget = HTMLElement | string;
```

**Examples:**

```typescript
// HTMLElement
const element = document.getElementById('terminal');
createTyped(element, options);

// CSS Selector
createTyped('#terminal', options);
createTyped('.typing-container', options);
```

---

### `TypedOptions`

Configuration options for typing animation.

```typescript
interface TypedOptions {
  // Basic Options
  strings: string[];
  typeSpeed?: number;
  startDelay?: number;

  // Cursor Options
  cursor?: CursorOptions;

  // Backspace/Delete Options
  backspaceSpeed?: number;
  deleteStrings?: boolean;
  deleteDelay?: number;

  // Loop Options
  loop?: boolean;

  // Smart Timing Options
  humanTypeDelay?: { min: number; max: number };
  stringPauseDelay?: number;
  pauseOnPunctuation?: boolean;

  // Speed Variation Options
  typeSpeedVariance?: number;
  shuffle?: boolean;
  speedProfile?: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';

  // Callback Events
  onBegin?: () => void;
  onStringStart?: (index: number, text: string) => void;
  onStringEnd?: (index: number, text: string) => void;
  onComplete?: () => void;
  onPause?: (index: number, charIndex: number) => void;
  onResume?: (index: number, charIndex: number) => void;
  onBackspaceStart?: (index: number, text: string) => void;
  onBackspaceEnd?: (index: number, text: string) => void;
  onLoop?: (index: number) => void;
  onShuffle?: (originalOrder: string[], shuffledOrder: string[]) => void;
}
```

#### Basic Options

**`strings: string[]`** (Required)

- Array of strings to type sequentially
- Each string will be typed character by character
- After completion, moves to next string

**`typeSpeed: number`** (Default: 50)

- Typing speed in milliseconds per character
- Lower values = faster typing
- Can be changed dynamically with `setSpeed()`

**`startDelay: number`** (Default: 0)

- Initial delay before typing starts (milliseconds)
- Useful for creating a pause before animation begins

#### Cursor Options

**`cursor: CursorOptions`**

- See `CursorOptions` interface below

#### Backspace/Delete Options

**`backspaceSpeed: number`** (Default: 30)

- Speed of backspace animation in milliseconds per character
- Used by `backspace()` and `deleteString()` methods

**`deleteStrings: boolean`** (Default: false)

- When true, automatically deletes each string after typing
- Useful for creating typing/deleting loops

**`deleteDelay: number`** (Default: 1000)

- Delay before starting deletion after string completion
- Only used when `deleteStrings: true`

#### Loop Options

**`loop: boolean`** (Default: false)

- When true, restarts from first string after completion
- Creates infinite typing animation
- Triggers `onLoop` callback

#### Smart Timing Options

**`humanTypeDelay: { min: number; max: number }`**

- Random typing delays (in milliseconds) for realistic human typing
- When specified, the random value fully replaces the base `typeSpeed` (and any `typeSpeedVariance` adjustment) for each character
- The resulting delay is still subject to further modification by `speedProfile` (curve scaling) and `pauseOnPunctuation` (+200ms on punctuation)
- Example: `{ min: 30, max: 100 }` produces 30-100ms random delays before any curve/punctuation adjustments

**`stringPauseDelay: number`** (Default: 500)

- Delay between strings in milliseconds
- Applied when moving to next string

**`pauseOnPunctuation: boolean`** (Default: false)

- When true, adds an extra 200ms delay after typing a punctuation character
- Recognized punctuation: `.` `!` `?` (English) and `，` `。` `！` `？` (Chinese full-width)

#### Speed Variation Options

**`typeSpeedVariance: number`** (Default: 0)

- Speed variation percentage (0-100)
- Creates random speed variations around base `typeSpeed`
- Example: `20` = ±20% speed variation

**`shuffle: boolean`** (Default: false)

- When true, randomizes string order on start
- Triggers `onShuffle` callback with original and shuffled order

**`speedProfile: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut'`** (Default: 'linear')

- Animation curve for typing speed:
  - `'linear'` - Constant speed
  - `'easeIn'` - Starts slow, accelerates
  - `'easeOut'` - Starts fast, decelerates
  - `'easeInOut'` - S-curve (slow-fast-slow)

#### Callback Events

**`onBegin: () => void`**

- Called when animation starts
- Called once per animation cycle

**`onStringStart: (index: number, text: string) => void`**

- Called when starting to type a new string
- `index` - String index (0-based)
- `text` - The string being typed

**`onStringEnd: (index: number, text: string) => void`**

- Called when finished typing a string
- `index` - String index (0-based)
- `text` - The completed string

**`onComplete: () => void`**

- Called when all strings are complete
- Not called in loop mode

**`onPause: (index: number, charIndex: number) => void`**

- Called when animation is paused
- `index` - Current string index
- `charIndex` - Current character position

**`onResume: (index: number, charIndex: number) => void`**

- Called when animation resumes
- `index` - Current string index
- `charIndex` - Current character position

**`onBackspaceStart: (index: number, text: string) => void`**

- Called when backspace/delete starts
- `index` - Current string index
- `text` - The string being deleted

**`onBackspaceEnd: (index: number, text: string) => void`**

- Called when backspace/delete completes
- `index` - Current string index
- `text` - The deleted string

**`onLoop: (index: number) => void`**

- Called when loop restarts
- `index` - Index of the string that just completed

**`onShuffle: (originalOrder: string[], shuffledOrder: string[]) => void`**

- Called when strings are shuffled
- `originalOrder` - Original string array
- `shuffledOrder` - Shuffled string array

---

### `CursorOptions`

Cursor configuration options.

```typescript
interface CursorOptions {
  enabled: boolean;
  char?: string;
  blink?: boolean;
  blinkSpeed?: number;
  blinkCount?: number;
  hideWhenComplete?: boolean;
  style?: string | Partial<{ [K in keyof CSSStyleDeclaration]: CSSStyleDeclaration[K] extends string ? K : never }>;
}
```

**`enabled: boolean`** (Required)

- Enable/disable cursor display

**`char: string`** (Default: '|')

- Character to display as cursor

**`blink: boolean`** (Default: true)

- Enable/disable cursor blinking

**`blinkSpeed: number`** (Default: 500)

- Blink speed in milliseconds
- Time between on/off states

**`blinkCount: number`** (Default: 0)

- Number of times to blink
- 0 = infinite blinking
- When reached, cursor stays visible

**`hideWhenComplete: boolean`** (Default: false)

- When true, hides cursor when animation completes
- Useful for clean terminal look

**`style: string | Partial<CSSStyleDeclaration>`**

- CSS styling for the cursor
- String = CSS class name (added via `classList.add`)
- Object = inline styles, keyed by camelCase CSS property names (e.g. `{ color: 'red', fontWeight: 'bold' }`); keys are converted to kebab-case and applied via `style.setProperty`

---

### `TypedController`

Controller returned by `createTyped()` for controlling the animation.

```typescript
interface TypedController {
  // Basic Controls
  start(): void;
  stop(): void;
  destroy(): void;
  pause(): void;
  resume(): void;

  // Advanced Controls
  backspace(): void;
  deleteString(): void;
  skip(): void;
  goTo(index: number): void;

  // Speed Controls
  getTypeSpeed(): number;
  setSpeed(speed: number): void;

  // Cursor Controls
  getCursorBlinkSpeed(): number;
  setCursorBlinkSpeed(speed: number): void;
}
```

#### Basic Controls

**`start(): void`**

- Starts the typing animation
- Does nothing if already running
- Mounts cursor if enabled

**`stop(): void`**

- Stops the animation immediately
- Hides cursor and clears all timers
- Internal state (`index`, `charIndex`) is preserved, but the animation is halted
- Cannot be resumed with `start()` — `start()` will re-trigger `onBegin`/`onStringStart(0, ...)` while leaving `index`/`charIndex` untouched, producing inconsistent state. To pause temporarily, use `pause()`/`resume()` instead. To restart cleanly, call `destroy()` and create a new controller.

**`destroy(): void`**

- Completely removes the animation
- Cleans up DOM elements
- Clears all timers
- Cannot be restarted after destroy

**`pause(): void`**

- Pauses the animation
- Hides cursor
- Can be resumed with `resume()`

**`resume(): void`**

- Resumes paused animation
- Shows cursor and restarts blinking
- Continues from current position

#### Advanced Controls

**`backspace(): void`**

- Triggers backspace animation
- Deletes characters from current string
- Uses `backspaceSpeed` configuration
- Cannot be called during active typing

**`deleteString(): void`**

- Deletes entire current string
- Uses `backspaceSpeed` configuration
- Moves to next string after deletion
- Useful with `loop: true` for infinite typing/deleting

**`skip(): void`**

- Skips current string
- Immediately shows full string
- Moves to next string
- Triggers `onStringEnd` callback

**`goTo(index: number): void`**

- Jump to specific string index
- `index` must be valid (0 to strings.length - 1); invalid indices are silently ignored
- Clears the current text and waits for `stringPauseDelay` before typing the target string from its first character
- Triggers `onStringStart` callback with the target index and string

#### Speed Controls

**`getTypeSpeed(): number`**

- Returns current typing speed (ms per character)
- Reflects current `typeSpeed` configuration

**`setSpeed(speed: number): void`**

- Changes typing speed dynamically
- `speed` - milliseconds per character
- Affects subsequent typing, not current character

#### Cursor Controls

**`getCursorBlinkSpeed(): number`**

- Returns current cursor blink speed (ms)
- Reflects current `blinkSpeed` configuration

**`setCursorBlinkSpeed(speed: number): void`**

- Changes cursor blink speed dynamically
- `speed` - milliseconds per blink cycle
- Immediately updates if cursor is blinking

---

### `CursorController`

Internal cursor controller interface (returned by `createCursor()`).

```typescript
interface CursorController {
  mount(): void;
  unmount(): void;
  show(): void;
  hide(): void;
  startBlink(): void;
  stopBlink(): void;
  setBlinkSpeed(speed: number): void;
  getBlinkSpeed(): number;
  destroy(): void;
}
```

**Note:** This interface is primarily for internal use. Most users will interact with
`TypedController` methods instead.

---

## Usage Examples

### Basic Usage

```typescript
import { createTyped } from 'nex-typed';

// Simple typing animation
const controller = createTyped('#terminal', {
  strings: ['Hello World!', 'Welcome to nex-typed.'],
  typeSpeed: 50,
});

controller.start();
```

### With Cursor

```typescript
const controller = createTyped('#terminal', {
  strings: ['Typing with cursor...'],
  typeSpeed: 50,
  cursor: {
    enabled: true,
    char: '▌',
    blink: true,
    blinkSpeed: 300,
  },
});
```

### With Callbacks

```typescript
const controller = createTyped('#terminal', {
  strings: ['First', 'Second', 'Third'],
  typeSpeed: 50,
  onBegin: () => console.log('Animation started'),
  onStringStart: (index, text) => console.log(`Starting: ${text}`),
  onStringEnd: (index, text) => console.log(`Completed: ${text}`),
  onComplete: () => console.log('All done!'),
});
```

### Advanced Features

```typescript
const controller = createTyped('#terminal', {
  strings: ['Hello', 'World', '!'],
  typeSpeed: 60,
  typeSpeedVariance: 20, // ±20% speed variation
  shuffle: true, // Random order
  speedProfile: 'easeOut', // Start fast, slow down
  loop: true, // Infinite loop
  cursor: {
    enabled: true,
    char: '█',
    blink: true,
    blinkSpeed: 250,
    blinkCount: 10, // Blink 10 times then stop
    hideWhenComplete: true, // Hide when done
  },
  onShuffle: (original, shuffled) => {
    console.log('Shuffled order:', shuffled);
  },
});
```

### Dynamic Control

```typescript
const controller = createTyped('#terminal', {
  strings: ['Type this', 'Then this'],
  typeSpeed: 50,
});

controller.start();

// Later, change speed
setTimeout(() => {
  controller.setSpeed(30); // Faster!
}, 2000);

// Get current speed
const currentSpeed = controller.getTypeSpeed();

// Control cursor blink
controller.setCursorBlinkSpeed(100); // Very fast blink
```

### Backspace/Delete

```typescript
const controller = createTyped('#terminal', {
  strings: ['Typing...', 'Deleting...'],
  typeSpeed: 50,
  backspaceSpeed: 20,
  deleteStrings: true, // Auto-delete after typing
  deleteDelay: 1000, // Wait 1s before deleting
  loop: true, // Infinite typing/deleting
});

controller.start();

// Manual backspace
setTimeout(() => {
  controller.backspace(); // Delete characters
}, 3000);

// Delete entire string
setTimeout(() => {
  controller.deleteString(); // Delete whole string
}, 5000);
```

---

## Error Handling

### Common Errors

**Target not found**

```typescript
try {
  createTyped('#non-existent', { strings: ['Hello'] });
} catch (error) {
  console.error(error.message); // "Target not found: #non-existent"
}
```

**Invalid index in goTo()**

```typescript
controller.goTo(999); // Silently fails (index out of bounds)
```

**Calling methods on destroyed controller**

```typescript
controller.destroy();
controller.start(); // No visible effect, no error
```

After `destroy()`, the root DOM element and cursor are removed from the document. Calling
`start()` will still flip internal state flags and schedule timers, but all subsequent
`render()` calls write to detached DOM nodes, so nothing appears on screen. To restart an
animation, create a new controller with `createTyped()` instead.

**Calling methods during invalid state**

```typescript
controller.backspace(); // No effect if not running or paused
```

---

## Performance Tips

1. **Reuse Controllers**: Don't create new controllers for same element
2. **Destroy When Done**: Call `destroy()` to clean up memory
3. **Limit String Count**: Very long arrays may impact performance
4. **Use Appropriate Speeds**: Very fast speeds (<10ms) may cause visual glitches
5. **Avoid Excessive Callbacks**: Keep callback logic lightweight

---

## Browser Compatibility

- **Modern Browsers**: Chrome 90+, Firefox 90+, Safari 15+, Edge 90+
- **ES2023**: Uses modern JavaScript features
- **DOM APIs**: Requires standard DOM APIs
- **No Polyfills**: Library doesn't include polyfills

---

## TypeScript Support

nex-typed is written in TypeScript and includes complete type definitions:

```typescript
import { createTyped, TypedOptions, TypedController } from 'nex-typed';

// Full type safety
const options: TypedOptions = {
  strings: ['Hello'],
  typeSpeed: 50,
};

const controller: TypedController = createTyped('#target', options);
```

---

## Framework Integration

### React

```typescript
import { useEffect, useRef } from 'react';
import { createTyped } from 'nex-typed';

function TypingComponent() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const controller = createTyped(ref.current, {
        strings: ['Hello React!'],
        typeSpeed: 50
      });
      controller.start();

      return () => controller.destroy();
    }
  }, []);

  return <div ref={ref} />;
}
```

### Vue

```typescript
import { onMounted, onUnmounted, ref } from 'vue';
import { createTyped } from 'nex-typed';

export default {
  setup() {
    const terminal = ref<HTMLElement | null>(null);
    let controller: TypedController | null = null;

    onMounted(() => {
      if (terminal.value) {
        controller = createTyped(terminal.value, {
          strings: ['Hello Vue!'],
          typeSpeed: 50,
        });
        controller.start();
      }
    });

    onUnmounted(() => {
      controller?.destroy();
    });

    return { terminal };
  },
};
```

### Svelte

```svelte
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { createTyped } from 'nex-typed';

  let terminal: HTMLElement;
  let controller: TypedController;

  onMount(() => {
    controller = createTyped(terminal, {
      strings: ['Hello Svelte!'],
      typeSpeed: 50
    });
    controller.start();
  });

  onDestroy(() => {
    controller?.destroy();
  });
</script>

<div bind:this={terminal}></div>
```

---

## Next Steps

- **[Usage Guide](./USAGE.md)** - Practical usage examples
- **[Examples](./EXAMPLES.md)** - Real-world examples
- **[GitHub Issues](https://github.com/kevinzhao2233/nex-typed/issues)** - Report bugs or request
  features

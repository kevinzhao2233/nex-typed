# Usage Guide

Practical usage examples for nex-typed.

## 📚 Table of Contents

- [Basic Usage](#basic-usage)
- [Advanced Features](#advanced-features)
- [Expert Techniques](#expert-techniques)
- [Real-World Examples](#real-world-examples)
- [Performance Tips](#performance-tips)

---

## Basic Usage

### 1. Simple Typing Animation

```typescript
import { createTyped } from 'nex-typed';

// Create a typing animation
const controller = createTyped('#terminal', {
  strings: ['Hello World!', 'Welcome to nex-typed.'],
  typeSpeed: 50,
});

controller.start();
```

**HTML:**

```html
<div id="terminal"></div>
```

### 2. With Cursor

```typescript
const controller = createTyped('#terminal', {
  strings: ['Typing with cursor...'],
  typeSpeed: 50,
  cursor: {
    enabled: true,
    char: '▌',
    blink: true,
    blinkSpeed: 500,
  },
});

controller.start();
```

### 3. With Callbacks

```typescript
const controller = createTyped('#terminal', {
  strings: ['First', 'Second', 'Third'],
  typeSpeed: 50,
  onBegin: () => console.log('Animation started!'),
  onStringStart: (index, text) => console.log(`Starting: ${text}`),
  onStringEnd: (index, text) => console.log(`Completed: ${text}`),
  onComplete: () => console.log('All done!'),
});

controller.start();
```

### 4. With Start Delay

```typescript
const controller = createTyped('#terminal', {
  strings: ['Hello after 2 seconds...'],
  typeSpeed: 50,
  startDelay: 2000, // Wait 2 seconds before starting
});

controller.start();
```

---

## Advanced Features

### 1. Backspace Effect

```typescript
const controller = createTyped('#terminal', {
  strings: ['Typing...', 'Then deleting...'],
  typeSpeed: 50,
  backspaceSpeed: 20, // Fast backspace
});

controller.start();

// Trigger backspace manually
setTimeout(() => {
  controller.backspace();
}, 3000);
```

### 2. Auto-Delete Strings

```typescript
const controller = createTyped('#terminal', {
  strings: ['Type this', 'Then this', 'Then this'],
  typeSpeed: 50,
  deleteStrings: true, // Auto-delete after typing
  deleteDelay: 1000, // Wait 1s before deleting
  loop: true, // Infinite loop
});

controller.start();
```

### 3. Infinite Loop

```typescript
const controller = createTyped('#terminal', {
  strings: ['Looping...', 'Forever...', 'And ever...'],
  typeSpeed: 50,
  loop: true,
  onLoop: (index) => console.log(`Loop iteration: ${index}`),
});

controller.start();
```

### 4. Human-Like Typing

```typescript
const controller = createTyped('#terminal', {
  strings: ['This looks human...', 'With natural pauses...'],
  typeSpeed: 50,
  humanTypeDelay: { min: 30, max: 100 }, // Random delays
  stringPauseDelay: 800, // Pause between strings
  pauseOnPunctuation: true, // Extra pause on punctuation
  typeSpeedVariance: 20, // ±20% speed variation
});

controller.start();
```

### 5. Speed Variation

```typescript
const controller = createTyped('#terminal', {
  strings: ['Variable speed...', 'Different pace...'],
  typeSpeed: 60,
  typeSpeedVariance: 25, // ±25% speed variation
  speedProfile: 'easeOut', // Start fast, slow down
});

controller.start();
```

### 6. Random String Order

```typescript
const controller = createTyped('#terminal', {
  strings: ['First', 'Second', 'Third', 'Fourth'],
  typeSpeed: 50,
  shuffle: true,
  onShuffle: (original, shuffled) => {
    console.log('Original:', original);
    console.log('Shuffled:', shuffled);
  },
});

controller.start();
```

### 7. Enhanced Cursor

```typescript
const controller = createTyped('#terminal', {
  strings: ['Enhanced cursor...'],
  typeSpeed: 50,
  cursor: {
    enabled: true,
    char: '█',
    blink: true,
    blinkSpeed: 300, // Fast blink
    blinkCount: 10, // Blink 10 times then stop
    hideWhenComplete: true, // Hide when done
    style: {
      // Custom styling
      color: '#00ff88',
      fontWeight: 'bold',
      fontSize: '18px',
    },
  },
});

controller.start();
```

---

## Expert Techniques

### 1. Dynamic Speed Control

```typescript
const controller = createTyped('#terminal', {
  strings: ['Speed control demo'],
  typeSpeed: 50,
});

controller.start();

// Speed up after 2 seconds
setTimeout(() => {
  controller.setSpeed(20); // Very fast
}, 2000);

// Slow down after 4 seconds
setTimeout(() => {
  controller.setSpeed(100); // Slow
}, 4000);

// Get current speed
const currentSpeed = controller.getTypeSpeed();
console.log(`Current speed: ${currentSpeed}ms`);
```

### 2. Dynamic Cursor Control

```typescript
const controller = createTyped('#terminal', {
  strings: ['Cursor control demo'],
  typeSpeed: 50,
  cursor: {
    enabled: true,
    char: '▌',
    blink: true,
    blinkSpeed: 500,
  },
});

controller.start();

// Change blink speed dynamically
setTimeout(() => {
  controller.setCursorBlinkSpeed(100); // Very fast blink
}, 2000);

// Get current blink speed
const blinkSpeed = controller.getCursorBlinkSpeed();
console.log(`Current blink speed: ${blinkSpeed}ms`);
```

### 3. Pause/Resume with State

```typescript
const controller = createTyped('#terminal', {
  strings: ['Pause and resume...'],
  typeSpeed: 50,
  onPause: (index, charIndex) => {
    console.log(`Paused at string ${index}, position ${charIndex}`);
  },
  onResume: (index, charIndex) => {
    console.log(`Resumed at string ${index}, position ${charIndex}`);
  },
});

controller.start();

// Pause after 1 second
setTimeout(() => controller.pause(), 1000);

// Resume after 2 seconds
setTimeout(() => controller.resume(), 2000);
```

### 4. Skip and Jump

```typescript
const controller = createTyped('#terminal', {
  strings: ['First', 'Second', 'Third', 'Fourth'],
  typeSpeed: 50,
});

controller.start();

// Skip to next string after 1 second
setTimeout(() => controller.skip(), 1000);

// Jump to specific string after 2 seconds
setTimeout(() => controller.goTo(3), 2000); // Jump to "Fourth"
```

### 5. Complex Animation Chain

```typescript
const controller = createTyped('#terminal', {
  strings: ['Starting...', 'Building animation...', 'Adding effects...', 'Complete!'],
  typeSpeed: 40,
  typeSpeedVariance: 15,
  humanTypeDelay: { min: 20, max: 60 },
  stringPauseDelay: 600,
  pauseOnPunctuation: true,
  cursor: {
    enabled: true,
    char: '▌',
    blink: true,
    blinkSpeed: 250,
    blinkCount: 5,
    hideWhenComplete: true,
    style: { color: '#00ff88' },
  },
  onBegin: () => console.log('🚀 Animation started'),
  onStringStart: (index, text) => console.log(`📝 String ${index}: "${text}"`),
  onStringEnd: (index, text) => console.log(`✅ String ${index} complete`),
  onComplete: () => console.log('🎉 All complete!'),
});

controller.start();
```

### 6. Terminal Emulator

```typescript
// Create a terminal-like experience
const terminal = createTyped('#terminal', {
  strings: [
    '$ ls -la',
    'total 24',
    'drwxr-xr-x  4 user  staff   128 Jan 26 15:30 .',
    'drwxr-xr-x 10 user  staff   320 Jan 26 15:29 ..',
    '-rw-r--r--  1 user  staff  1234 Jan 26 15:30 README.md',
    '$ echo "Hello World"',
    'Hello World',
    '$ ',
  ],
  typeSpeed: 30,
  cursor: {
    enabled: true,
    char: '█',
    blink: true,
    blinkSpeed: 400,
  },
  stringPauseDelay: 400,
  onBegin: () => {
    document.getElementById('terminal').style.fontFamily = 'monospace';
    document.getElementById('terminal').style.color = '#00ff00';
  },
});

terminal.start();
```

### 7. Chat Message Simulation

```typescript
const messages = [
  { user: 'Alice', text: 'Hey there!' },
  { user: 'Bob', text: 'Hi Alice, how are you?' },
  { user: 'Alice', text: "I'm good, thanks!" },
];

function typeMessage(elementId, message, delay = 0) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const controller = createTyped(elementId, {
        strings: [`${message.user}: ${message.text}`],
        typeSpeed: 50,
        cursor: {
          enabled: true,
          char: '▌',
          blink: true,
          blinkSpeed: 300,
        },
        onComplete: resolve,
      });
      controller.start();
    }, delay);
  });
}

// Type messages sequentially
async function chatSimulation() {
  await typeMessage('#msg1', messages[0], 0);
  await typeMessage('#msg2', messages[1], 1000);
  await typeMessage('#msg3', messages[2], 1000);
}

chatSimulation();
```

### 8. Code Typing Animation

```typescript
const code = `function hello() {
  console.log("Hello World!");
  return true;
}`;

const controller = createTyped('#code-editor', {
  strings: [code],
  typeSpeed: 20,
  cursor: {
    enabled: true,
    char: '█',
    blink: true,
    blinkSpeed: 200,
  },
  onBegin: () => {
    // Style as code editor
    const editor = document.getElementById('code-editor');
    editor.style.fontFamily = 'monospace';
    editor.style.background = '#1e1e1e';
    editor.style.color = '#d4d4d4';
    editor.style.padding = '20px';
    editor.style.borderRadius = '8px';
  },
});

controller.start();
```

---

## Real-World Examples

### 1. Terminal Emulator

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
      'Type commands to interact.',
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
    onBegin: () => {
      console.log('Terminal session started');
    },
  });

  terminal.start();
</script>
```

### 2. Typewriter Effect

```html
<div
  id="typewriter"
  style="font-family: 'Courier New', monospace; font-size: 24px; line-height: 1.6;"
></div>

<script type="module">
  import { createTyped } from 'nex-typed';

  const typewriter = createTyped('#typewriter', {
    strings: [
      'The quick brown fox jumps over the lazy dog.',
      'Typewriter effects create nostalgic feelings.',
      'Each character appears one by one...',
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
    },
  });

  typewriter.start();
</script>
```

### 3. Chat Interface

```html
<div id="chat-container" style="background: #f0f0f0; padding: 20px; border-radius: 8px;">
  <div id="msg1" style="margin: 10px 0;"></div>
  <div id="msg2" style="margin: 10px 0;"></div>
  <div id="msg3" style="margin: 10px 0;"></div>
</div>

<script type="module">
  import { createTyped } from 'nex-typed';

  const messages = [
    { user: 'Alice', text: 'Hey there! 👋' },
    { user: 'Bob', text: 'Hi Alice! How are you?' },
    { user: 'Alice', text: "I'm great, thanks for asking!" },
  ];

  async function typeChatMessage(elementId, message, delay = 0) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const controller = createTyped(elementId, {
          strings: [`${message.user}: ${message.text}`],
          typeSpeed: 50,
          cursor: {
            enabled: true,
            char: '▌',
            blink: true,
            blinkSpeed: 300,
          },
          onComplete: resolve,
        });
        controller.start();
      }, delay);
    });
  }

  async function chatSimulation() {
    await typeChatMessage('#msg1', messages[0], 0);
    await typeChatMessage('#msg2', messages[1], 1500);
    await typeChatMessage('#msg3', messages[2], 1500);
  }

  chatSimulation();
</script>
```

### 4. Loading/Progress Indicator

```html
<div
  id="loader"
  style="background: #2a2a2a; color: #00ff88; padding: 20px; border-radius: 8px; font-family: monospace;"
></div>

<script type="module">
  import { createTyped } from 'nex-typed';

  const loader = createTyped('#loader', {
    strings: ['Loading resources...', 'Processing data...', 'Almost there...', 'Complete! ✅'],
    typeSpeed: 60,
    typeSpeedVariance: 20,
    cursor: {
      enabled: true,
      char: '█',
      blink: true,
      blinkSpeed: 200,
      blinkCount: 3,
    },
    onBegin: () => {
      console.log('Loading started');
    },
    onComplete: () => {
      console.log('Loading complete');
      // Could trigger next action here
    },
  });

  loader.start();
</script>
```

### 5. Interactive Tutorial

```html
<div
  id="tutorial"
  style="background: #fff; padding: 20px; border: 2px solid #0066cc; border-radius: 8px;"
></div>

<script type="module">
  import { createTyped } from 'nex-typed';

  const tutorial = createTyped('#tutorial', {
    strings: [
      'Welcome to our interactive tutorial! 🎓',
      'We will guide you through the features.',
      "First, let's learn about basic typing...",
      'Each message appears character by character.',
      'You can control the speed and style.',
      "Ready to continue? Let's go! 🚀",
    ],
    typeSpeed: 40,
    humanTypeDelay: { min: 30, max: 80 },
    stringPauseDelay: 1000,
    pauseOnPunctuation: true,
    cursor: {
      enabled: true,
      char: '▌',
      blink: true,
      blinkSpeed: 400,
      style: { color: '#0066cc', fontWeight: 'bold' },
    },
    onStringEnd: (index) => {
      if (index === 2) {
        console.log('Tutorial: Basic typing lesson complete');
      }
    },
    onComplete: () => {
      console.log('Tutorial: All lessons complete');
    },
  });

  tutorial.start();
</script>
```

### 6. Dynamic Content Generator

```html
<div
  id="content"
  style="background: #f9f9f9; padding: 20px; border-radius: 8px; font-family: serif; line-height: 1.8;"
></div>

<script type="module">
  import { createTyped } from 'nex-typed';

  // Generate dynamic content
  function generateContent() {
    const topics = ['Technology', 'Innovation', 'Creativity', 'Future', 'Progress'];

    const templates = [
      `The future of {topic} is exciting.`,
      `{topic} is changing the world.`,
      `Innovation in {topic} brings new possibilities.`,
      `We are entering a new era of {topic}.`,
      `{topic} will shape our tomorrow.`,
    ];

    const content = templates.map((template) =>
      template.replace('{topic}', topics[Math.floor(Math.random() * topics.length)])
    );

    return content;
  }

  const content = createTyped('#content', {
    strings: generateContent(),
    typeSpeed: 50,
    typeSpeedVariance: 15,
    shuffle: true,
    speedProfile: 'easeOut',
    cursor: {
      enabled: true,
      char: '▌',
      blink: true,
      blinkSpeed: 300,
      hideWhenComplete: true,
    },
    onShuffle: (original, shuffled) => {
      console.log('Content order:', shuffled);
    },
  });

  content.start();
</script>
```

---

## Performance Tips

### 1. Memory Management

```typescript
// ✅ Good: Always destroy when done
const controller = createTyped('#target', options);
controller.start();

// When component unmounts or animation completes
controller.destroy();

// ❌ Bad: Not destroying leads to memory leaks
// (No cleanup, timers keep running)
```

### 2. Reuse Controllers

```typescript
// ✅ Good: Reuse same controller
let controller = null;

function startAnimation() {
  if (controller) {
    controller.destroy();
  }
  controller = createTyped('#target', options);
  controller.start();
}

// ❌ Bad: Creating new controllers repeatedly
function startAnimation() {
  const controller = createTyped('#target', options); // New instance each time
  controller.start();
}
```

### 3. Optimize String Count

```typescript
// ✅ Good: Reasonable number of strings
const controller = createTyped('#target', {
  strings: ['Short', 'Medium', 'Long'], // 3 strings
  typeSpeed: 50,
});

// ❌ Bad: Too many strings
const controller = createTyped('#target', {
  strings: Array(1000).fill('Very long string...'), // 1000 strings!
  typeSpeed: 50,
});
```

### 4. Appropriate Speeds

```typescript
// ✅ Good: Reasonable speeds
const controller = createTyped('#target', {
  strings: ['Hello'],
  typeSpeed: 30, // 30ms per character (33 chars/sec)
});

// ❌ Bad: Too fast (may cause visual glitches)
const controller = createTyped('#target', {
  strings: ['Hello'],
  typeSpeed: 5, // 5ms per character (200 chars/sec)
});
```

### 5. Callback Efficiency

```typescript
// ✅ Good: Lightweight callbacks
const controller = createTyped('#target', {
  strings: ['Hello'],
  onStringEnd: (index, text) => {
    console.log(`Completed: ${text}`); // Simple operation
  },
});

// ❌ Bad: Heavy operations in callbacks
const controller = createTyped('#target', {
  strings: ['Hello'],
  onStringEnd: (index, text) => {
    // Heavy DOM manipulation
    document.getElementById('target').innerHTML = text;
    // Expensive calculations
    for (let i = 0; i < 1000000; i++) {
      /* ... */
    }
  },
});
```

### 6. Use Appropriate Options

```typescript
// ✅ Good: Use only needed options
const controller = createTyped('#target', {
  strings: ['Hello'],
  typeSpeed: 50,
  cursor: { enabled: true },
});

// ❌ Bad: Unnecessary options
const controller = createTyped('#target', {
  strings: ['Hello'],
  typeSpeed: 50,
  backspaceSpeed: 30, // Not needed
  deleteStrings: true, // Not needed
  deleteDelay: 1000, // Not needed
  loop: true, // Not needed
  humanTypeDelay: { min: 30, max: 100 }, // Not needed
  // ... many more unnecessary options
});
```

---

## Common Patterns

### 1. Sequential Animations

```typescript
async function sequentialAnimations() {
  await new Promise<void>((resolve) => {
    const controller1 = createTyped('#msg1', {
      strings: ['First message'],
      typeSpeed: 50,
      onComplete: resolve,
    });
    controller1.start();
  });

  await new Promise<void>((resolve) => {
    const controller2 = createTyped('#msg2', {
      strings: ['Second message'],
      typeSpeed: 50,
      onComplete: resolve,
    });
    controller2.start();
  });
}
```

### 2. Parallel Animations

```typescript
// Start multiple animations simultaneously
const controller1 = createTyped('#msg1', {
  strings: ['Message 1'],
  typeSpeed: 50,
});

const controller2 = createTyped('#msg2', {
  strings: ['Message 2'],
  typeSpeed: 50,
});

controller1.start();
controller2.start();
```

### 3. Conditional Animation

```typescript
function startConditionalAnimation(condition) {
  const strings = condition
    ? ['Condition is true', 'Showing positive message']
    : ['Condition is false', 'Showing negative message'];

  const controller = createTyped('#target', {
    strings: strings,
    typeSpeed: 50,
  });

  controller.start();
}
```

### 4. Responsive Animation

```typescript
function getResponsiveSpeed() {
  const width = window.innerWidth;
  if (width < 768) return 80; // Slower on mobile
  if (width < 1024) return 60; // Medium on tablet
  return 40; // Fast on desktop
}

const controller = createTyped('#target', {
  strings: ['Responsive speed'],
  typeSpeed: getResponsiveSpeed(),
});
```

### 5. Theme-Based Animation

```typescript
function getThemeConfig(theme) {
  const configs = {
    dark: {
      cursor: { char: '█', style: { color: '#00ff88' } },
      typeSpeed: 40,
    },
    light: {
      cursor: { char: '|', style: { color: '#0066cc' } },
      typeSpeed: 60,
    },
    terminal: {
      cursor: { char: '▌', style: { color: '#0f0' } },
      typeSpeed: 30,
    },
  };

  return configs[theme] || configs.dark;
}

const theme = 'dark';
const config = getThemeConfig(theme);

const controller = createTyped('#target', {
  strings: ['Theme-based animation'],
  ...config,
});
```

---

## Troubleshooting

### Issue: Animation doesn't start

**Solution:**

```typescript
// Check if element exists
const element = document.querySelector('#target');
if (!element) {
  console.error('Element not found');
  return;
}

// Check if controller is created
const controller = createTyped('#target', options);
if (!controller) {
  console.error('Controller creation failed');
  return;
}

// Start the animation
controller.start();
```

### Issue: Cursor not visible

**Solution:**

```typescript
const controller = createTyped('#target', {
  strings: ['Test'],
  cursor: {
    enabled: true, // Make sure this is true
    char: '|', // Make sure char is visible
    blink: true, // Make sure blink is enabled
  },
});
```

### Issue: Memory leaks

**Solution:**

```typescript
// Always destroy when done
const controller = createTyped('#target', options);
controller.start();

// In cleanup function
function cleanup() {
  if (controller) {
    controller.destroy();
    controller = null;
  }
}
```

### Issue: Performance issues

**Solution:**

```typescript
// Reduce string count
const controller = createTyped('#target', {
  strings: ['Short', 'List'], // Fewer strings
  typeSpeed: 50,
});

// Increase typeSpeed (slower animation)
const controller = createTyped('#target', {
  strings: ['Many', 'Strings', 'Here'],
  typeSpeed: 100, // Slower = less CPU usage
});
```

---

## Next Steps

- **[API Reference](./API.md)** - Complete API documentation
- **[Examples](./EXAMPLES.md)** - More real-world examples
- **[GitHub Issues](https://github.com/kevinzhao2233/nex-typed/issues)** - Get help or report issues

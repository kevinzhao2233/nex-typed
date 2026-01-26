# Examples

Real-world examples and use cases for nex-typed.

## 📚 Table of Contents

- [Terminal Emulator](#terminal-emulator)
- [Typewriter Effect](#typewriter-effect)
- [Chat Interface](#chat-interface)
- [Code Editor](#code-editor)
- [Loading Indicators](#loading-indicators)
- [Interactive Tutorial](#interactive-tutorial)
- [Dynamic Content](#dynamic-content)
- [Game Dialog](#game-dialog)
- [Email Composer](#email-composer)
- [Social Media Feed](#social-media-feed)

---

## Terminal Emulator

A full-featured terminal simulation with command history.

```html
<div
  id="terminal"
  style="background: #000; color: #0f0; font-family: monospace; padding: 20px; border-radius: 8px; min-height: 300px;"
></div>

<script type="module">
  import { createTyped } from 'nex-typed';

  const commands = [
    '$ whoami',
    'guest',
    '$ ls -la',
    'total 24',
    'drwxr-xr-x  4 guest  staff   128 Jan 26 15:30 .',
    'drwxr-xr-x 10 guest  staff   320 Jan 26 15:29 ..',
    '-rw-r--r--  1 guest  staff  1234 Jan 26 15:30 README.md',
    '-rwxr-xr-x  1 guest  staff  2048 Jan 26 15:30 script.sh',
    '$ ./script.sh',
    'Running script...',
    'Processing files...',
    'Complete!',
    '$ ',
  ];

  const terminal = createTyped('#terminal', {
    strings: commands,
    typeSpeed: 30,
    cursor: {
      enabled: true,
      char: '█',
      blink: true,
      blinkSpeed: 400,
    },
    stringPauseDelay: 300,
    pauseOnPunctuation: true,
    onBegin: () => {
      console.log('Terminal session started');
    },
    onStringStart: (index, text) => {
      if (text.startsWith('$')) {
        console.log(`Command: ${text}`);
      }
    },
    onComplete: () => {
      console.log('Terminal session ended');
    },
  });

  terminal.start();
</script>
```

**Features:**

- ✅ Command line simulation
- ✅ File listing output
- ✅ Command execution feedback
- ✅ Realistic terminal cursor
- ✅ Punctuation pauses

---

## Typewriter Effect

Classic typewriter style with paper-like appearance.

```html
<div
  id="typewriter"
  style="background: #f4f1e8; padding: 40px; border-radius: 4px; font-family: 'Courier New', monospace; font-size: 18px; line-height: 1.8; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"
></div>

<script type="module">
  import { createTyped } from 'nex-typed';

  const content = [
    'Dear Reader,',
    '',
    'This is a classic typewriter effect.',
    'Each character appears one by one,',
    'creating a nostalgic feeling.',
    '',
    'The paper is yellowed with age,',
    'and the ink slightly faded.',
    '',
    'Sincerely,',
    'The Author',
  ];

  const typewriter = createTyped('#typewriter', {
    strings: content,
    typeSpeed: 80,
    humanTypeDelay: { min: 60, max: 120 },
    stringPauseDelay: 1000,
    pauseOnPunctuation: true,
    typeSpeedVariance: 15,
    cursor: {
      enabled: true,
      char: '|',
      blink: true,
      blinkSpeed: 600,
      style: { color: '#8b4513' }, // Brown ink color
    },
    onBegin: () => {
      const element = document.getElementById('typewriter');
      element.style.fontFamily = "'Courier New', monospace";
      element.style.letterSpacing = '0.5px';
    },
  });

  typewriter.start();
</script>
```

**Features:**

- ✅ Classic typewriter speed
- ✅ Human-like typing delays
- ✅ Punctuation pauses
- ✅ Vintage paper styling
- ✅ Brown ink cursor

---

## Chat Interface

Simulate a chat conversation with multiple participants.

```html
<div
  id="chat-container"
  style="background: #f0f0f0; padding: 20px; border-radius: 8px; max-width: 500px;"
>
  <div
    id="msg1"
    style="margin: 10px 0; padding: 10px; background: white; border-radius: 12px; max-width: 80%;"
  ></div>
  <div
    id="msg2"
    style="margin: 10px 0; padding: 10px; background: #e3f2fd; border-radius: 12px; max-width: 80%; margin-left: auto;"
  ></div>
  <div
    id="msg3"
    style="margin: 10px 0; padding: 10px; background: white; border-radius: 12px; max-width: 80%;"
  ></div>
  <div
    id="msg4"
    style="margin: 10px 0; padding: 10px; background: #e3f2fd; border-radius: 12px; max-width: 80%; margin-left: auto;"
  ></div>
</div>

<script type="module">
  import { createTyped } from 'nex-typed';

  const messages = [
    { user: 'Alice', text: 'Hey Bob! 👋', align: 'left' },
    { user: 'Bob', text: 'Hi Alice! How are you?', align: 'right' },
    { user: 'Alice', text: "I'm great, thanks! Working on a new project.", align: 'left' },
    { user: 'Bob', text: 'That sounds exciting! What kind of project?', align: 'right' },
  ];

  async function typeMessage(elementId, message, delay = 0) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const controller = createTyped(elementId, {
          strings: [`${message.user}: ${message.text}`],
          typeSpeed: 50,
          humanTypeDelay: { min: 30, max: 80 },
          cursor: {
            enabled: true,
            char: '▌',
            blink: true,
            blinkSpeed: 300,
            hideWhenComplete: true,
          },
          onComplete: resolve,
        });
        controller.start();
      }, delay);
    });
  }

  async function chatSimulation() {
    await typeMessage('#msg1', messages[0], 0);
    await typeMessage('#msg2', messages[1], 1500);
    await typeMessage('#msg3', messages[2], 1500);
    await typeMessage('#msg4', messages[3], 1500);
  }

  chatSimulation();
</script>
```

**Features:**

- ✅ Multiple participants
- ✅ Sequential message delivery
- ✅ Different styling per user
- ✅ Human-like typing
- ✅ Auto-hide cursor

---

## Code Editor

Animated code typing with syntax highlighting simulation.

```html
<div
  id="code-editor"
  style="background: #1e1e1e; color: #d4d4d4; font-family: 'Fira Code', monospace; padding: 20px; border-radius: 8px; font-size: 14px; line-height: 1.5;"
></div>

<script type="module">
  import { createTyped } from 'nex-typed';

  const code = `function fibonacci(n) {
  if (n <= 1) return n;

  let prev = 0;
  let curr = 1;

  for (let i = 2; i <= n; i++) {
    let next = prev + curr;
    prev = curr;
    curr = next;
  }

  return curr;
}

// Example usage
console.log(fibonacci(10)); // 55`;

  const editor = createTyped('#code-editor', {
    strings: [code],
    typeSpeed: 20,
    cursor: {
      enabled: true,
      char: '█',
      blink: true,
      blinkSpeed: 200,
      hideWhenComplete: true,
      style: { color: '#00ff88' },
    },
    onBegin: () => {
      console.log('Code typing started');
    },
    onComplete: () => {
      console.log('Code typing complete');
    },
  });

  editor.start();
</script>
```

**Features:**

- ✅ Code-like typing speed
- ✅ Dark theme editor
- ✅ Monospace font
- ✅ Fast cursor blink
- ✅ Hide cursor when done

---

## Loading Indicators

Creative loading animations with text.

```html
<div
  id="loader"
  style="background: #2a2a2a; color: #00ff88; padding: 30px; border-radius: 8px; font-family: monospace; text-align: center;"
></div>

<script type="module">
  import { createTyped } from 'nex-typed';

  const loadingPhases = [
    'Initializing...',
    'Loading resources...',
    'Processing data...',
    'Almost there...',
    'Finalizing...',
    'Complete! ✅',
  ];

  const loader = createTyped('#loader', {
    strings: loadingPhases,
    typeSpeed: 60,
    typeSpeedVariance: 25,
    humanTypeDelay: { min: 40, max: 100 },
    stringPauseDelay: 800,
    cursor: {
      enabled: true,
      char: '█',
      blink: true,
      blinkSpeed: 250,
      blinkCount: 5, // Blink 5 times then stop
      hideWhenComplete: true,
      style: { color: '#00ff88', fontWeight: 'bold' },
    },
    onBegin: () => {
      console.log('Loading started');
    },
    onStringStart: (index) => {
      console.log(`Loading phase ${index + 1}`);
    },
    onComplete: () => {
      console.log('Loading complete');
      // Could trigger next action here
    },
  });

  loader.start();
</script>
```

**Features:**

- ✅ Multiple loading phases
- ✅ Speed variation for realism
- ✅ Limited blink count
- ✅ Hide cursor when done
- ✅ Progress callbacks

---

## Interactive Tutorial

Step-by-step tutorial with interactive elements.

```html
<div
  id="tutorial"
  style="background: #fff; padding: 25px; border: 2px solid #0066cc; border-radius: 8px; font-family: system-ui; line-height: 1.6;"
></div>

<script type="module">
  import { createTyped } from 'nex-typed';

  const tutorialSteps = [
    '🎓 Welcome to our interactive tutorial!',
    'We will guide you through the features.',
    "First, let's learn about basic typing...",
    'Each message appears character by character.',
    'You can control the speed and style.',
    "Ready to continue? Let's go! 🚀",
  ];

  const tutorial = createTyped('#tutorial', {
    strings: tutorialSteps,
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
      if (index === 4) {
        console.log('Tutorial: Speed control lesson complete');
      }
    },
    onComplete: () => {
      console.log('Tutorial: All lessons complete');
      // Could show completion message or next steps
    },
  });

  tutorial.start();
</script>
```

**Features:**

- ✅ Educational content
- ✅ Step-by-step progression
- ✅ Callbacks for lesson completion
- ✅ Professional styling
- ✅ Emoji support

---

## Dynamic Content

Generate and type dynamic content based on data.

```html
<div
  id="dynamic-content"
  style="background: #f9f9f9; padding: 20px; border-radius: 8px; font-family: serif; line-height: 1.8; max-width: 600px;"
></div>

<script type="module">
  import { createTyped } from 'nex-typed';

  // Dynamic content generator
  function generateContent() {
    const topics = [
      'Technology',
      'Innovation',
      'Creativity',
      'Future',
      'Progress',
      'Development',
      'Design',
      'Engineering',
    ];

    const templates = [
      `The future of {topic} is exciting.`,
      `{topic} is changing the world.`,
      `Innovation in {topic} brings new possibilities.`,
      `We are entering a new era of {topic}.`,
      `{topic} will shape our tomorrow.`,
      `Advances in {topic} are remarkable.`,
      `{topic} represents endless potential.`,
      `The {topic} revolution is here.`,
    ];

    // Generate 5 random pieces of content
    const content = [];
    for (let i = 0; i < 5; i++) {
      const template = templates[Math.floor(Math.random() * templates.length)];
      const topic = topics[Math.floor(Math.random() * topics.length)];
      content.push(template.replace('{topic}', topic));
    }

    return content;
  }

  const dynamicContent = createTyped('#dynamic-content', {
    strings: generateContent(),
    typeSpeed: 50,
    typeSpeedVariance: 15,
    shuffle: true,
    speedProfile: 'easeOut',
    stringPauseDelay: 800,
    cursor: {
      enabled: true,
      char: '▌',
      blink: true,
      blinkSpeed: 300,
      hideWhenComplete: true,
      style: { color: '#666' },
    },
    onShuffle: (original, shuffled) => {
      console.log('Content order:', shuffled);
    },
    onComplete: () => {
      console.log('Dynamic content complete');
    },
  });

  dynamicContent.start();
</script>
```

**Features:**

- ✅ Dynamic content generation
- ✅ Random content selection
- ✅ Shuffle order
- ✅ Speed variation
- ✅ Ease-out curve

---

## Game Dialog

RPG-style dialog with character speaking.

```html
<div
  id="game-dialog"
  style="background: #2a2a2a; color: #fff; padding: 20px; border-radius: 8px; font-family: 'Press Start 2P', monospace; font-size: 12px; line-height: 1.8; border: 3px solid #444;"
></div>

<script type="module">
  import { createTyped } from 'nex-typed';

  const dialog = [
    'HERO: I have found the ancient sword!',
    'VILLAIN: You will never defeat me!',
    'HERO: This is not the end...',
    'VILLAIN: Mwahahaha! You are too late!',
    'HERO: I will save the kingdom!',
  ];

  const gameDialog = createTyped('#game-dialog', {
    strings: dialog,
    typeSpeed: 30,
    humanTypeDelay: { min: 20, max: 60 },
    stringPauseDelay: 1200,
    pauseOnPunctuation: true,
    typeSpeedVariance: 20,
    cursor: {
      enabled: true,
      char: '█',
      blink: true,
      blinkSpeed: 300,
      blinkCount: 3,
      hideWhenComplete: true,
      style: { color: '#ffff00', fontWeight: 'bold' },
    },
    onBegin: () => {
      console.log('🎮 Game dialog started');
    },
    onStringStart: (index, text) => {
      const character = text.split(':')[0];
      console.log(`👤 ${character} is speaking...`);
    },
    onComplete: () => {
      console.log('🎮 Game dialog complete');
    },
  });

  gameDialog.start();
</script>
```

**Features:**

- ✅ RPG-style dialog
- ✅ Character identification
- ✅ Fast typing speed
- ✅ Yellow cursor
- ✅ Limited blink count

---

## Email Composer

Simulate typing an email with proper formatting.

```html
<div
  id="email-composer"
  style="background: #fff; padding: 25px; border-radius: 8px; font-family: system-ui; line-height: 1.6; border: 1px solid #ddd; max-width: 700px;"
></div>

<script type="module">
  import { createTyped } from 'nex-typed';

  const emailContent = [
    'Subject: Project Update - Q1 2024',
    '',
    'Dear Team,',
    '',
    'I hope this email finds you well.',
    '',
    'I wanted to provide an update on our Q1 project progress.',
    'We have successfully completed the initial development phase.',
    'All major features are now implemented and tested.',
    '',
    'Next steps:',
    '- Code review and optimization',
    '- Performance testing',
    '- Documentation updates',
    '- Deployment preparation',
    '',
    'Please review the attached documents and provide your feedback.',
    '',
    'Best regards,',
    'Project Manager',
  ];

  const email = createTyped('#email-composer', {
    strings: emailContent,
    typeSpeed: 40,
    humanTypeDelay: { min: 25, max: 70 },
    stringPauseDelay: 600,
    pauseOnPunctuation: true,
    typeSpeedVariance: 10,
    cursor: {
      enabled: true,
      char: '▌',
      blink: true,
      blinkSpeed: 400,
      hideWhenComplete: true,
      style: { color: '#333' },
    },
    onBegin: () => {
      console.log('📧 Email composition started');
    },
    onStringStart: (index, text) => {
      if (text.startsWith('Subject:')) {
        console.log('📝 Writing subject line...');
      } else if (text.startsWith('Dear')) {
        console.log('👋 Writing greeting...');
      }
    },
    onComplete: () => {
      console.log('📧 Email composition complete');
    },
  });

  email.start();
</script>
```

**Features:**

- ✅ Professional email format
- ✅ Proper line breaks
- ✅ Subject line emphasis
- ✅ Structured content
- ✅ Business-appropriate styling

---

## Social Media Feed

Simulate typing social media posts.

```html
<div
  id="social-feed"
  style="background: #f0f2f5; padding: 20px; border-radius: 8px; font-family: system-ui;"
></div>

<script type="module">
  import { createTyped } from 'nex-typed';

  const posts = [
    'Just finished an amazing project! 🎉 #coding #typescript',
    'Learning new things every day. The journey never ends! 📚',
    'Beautiful sunset today. Nature never ceases to amaze. 🌅',
    'Coffee + code = perfect morning routine ☕️💻',
    "Excited to share what I've been working on! Stay tuned... 🚀",
  ];

  async function typePost(elementId, post, delay = 0) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const controller = createTyped(elementId, {
          strings: [post],
          typeSpeed: 50,
          humanTypeDelay: { min: 30, max: 80 },
          cursor: {
            enabled: true,
            char: '▌',
            blink: true,
            blinkSpeed: 300,
            hideWhenComplete: true,
          },
          onComplete: resolve,
        });
        controller.start();
      }, delay);
    });
  }

  async function feedSimulation() {
    for (let i = 0; i < posts.length; i++) {
      const postId = `post-${i}`;
      const postDiv = document.createElement('div');
      postDiv.id = postId;
      postDiv.style.cssText =
        'background: white; padding: 15px; border-radius: 8px; margin: 10px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1);';
      document.getElementById('social-feed').appendChild(postDiv);

      await typePost(postId, posts[i], 1000);
    }
  }

  feedSimulation();
</script>
```

**Features:**

- ✅ Social media style posts
- ✅ Hashtag support
- ✅ Emoji support
- ✅ Card-based layout
- ✅ Sequential posting

---

## Advanced: Multi-Controller Coordination

Coordinate multiple typing animations.

```html
<div
  id="header"
  style="background: #0066cc; color: white; padding: 20px; border-radius: 8px 8px 0 0; font-family: system-ui;"
></div>
<div
  id="content"
  style="background: white; padding: 20px; border-radius: 0 0 8px 8px; font-family: system-ui;"
></div>

<script type="module">
  import { createTyped } from 'nex-typed';

  // Header animation
  const header = createTyped('#header', {
    strings: ['Welcome to Our Platform'],
    typeSpeed: 40,
    cursor: {
      enabled: true,
      char: '▌',
      blink: true,
      blinkSpeed: 400,
      hideWhenComplete: true,
      style: { color: '#fff' },
    },
  });

  // Content animation (starts after header)
  const content = createTyped('#content', {
    strings: [
      'We provide innovative solutions for modern web development.',
      'Built with TypeScript for maximum reliability.',
      'Zero dependencies for optimal performance.',
      'Ready to transform your user experience.',
    ],
    typeSpeed: 50,
    typeSpeedVariance: 15,
    stringPauseDelay: 600,
    cursor: {
      enabled: true,
      char: '▌',
      blink: true,
      blinkSpeed: 300,
      hideWhenComplete: true,
    },
  });

  // Coordinate animations
  async function runSequence() {
    // Start header
    header.start();

    // Wait for header to complete
    await new Promise((resolve) => {
      header.onComplete = resolve;
    });

    // Start content
    content.start();
  }

  runSequence();
</script>
```

**Features:**

- ✅ Multiple controllers
- ✅ Sequential execution
- ✅ Coordinated animations
- ✅ Different styling per section
- ✅ Promise-based coordination

---

## Advanced: Conditional Animation

Show different content based on user interaction.

```html
<div
  id="conditional"
  style="background: #f0f0f0; padding: 20px; border-radius: 8px; font-family: system-ui;"
></div>

<script type="module">
  import { createTyped } from 'nex-typed';

  // Content based on user choice
  const contentSets = {
    beginner: [
      'Welcome to the beginner track! 🌱',
      'We will start with the basics.',
      'Take your time and learn step by step.',
      "You're doing great!",
    ],
    intermediate: [
      'Welcome to the intermediate track! 🚀',
      'Ready to level up your skills?',
      'We will cover advanced topics.',
      "Let's push your limits!",
    ],
    expert: [
      'Welcome to the expert track! 🎯',
      "You're ready for the big leagues.",
      'We will dive deep into complex topics.',
      'Challenge accepted?',
    ],
  };

  function startAnimation(level) {
    const element = document.getElementById('conditional');
    element.innerHTML = ''; // Clear previous content

    const controller = createTyped(element, {
      strings: contentSets[level] || contentSets.beginner,
      typeSpeed: 50,
      typeSpeedVariance: 10,
      cursor: {
        enabled: true,
        char: '▌',
        blink: true,
        blinkSpeed: 300,
        hideWhenComplete: true,
      },
    });

    controller.start();
  }

  // Simulate user choice (in real app, this would be from UI)
  setTimeout(() => startAnimation('intermediate'), 1000);
</script>
```

**Features:**

- ✅ Dynamic content selection
- ✅ Conditional animation
- ✅ Content clearing
- ✅ Level-based messaging
- ✅ Flexible architecture

---

## Advanced: Typing with Sound Effects

Add audio feedback to typing (requires audio files).

```html
<div
  id="sound-typing"
  style="background: #2a2a2a; color: #00ff88; padding: 20px; border-radius: 8px; font-family: monospace;"
></div>

<script type="module">
  import { createTyped } from 'nex-typed';

  // Audio setup (you would need actual audio files)
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  function playTypingSound() {
    // Create a simple beep sound
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  }

  const controller = createTyped('#sound-typing', {
    strings: ['Typing with sound effects...'],
    typeSpeed: 50,
    cursor: {
      enabled: true,
      char: '▌',
      blink: true,
      blinkSpeed: 300,
    },
    onStringStart: () => {
      // Play sound when starting to type
      playTypingSound();
    },
  });

  controller.start();
</script>
```

**Features:**

- ✅ Audio feedback
- ✅ Web Audio API
- ✅ Custom sound generation
- ✅ Event-driven audio
- ✅ Extensible architecture

---

## Performance Comparison

### Example: 1000 Character String

```typescript
// nex-typed: Efficient handling
const controller = createTyped('#target', {
  strings: ['A'.repeat(1000)], // 1000 characters
  typeSpeed: 10, // Fast typing
  cursor: {
    enabled: true,
    char: '▌',
    blink: true,
    blinkSpeed: 200,
  },
});

// Performance characteristics:
// - Memory efficient (no jQuery overhead)
// - Smooth rendering (optimized DOM updates)
// - No frame drops (proper timer management)
// - ~5KB bundle size
```

### Comparison with typed.js

```typescript
// typed.js: Larger bundle, jQuery dependency
// nex-typed: Smaller bundle, no dependencies

// Bundle size comparison:
// typed.js: ~20KB + jQuery (~85KB) = ~105KB
// nex-typed: ~5KB = ~5KB

// Memory usage:
// typed.js: Higher (jQuery overhead)
// nex-typed: Lower (vanilla JS)

// Performance:
// typed.js: Good (but limited features)
// nex-typed: Excellent (more features, better optimization)
```

---

## Best Practices

### 1. Memory Management

```typescript
// ✅ Good: Always destroy when done
const controller = createTyped('#target', options);
controller.start();

// When component unmounts or animation completes
controller.destroy();

// ❌ Bad: Not destroying leads to memory leaks
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
```

### 3. Optimize for Performance

```typescript
// ✅ Good: Reasonable string count
const controller = createTyped('#target', {
  strings: ['Short', 'Medium', 'Long'],
  typeSpeed: 50,
});

// ❌ Bad: Too many strings
const controller = createTyped('#target', {
  strings: Array(1000).fill('Very long string...'),
  typeSpeed: 50,
});
```

### 4. Use Appropriate Speeds

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

### 5. Keep Callbacks Lightweight

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

---

## Next Steps

- **[API Reference](./API.md)** - Complete API documentation
- **[Usage Guide](./USAGE.md)** - Practical usage examples
- **[Migration Guide](./MIGRATION.md)** - Migrating from typed.js
- **[GitHub Issues](https://github.com/kevinzhao2233/nex-typed/issues)** - Get help or report issues

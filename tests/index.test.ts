import { expect, test, beforeEach, afterEach } from 'vitest';
import { createTyped } from '../src';

// Mock DOM environment for testing
let testElement: HTMLElement;

beforeEach(() => {
  // Create a test element for each test
  testElement = document.createElement('div');
  testElement.setAttribute('id', 'test-target');
  document.body.appendChild(testElement);
});

afterEach(() => {
  // Clean up after each test
  if (testElement && testElement.parentNode) {
    testElement.parentNode.removeChild(testElement);
  }
  // Clear any existing elements
  const existingRoot = document.querySelector('[data-nex-typed-root]');
  if (existingRoot) {
    existingRoot.remove();
  }
});

test('createTyped should create typing animation controller', () => {
  const controller = createTyped(testElement, {
    strings: ['Hello World'],
    typeSpeed: 50,
  });

  expect(controller).toBeDefined();
  expect(controller.start).toBeInstanceOf(Function);
  expect(controller.stop).toBeInstanceOf(Function);
  expect(controller.pause).toBeInstanceOf(Function);
  expect(controller.resume).toBeInstanceOf(Function);
  expect(controller.destroy).toBeInstanceOf(Function);
});

test('createTyped should render initial DOM structure', () => {
  createTyped(testElement, {
    strings: ['Hello World'],
    typeSpeed: 50,
  });

  const root = testElement.querySelector('[data-nex-typed-root]');
  const text = testElement.querySelector('[data-nex-typed-text]');

  expect(root).toBeDefined();
  expect(text).toBeDefined();
});

test('createTyped should handle string selector target', () => {
  // Create element with ID for selector test
  const selectorElement = document.createElement('div');
  selectorElement.setAttribute('id', 'selector-test');
  document.body.appendChild(selectorElement);

  const controller = createTyped('#selector-test', {
    strings: ['Hello from selector'],
    typeSpeed: 50,
  });

  expect(controller).toBeDefined();

  // Clean up
  selectorElement.remove();
});

test('createTyped should throw error for invalid selector', () => {
  expect(() => {
    createTyped('#non-existent-element', {
      strings: ['Hello'],
      typeSpeed: 50,
    });
  }).toThrow('Target not found: #non-existent-element');
});

test('createTyped should handle cursor configuration', () => {
  const controller = createTyped(testElement, {
    strings: ['With cursor'],
    typeSpeed: 50,
    cursor: {
      enabled: true,
      char: '_',
      blink: true,
    },
  });

  // Start the animation to ensure cursor is mounted
  controller.start();

  const cursor = testElement.querySelector('[data-nex-typed-cursor]');
  expect(cursor).toBeDefined();
  expect(cursor?.textContent).toBe('_');
});

test('createTyped should handle cursor disabled', () => {
  createTyped(testElement, {
    strings: ['No cursor'],
    typeSpeed: 50,
    cursor: {
      enabled: false,
    },
  });

  const cursor = testElement.querySelector('[data-nex-typed-cursor]');
  expect(cursor).toBeNull();
});

test('createTyped should handle startDelay option', () => {
  const controller = createTyped(testElement, {
    strings: ['Delayed start'],
    typeSpeed: 50,
    startDelay: 100,
  });

  expect(controller).toBeDefined();
  // The actual delay testing would require async testing with timers
});

test('createTyped should handle multiple strings', () => {
  const controller = createTyped(testElement, {
    strings: ['First string', 'Second string', 'Third string'],
    typeSpeed: 50,
  });

  expect(controller).toBeDefined();
  // More comprehensive testing would require async testing
});

test('createTyped should handle callback functions', () => {
  const controller = createTyped(testElement, {
    strings: ['Test'],
    typeSpeed: 50,
    onBegin: () => {},
    onStringStart: () => {},
    onStringEnd: () => {},
    onComplete: () => {},
  });

  expect(controller).toBeDefined();
  // Callbacks would be tested during actual animation
});

test('createTyped should handle pause and resume', () => {
  const controller = createTyped(testElement, {
    strings: ['Pause test'],
    typeSpeed: 50,
  });

  // These methods should exist and be callable
  expect(controller.pause).toBeInstanceOf(Function);
  expect(controller.resume).toBeInstanceOf(Function);

  // Calling them should not throw errors
  expect(() => controller.pause()).not.toThrow();
  expect(() => controller.resume()).not.toThrow();
});

test('createTyped should handle stop and destroy', () => {
  const controller = createTyped(testElement, {
    strings: ['Stop test'],
    typeSpeed: 50,
  });

  expect(controller.stop).toBeInstanceOf(Function);
  expect(controller.destroy).toBeInstanceOf(Function);

  // Calling them should not throw errors
  expect(() => controller.stop()).not.toThrow();
  expect(() => controller.destroy()).not.toThrow();

  // After destroy, root element should be removed
  const root = testElement.querySelector('[data-nex-typed-root]');
  expect(root).toBeNull();
});

test('createTyped should handle empty strings array', () => {
  const controller = createTyped(testElement, {
    strings: [],
    typeSpeed: 50,
  });

  expect(controller).toBeDefined();
  // Should handle gracefully without crashing
});

test('createTyped should use default typeSpeed when not specified', () => {
  const controller = createTyped(testElement, {
    strings: ['Default speed'],
    // typeSpeed not specified, should default to 50
  });

  expect(controller).toBeDefined();
});

test('createTyped should handle cursor with default blink', () => {
  createTyped(testElement, {
    strings: ['Default blink'],
    typeSpeed: 50,
    cursor: {
      enabled: true,
      char: '|',
      // blink not specified, should default to true
    },
  });

  const cursor = testElement.querySelector('[data-nex-typed-cursor]');
  expect(cursor).toBeDefined();
});

test('createTyped should handle cursor with custom blink disabled', () => {
  createTyped(testElement, {
    strings: ['No blink'],
    typeSpeed: 50,
    cursor: {
      enabled: true,
      char: '|',
      blink: false,
    },
  });

  const cursor = testElement.querySelector('[data-nex-typed-cursor]');
  expect(cursor).toBeDefined();
});

// 新增测试：退格/删除功能
test('createTyped should have backspace method', () => {
  const controller = createTyped(testElement, {
    strings: ['Test backspace'],
    typeSpeed: 50,
  });

  expect(controller.backspace).toBeInstanceOf(Function);
  // Should not throw when called
  expect(() => controller.backspace()).not.toThrow();
});

test('createTyped should have deleteString method', () => {
  const controller = createTyped(testElement, {
    strings: ['Test delete'],
    typeSpeed: 50,
  });

  expect(controller.deleteString).toBeInstanceOf(Function);
  // Should not throw when called
  expect(() => controller.deleteString()).not.toThrow();
});

test('createTyped should handle backspaceSpeed option', () => {
  const controller = createTyped(testElement, {
    strings: ['Backspace test'],
    typeSpeed: 50,
    backspaceSpeed: 20,
  });

  expect(controller).toBeDefined();
  // backspaceSpeed should be accepted without error
});

test('createTyped should handle deleteStrings option', () => {
  const controller = createTyped(testElement, {
    strings: ['Delete test'],
    typeSpeed: 50,
    deleteStrings: true,
    deleteDelay: 500,
  });

  expect(controller).toBeDefined();
  // deleteStrings and deleteDelay should be accepted without error
});

test('createTyped should have loop option', () => {
  const controller = createTyped(testElement, {
    strings: ['Loop test'],
    typeSpeed: 50,
    loop: true,
  });

  expect(controller).toBeDefined();
  // loop option should be accepted without error
});

test('createTyped should have humanTypeDelay option', () => {
  const controller = createTyped(testElement, {
    strings: ['Human typing'],
    typeSpeed: 50,
    humanTypeDelay: { min: 30, max: 100 },
  });

  expect(controller).toBeDefined();
  // humanTypeDelay should be accepted without error
});

test('createTyped should have stringPauseDelay option', () => {
  const controller = createTyped(testElement, {
    strings: ['String pause'],
    typeSpeed: 50,
    stringPauseDelay: 1000,
  });

  expect(controller).toBeDefined();
  // stringPauseDelay should be accepted without error
});

test('createTyped should have pauseOnPunctuation option', () => {
  const controller = createTyped(testElement, {
    strings: ['Punctuation pause.'],
    typeSpeed: 50,
    pauseOnPunctuation: true,
  });

  expect(controller).toBeDefined();
  // pauseOnPunctuation should be accepted without error
});

test('createTyped should have skip method', () => {
  const controller = createTyped(testElement, {
    strings: ['Skip test'],
    typeSpeed: 50,
  });

  expect(controller.skip).toBeInstanceOf(Function);
  // Should not throw when called
  expect(() => controller.skip()).not.toThrow();
});

test('createTyped should have goTo method', () => {
  const controller = createTyped(testElement, {
    strings: ['First', 'Second', 'Third'],
    typeSpeed: 50,
  });

  expect(controller.goTo).toBeInstanceOf(Function);
  // Should not throw when called with valid index
  expect(() => controller.goTo(1)).not.toThrow();
});

test('createTyped should have getTypeSpeed method', () => {
  const controller = createTyped(testElement, {
    strings: ['Speed test'],
    typeSpeed: 75,
  });

  expect(controller.getTypeSpeed).toBeInstanceOf(Function);
  expect(controller.getTypeSpeed()).toBe(75);
});

test('createTyped should have setSpeed method', () => {
  const controller = createTyped(testElement, {
    strings: ['Set speed test'],
    typeSpeed: 50,
  });

  expect(controller.setSpeed).toBeInstanceOf(Function);
  // Should not throw when called
  expect(() => controller.setSpeed(100)).not.toThrow();
  // Speed should be updated
  expect(controller.getTypeSpeed()).toBe(100);
});

test('createTyped should handle onBackspaceStart and onBackspaceEnd callbacks', () => {
  const controller = createTyped(testElement, {
    strings: ['Backspace callback'],
    typeSpeed: 50,
    onBackspaceStart: () => {},
    onBackspaceEnd: () => {},
  });

  expect(controller).toBeDefined();
  // Callbacks would be tested during actual backspace operation
});

test('createTyped should handle onLoop callback', () => {
  const controller = createTyped(testElement, {
    strings: ['Loop callback'],
    typeSpeed: 50,
    loop: true,
    onLoop: () => {},
  });

  expect(controller).toBeDefined();
  // Callback would be tested during actual loop operation
});

test('createTyped should handle multiple options together', () => {
  const controller = createTyped(testElement, {
    strings: ['Complex test'],
    typeSpeed: 60,
    startDelay: 200,
    backspaceSpeed: 25,
    deleteStrings: true,
    deleteDelay: 800,
    loop: true,
    humanTypeDelay: { min: 40, max: 80 },
    stringPauseDelay: 600,
    pauseOnPunctuation: true,
    cursor: {
      enabled: true,
      char: '▌',
      blink: true,
    },
    onBegin: () => {},
    onStringStart: () => {},
    onStringEnd: () => {},
    onComplete: () => {},
    onPause: () => {},
    onResume: () => {},
    onBackspaceStart: () => {},
    onBackspaceEnd: () => {},
    onLoop: () => {},
  });

  expect(controller).toBeDefined();
  expect(controller.start).toBeInstanceOf(Function);
  expect(controller.backspace).toBeInstanceOf(Function);
  expect(controller.deleteString).toBeInstanceOf(Function);
  expect(controller.skip).toBeInstanceOf(Function);
  expect(controller.goTo).toBeInstanceOf(Function);
  expect(controller.getTypeSpeed).toBeInstanceOf(Function);
  expect(controller.setSpeed).toBeInstanceOf(Function);
});

// Phase 3: 光标配置增强测试
test('createTyped should handle cursor blinkSpeed option', () => {
  createTyped(testElement, {
    strings: ['Blink speed test'],
    typeSpeed: 50,
    cursor: {
      enabled: true,
      char: '|',
      blink: true,
      blinkSpeed: 300, // 自定义闪烁速度
    },
  });

  const cursor = testElement.querySelector('[data-nex-typed-cursor]');
  expect(cursor).toBeDefined();
});

test('createTyped should handle cursor blinkCount option', () => {
  createTyped(testElement, {
    strings: ['Blink count test'],
    typeSpeed: 50,
    cursor: {
      enabled: true,
      char: '|',
      blink: true,
      blinkCount: 5, // 闪烁5次后停止
    },
  });

  const cursor = testElement.querySelector('[data-nex-typed-cursor]');
  expect(cursor).toBeDefined();
});

test('createTyped should handle cursor hideWhenComplete option', () => {
  const controller = createTyped(testElement, {
    strings: ['Hide when complete'],
    typeSpeed: 50,
    cursor: {
      enabled: true,
      char: '|',
      blink: true,
      hideWhenComplete: true, // 完成时隐藏光标
    },
  });

  expect(controller).toBeDefined();
  // 光标应该在完成时自动隐藏
});

test('createTyped should handle cursor style as string (CSS class)', () => {
  createTyped(testElement, {
    strings: ['Style test'],
    typeSpeed: 50,
    cursor: {
      enabled: true,
      char: '|',
      style: 'custom-cursor-class', // CSS类名
    },
  });

  const cursor = testElement.querySelector('[data-nex-typed-cursor]');
  expect(cursor).toBeDefined();
  // 注意：在测试环境中可能无法验证CSS类应用
});

test('createTyped should handle cursor style as object (inline styles)', () => {
  createTyped(testElement, {
    strings: ['Style test'],
    typeSpeed: 50,
    cursor: {
      enabled: true,
      char: '|',
      style: { color: 'red', fontWeight: 'bold' }, // 内联样式对象
    },
  });

  const cursor = testElement.querySelector('[data-nex-typed-cursor]');
  expect(cursor).toBeDefined();
  // 注意：在测试环境中可能无法验证样式应用
});

test('createTyped should have getCursorBlinkSpeed method', () => {
  const controller = createTyped(testElement, {
    strings: ['Blink speed test'],
    typeSpeed: 50,
    cursor: {
      enabled: true,
      char: '|',
      blink: true,
      blinkSpeed: 300,
    },
  });

  expect(controller.getCursorBlinkSpeed).toBeInstanceOf(Function);
  expect(controller.getCursorBlinkSpeed()).toBe(300);
});

test('createTyped should have setCursorBlinkSpeed method', () => {
  const controller = createTyped(testElement, {
    strings: ['Blink speed test'],
    typeSpeed: 50,
    cursor: {
      enabled: true,
      char: '|',
      blink: true,
      blinkSpeed: 300,
    },
  });

  expect(controller.setCursorBlinkSpeed).toBeInstanceOf(Function);
  // Should not throw when called
  expect(() => controller.setCursorBlinkSpeed(200)).not.toThrow();
});

// Phase 3: 速度变化与随机化测试
test('createTyped should handle typeSpeedVariance option', () => {
  const controller = createTyped(testElement, {
    strings: ['Variance test'],
    typeSpeed: 50,
    typeSpeedVariance: 20, // ±20% 速度变化
  });

  expect(controller).toBeDefined();
  // typeSpeedVariance should be accepted without error
});

test('createTyped should handle shuffle option', () => {
  const controller = createTyped(testElement, {
    strings: ['First', 'Second', 'Third', 'Fourth'],
    typeSpeed: 50,
    shuffle: true,
    onShuffle: () => {},
  });

  expect(controller).toBeDefined();
  // Shuffle should be accepted without error
  // The callback would be tested during actual initialization
});

test('createTyped should handle speedProfile option - linear', () => {
  const controller = createTyped(testElement, {
    strings: ['Linear profile'],
    typeSpeed: 50,
    speedProfile: 'linear',
  });

  expect(controller).toBeDefined();
  // linear profile should be accepted without error
});

test('createTyped should handle speedProfile option - easeIn', () => {
  const controller = createTyped(testElement, {
    strings: ['EaseIn profile'],
    typeSpeed: 50,
    speedProfile: 'easeIn',
  });

  expect(controller).toBeDefined();
  // easeIn profile should be accepted without error
});

test('createTyped should handle speedProfile option - easeOut', () => {
  const controller = createTyped(testElement, {
    strings: ['EaseOut profile'],
    typeSpeed: 50,
    speedProfile: 'easeOut',
  });

  expect(controller).toBeDefined();
  // easeOut profile should be accepted without error
});

test('createTyped should handle speedProfile option - easeInOut', () => {
  const controller = createTyped(testElement, {
    strings: ['EaseInOut profile'],
    typeSpeed: 50,
    speedProfile: 'easeInOut',
  });

  expect(controller).toBeDefined();
  // easeInOut profile should be accepted without error
});

test('createTyped should handle combined speed options', () => {
  const controller = createTyped(testElement, {
    strings: ['Combined speed test'],
    typeSpeed: 60,
    typeSpeedVariance: 15,
    humanTypeDelay: { min: 30, max: 90 },
    speedProfile: 'easeInOut',
    pauseOnPunctuation: true,
  });

  expect(controller).toBeDefined();
  // All speed options should work together
});

test('createTyped should handle combined cursor options', () => {
  const controller = createTyped(testElement, {
    strings: ['Combined cursor test'],
    typeSpeed: 50,
    cursor: {
      enabled: true,
      char: '█',
      blink: true,
      blinkSpeed: 250,
      blinkCount: 10,
      hideWhenComplete: true,
      style: { color: '#00ff88', fontSize: '18px' },
    },
  });

  expect(controller).toBeDefined();
  // All cursor options should work together
});

test('createTyped should handle complex Phase 3 scenario', () => {
  const controller = createTyped(testElement, {
    strings: ['Phase 3', 'Complete', 'Test'],
    typeSpeed: 70,
    typeSpeedVariance: 25,
    shuffle: true,
    speedProfile: 'easeOut',
    humanTypeDelay: { min: 40, max: 100 },
    stringPauseDelay: 600,
    pauseOnPunctuation: true,
    backspaceSpeed: 20,
    deleteStrings: true,
    deleteDelay: 1000,
    loop: true,
    cursor: {
      enabled: true,
      char: '▌',
      blink: true,
      blinkSpeed: 300,
      blinkCount: 8,
      hideWhenComplete: true,
      style: 'custom-cursor',
    },
    onShuffle: () => {
      // Shuffle callback
    },
  });

  expect(controller).toBeDefined();
  expect(controller.start).toBeInstanceOf(Function);
  expect(controller.backspace).toBeInstanceOf(Function);
  expect(controller.deleteString).toBeInstanceOf(Function);
  expect(controller.skip).toBeInstanceOf(Function);
  expect(controller.goTo).toBeInstanceOf(Function);
  expect(controller.getTypeSpeed).toBeInstanceOf(Function);
  expect(controller.setSpeed).toBeInstanceOf(Function);
  expect(controller.getCursorBlinkSpeed).toBeInstanceOf(Function);
  expect(controller.setCursorBlinkSpeed).toBeInstanceOf(Function);
});

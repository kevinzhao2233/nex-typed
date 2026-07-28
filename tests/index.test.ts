import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { createTyped } from '../src';
import type { TypedOptions } from '../src/types';

let testElement: HTMLElement;

beforeEach(() => {
  vi.useFakeTimers();
  testElement = document.createElement('div');
  testElement.setAttribute('id', 'test-target');
  document.body.appendChild(testElement);
});

afterEach(() => {
  vi.useRealTimers();
  if (testElement?.parentNode) {
    testElement.parentNode.removeChild(testElement);
  }
  const existingRoot = document.querySelector('[data-nex-typed-root]');
  if (existingRoot) {
    existingRoot.remove();
  }
});

function getTextContent(): string {
  const text = testElement.querySelector('[data-nex-typed-text]');
  return text?.textContent ?? '';
}

function getCursor(): Element | null {
  return testElement.querySelector('[data-nex-typed-cursor]');
}

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
  expect(controller.backspace).toBeInstanceOf(Function);
  expect(controller.deleteString).toBeInstanceOf(Function);
  expect(controller.skip).toBeInstanceOf(Function);
  expect(controller.goTo).toBeInstanceOf(Function);
  expect(controller.getTypeSpeed).toBeInstanceOf(Function);
  expect(controller.setSpeed).toBeInstanceOf(Function);
  expect(controller.getCursorBlinkSpeed).toBeInstanceOf(Function);
  expect(controller.setCursorBlinkSpeed).toBeInstanceOf(Function);
});

test('createTyped should render initial DOM structure', () => {
  createTyped(testElement, {
    strings: ['Hello World'],
    typeSpeed: 50,
  });

  const root = testElement.querySelector('[data-nex-typed-root]');
  const text = testElement.querySelector('[data-nex-typed-text]');

  expect(root).not.toBeNull();
  expect(text).not.toBeNull();
});

test('createTyped should handle string selector target', () => {
  const selectorElement = document.createElement('div');
  selectorElement.setAttribute('id', 'selector-test');
  document.body.appendChild(selectorElement);

  const controller = createTyped('#selector-test', {
    strings: ['Hello from selector'],
    typeSpeed: 50,
  });

  expect(controller).toBeDefined();
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

test('typing animation should type characters one by one after start', () => {
  const controller = createTyped(testElement, {
    strings: ['Hi'],
    typeSpeed: 50,
  });

  controller.start();
  expect(getTextContent()).toBe('');

  vi.advanceTimersByTime(0);
  expect(getTextContent()).toBe('H');

  vi.advanceTimersByTime(50);
  expect(getTextContent()).toBe('Hi');
});

test('typing animation should respect startDelay', () => {
  const controller = createTyped(testElement, {
    strings: ['Hi'],
    typeSpeed: 50,
    startDelay: 200,
  });

  controller.start();

  vi.advanceTimersByTime(100);
  expect(getTextContent()).toBe('');

  vi.advanceTimersByTime(100);
  expect(getTextContent()).toBe('H');

  vi.advanceTimersByTime(50);
  expect(getTextContent()).toBe('Hi');
});

test('typing animation should progress through multiple strings', () => {
  const controller = createTyped(testElement, {
    strings: ['AB', 'CD'],
    typeSpeed: 50,
    stringPauseDelay: 100,
  });

  controller.start();

  vi.advanceTimersByTime(0);
  expect(getTextContent()).toBe('A');
  vi.advanceTimersByTime(50);
  expect(getTextContent()).toBe('AB');

  vi.advanceTimersByTime(50);
  vi.advanceTimersByTime(100);
  expect(getTextContent()).toBe('C');
  vi.advanceTimersByTime(50);
  expect(getTextContent()).toBe('CD');
});

test('onBegin callback should fire on start', () => {
  const onBegin = vi.fn();
  const controller = createTyped(testElement, {
    strings: ['Hi'],
    typeSpeed: 50,
    onBegin,
  });

  controller.start();
  expect(onBegin).toHaveBeenCalledTimes(1);
});

test('onStringStart callback should fire for each string', () => {
  const onStringStart = vi.fn();
  const controller = createTyped(testElement, {
    strings: ['AB', 'CD'],
    typeSpeed: 50,
    stringPauseDelay: 100,
    onStringStart,
  });

  controller.start();
  expect(onStringStart).toHaveBeenCalledTimes(1);
  expect(onStringStart).toHaveBeenCalledWith(0, 'AB');

  vi.advanceTimersByTime(200);
  expect(onStringStart).toHaveBeenCalledTimes(2);
  expect(onStringStart).toHaveBeenCalledWith(1, 'CD');
});

test('onStringEnd callback should fire when a string is fully typed', () => {
  const onStringEnd = vi.fn();
  const controller = createTyped(testElement, {
    strings: ['AB'],
    typeSpeed: 50,
    onStringEnd,
  });

  controller.start();

  vi.advanceTimersByTime(100);
  expect(onStringEnd).toHaveBeenCalledTimes(1);
  expect(onStringEnd).toHaveBeenCalledWith(0, 'AB');
});

test('onComplete callback should fire when all strings are typed', () => {
  const onComplete = vi.fn();
  const controller = createTyped(testElement, {
    strings: ['AB'],
    typeSpeed: 50,
    onComplete,
  });

  controller.start();

  vi.advanceTimersByTime(100);
  expect(onComplete).toHaveBeenCalledTimes(1);
});

test('cursor should be created when enabled and start is called', () => {
  const controller = createTyped(testElement, {
    strings: ['Hi'],
    typeSpeed: 50,
    cursor: {
      enabled: true,
      char: '_',
      blink: true,
    },
  });

  expect(getCursor()).toBeNull();

  controller.start();

  const cursor = getCursor();
  expect(cursor).not.toBeNull();
  expect(cursor?.textContent).toBe('_');
});

test('cursor should not be created when disabled', () => {
  const controller = createTyped(testElement, {
    strings: ['Hi'],
    typeSpeed: 50,
    cursor: {
      enabled: false,
    },
  });

  controller.start();
  expect(getCursor()).toBeNull();
});

test('cursor should blink at specified speed', () => {
  const controller = createTyped(testElement, {
    strings: ['Hi'],
    typeSpeed: 50,
    cursor: {
      enabled: true,
      char: '|',
      blink: true,
      blinkSpeed: 300,
    },
  });

  controller.start();

  const cursor = getCursor() as HTMLElement;
  expect(cursor.style.visibility).toBe('visible');

  vi.advanceTimersByTime(300);
  expect(cursor.style.visibility).toBe('hidden');

  vi.advanceTimersByTime(300);
  expect(cursor.style.visibility).toBe('visible');
});

test('cursor should stop blinking after blinkCount', () => {
  const controller = createTyped(testElement, {
    strings: ['Hi'],
    typeSpeed: 50,
    cursor: {
      enabled: true,
      char: '|',
      blink: true,
      blinkSpeed: 100,
      blinkCount: 3,
    },
  });

  controller.start();

  const cursor = getCursor() as HTMLElement;

  vi.advanceTimersByTime(100);
  expect(cursor.style.visibility).toBe('hidden');
  vi.advanceTimersByTime(100);
  expect(cursor.style.visibility).toBe('visible');
  vi.advanceTimersByTime(100);
  expect(cursor.style.visibility).toBe('hidden');
  vi.advanceTimersByTime(100);
  expect(cursor.style.visibility).toBe('visible');
  vi.advanceTimersByTime(100);
  expect(cursor.style.visibility).toBe('visible');
});

test('cursor should hide when complete if hideWhenComplete is true', () => {
  const controller = createTyped(testElement, {
    strings: ['Hi'],
    typeSpeed: 50,
    cursor: {
      enabled: true,
      char: '|',
      blink: true,
      hideWhenComplete: true,
    },
  });

  controller.start();

  const cursor = getCursor() as HTMLElement;
  expect(cursor.style.visibility).toBe('visible');

  vi.advanceTimersByTime(100);
  expect(cursor.style.visibility).toBe('hidden');
});

test('cursor style as string should add CSS class', () => {
  const controller = createTyped(testElement, {
    strings: ['Hi'],
    typeSpeed: 50,
    cursor: {
      enabled: true,
      char: '|',
      style: 'custom-cursor-class',
    },
  });

  controller.start();

  const cursor = getCursor() as HTMLElement;
  expect(cursor.classList.contains('custom-cursor-class')).toBe(true);
});

test('cursor style as object should apply inline styles', () => {
  const controller = createTyped(testElement, {
    strings: ['Hi'],
    typeSpeed: 50,
    cursor: {
      enabled: true,
      char: '|',
      style: { color: 'red', fontWeight: 'bold' },
    },
  });

  controller.start();

  const cursor = getCursor() as HTMLElement;
  expect(cursor.style.color).toBe('red');
  expect(cursor.style.fontWeight).toBe('bold');
});

test('pause should stop typing and hide cursor', () => {
  const controller = createTyped(testElement, {
    strings: ['ABCDE'],
    typeSpeed: 50,
    cursor: {
      enabled: true,
      char: '|',
      blink: true,
    },
  });

  controller.start();

  vi.advanceTimersByTime(0);
  expect(getTextContent()).toBe('A');

  vi.advanceTimersByTime(50);
  expect(getTextContent()).toBe('AB');

  controller.pause();
  const cursor = getCursor() as HTMLElement;
  expect(cursor.style.visibility).toBe('hidden');

  vi.advanceTimersByTime(200);
  expect(getTextContent()).toBe('AB');
});

test('resume should continue typing from paused position', () => {
  const controller = createTyped(testElement, {
    strings: ['ABCDE'],
    typeSpeed: 50,
    cursor: {
      enabled: true,
      char: '|',
      blink: true,
    },
  });

  controller.start();

  vi.advanceTimersByTime(0);
  expect(getTextContent()).toBe('A');

  vi.advanceTimersByTime(50);
  expect(getTextContent()).toBe('AB');

  controller.pause();
  vi.advanceTimersByTime(200);
  expect(getTextContent()).toBe('AB');

  controller.resume();
  vi.advanceTimersByTime(50);
  expect(getTextContent()).toBe('ABC');

  vi.advanceTimersByTime(50);
  expect(getTextContent()).toBe('ABCD');
});

test('onPause and onResume callbacks should fire', () => {
  const onPause = vi.fn();
  const onResume = vi.fn();
  const controller = createTyped(testElement, {
    strings: ['ABCDE'],
    typeSpeed: 50,
    onPause,
    onResume,
  });

  controller.start();

  vi.advanceTimersByTime(0);
  expect(getTextContent()).toBe('A');

  controller.pause();
  expect(onPause).toHaveBeenCalledTimes(1);
  expect(onPause).toHaveBeenCalledWith(0, 1);

  controller.resume();
  expect(onResume).toHaveBeenCalledTimes(1);
  expect(onResume).toHaveBeenCalledWith(0, 1);
});

test('stop should halt animation', () => {
  const controller = createTyped(testElement, {
    strings: ['ABCDE'],
    typeSpeed: 50,
  });

  controller.start();

  vi.advanceTimersByTime(0);
  expect(getTextContent()).toBe('A');

  vi.advanceTimersByTime(50);
  expect(getTextContent()).toBe('AB');

  controller.stop();
  vi.advanceTimersByTime(500);
  expect(getTextContent()).toBe('AB');
});

test('destroy should remove root element from DOM', () => {
  const controller = createTyped(testElement, {
    strings: ['Hi'],
    typeSpeed: 50,
  });

  expect(testElement.querySelector('[data-nex-typed-root]')).not.toBeNull();

  controller.destroy();
  expect(testElement.querySelector('[data-nex-typed-root]')).toBeNull();
});

test('backspace should remove characters one by one', () => {
  const controller = createTyped(testElement, {
    strings: ['ABC'],
    typeSpeed: 50,
    backspaceSpeed: 30,
  });

  controller.start();

  vi.advanceTimersByTime(100);
  expect(getTextContent()).toBe('ABC');

  controller.backspace();
  vi.advanceTimersByTime(30);
  expect(getTextContent()).toBe('AB');
  vi.advanceTimersByTime(30);
  expect(getTextContent()).toBe('A');
  vi.advanceTimersByTime(30);
  expect(getTextContent()).toBe('');
});

test('onBackspaceStart and onBackspaceEnd callbacks should fire', () => {
  const onBackspaceStart = vi.fn();
  const onBackspaceEnd = vi.fn();
  const controller = createTyped(testElement, {
    strings: ['ABCDE'],
    typeSpeed: 50,
    backspaceSpeed: 30,
    onBackspaceStart,
    onBackspaceEnd,
  });

  controller.start();

  vi.advanceTimersByTime(0);
  expect(getTextContent()).toBe('A');

  controller.backspace();
  expect(onBackspaceStart).toHaveBeenCalledTimes(1);
  expect(onBackspaceStart).toHaveBeenCalledWith(0, 'ABCDE');

  vi.advanceTimersByTime(30);
  expect(getTextContent()).toBe('');
  expect(onBackspaceEnd).toHaveBeenCalledTimes(1);
  expect(onBackspaceEnd).toHaveBeenCalledWith(0, 'ABCDE');
});

test('deleteString should remove all characters and advance to next string', () => {
  const controller = createTyped(testElement, {
    strings: ['AB', 'CD'],
    typeSpeed: 50,
    backspaceSpeed: 30,
    deleteStrings: true,
    deleteDelay: 100,
    stringPauseDelay: 50,
  });

  controller.start();

  vi.advanceTimersByTime(0);
  expect(getTextContent()).toBe('A');
  vi.advanceTimersByTime(50);
  expect(getTextContent()).toBe('AB');

  vi.advanceTimersByTime(50);
  vi.advanceTimersByTime(100);
  vi.advanceTimersByTime(30);
  expect(getTextContent()).toBe('A');
  vi.advanceTimersByTime(30);
  expect(getTextContent()).toBe('');

  vi.advanceTimersByTime(50);
  expect(getTextContent()).toBe('C');
  vi.advanceTimersByTime(50);
  expect(getTextContent()).toBe('CD');
});

test('loop should restart from beginning after completing all strings', () => {
  const onLoop = vi.fn();
  const controller = createTyped(testElement, {
    strings: ['AB'],
    typeSpeed: 50,
    loop: true,
    stringPauseDelay: 100,
    onLoop,
  });

  controller.start();

  vi.advanceTimersByTime(0);
  expect(getTextContent()).toBe('A');
  vi.advanceTimersByTime(50);
  expect(getTextContent()).toBe('AB');

  vi.advanceTimersByTime(50);
  expect(onLoop).toHaveBeenCalledTimes(1);

  vi.advanceTimersByTime(100);
  expect(getTextContent()).toBe('A');
  vi.advanceTimersByTime(50);
  expect(getTextContent()).toBe('AB');
});

test('loop with shuffle should reshuffle each loop iteration', () => {
  const onShuffle = vi.fn();
  const onLoop = vi.fn();
  const controller = createTyped(testElement, {
    strings: ['AB'],
    typeSpeed: 50,
    loop: true,
    shuffle: true,
    stringPauseDelay: 50,
    onShuffle,
    onLoop,
  });

  controller.start();
  expect(onShuffle).toHaveBeenCalledTimes(1);

  vi.advanceTimersByTime(100);
  expect(onLoop).toHaveBeenCalledTimes(1);
  expect(onShuffle).toHaveBeenCalledTimes(2);
});

test('skip should immediately show full current string', () => {
  const controller = createTyped(testElement, {
    strings: ['ABCDE', 'FGH'],
    typeSpeed: 50,
    stringPauseDelay: 50,
  });

  controller.start();

  vi.advanceTimersByTime(0);
  expect(getTextContent()).toBe('A');

  controller.skip();
  expect(getTextContent()).toBe('ABCDE');

  vi.advanceTimersByTime(50);
  vi.advanceTimersByTime(0);
  expect(getTextContent()).toBe('F');
  vi.advanceTimersByTime(50);
  expect(getTextContent()).toBe('FG');
  vi.advanceTimersByTime(50);
  expect(getTextContent()).toBe('FGH');
});

test('goTo should jump to specified string index', () => {
  const controller = createTyped(testElement, {
    strings: ['AB', 'CD', 'EF'],
    typeSpeed: 50,
    stringPauseDelay: 50,
  });

  controller.start();

  vi.advanceTimersByTime(0);
  expect(getTextContent()).toBe('A');

  controller.goTo(2);
  expect(getTextContent()).toBe('');

  vi.advanceTimersByTime(50);
  expect(getTextContent()).toBe('E');
  vi.advanceTimersByTime(50);
  expect(getTextContent()).toBe('EF');
});

test('goTo should ignore invalid indices', () => {
  const controller = createTyped(testElement, {
    strings: ['AB'],
    typeSpeed: 50,
  });

  controller.start();

  vi.advanceTimersByTime(0);
  expect(getTextContent()).toBe('A');

  controller.goTo(-1);
  controller.goTo(5);
  vi.advanceTimersByTime(50);
  expect(getTextContent()).toBe('AB');
});

test('getTypeSpeed should return current speed', () => {
  const controller = createTyped(testElement, {
    strings: ['Hi'],
    typeSpeed: 75,
  });

  expect(controller.getTypeSpeed()).toBe(75);
});

test('setSpeed should update typing speed', () => {
  const controller = createTyped(testElement, {
    strings: ['ABCDE'],
    typeSpeed: 100,
  });

  expect(controller.getTypeSpeed()).toBe(100);

  controller.setSpeed(50);
  expect(controller.getTypeSpeed()).toBe(50);
});

test('getCursorBlinkSpeed should return configured blink speed', () => {
  const controller = createTyped(testElement, {
    strings: ['Hi'],
    typeSpeed: 50,
    cursor: {
      enabled: true,
      char: '|',
      blink: true,
      blinkSpeed: 300,
    },
  });

  expect(controller.getCursorBlinkSpeed()).toBe(300);
});

test('setCursorBlinkSpeed should update blink speed', () => {
  const controller = createTyped(testElement, {
    strings: ['Hi'],
    typeSpeed: 50,
    cursor: {
      enabled: true,
      char: '|',
      blink: true,
      blinkSpeed: 300,
    },
  });

  controller.setCursorBlinkSpeed(200);
  expect(controller.getCursorBlinkSpeed()).toBe(200);
});

test('empty strings array should not crash', () => {
  const controller = createTyped(testElement, {
    strings: [],
    typeSpeed: 50,
  });

  expect(controller).toBeDefined();
  controller.start();
  vi.advanceTimersByTime(1000);
  expect(getTextContent()).toBe('');
});

test('default typeSpeed should be 50', () => {
  const controller = createTyped(testElement, {
    strings: ['Hi'],
  });

  expect(controller.getTypeSpeed()).toBe(50);
});

test('default cursor blinkSpeed should be 500', () => {
  const controller = createTyped(testElement, {
    strings: ['Hi'],
    cursor: {
      enabled: true,
      char: '|',
      blink: true,
    },
  });

  expect(controller.getCursorBlinkSpeed()).toBe(500);
});

test('pauseOnPunctuation should add extra delay on punctuation', () => {
  const onStringEnd = vi.fn();
  const controller = createTyped(testElement, {
    strings: ['A.'],
    typeSpeed: 50,
    pauseOnPunctuation: true,
    onStringEnd,
  });

  controller.start();

  vi.advanceTimersByTime(0);
  expect(getTextContent()).toBe('A');

  vi.advanceTimersByTime(250);
  expect(getTextContent()).toBe('A.');

  vi.advanceTimersByTime(50);
  expect(onStringEnd).toHaveBeenCalledTimes(1);
});

test('shuffle should randomize string order and call onShuffle', () => {
  const onShuffle = vi.fn();
  createTyped(testElement, {
    strings: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
    typeSpeed: 50,
    shuffle: true,
    onShuffle,
  });

  expect(onShuffle).toHaveBeenCalledTimes(1);
  const [original, shuffled] = onShuffle.mock.calls[0];
  expect(original).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']);
  expect(shuffled.length).toBe(10);
  expect(shuffled.sort()).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']);
});

function measureTickDelays(el: HTMLElement, options: TypedOptions, charCount: number): number[] {
  const originalSetTimeout = window.setTimeout.bind(window);
  const capturedDelays: number[] = [];

  window.setTimeout = ((fn: TimerHandler, delay?: number, ...args: unknown[]) => {
    if (typeof delay === 'number') {
      capturedDelays.push(delay);
    }
    return originalSetTimeout(fn, delay, ...args);
  });

  const controller = createTyped(el, { ...options, cursor: { enabled: false } });
  controller.start();

  for (let i = 0; i < charCount + 2; i++) {
    vi.advanceTimersToNextTimer();
  }

  window.setTimeout = originalSetTimeout;
  controller.destroy();
  return capturedDelays;
}

test('speedProfile easeIn should produce increasing delays', () => {
  const el = document.createElement('div');
  document.body.appendChild(el);

  const delays = measureTickDelays(el, {
    strings: ['ABCDE'],
    typeSpeed: 100,
    speedProfile: 'easeIn',
  }, 5);

  el.remove();

  const tickDelays = delays.slice(1, 5);
  expect(tickDelays.length).toBe(4);
  for (let i = 1; i < tickDelays.length; i++) {
    expect(tickDelays[i]).toBeGreaterThanOrEqual(tickDelays[i - 1]);
  }
});

test('speedProfile easeOut should produce increasing delays (fast then slow typing)', () => {
  const el = document.createElement('div');
  document.body.appendChild(el);

  const delays = measureTickDelays(el, {
    strings: ['ABCDE'],
    typeSpeed: 100,
    speedProfile: 'easeOut',
  }, 5);

  el.remove();

  const tickDelays = delays.slice(1, 5);
  expect(tickDelays.length).toBe(4);
  for (let i = 1; i < tickDelays.length; i++) {
    expect(tickDelays[i]).toBeGreaterThanOrEqual(tickDelays[i - 1]);
  }
});

test('speedProfile easeInOut should produce delays that increase then plateau', () => {
  const el = document.createElement('div');
  document.body.appendChild(el);

  const delays = measureTickDelays(el, {
    strings: ['ABCDEFGH'],
    typeSpeed: 100,
    speedProfile: 'easeInOut',
  }, 8);

  el.remove();

  const tickDelays = delays.slice(1, 8);
  expect(tickDelays.length).toBe(7);
  for (let i = 1; i < tickDelays.length; i++) {
    expect(tickDelays[i]).toBeGreaterThanOrEqual(tickDelays[i - 1]);
  }
  expect(tickDelays[0]).toBeLessThan(tickDelays[tickDelays.length - 1]);
});

test('speedProfile linear should produce constant delays', () => {
  const el = document.createElement('div');
  document.body.appendChild(el);

  const delays = measureTickDelays(el, {
    strings: ['ABC'],
    typeSpeed: 50,
    speedProfile: 'linear',
  }, 3);

  el.remove();

  const tickDelays = delays.slice(1, 3);
  expect(tickDelays.length).toBe(2);
  expect(tickDelays[0]).toBe(tickDelays[1]);
});

test('typeSpeedVariance should vary delay based on random value', () => {
  const el = document.createElement('div');
  document.body.appendChild(el);

  const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.75);

  const delays = measureTickDelays(el, {
    strings: ['AB'],
    typeSpeed: 100,
    typeSpeedVariance: 50,
  }, 2);

  randomSpy.mockRestore();
  el.remove();

  const tickDelays = delays.slice(1, 2);
  expect(tickDelays.length).toBe(1);
  const variance = (0.75 - 0.5) * 2 * 50 / 100;
  const expectedDelay = Math.max(10, Math.round(100 * (1 + variance)));
  expect(tickDelays[0]).toBe(expectedDelay);
});

test('typeSpeedVariance should keep delay within typeSpeed bounds', () => {
  const el = document.createElement('div');
  document.body.appendChild(el);

  const delays = measureTickDelays(el, {
    strings: ['ABCDEFGHIJ'],
    typeSpeed: 100,
    typeSpeedVariance: 50,
  }, 10);

  el.remove();

  const tickDelays = delays.slice(1, 10);
  expect(tickDelays.length).toBeGreaterThanOrEqual(5);
  for (const d of tickDelays) {
    expect(d).toBeGreaterThanOrEqual(10);
    expect(d).toBeLessThanOrEqual(200);
  }
});

test('humanTypeDelay should produce delays within min-max range', () => {
  const el = document.createElement('div');
  document.body.appendChild(el);

  const delays = measureTickDelays(el, {
    strings: ['ABCDEFGHIJ'],
    typeSpeed: 50,
    humanTypeDelay: { min: 30, max: 100 },
  }, 10);

  el.remove();

  const tickDelays = delays.slice(1, 10);
  expect(tickDelays.length).toBeGreaterThanOrEqual(5);
  for (const d of tickDelays) {
    expect(d).toBeGreaterThanOrEqual(30);
    expect(d).toBeLessThanOrEqual(100);
  }
});

test('humanTypeDelay should override typeSpeed', () => {
  const el = document.createElement('div');
  document.body.appendChild(el);

  const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5);

  const delays = measureTickDelays(el, {
    strings: ['AB'],
    typeSpeed: 50,
    humanTypeDelay: { min: 30, max: 100 },
  }, 2);

  randomSpy.mockRestore();
  el.remove();

  const tickDelays = delays.slice(1, 2);
  expect(tickDelays.length).toBe(1);
  const expectedDelay = Math.floor(0.5 * (100 - 30 + 1)) + 30;
  expect(tickDelays[0]).toBe(expectedDelay);
});

test('combined options should work together', () => {
  const onBegin = vi.fn();
  const onStringStart = vi.fn();
  const onStringEnd = vi.fn();
  const onComplete = vi.fn();

  const controller = createTyped(testElement, {
    strings: ['AB', 'CD'],
    typeSpeed: 50,
    startDelay: 100,
    stringPauseDelay: 50,
    cursor: {
      enabled: true,
      char: '_',
      blink: true,
    },
    onBegin,
    onStringStart,
    onStringEnd,
    onComplete,
  });

  controller.start();
  expect(onBegin).toHaveBeenCalledTimes(1);

  vi.advanceTimersByTime(100);
  expect(getTextContent()).toBe('A');
  vi.advanceTimersByTime(50);
  expect(getTextContent()).toBe('AB');

  vi.advanceTimersByTime(50);
  expect(onStringEnd).toHaveBeenCalledWith(0, 'AB');

  vi.advanceTimersByTime(50);
  vi.advanceTimersByTime(0);
  expect(getTextContent()).toBe('C');
  vi.advanceTimersByTime(50);
  expect(getTextContent()).toBe('CD');

  vi.advanceTimersByTime(50);
  expect(onComplete).toHaveBeenCalledTimes(1);
});

test('deleteStrings with loop should cycle through strings', () => {
  const onLoop = vi.fn();
  const onBackspaceEnd = vi.fn();
  const controller = createTyped(testElement, {
    strings: ['AB'],
    typeSpeed: 50,
    backspaceSpeed: 30,
    deleteStrings: true,
    deleteDelay: 50,
    loop: true,
    stringPauseDelay: 50,
    onLoop,
    onBackspaceEnd,
  });

  controller.start();

  vi.advanceTimersByTime(0);
  expect(getTextContent()).toBe('A');
  vi.advanceTimersByTime(50);
  expect(getTextContent()).toBe('AB');

  vi.advanceTimersByTime(50);
  vi.advanceTimersByTime(50);
  vi.advanceTimersByTime(30);
  expect(getTextContent()).toBe('A');
  vi.advanceTimersByTime(30);
  expect(getTextContent()).toBe('');
  vi.advanceTimersByTime(30);
  expect(onBackspaceEnd).toHaveBeenCalledTimes(1);
  expect(onLoop).toHaveBeenCalledTimes(1);

  vi.advanceTimersByTime(50);
  expect(getTextContent()).toBe('A');
  vi.advanceTimersByTime(50);
  expect(getTextContent()).toBe('AB');
});

test('onLoop callback should receive current index', () => {
  const onLoop = vi.fn();
  const controller = createTyped(testElement, {
    strings: ['AB'],
    typeSpeed: 50,
    loop: true,
    stringPauseDelay: 50,
    onLoop,
  });

  controller.start();

  vi.advanceTimersByTime(100);
  expect(onLoop).toHaveBeenCalledWith(0);
});

test('backspace should not work when paused', () => {
  const controller = createTyped(testElement, {
    strings: ['ABC'],
    typeSpeed: 50,
    backspaceSpeed: 30,
  });

  controller.start();

  vi.advanceTimersByTime(100);
  expect(getTextContent()).toBe('ABC');

  controller.pause();
  controller.backspace();
  vi.advanceTimersByTime(100);
  expect(getTextContent()).toBe('ABC');
});

test('skip with deleteStrings should trigger deletion after skip', () => {
  const onBackspaceStart = vi.fn();
  const controller = createTyped(testElement, {
    strings: ['ABC', 'DE'],
    typeSpeed: 50,
    backspaceSpeed: 30,
    deleteStrings: true,
    deleteDelay: 50,
    stringPauseDelay: 50,
    onBackspaceStart,
  });

  controller.start();

  vi.advanceTimersByTime(0);
  expect(getTextContent()).toBe('A');

  controller.skip();
  expect(getTextContent()).toBe('ABC');

  vi.advanceTimersByTime(50);
  expect(onBackspaceStart).toHaveBeenCalled();
});

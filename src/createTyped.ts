import { createCursor } from './cursor';
import type { TypedController, TypedOptions, TypedState, TypedTarget } from './types';

function resolveElement(target: TypedTarget): HTMLElement {
  if (typeof target === 'string') {
    const el = document.querySelector(target);
    if (!el) throw new Error(`Target not found: ${target}`);
    return el as HTMLElement;
  }
  return target;
}

export function createTyped(target: TypedTarget, options: TypedOptions): TypedController {
  const el = resolveElement(target);

  const state: TypedState = {
    el,
    strings: options.strings,
    index: 0,
    charIndex: 0,
    running: false,
    paused: false,
    timeoutId: null,
  };

  const typeSpeed = options.typeSpeed ?? 50;
  const startDelay = options.startDelay ?? 0;
  const backspaceSpeed = options.backspaceSpeed ?? 30;
  const deleteDelay = options.deleteDelay ?? 1000;
  const stringPauseDelay = options.stringPauseDelay ?? 500;
  const loop = options.loop ?? false;
  const pauseOnPunctuation = options.pauseOnPunctuation ?? false;
  const typeSpeedVariance = options.typeSpeedVariance ?? 0;
  const shuffle = options.shuffle ?? false;
  const speedProfile = options.speedProfile ?? 'linear';

  let isBackspacing = false;
  let backspaceTimeoutId: number | null = null;
  let currentTypeSpeed = typeSpeed;

  const originalStrings = [...options.strings];

  function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  if (shuffle) {
    const shuffled = shuffleArray(options.strings);
    state.strings = shuffled;
    options.onShuffle?.(originalStrings, shuffled);
  }

  const root = document.createElement('span');
  root.setAttribute('data-nex-typed-root', '');
  el.appendChild(root);

  const textNode = document.createElement('span');
  textNode.setAttribute('data-nex-typed-text', '');
  root.appendChild(textNode);

  const cursor = options.cursor?.enabled
    ? createCursor(textNode, {
        enabled: true,
        char: options.cursor.char,
        blink: options.cursor.blink ?? true,
        blinkSpeed: options.cursor.blinkSpeed,
        blinkCount: options.cursor.blinkCount,
        hideWhenComplete: options.cursor.hideWhenComplete,
        style: options.cursor.style,
      })
    : null;

  function render(text: string) {
    textNode.textContent = text;
  }

  function getSpeedCurveFactor(progress: number): number {
    switch (speedProfile) {
      case 'easeIn':
        return progress * progress;
      case 'easeOut':
        return 1 - (1 - progress) * (1 - progress);
      case 'easeInOut':
        return progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      default:
        return progress;
    }
  }

  function shouldPauseOnPunctuation(char: string): boolean {
    if (!pauseOnPunctuation) return false;
    const punctuation = ['.', '!', '?', '，', '。', '！', '？'];
    return punctuation.includes(char);
  }

  function getNextDelay(): number {
    let delay = currentTypeSpeed;

    if (typeSpeedVariance > 0) {
      const variance = ((Math.random() - 0.5) * 2 * typeSpeedVariance) / 100;
      delay = delay * (1 + variance);
    }

    if (options.humanTypeDelay) {
      const { min, max } = options.humanTypeDelay;
      delay = Math.floor(Math.random() * (max - min + 1)) + min;
    }

    if (speedProfile !== 'linear' && state.strings[state.index]) {
      const currentString = state.strings[state.index];
      const progress = state.charIndex / currentString.length;
      const curveFactor = getSpeedCurveFactor(progress);

      if (speedProfile === 'easeIn') {
        delay = delay * (1 + curveFactor);
      } else if (speedProfile === 'easeOut') {
        delay = delay * curveFactor;
      } else if (speedProfile === 'easeInOut') {
        delay = delay * (0.5 + curveFactor);
      }
    }

    if (state.strings[state.index] && state.charIndex < state.strings[state.index].length) {
      const currentChar = state.strings[state.index][state.charIndex];
      if (shouldPauseOnPunctuation(currentChar)) {
        delay += 200;
      }
    }

    return Math.max(10, delay);
  }

  function clearAllTimers() {
    if (state.timeoutId) {
      clearTimeout(state.timeoutId);
      state.timeoutId = null;
    }
    if (backspaceTimeoutId) {
      clearTimeout(backspaceTimeoutId);
      backspaceTimeoutId = null;
    }
  }

  function advanceToNextString() {
    if (loop) {
      if (shuffle) {
        const reshuffled = shuffleArray(originalStrings);
        state.strings = reshuffled;
        options.onShuffle?.(originalStrings, reshuffled);
      }
      options.onLoop?.(state.index);
      state.index = 0;
      state.charIndex = 0;
      state.timeoutId = window.setTimeout(tick, stringPauseDelay);
      return;
    }

    if (state.index >= state.strings.length - 1) {
      state.running = false;
      options.onComplete?.();
      if (options.cursor?.hideWhenComplete) {
        cursor?.hide();
      }
      return;
    }

    state.index++;
    state.charIndex = 0;
    options.onStringStart?.(state.index, state.strings[state.index]);
    state.timeoutId = window.setTimeout(tick, stringPauseDelay);
  }

  function tick() {
    if (state.paused || !state.running || isBackspacing) return;

    if (state.index >= state.strings.length) {
      state.running = false;
      return;
    }

    const current = state.strings[state.index];

    if (state.charIndex >= current.length) {
      options.onStringEnd?.(state.index, current);

      if (options.deleteStrings) {
        state.timeoutId = window.setTimeout(() => {
          deleteString();
        }, deleteDelay);
        return;
      }

      advanceToNextString();
      return;
    }

    state.charIndex++;
    const output = current.slice(0, state.charIndex);
    render(output);

    const delay = getNextDelay();
    state.timeoutId = window.setTimeout(tick, delay);
  }

  function backspace() {
    if (!state.running || state.paused || isBackspacing) return;
    if (state.charIndex <= 0) return;

    isBackspacing = true;
    clearAllTimers();

    const currentString = state.strings[state.index];
    options.onBackspaceStart?.(state.index, currentString);

    function backspaceTick() {
      if (state.paused || !state.running) {
        isBackspacing = false;
        return;
      }

      if (state.charIndex <= 0) {
        isBackspacing = false;
        options.onBackspaceEnd?.(state.index, currentString);
        return;
      }

      state.charIndex--;
      const output = state.strings[state.index].slice(0, state.charIndex);
      render(output);

      backspaceTimeoutId = window.setTimeout(backspaceTick, backspaceSpeed);
    }

    backspaceTimeoutId = window.setTimeout(backspaceTick, backspaceSpeed);
  }

  function deleteString() {
    if (!state.running || state.paused || isBackspacing) return;

    const currentString = state.strings[state.index];
    options.onBackspaceStart?.(state.index, currentString);

    isBackspacing = true;
    clearAllTimers();

    function deleteTick() {
      if (state.paused || !state.running) {
        isBackspacing = false;
        return;
      }

      if (state.charIndex <= 0) {
        isBackspacing = false;
        options.onBackspaceEnd?.(state.index, currentString);
        advanceToNextString();
        return;
      }

      state.charIndex--;
      const output = state.strings[state.index].slice(0, state.charIndex);
      render(output);

      backspaceTimeoutId = window.setTimeout(deleteTick, backspaceSpeed);
    }

    backspaceTimeoutId = window.setTimeout(deleteTick, backspaceSpeed);
  }

  function skip() {
    if (!state.running || state.paused || isBackspacing) return;

    clearAllTimers();

    render(state.strings[state.index]);
    state.charIndex = state.strings[state.index].length;
    options.onStringEnd?.(state.index, state.strings[state.index]);

    if (options.deleteStrings) {
      state.timeoutId = window.setTimeout(() => {
        deleteString();
      }, deleteDelay);
      return;
    }

    advanceToNextString();
  }

  function goTo(index: number) {
    if (!state.running || state.paused || isBackspacing) return;
    if (index < 0 || index >= state.strings.length) return;

    clearAllTimers();

    state.index = index;
    state.charIndex = 0;
    render('');

    options.onStringStart?.(state.index, state.strings[state.index]);
    state.timeoutId = window.setTimeout(tick, stringPauseDelay);
  }

  function getTypeSpeed(): number {
    return currentTypeSpeed;
  }

  function setSpeed(speed: number) {
    currentTypeSpeed = speed;
  }

  function getCursorBlinkSpeed(): number {
    return options.cursor?.blinkSpeed ?? 500;
  }

  function setCursorBlinkSpeed(speed: number) {
    if (cursor && typeof cursor.setBlinkSpeed === 'function') {
      cursor.setBlinkSpeed(speed);
    }
    if (options.cursor) {
      options.cursor.blinkSpeed = speed;
    }
  }

  function start() {
    if (state.running) return;
    if (state.strings.length === 0) return;

    state.running = true;
    isBackspacing = false;

    cursor?.mount();
    cursor?.show();

    options.onBegin?.();
    options.onStringStart?.(0, state.strings[0]);
    state.timeoutId = window.setTimeout(tick, startDelay);
  }

  function pause() {
    if (!state.running) return;
    if (state.paused) return;

    state.paused = true;
    clearAllTimers();

    cursor?.hide();
    options.onPause?.(state.index, state.charIndex);
  }

  function resume() {
    if (!state.running) return;
    if (!state.paused) return;

    state.paused = false;

    cursor?.show();
    cursor?.startBlink();
    options.onResume?.(state.index, state.charIndex);

    if (isBackspacing) {
      backspaceTimeoutId = window.setTimeout(continueBackspaceAfterResume, 100);
    } else {
      state.timeoutId = window.setTimeout(tick, currentTypeSpeed);
    }
  }

  function continueBackspaceAfterResume() {
    if (state.paused || !state.running) {
      isBackspacing = false;
      return;
    }

    if (state.charIndex <= 0) {
      isBackspacing = false;
      const currentString = state.strings[state.index];
      options.onBackspaceEnd?.(state.index, currentString);
      state.timeoutId = window.setTimeout(tick, currentTypeSpeed);
      return;
    }

    state.charIndex--;
    const output = state.strings[state.index].slice(0, state.charIndex);
    render(output);

    backspaceTimeoutId = window.setTimeout(continueBackspaceAfterResume, backspaceSpeed);
  }

  function stop() {
    state.running = false;
    isBackspacing = false;
    clearAllTimers();
    cursor?.hide();
  }

  function destroy() {
    stop();
    cursor?.destroy();
    root.remove();
  }

  return {
    start,
    stop,
    destroy,
    pause,
    resume,
    backspace,
    deleteString,
    skip,
    goTo,
    getTypeSpeed,
    setSpeed,
    getCursorBlinkSpeed,
    setCursorBlinkSpeed,
  };
}

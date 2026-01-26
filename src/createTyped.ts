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

  // 状态管理
  const state: TypedState = {
    el,
    strings: options.strings,
    index: 0,
    charIndex: 0,
    running: false,
    paused: false,
    timeoutId: null,
  };

  // 配置选项（带默认值）
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

  // 退格状态
  let isBackspacing = false;
  let backspaceTimeoutId: number | null = null;

  // 速度曲线缓存（暂时保留，未来可能用于优化）
  // let speedCurveCache: number[] = []

  // 原始字符串顺序（用于 shuffle 回调）
  const originalStrings = [...options.strings];

  // 随机打乱字符串
  function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // 应用随机打乱
  if (shuffle) {
    const shuffled = shuffleArray(options.strings);
    state.strings = shuffled;
    options.onShuffle?.(originalStrings, shuffled);
  }

  // DOM 元素创建
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

  // 渲染函数
  function render(text: string) {
    textNode.textContent = text;
  }

  // 获取速度曲线因子
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

  // 检查是否需要暂停（标点符号）
  function shouldPauseOnPunctuation(char: string): boolean {
    if (!pauseOnPunctuation) return false;
    const punctuation = ['.', '!', '?', '，', '。', '！', '？'];
    return punctuation.includes(char);
  }

  // 获取下一个延迟时间
  function getNextDelay(): number {
    const currentTypeSpeed = options.typeSpeed ?? 50;
    let delay = currentTypeSpeed;

    // 应用速度变化百分比
    if (typeSpeedVariance > 0) {
      const variance = ((Math.random() - 0.5) * 2 * typeSpeedVariance) / 100;
      delay = delay * (1 + variance);
    }

    // 如果设置了 humanTypeDelay，使用随机延迟（覆盖基础速度）
    if (options.humanTypeDelay) {
      const { min, max } = options.humanTypeDelay;
      delay = Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // 应用速度曲线
    if (speedProfile !== 'linear' && state.strings[state.index]) {
      const currentString = state.strings[state.index];
      const progress = state.charIndex / currentString.length;
      const curveFactor = getSpeedCurveFactor(progress);

      // 对于 easeIn，开始慢后面快；对于 easeOut，开始快后面慢
      if (speedProfile === 'easeIn') {
        delay = delay * (1 + curveFactor); // 从 2x 到 1x
      } else if (speedProfile === 'easeOut') {
        delay = delay * curveFactor; // 从 1x 到 0.5x
      } else if (speedProfile === 'easeInOut') {
        delay = delay * (0.5 + curveFactor); // 从 1.5x 到 0.5x
      }
    }

    // 如果当前字符是标点符号，增加额外延迟
    if (state.charIndex < state.strings[state.index].length) {
      const currentChar = state.strings[state.index][state.charIndex];
      if (shouldPauseOnPunctuation(currentChar)) {
        delay += 200; // 额外的200ms暂停
      }
    }

    // 确保延迟不小于 10ms
    return Math.max(10, delay);
  }

  // 主打字循环
  function tick() {
    if (state.paused || !state.running || isBackspacing) return;

    const current = state.strings[state.index];
    if (current === null) return;

    // 检查是否完成当前字符串
    if (state.charIndex >= current.length) {
      options.onStringEnd?.(state.index, current);

      // 处理删除字符串选项
      if (options.deleteStrings) {
        setTimeout(() => {
          deleteString();
        }, deleteDelay);
        return;
      }

      // 处理循环
      if (loop) {
        options.onLoop?.(state.index);
        state.index = 0;
        state.charIndex = 0;
        state.timeoutId = window.setTimeout(tick, stringPauseDelay);
        return;
      }

      // 检查是否完成所有字符串
      if (state.index >= state.strings.length - 1) {
        state.running = false;
        options.onComplete?.();

        // 完成时隐藏光标
        if (options.cursor?.hideWhenComplete) {
          cursor?.hide();
        }
        return;
      }

      // 移动到下一个字符串
      state.index++;
      state.charIndex = 0;

      options.onStringStart?.(state.index, state.strings[state.index]);
      state.timeoutId = window.setTimeout(tick, stringPauseDelay);
      return;
    }

    // 打字下一个字符
    state.charIndex++;

    const output = current.slice(0, state.charIndex);
    render(output);

    // 计算下一个延迟
    const delay = getNextDelay();
    state.timeoutId = window.setTimeout(tick, delay);
  }

  // 退格功能
  function backspace() {
    if (!state.running || state.paused || isBackspacing) return;
    if (state.charIndex <= 0) return;

    isBackspacing = true;

    // 清除当前打字定时器
    if (state.timeoutId) {
      clearTimeout(state.timeoutId);
      state.timeoutId = null;
    }

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

  // 删除当前字符串
  function deleteString() {
    if (!state.running || state.paused || isBackspacing) return;

    const currentString = state.strings[state.index];
    options.onBackspaceStart?.(state.index, currentString);

    isBackspacing = true;

    // 清除当前打字定时器
    if (state.timeoutId) {
      clearTimeout(state.timeoutId);
      state.timeoutId = null;
    }

    function deleteTick() {
      if (state.paused || !state.running) {
        isBackspacing = false;
        return;
      }

      if (state.charIndex <= 0) {
        isBackspacing = false;
        options.onBackspaceEnd?.(state.index, currentString);

        // 处理循环
        if (loop) {
          options.onLoop?.(state.index);
          state.index = 0;
          state.charIndex = 0;
          state.timeoutId = window.setTimeout(tick, stringPauseDelay);
          return;
        }

        // 检查是否完成所有字符串
        if (state.index >= state.strings.length - 1) {
          state.running = false;
          options.onComplete?.();

          // 完成时隐藏光标
          if (options.cursor?.hideWhenComplete) {
            cursor?.hide();
          }
          return;
        }

        // 移动到下一个字符串
        state.index++;
        state.charIndex = 0;

        options.onStringStart?.(state.index, state.strings[state.index]);
        state.timeoutId = window.setTimeout(tick, stringPauseDelay);
        return;
      }

      state.charIndex--;
      const output = state.strings[state.index].slice(0, state.charIndex);
      render(output);

      backspaceTimeoutId = window.setTimeout(deleteTick, backspaceSpeed);
    }

    backspaceTimeoutId = window.setTimeout(deleteTick, backspaceSpeed);
  }

  // 跳过当前字符串
  function skip() {
    if (!state.running || state.paused || isBackspacing) return;

    // 清除所有定时器
    if (state.timeoutId) {
      clearTimeout(state.timeoutId);
      state.timeoutId = null;
    }
    if (backspaceTimeoutId) {
      clearTimeout(backspaceTimeoutId);
      backspaceTimeoutId = null;
    }

    // 立即显示完整字符串
    render(state.strings[state.index]);
    options.onStringEnd?.(state.index, state.strings[state.index]);

    // 处理循环
    if (loop) {
      options.onLoop?.(state.index);
      state.index = 0;
      state.charIndex = 0;
      state.timeoutId = window.setTimeout(tick, stringPauseDelay);
      return;
    }

    // 检查是否完成所有字符串
    if (state.index >= state.strings.length - 1) {
      state.running = false;
      options.onComplete?.();

      // 完成时隐藏光标
      if (options.cursor?.hideWhenComplete) {
        cursor?.hide();
      }
      return;
    }

    // 移动到下一个字符串
    state.index++;
    state.charIndex = 0;

    options.onStringStart?.(state.index, state.strings[state.index]);
    state.timeoutId = window.setTimeout(tick, stringPauseDelay);
  }

  // 跳转到指定索引
  function goTo(index: number) {
    if (!state.running || state.paused || isBackspacing) return;
    if (index < 0 || index >= state.strings.length) return;

    // 清除所有定时器
    if (state.timeoutId) {
      clearTimeout(state.timeoutId);
      state.timeoutId = null;
    }
    if (backspaceTimeoutId) {
      clearTimeout(backspaceTimeoutId);
      backspaceTimeoutId = null;
    }

    // 更新状态
    state.index = index;
    state.charIndex = 0;

    // 渲染新字符串
    render('');

    options.onStringStart?.(state.index, state.strings[state.index]);
    state.timeoutId = window.setTimeout(tick, stringPauseDelay);
  }

  // 获取当前打字速度
  function getTypeSpeed(): number {
    return options.typeSpeed ?? 50;
  }

  // 设置打字速度（动态修改）
  function setSpeed(speed: number) {
    options.typeSpeed = speed;
  }

  // 获取光标闪烁速度
  function getCursorBlinkSpeed(): number {
    return options.cursor?.blinkSpeed ?? 500;
  }

  // 设置光标闪烁速度
  function setCursorBlinkSpeed(speed: number) {
    if (cursor && typeof cursor.setBlinkSpeed === 'function') {
      cursor.setBlinkSpeed(speed);
    }
    // 更新配置
    if (options.cursor) {
      options.cursor.blinkSpeed = speed;
    }
  }

  // 开始动画
  function start() {
    if (state.running) return;
    state.running = true;
    isBackspacing = false;

    cursor?.mount();
    cursor?.show();

    options.onBegin?.();
    options.onStringStart?.(0, state.strings[0]);
    state.timeoutId = window.setTimeout(tick, startDelay);
  }

  // 暂停
  function pause() {
    if (!state.running) return;
    if (state.paused) return;

    state.paused = true;

    if (state.timeoutId) {
      clearTimeout(state.timeoutId);
      state.timeoutId = null;
    }

    if (backspaceTimeoutId) {
      clearTimeout(backspaceTimeoutId);
      backspaceTimeoutId = null;
    }

    cursor?.hide();
    options.onPause?.(state.index, state.charIndex);
  }

  // 恢复
  function resume() {
    if (!state.running) return;
    if (!state.paused) return;

    state.paused = false;

    cursor?.show();
    cursor?.startBlink();
    options.onResume?.(state.index, state.charIndex);

    // 如果正在退格，恢复退格
    if (isBackspacing) {
      backspaceTimeoutId = window.setTimeout(() => {
        // 继续退格逻辑
        const currentString = state.strings[state.index];
        function continueBackspace() {
          if (state.paused || !state.running) {
            isBackspacing = false;
            return;
          }

          if (state.charIndex <= 0) {
            isBackspacing = false;
            options.onBackspaceEnd?.(state.index, currentString);
            scheduleNextTick();
            return;
          }

          state.charIndex--;
          const output = state.strings[state.index].slice(0, state.charIndex);
          render(output);

          backspaceTimeoutId = window.setTimeout(continueBackspace, backspaceSpeed);
        }
        continueBackspace();
      }, 100);
    } else {
      scheduleNextTick();
    }
  }

  // 停止
  function stop() {
    state.running = false;
    isBackspacing = false;

    if (state.timeoutId) {
      clearTimeout(state.timeoutId);
      state.timeoutId = null;
    }

    if (backspaceTimeoutId) {
      clearTimeout(backspaceTimeoutId);
      backspaceTimeoutId = null;
    }

    cursor?.hide();
  }

  // 销毁
  function destroy() {
    stop();
    cursor?.destroy();
    root.remove();
  }

  // 调度下一个打字
  function scheduleNextTick() {
    if (state.paused) return;
    state.timeoutId = window.setTimeout(tick, typeSpeed);
  }

  // 返回控制器
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

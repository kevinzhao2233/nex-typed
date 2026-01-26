import type { CursorController, CursorOptions } from './types';

export function createCursor(textHost: HTMLElement, options: CursorOptions): CursorController {
  const cursor = document.createElement('span');
  cursor.textContent = options.char ?? '|';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.setAttribute('data-nex-typed-cursor', '');
  cursor.style.display = 'inline-block';
  // 防御性 CSS，字符串里有空格 / 换行也不会影响 cursor 行为
  cursor.style.whiteSpace = 'pre';

  // 应用自定义样式
  if (options.style) {
    if (typeof options.style === 'string') {
      // CSS 类名
      cursor.classList.add(options.style);
    } else {
      // 内联样式对象
      Object.entries(options.style).forEach(([key, value]) => {
        if (value !== undefined) {
          cursor.style.setProperty(key, value);
        }
      });
    }
  }

  let mounted = false;
  let blinkTimer: number | null = null;
  let blinkCount = 0;
  let blinkSpeed = options.blinkSpeed ?? 500;
  const maxBlinks = options.blinkCount ?? 0; // 0 表示无限

  function mount() {
    if (mounted) return;
    textHost.after(cursor);
    mounted = true;
    if (options.blink) startBlink();
  }

  function unmount() {
    if (!mounted) return;
    cursor.remove();
    mounted = false;
    stopBlink();
  }

  function show() {
    cursor.style.visibility = 'visible';
  }

  function hide() {
    cursor.style.visibility = 'hidden';
  }

  function startBlink() {
    stopBlink();
    blinkCount = 0;

    blinkTimer = window.setInterval(() => {
      // 检查是否达到最大闪烁次数
      if (maxBlinks > 0 && blinkCount >= maxBlinks) {
        stopBlink();
        // 最后一次闪烁后保持可见
        cursor.style.visibility = 'visible';
        return;
      }

      cursor.style.visibility = cursor.style.visibility === 'hidden' ? 'visible' : 'hidden';
      blinkCount++;
    }, blinkSpeed);
  }

  function stopBlink() {
    if (blinkTimer) {
      clearInterval(blinkTimer);
      blinkTimer = null;
      cursor.style.visibility = 'visible';
    }
  }

  function setBlinkSpeed(speed: number) {
    blinkSpeed = speed;
    // 如果正在闪烁，重新启动以应用新速度
    if (blinkTimer) {
      startBlink();
    }
  }

  function getBlinkSpeed(): number {
    return blinkSpeed;
  }

  function destroy() {
    stopBlink();
    unmount();
  }

  return {
    mount,
    unmount,
    show,
    hide,
    startBlink,
    stopBlink,
    setBlinkSpeed,
    getBlinkSpeed,
    destroy,
  };
}

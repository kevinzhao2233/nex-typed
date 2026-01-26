import type { CursorController, CursorOptions } from "./types"

export function createCursor(
  textHost: HTMLElement,
  options: CursorOptions
): CursorController {
  const cursor = document.createElement('span')
  cursor.textContent = options.char ?? '|'
  cursor.setAttribute('aria-hidden', 'true')
  cursor.setAttribute('data-nex-typed-cursor', '')
  cursor.style.display = 'inline-block'
  // 防御性 CSS，字符串里有空格 / 换行也不会影响 cursor 行为
  cursor.style.whiteSpace = 'pre'

  let mounted = false
  let blinkTimer: number | null = null

  function mount() {
    if (mounted) return
    textHost.after(cursor)
    mounted = true
    if (options.blink) startBlink()
  }

  function unmount() {
    if (!mounted) return
    cursor.remove()
    mounted = false
    stopBlink()
  }

  function show() {
    cursor.style.visibility = 'visible'
  }

  function hide() {
    cursor.style.visibility = 'hidden'
  }

  function startBlink() {
    stopBlink()
    blinkTimer = window.setInterval(() => {
      cursor.style.visibility =
        cursor.style.visibility === 'hidden' ? 'visible' : 'hidden'
    }, 500)
  }

  function stopBlink() {
    if (blinkTimer) {
      clearInterval(blinkTimer)
      blinkTimer = null
      cursor.style.visibility = 'visible'
    }
  }

  function destroy() {
    stopBlink()
    unmount()
  }

  return {
    mount,
    unmount,
    show,
    hide,
    startBlink,
    destroy,
  }
}

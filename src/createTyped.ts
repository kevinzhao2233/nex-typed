import type { TypedOptions, TypedController, TypedTarget, TypedState } from './types'
import { createCursor } from './cursor'

function resolveElement(target: TypedTarget): HTMLElement {
  if (typeof target === 'string') {
    const el = document.querySelector(target)
    if (!el) throw new Error(`Target not found: ${target}`)
    return el as HTMLElement
  }
  return target
}

export function createTyped(
  target: TypedTarget,
  options: TypedOptions
): TypedController {
  const el = resolveElement(target)

  const state: TypedState = {
    el,
    strings: options.strings,
    index: 0,
    charIndex: 0,
    running: false,
    paused: false,
    timeoutId: null,
  }

  const typeSpeed = options.typeSpeed ?? 50
  const startDelay = options.startDelay ?? 0

  const root = document.createElement('span')
  root.setAttribute('data-nex-typed-root', '')
  el.appendChild(root)

  const textNode = document.createElement('span')
  textNode.setAttribute('data-nex-typed-text', '')
  root.appendChild(textNode)

  const cursor = options.cursor?.enabled
    ? createCursor(textNode, {
      enabled: true,
      char: options.cursor.char,
      blink: options.cursor.blink ?? true,
    })
    : null

  function render(text: string) {
    textNode.textContent = text
  }

  function tick() {
    if (state.paused || !state.running) return

    const current = state.strings[state.index]
    if (current == null) return

    if (state.charIndex >= current.length) {
      options.onStringEnd?.(state.index, current)

      state.index++
      state.charIndex = 0

      if (state.index >= state.strings.length) {
        state.running = false
        options.onComplete?.()
        return
      }

      options.onStringStart?.(
        state.index,
        state.strings[state.index]
      )

      state.timeoutId = window.setTimeout(tick, typeSpeed)
      return
    }

    state.charIndex++

    const output = current.slice(0, state.charIndex)

    render(output)

    state.timeoutId = window.setTimeout(tick, typeSpeed)
  }

  function start() {
    if (state.running) return
    state.running = true

    cursor?.mount()
    cursor?.show()

    options.onBegin?.()
    options.onStringStart?.(0, state.strings[0])
    state.timeoutId = window.setTimeout(tick, startDelay)
  }

  function scheduleNextTick() {
    if (state.paused) return
    state.timeoutId = window.setTimeout(tick, typeSpeed)
  }

  function pause() {
    if (!state.running) return
    if (state.paused) return


    state.paused = true


    if (state.timeoutId) {
      clearTimeout(state.timeoutId)
      state.timeoutId = null
    }


    cursor?.hide()
    options.onPause?.(state.index, state.charIndex)
  }

  function resume() {
    if (!state.running) return
    if (!state.paused) return

    state.paused = false

    cursor?.show()
    cursor?.startBlink()
    options.onResume?.(state.index, state.charIndex)

    scheduleNextTick()
  }

  function stop() {
    state.running = false
    if (state.timeoutId) clearTimeout(state.timeoutId)
    cursor?.hide()
  }

  function destroy() {
    stop()
    cursor?.destroy()
    root.remove()
  }

  return {
    start,
    stop,
    destroy,
    pause,
    resume,
  }
}

export type TypedTarget = HTMLElement | string

export interface TypedState {
  el: HTMLElement
  strings: string[]
  running: boolean // 是否已 start
  paused: boolean // 是否暂停
  index: number // 当前字符串索引
  charIndex: number // 当前字符索引
  timeoutId: number | null
}

export interface CursorOptions {
  enabled: boolean
  char?: string
  blink?: boolean
}

export interface CursorController {
  mount(): void
  unmount(): void
  show(): void
  hide(): void
  startBlink(): void
  destroy(): void
}

export interface TypedOptions {
  strings: string[]
  typeSpeed?: number
  startDelay?: number
  cursor?: CursorOptions

  onBegin?: () => void
  onStringStart?: (index: number, text: string) => void
  onStringEnd?: (index: number, text: string) => void
  onComplete?: () => void
  onPause?: (index: number, charIndex: number) => void
  onResume?: (index: number, charIndex: number) => void
}

export interface TypedController {
  start(): void
  stop(): void
  destroy(): void
  pause(): void
  resume(): void
}

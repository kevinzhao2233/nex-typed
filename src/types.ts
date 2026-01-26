export type TypedTarget = HTMLElement | string;

export interface TypedState {
  el: HTMLElement;
  strings: string[];
  running: boolean; // 是否已 start
  paused: boolean; // 是否暂停
  index: number; // 当前字符串索引
  charIndex: number; // 当前字符索引
  timeoutId: number | null;
}

export interface CursorOptions {
  enabled: boolean;
  char?: string;
  blink?: boolean;
  blinkSpeed?: number; // 闪烁速度（ms），默认 500ms
  blinkCount?: number; // 闪烁次数，0 表示无限
  hideWhenComplete?: boolean; // 完成时隐藏光标
  style?: string | Record<string, string>; // 光标样式（CSS类名或内联样式）
}

export interface CursorController {
  mount(): void;
  unmount(): void;
  show(): void;
  hide(): void;
  startBlink(): void;
  stopBlink(): void;
  setBlinkSpeed(speed: number): void;
  getBlinkSpeed(): number;
  destroy(): void;
}

export interface TypedOptions {
  strings: string[];
  typeSpeed?: number;
  startDelay?: number;
  cursor?: CursorOptions;

  // 新增：退格/删除功能选项
  backspaceSpeed?: number;
  deleteStrings?: boolean;
  deleteDelay?: number;

  // 新增：循环功能选项
  loop?: boolean;

  // 新增：智能定时选项
  humanTypeDelay?: { min: number; max: number };
  stringPauseDelay?: number;
  pauseOnPunctuation?: boolean;

  // 新增：速度变化与随机化选项
  typeSpeedVariance?: number; // 速度变化百分比（0-100），默认 0
  shuffle?: boolean; // 随机打乱字符串顺序
  speedProfile?: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut'; // 速度曲线

  // 现有回调
  onBegin?: () => void;
  onStringStart?: (index: number, text: string) => void;
  onStringEnd?: (index: number, text: string) => void;
  onComplete?: () => void;
  onPause?: (index: number, charIndex: number) => void;
  onResume?: (index: number, charIndex: number) => void;

  // 新增回调
  onBackspaceStart?: (index: number, text: string) => void;
  onBackspaceEnd?: (index: number, text: string) => void;
  onLoop?: (index: number) => void;
  onShuffle?: (originalOrder: string[], shuffledOrder: string[]) => void; // 随机打乱回调
}

export interface TypedController {
  start(): void;
  stop(): void;
  destroy(): void;
  pause(): void;
  resume(): void;

  // 新增方法
  backspace(): void;
  deleteString(): void;
  skip(): void;
  goTo(index: number): void;
  getTypeSpeed(): number;
  setSpeed(speed: number): void;
  getCursorBlinkSpeed(): number;
  setCursorBlinkSpeed(speed: number): void;
}

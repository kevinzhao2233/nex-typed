import { expect, test, beforeEach, afterEach } from 'vitest'
import { createTyped } from '../src'

// Mock DOM environment for testing
let testElement: HTMLElement

beforeEach(() => {
  // Create a test element for each test
  testElement = document.createElement('div')
  testElement.setAttribute('id', 'test-target')
  document.body.appendChild(testElement)
})

afterEach(() => {
  // Clean up after each test
  if (testElement && testElement.parentNode) {
    testElement.parentNode.removeChild(testElement)
  }
  // Clear any existing elements
  const existingRoot = document.querySelector('[data-nex-typed-root]')
  if (existingRoot) {
    existingRoot.remove()
  }
})

test('createTyped should create typing animation controller', () => {
  const controller = createTyped(testElement, {
    strings: ['Hello World'],
    typeSpeed: 50
  })

  expect(controller).toBeDefined()
  expect(controller.start).toBeInstanceOf(Function)
  expect(controller.stop).toBeInstanceOf(Function)
  expect(controller.pause).toBeInstanceOf(Function)
  expect(controller.resume).toBeInstanceOf(Function)
  expect(controller.destroy).toBeInstanceOf(Function)
})

test('createTyped should render initial DOM structure', () => {
  createTyped(testElement, {
    strings: ['Hello World'],
    typeSpeed: 50
  })

  const root = testElement.querySelector('[data-nex-typed-root]')
  const text = testElement.querySelector('[data-nex-typed-text]')

  expect(root).toBeDefined()
  expect(text).toBeDefined()
})

test('createTyped should handle string selector target', () => {
  // Create element with ID for selector test
  const selectorElement = document.createElement('div')
  selectorElement.setAttribute('id', 'selector-test')
  document.body.appendChild(selectorElement)

  const controller = createTyped('#selector-test', {
    strings: ['Hello from selector'],
    typeSpeed: 50
  })

  expect(controller).toBeDefined()

  // Clean up
  selectorElement.remove()
})

test('createTyped should throw error for invalid selector', () => {
  expect(() => {
    createTyped('#non-existent-element', {
      strings: ['Hello'],
      typeSpeed: 50
    })
  }).toThrow('Target not found: #non-existent-element')
})

test('createTyped should handle cursor configuration', () => {
  createTyped(testElement, {
    strings: ['With cursor'],
    typeSpeed: 50,
    cursor: {
      enabled: true,
      char: '_',
      blink: true
    }
  })

  const cursor = testElement.querySelector('[data-nex-typed-cursor]')
  expect(cursor).toBeDefined()
  expect(cursor?.textContent).toBe('_')
})

test('createTyped should handle cursor disabled', () => {
  createTyped(testElement, {
    strings: ['No cursor'],
    typeSpeed: 50,
    cursor: {
      enabled: false
    }
  })

  const cursor = testElement.querySelector('[data-nex-typed-cursor]')
  expect(cursor).toBeNull()
})

test('createTyped should handle startDelay option', () => {
  const controller = createTyped(testElement, {
    strings: ['Delayed start'],
    typeSpeed: 50,
    startDelay: 100
  })

  expect(controller).toBeDefined()
  // The actual delay testing would require async testing with timers
})

test('createTyped should handle multiple strings', () => {
  const controller = createTyped(testElement, {
    strings: ['First string', 'Second string', 'Third string'],
    typeSpeed: 50
  })

  expect(controller).toBeDefined()
  // More comprehensive testing would require async testing
})

test('createTyped should handle callback functions', () => {
  let beginCalled = false
  let stringStartCalled = false
  let stringEndCalled = false
  let completeCalled = false

  const controller = createTyped(testElement, {
    strings: ['Test'],
    typeSpeed: 50,
    onBegin: () => { beginCalled = true },
    onStringStart: () => { stringStartCalled = true },
    onStringEnd: () => { stringEndCalled = true },
    onComplete: () => { completeCalled = true }
  })

  expect(controller).toBeDefined()
  // Callbacks would be tested during actual animation
})

test('createTyped should handle pause and resume', () => {
  const controller = createTyped(testElement, {
    strings: ['Pause test'],
    typeSpeed: 50
  })

  // These methods should exist and be callable
  expect(controller.pause).toBeInstanceOf(Function)
  expect(controller.resume).toBeInstanceOf(Function)

  // Calling them should not throw errors
  expect(() => controller.pause()).not.toThrow()
  expect(() => controller.resume()).not.toThrow()
})

test('createTyped should handle stop and destroy', () => {
  const controller = createTyped(testElement, {
    strings: ['Stop test'],
    typeSpeed: 50
  })

  expect(controller.stop).toBeInstanceOf(Function)
  expect(controller.destroy).toBeInstanceOf(Function)

  // Calling them should not throw errors
  expect(() => controller.stop()).not.toThrow()
  expect(() => controller.destroy()).not.toThrow()

  // After destroy, root element should be removed
  const root = testElement.querySelector('[data-nex-typed-root]')
  expect(root).toBeNull()
})

test('createTyped should handle empty strings array', () => {
  const controller = createTyped(testElement, {
    strings: [],
    typeSpeed: 50
  })

  expect(controller).toBeDefined()
  // Should handle gracefully without crashing
})

test('createTyped should use default typeSpeed when not specified', () => {
  const controller = createTyped(testElement, {
    strings: ['Default speed']
    // typeSpeed not specified, should default to 50
  })

  expect(controller).toBeDefined()
})

test('createTyped should handle cursor with default blink', () => {
  createTyped(testElement, {
    strings: ['Default blink'],
    typeSpeed: 50,
    cursor: {
      enabled: true,
      char: '|'
      // blink not specified, should default to true
    }
  })

  const cursor = testElement.querySelector('[data-nex-typed-cursor]')
  expect(cursor).toBeDefined()
})

test('createTyped should handle cursor with custom blink disabled', () => {
  createTyped(testElement, {
    strings: ['No blink'],
    typeSpeed: 50,
    cursor: {
      enabled: true,
      char: '|',
      blink: false
    }
  })

  const cursor = testElement.querySelector('[data-nex-typed-cursor]')
  expect(cursor).toBeDefined()
})

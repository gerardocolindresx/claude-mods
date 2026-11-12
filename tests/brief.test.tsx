import { expect, mock, test } from 'claude-code/testing'

const LONG_ES = Array.from({ length: 30 }, () => 'quiero que el plan sea claro para el equipo').join(' ')
const BRIEF = '## Objetivo\nUn plan claro para el equipo.'

const BAND = {
  plugin: 'brief',
  component: 'AbovePrompt',
  props: {
    hasSurvey: false,
    isCollapsed: false,
    isWorking: false,
    maxRows: 20,
    bodyColumns: 80,
    scroll: { offset: 0, bodyRows: 20 },
    view: {},
  },
} as const

test('a long message is held, briefed in its language, and sent with the original as context', async ($, on) => {
  const clock = mock.clock(on)
  const sent: { text: string; context?: readonly string[]; origin: unknown }[] = []

  on('command.register', () => ({ value: { command: 'brief' } }))
  on('store.get', () => ({ value: undefined }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('model.complete', () => ({
    value: { isAnswered: true, text: BRIEF, usage: { input_tokens: 1, output_tokens: 1, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 } },
  }))
  const appended: string[] = []
  on('session.append', (_, e, next) => {
    for (const block of e.message.content) if (block.type === 'text' && typeof block.text === 'string') appended.push(block.text)
    return next(e)
  })
  on('prompt.submit', (_, e) => {
    sent.push({ text: e.text, context: e.context, origin: e.origin })
    return { text: e.text, context: e.context }
  })

  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })

  const held = await $.prompt.submit({ text: LONG_ES, wait: false, origin: { kind: 'composer' } })
  expect(held.drop).toBeDefined()
  expect(sent.length).toBe(0)

  await clock.settle()

  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({ ...BAND, surface })
    expect((await ui.find({ type: 'Text', text: /Brief listo/ }))?.text).toContain('Brief listo')
    await ui.unmount()
  }

  const ui = await $.ui.mount({ ...BAND, surface: 'desktop' })
  await ui.press({ key: 'brief-send' })
  await ui.unmount()

  expect(sent.length).toBe(1)
  expect(sent[0]?.text).toBe(BRIEF)
  expect(appended.some(text => text.includes(LONG_ES))).toBe(true)
})

test('short messages and raw: messages pass through', async ($, on) => {
  const sent: string[] = []
  on('prompt.submit', (_, e) => {
    sent.push(e.text)
    return { text: e.text }
  })

  await $.prompt.submit({ text: 'una pregunta corta', wait: false, origin: { kind: 'composer' } })
  await $.prompt.submit({ text: `raw: ${LONG_ES}`, wait: false, origin: { kind: 'composer' } })

  expect(sent).toEqual(['una pregunta corta', LONG_ES])
})

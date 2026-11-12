// Brief: turns a long, messy message into a clear brief before Claude reads it.
//
// A message of MIN_WORDS words or more is held back. A small, fast model
// rewrites it as a brief (goal, context, what I need, constraints, open
// questions) in the same language the person wrote in. A band above the prompt
// shows the brief with four choices: send the brief, send the original text,
// edit the brief, or cancel. Start a message with "raw:" to send it untouched.
// /brief turns the mod off and on.

import { atom, read, update } from 'claude-code'
import type { EngineInterface, PromptOrigin, Register } from 'claude-code'

import type { BriefDraft } from '../types'

const PLUGIN = 'brief'
const MIN_WORDS = 100
const BYPASS = /^\s*raw:\s*/i

const draft = atom({ plugin: 'brief', key: 'draft' } as const, null)

// Module memory: what the next submission of ours should carry. A reload
// forgets it, which only costs the hidden copy of the original.
let originalForContext: string | null = null
let letNextThrough = false

const RULES = [
  'You rewrite a long, unstructured message that a person wrote to an AI assistant into a clear brief the assistant can act on.',
  '',
  'Rules:',
  '- Write in the same language as the message, section titles included.',
  '- Write in first person, as the person speaking to the assistant.',
  '- Keep every concrete fact, name, number, date, file, link and constraint. Never drop a detail and never add a fact.',
  '- If something has to be filled in to make sense, mark it as an assumption in the message language, e.g. "(supuesto)" or "(assumption)".',
  '- Use these sections in this order, as "## " Markdown headings, and leave out any that would be empty:',
  '  1. Goal: one or two sentences on the outcome wanted.',
  '  2. Context: the background the assistant needs.',
  '  3. What I need: numbered tasks or deliverables.',
  '  4. Constraints and format: limits, tone, length, tools, deadlines.',
  '  5. Open questions: at most three, only real ambiguities that would change the result, phrased so the assistant asks them before starting.',
  '- Short bullets, plain words. Reply with the brief only: no preface, no closing line.',
].join('\n')

type Lang = 'es' | 'en'

type LabelKey = 'working' | 'held' | 'ready' | 'send' | 'original' | 'edit' | 'cancel' | 'failed' | 'on' | 'off'

const LABELS: Record<Lang, Record<LabelKey, string>> = {
  es: {
    working: 'Brief: ordenando tu mensaje…',
    held: 'Brief está ordenando tu mensaje. Lo verás encima del cuadro de texto.',
    ready: 'Brief listo. Revísalo antes de enviarlo:',
    send: 'Enviar brief',
    original: 'Enviar mi texto',
    edit: 'Editar',
    cancel: 'Cancelar',
    failed: 'Brief no pudo ordenar el mensaje, así que se envió tal cual.',
    on: 'Brief activado: los mensajes largos se convierten en un brief antes de enviarse.',
    off: 'Brief desactivado. Escribe /brief para volver a activarlo.',
  },
  en: {
    working: 'Brief: sorting your message…',
    held: 'Brief is sorting your message. You will see it above the prompt.',
    ready: 'Brief ready. Check it before you send it:',
    send: 'Send brief',
    original: 'Send my text',
    edit: 'Edit',
    cancel: 'Cancel',
    failed: "Brief couldn't sort the message, so it was sent as written.",
    on: 'Brief is on: long messages become a brief before they are sent.',
    off: 'Brief is off. Type /brief to turn it back on.',
  },
}

const SPANISH_WORDS = /\b(que|para|quiero|pero|como|los|las|una|con|por|esto|necesito|también|porque)\b/gi

export function languageOf(text: string): Lang {
  return (text.match(SPANISH_WORDS)?.length ?? 0) >= 3 ? 'es' : 'en'
}

export function wordCount(text: string): number {
  const words = text.trim().split(/\s+/)
  return words[0] === '' ? 0 : words.length
}

function isTypedByPerson(origin: PromptOrigin): boolean {
  return origin.kind === 'composer' || origin.kind === 'bridge'
}

function contextNote(original: string): string {
  return [
    'The person wrote the message below; the Brief mod restructured it into the brief they just sent.',
    'Work from the brief. Use this original only for any detail the brief left out.',
    '',
    original,
  ].join('\n')
}

async function isOn($: EngineInterface): Promise<boolean> {
  return (await $.store.get('enabled')) !== false
}

async function build($: EngineInterface, original: string): Promise<void> {
  const reply = await $.model.complete({
    model: 'haiku',
    system: RULES,
    prompt: original,
    maxTokens: 2000,
    timeoutMs: 60_000,
  })
  const brief = reply.isAnswered ? reply.text.trim() : ''

  if (brief === '') {
    await update($, draft, () => null)
    $.ui.toast(LABELS[languageOf(original)].failed)
    await $.prompt.submit({ text: original, asUser: true })
    return
  }

  await update($, draft, () => ({ original, status: 'ready', brief }))
}

async function take($: EngineInterface): Promise<BriefDraft | null> {
  const current = await read($, draft)
  await update($, draft, () => null)
  return current
}

async function sendBrief($: EngineInterface): Promise<void> {
  const current = await take($)
  if (current === null) return
  // The model reads the original beside the brief; the person never sees this row.
  try {
    await $.session.append({ message: { type: 'user', content: [{ type: 'text', text: contextNote(current.original) }] } })
  } catch {
    // Refused: the brief still goes; it keeps every fact.
  }
  await $.prompt.submit({ text: current.brief, asUser: true })
}

async function sendOriginal($: EngineInterface): Promise<void> {
  const current = await take($)
  if (current === null) return
  await $.prompt.submit({ text: current.original, asUser: true })
}

async function editBrief($: EngineInterface): Promise<void> {
  const current = await take($)
  if (current === null) return
  letNextThrough = true
  originalForContext = current.original
  await $.prompt.fill({ text: current.brief })
}

async function cancel($: EngineInterface): Promise<void> {
  const current = await take($)
  if (current === null) return
  await $.prompt.fill({ text: current.original })
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'brief',
      description: 'Turn Brief on or off (long messages become a clear brief before sending)',
    })
    return next(e)
  })

  on('command.run', { command: 'brief' }, async $ => {
    const now = !(await isOn($))
    await $.store.set('enabled', now)
    if (!now) await update($, draft, () => null)
    return { text: LABELS.es[now ? 'on' : 'off'] + '\n' + LABELS.en[now ? 'on' : 'off'] }
  })

  on('prompt.submit', async ($, e, next) => {
    // Our own submissions pass untouched.
    if (e.origin.kind === 'plugin' && e.origin.name === PLUGIN) return next(e)

    if (e.command !== undefined || e.isMeta === true || !isTypedByPerson(e.origin)) return next(e)

    if (BYPASS.test(e.text)) return next({ ...e, text: e.text.replace(BYPASS, '') })

    // An edited brief or a message we already let go: once, untouched.
    if (letNextThrough) {
      letNextThrough = false
      const original = originalForContext
      originalForContext = null
      return original === null ? next(e) : next({ ...e, context: [...(e.context ?? []), contextNote(original)] })
    }

    const isLong = wordCount(e.text) >= MIN_WORDS
    const hasMedia = (e.attachments?.length ?? 0) > 0
    if (!isLong || hasMedia || !(await isOn($)) || (await read($, draft)) !== null) return next(e)

    await update($, draft, () => ({ original: e.text, status: 'working', brief: '' }))
    const text = e.text
    $.clock.after(0, () => void build($, text))
    return { drop: LABELS[languageOf(text)].held }
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const current = await read($, draft)
    if (e.props.hasSurvey || current === null) return next(e)

    const { Box, Button, Text } = $.ui.resolve(e)
    const t = LABELS[languageOf(current.original)]

    if (current.status === 'working') {
      return (
        <Box>
          <Text dimColor>{t.working}</Text>
        </Box>
      )
    }

    return (
      <Box flexDirection="column" borderStyle="round" paddingX={1}>
        <Text bold>{t.ready}</Text>
        <Text>{current.brief}</Text>
        <Box flexDirection="row">
          <Button key="brief-send" label={t.send} variant="primary" onPress={() => void sendBrief($)} />
          <Button key="brief-original" label={t.original} onPress={() => void sendOriginal($)} />
          <Button key="brief-edit" label={t.edit} onPress={() => void editBrief($)} />
          <Button key="brief-cancel" label={t.cancel} plain dimColor onPress={() => void cancel($)} />
        </Box>
      </Box>
    )
  })
}

export type BriefStatus = 'working' | 'ready'

export type BriefDraft = {
  /** What the person typed, word for word. */
  original: string
  status: BriefStatus
  /** The structured brief, once the model has written it. */
  brief: string
}

declare module 'claude-code' {
  interface PluginState {
    brief: { draft: BriefDraft | null }
  }
}

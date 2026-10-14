import z from '@deepseek-ai/schemastery'

/**
 * Settings namespace for the private-wiki reader. The namespace string is
 * spelled here (not imported from `@deepseek-ai/dsh-settings`) so this plugin
 * adds no host dependency edge — the settings service is provided by the
 * harness plugin tree at runtime, and the string + type shim below is all the
 * plugin needs to register.
 */
export const WIKI_SETTINGS_NS = 'wiki'

/** Default wiki repo, `owner/name`. Overridable per device in settings.yaml. */
export const DEFAULT_REPO = 'lb-aigc/aigc-video-wiki'

export interface WikiSettings {
  /** GitHub fine-grained PAT scoped to the wiki repo (contents: read). */
  token?: string
  /** Repo as `owner/name`. Falls back to DEFAULT_REPO. */
  repo?: string
}

export const WikiSettingsSchema: z<WikiSettings> = z.object({
  token: z.string(),
  repo: z.string(),
})

/**
 * Minimal type surface of the user-settings service this plugin consumes. It
 * mirrors `@deepseek-ai/dsh-settings` (`SettingsScope` / `SettingsProvider.register`)
 * without importing that package, so the plugin compiles against the harness's
 * runtime service while the lockfile stays untouched.
 */
export interface WikiSettingsScope<T> {
  get(): T
  watch(callback: (next: T, prev: T) => void | Promise<void>): () => void
}

export interface WikiSettingsProvider {
  register<T>(
    ns: string,
    schema: z<T>,
    options?: { readonly base?: Partial<T> },
  ): WikiSettingsScope<T>
}

declare module '@deepseek-ai/cordis' {
  interface Context {
    settings: WikiSettingsProvider
  }
}

import z from '@deepseek-ai/schemastery';
/**
 * Settings namespace for the private-wiki reader. The namespace string is
 * spelled here (not imported from `@deepseek-ai/dsh-settings`) so this plugin
 * adds no host dependency edge — the settings service is provided by the
 * harness plugin tree at runtime, and the string + type shim below is all the
 * plugin needs to register.
 */
export const WIKI_SETTINGS_NS = 'wiki';
/** Default wiki repo, `owner/name`. Overridable per device in settings.yaml. */
export const DEFAULT_REPO = 'lb-aigc/aigc-video-wiki';
export const WikiSettingsSchema = z.object({
    token: z.string(),
    repo: z.string(),
});
//# sourceMappingURL=settings.js.map
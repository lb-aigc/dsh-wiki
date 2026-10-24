import z from '@deepseek-ai/schemastery';
/**
 * Wiki settings. 0.2.0 derives the settings namespace from the plugin entry
 * id (`ldd-wiki`, see cordis.patch.yml) — there is NO manual
 * `settings.register(ns, schema)` call (that API was removed in 0.2.0). The
 * config arrives via `apply(ctx, config)`'s second argument, backed by the
 * `config:` object in cordis.patch.yml (or the user's profile patch override).
 */
export const WIKI_SETTINGS_NS = 'ldd-wiki';
/** Default wiki repo, `owner/name`. Overridable per device. */
export const DEFAULT_REPO = 'lb-aigc/aigc-video-wiki';
export const WikiConfigSchema = z.object({
    token: z.string().default(''),
    repo: z.string().default(DEFAULT_REPO),
});
//# sourceMappingURL=settings.js.map
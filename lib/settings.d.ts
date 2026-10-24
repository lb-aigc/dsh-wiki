import z from '@deepseek-ai/schemastery';
/**
 * Wiki settings. 0.2.0 derives the settings namespace from the plugin entry
 * id (`ldd-wiki`, see cordis.patch.yml) — there is NO manual
 * `settings.register(ns, schema)` call (that API was removed in 0.2.0). The
 * config arrives via `apply(ctx, config)`'s second argument, backed by the
 * `config:` object in cordis.patch.yml (or the user's profile patch override).
 */
export declare const WIKI_SETTINGS_NS = "ldd-wiki";
/** Default wiki repo, `owner/name`. Overridable per device. */
export declare const DEFAULT_REPO = "lb-aigc/aigc-video-wiki";
export interface WikiSettings {
    /** GitHub fine-grained PAT scoped to the wiki repo (contents: read). */
    token?: string;
    /** Repo as `owner/name`. Falls back to DEFAULT_REPO. */
    repo?: string;
}
/** Raw config input accepted by the schema (all optional). */
export interface WikiConfigInput {
    token?: string | null;
    repo?: string | null;
}
export interface WikiConfig {
    token: string;
    repo: string;
}
export declare const WikiConfigSchema: z<WikiConfigInput, WikiConfig>;
//# sourceMappingURL=settings.d.ts.map
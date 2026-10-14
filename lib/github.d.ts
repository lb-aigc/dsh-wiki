/**
 * GitHub Contents + Git Trees client for reading a private wiki repo at
 * request time. Content is fetched per call and never written to disk — the
 * revocation premise of this plugin: revoke the PAT server-side and every
 * subsequent call 401s immediately.
 */
/**
 * List `.md` blob paths under the repo (recursive tree).
 *
 * `scope` controls what gets returned. The wiki's own schema (AGENTS.md)
 * separates structured knowledge (`wiki/`, the agent-authored pages) from raw
 * ingest material (`raw/`, human-only, never agent-read in the first pass).
 * Default `wiki` returns the structured pages + the repo entry files so the
 * agent follows "read wiki/ first, fall back to raw/ only when needed".
 */
export declare function listWikiPages(repo: string, token: string, scope?: 'wiki' | 'all', branch?: string): Promise<string[]>;
/** Read one page's full Markdown text. */
export declare function readWikiPage(repo: string, token: string, path: string): Promise<string>;
//# sourceMappingURL=github.d.ts.map
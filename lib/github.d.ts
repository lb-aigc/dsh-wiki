/**
 * GitHub Contents + Git Trees client for reading a private wiki repo at
 * request time. Content is fetched per call and never written to disk — the
 * revocation premise of this plugin: revoke the PAT server-side and every
 * subsequent call 401s immediately.
 */
/** List every `.md` blob path under the repo (recursive tree). */
export declare function listWikiPages(repo: string, token: string, branch?: string): Promise<string[]>;
/** Read one page's full Markdown text. */
export declare function readWikiPage(repo: string, token: string, path: string): Promise<string>;
//# sourceMappingURL=github.d.ts.map
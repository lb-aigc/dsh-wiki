/**
 * GitHub Contents + Git Trees client for reading a private wiki repo at
 * request time. Content is fetched per call and never written to disk — the
 * revocation premise of this plugin: revoke the PAT server-side and every
 * subsequent call 401s immediately.
 */
const GITHUB_API = 'https://api.github.com';
const REQUEST_TIMEOUT_MS = 20_000;
function headers(token) {
    return {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'ldd-dsh-wiki',
    };
}
function encodePath(path) {
    return path.split('/').map((segment) => encodeURIComponent(segment)).join('/');
}
/**
 * List `.md` blob paths under the repo (recursive tree).
 *
 * `scope` controls what gets returned. The wiki's own schema (AGENTS.md)
 * separates structured knowledge (`wiki/`, the agent-authored pages) from raw
 * ingest material (`raw/`, human-only, never agent-read in the first pass).
 * Default `wiki` returns the structured pages + the repo entry files so the
 * agent follows "read wiki/ first, fall back to raw/ only when needed".
 */
export async function listWikiPages(repo, token, scope = 'wiki', branch = 'main') {
    const url = `${GITHUB_API}/repos/${repo}/git/trees/${encodeURIComponent(branch)}?recursive=1`;
    const res = await fetch(url, { headers: headers(token), signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
    if (!res.ok)
        throw new Error(`GitHub API ${res.status}: ${await safeText(res)}`);
    const data = (await res.json());
    const pages = (data.tree ?? [])
        .filter((entry) => entry.type === 'blob' && entry.path !== undefined && entry.path.endsWith('.md'))
        .map((entry) => entry.path)
        .sort();
    if (scope === 'all')
        return pages;
    return pages.filter((path) => path === 'AGENTS.md' || path === 'README.md' || path.startsWith('wiki/'));
}
/** Read one page's full Markdown text. */
export async function readWikiPage(repo, token, path) {
    const url = `${GITHUB_API}/repos/${repo}/contents/${encodePath(path)}`;
    const res = await fetch(url, { headers: headers(token), signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
    if (!res.ok)
        throw new Error(`GitHub API ${res.status}: ${await safeText(res)}`);
    const data = (await res.json());
    if (data.encoding === 'base64' && typeof data.content === 'string') {
        return Buffer.from(data.content, 'base64').toString('utf8');
    }
    // Large files (>1MB) return a download_url instead of inline content.
    if (typeof data.download_url === 'string' && data.download_url !== '') {
        const raw = await fetch(data.download_url, { headers: headers(token), signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
        if (!raw.ok)
            throw new Error(`GitHub raw ${raw.status}: ${await safeText(raw)}`);
        return await raw.text();
    }
    throw new Error(`wiki page "${path}" has no readable content`);
}
async function safeText(res) {
    try {
        return (await res.text()).slice(0, 500);
    }
    catch {
        return '(no body)';
    }
}
//# sourceMappingURL=github.js.map
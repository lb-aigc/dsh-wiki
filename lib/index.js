import z from '@deepseek-ai/schemastery';
import { defineTool } from '@deepseek-ai/dsh-tools';
import { WIKI_SETTINGS_NS, WikiSettingsSchema, DEFAULT_REPO } from "./settings.js";
import { listWikiPages, readWikiPage } from "./github.js";
export const name = 'ldd-wiki';
export const inject = ['tools', 'settings'];
export function apply(ctx) {
    let resolve;
    ctx.inject(['settings'], (settingsCtx) => {
        const scope = settingsCtx.settings.register(WIKI_SETTINGS_NS, WikiSettingsSchema, {
            base: { repo: DEFAULT_REPO },
        });
        resolve = () => {
            const cfg = scope.get();
            const repo = cfg.repo && cfg.repo !== '' ? cfg.repo : DEFAULT_REPO;
            const token = cfg.token && cfg.token !== '' ? cfg.token : process.env.WIKI_TOKEN ?? '';
            if (token === '') {
                throw new Error('wiki 未配置访问令牌：请在 settings.yaml 的 wiki.token 填入 GitHub fine-grained PAT（或设置 WIKI_TOKEN 环境变量）');
            }
            return { token, repo };
        };
    });
    const requireConfig = () => {
        if (resolve === undefined) {
            throw new Error('wiki 配置不可用：settings 服务未加载');
        }
        return resolve();
    };
    const listTool = defineTool({
        name: 'wiki_list',
        description: '列出私有 wiki 知识库（AIGC 视频 / 广告 / 短剧领域）的全部 Markdown 页面路径。调用它先了解目录结构，再用 wiki_read 读具体页。内容实时从私有仓库拉取，不落盘。',
        parameters: {},
        output: {
            schema: {
                type: 'object',
                additionalProperties: false,
                properties: {
                    pages: { type: 'array', required: true, items: { type: 'string' } },
                    count: { type: 'integer', required: true },
                },
            },
            render: (_args, value) => [
                { type: 'text', text: `wiki 共 ${value.count} 个页面：\n${value.pages.join('\n')}` },
            ],
        },
        isConcurrencySafe: () => true,
        async execute() {
            const { token, repo } = requireConfig();
            const pages = await listWikiPages(repo, token);
            return { pages, count: pages.length };
        },
    });
    const readTool = defineTool({
        name: 'wiki_read',
        description: '读取私有 wiki 知识库某一页的完整 Markdown 内容。path 用 wiki_list 返回的路径（如 wiki/index.md、wiki/methodologies/xxx.md）。内容每次实时拉取、用后即弃，不写磁盘。',
        parameters: {
            path: {
                type: 'string',
                required: true,
                description: '页面相对路径，取 wiki_list 返回的路径（含 wiki/ 前缀）。',
            },
        },
        output: {
            schema: {
                type: 'object',
                additionalProperties: false,
                properties: {
                    path: { type: 'string', required: true },
                    content: { type: 'string', required: true },
                },
            },
            render: (_args, value) => [{ type: 'text', text: value.content }],
        },
        isConcurrencySafe: () => true,
        async execute(args) {
            const { token, repo } = requireConfig();
            const content = await readWikiPage(repo, token, args.path);
            return { path: args.path, content };
        },
    });
    const disposers = [listTool, readTool].map((tool) => ctx.tools.register(tool));
    ctx.effect(() => () => {
        for (const dispose of disposers)
            dispose();
    }, 'ldd-wiki: dispose tools');
}
//# sourceMappingURL=index.js.map
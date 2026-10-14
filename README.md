# @ldd/dsh-wiki

把**私有 wiki 知识库**（GitHub private repo）作为实时工具接入 LLD agent —— 内容每次现查现取、**不落盘**，撤销访问令牌即秒级断供。

## 用途

Agent 通过两个工具按需读私有 wiki（AIGC 视频 / 广告 / 短剧领域知识）：

- `wiki_list` — 列出全部 `.md` 页面路径（先看目录）
- `wiki_read` — 读某一页完整 Markdown（`path` 来自 `wiki_list`）

配合 wiki 的「先读 `wiki/index.md` 总目录再跳转」设计：agent 先 `wiki_list`，再 `wiki_read` 读 index 和具体页，体量按需控制。

## 安装（可装卸）

```bash
# 用 LDD 的 dsh CLI（参考第三方插件安装流程）
"$NODE" "$DSH" plugin --profile web add "https://github.com/lb-aigc/dsh-wiki.git"
```

卸载：`dsh plugin --profile web remove @ldd/dsh-wiki`（或删掉 profile 里的依赖 + bundle 条目）。

## 配置（settings.yaml）

在 `<DSH_HOME>/settings.yaml` 增加一个 `wiki` 命名空间：

```yaml
wiki:
  repo: lb-aigc/aigc-video-wiki   # owner/name，可省略（有默认值）
  token: github_pat_xxx           # GitHub fine-grained PAT（只读该仓库）
```

`token` 也可用环境变量 `WIKI_TOKEN` 提供（不落盘）。两者都未配置时，工具调用会报错提示。

## 授权 / 撤销（每设备独立）

- **发**：GitHub → 该私有仓库 → Settings → Fine-grained personal access tokens → 只勾 `Contents: Read-only`、只选这一个仓库，生成 PAT。
- **断**：GitHub → 删除该 PAT → 对方下一次 `wiki_list` / `wiki_read` 立即 401。

内容永不落盘，所以撤销是即时的：没有"已同步到磁盘的旧副本"可残留。

## 说明

- token 是 fine-grained、只读单仓库，泄露影响面 = 只能读该 wiki（"能用 wiki"本已授予此权限）；真正兜底的是"你能随时 revoke"。
- 第一版为纯 host 插件（无 UI 设置卡），token 手填 settings.yaml；将来换自建 API 只需改 `src/github.ts` 的 `GITHUB_API` 基址 + 鉴权头。

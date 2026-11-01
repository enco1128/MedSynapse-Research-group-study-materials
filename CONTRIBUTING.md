# 贡献指南

本仓库是 MedSynapse 课题组的科研入门体系，任何修改都应保持**三端同构**：同一阶段编号同时出现在网页、LaTeX 手册与资源目录里。

## 目录与编号对应

| 阶段 | 网页 `docs/` | LaTeX `latex/sections/` | 资源 `resources/` |
|---|---|---|---|
| 01 导论 | `1-导论/` | `01-intro.tex` | `01-mindset/` |
| 02 文献 | `2-文献/` | `02-related.tex` | `02-literature/` |
| 03 代码 | `3-代码/` | `03-method.tex` | `03-coding/` |
| 04 实验 | `4-实验/` | `04-experiments.tex` | `04-experiment/` |
| 05 写作 | `5-写作/` | `05-writing.tex` | `05-writing/` |
| 06 课题范式 | `6-课题范式/` | `06-case.tex` | `06-domain/` |
| 07 路线图 | `7-路线图/` | `07-conclusion.tex` | `templates/` |
| 08 附录 | `8-附录/` | `A-appendix.tex` | `08-links/` |

新增页面时沿用 `N-标题.md` 的数字前缀，侧边栏由 `vitepress-sidebar` 按前缀排序，不要手工维护 sidebar 列表。

## 页面写法

每页保持既有骨架：**品牌行 → 本页目标 → 正文 → Checklist → 进入下一阶段**。

- 品牌行统一为 `> **MedSynapse课题组科研入门** · 对应论文章节：**XXX**`。
- 正文用表格与短句，避免整段散文；可执行的内容放进 Checklist。
- 指向仓库文件的链接写绝对 URL（`https://github.com/enco1128/MedSynapse-Research-group-study-materials/blob/main/...`），站内跳转用 `/阶段/页面` 绝对路径。

## 链接与数据规则

- **链接必须实测过再提交**。不确定就写「待补」，不要凭印象拼 URL。
- 范例数据（如 `resources/02-literature/*_example.md`）只能来自组内原表，字段缺失就标注缺失，不得补写或猜测。
- 反爬返回 403/202 的站点（知乎、MDPI、OpenReview、IEEE）不等于死链，改动前先人工确认。
- 自检命令：

```bash
python scripts/check_links.py          # 仓库内引用 + base 一致性，致命
python scripts/check_links.py --net    # 追加外部链接探测，仅报告
```

## 仓库改名 / 迁移时必须同步的位置

GitHub Pages **不会**随仓库改名重定向，改名后站点会整页丢样式。以下每一处都要改：

1. `docs/.vitepress/config.mts`：`base`、`head` 里的 favicon 路径、`repo`、`site`、`siteTitle`；
2. `scripts/check_links.py`：`SITE` 与 `REPO_SLUG` 常量；
3. `README.md` 与 `docs/index.md` 的全部站点/仓库 URL；
4. 各 `docs/**/*.md` 品牌行与仓库资源链接；
5. 仓库 Settings → Pages → Custom domain / homepage 字段。

改完必须线上复验：抓首页 HTML，确认 `<link href="...">` 的前缀与新 base 一致，且这些资源返回 200。

## 本地开发与构建

```bash
npm install
npm run docs:dev      # 本地预览
npm run docs:build    # 构建；VitePress 会对死链直接报错
```

LaTeX 手册：`latex/main.tex`，编译器 XeLaTeX（本地 TeX Live 或 Overleaf 导入本仓库）。

## 提交与部署

1. 从 `main` 切分支，一个 PR 只解决一件事；
2. PR 里贴出自检命令的输出（链接、构建）；
3. CI 的 `Deploy VitePress` 与 `Check links` 通过后再合并；
4. 合并后到 Actions 确认 Pages 部署成功，再打开线上站点抽查一页。

## 不要提交

未脱敏的项目细节、患者数据、未授权数据集、账号与密钥、编译中间产物（`*.aux`、`*.log`、`docs/.vitepress/dist/` 已在 `.gitignore` 中）。

# 深度指引 Web

基于 Nuxt 4、Vue 3、Pinia 和 Nitro 的工具导航站。前端业务数据统一通过 API 获取，当前仓库内置一套 Nitro 模拟后端，便于前后端并行开发和后续无缝替换真实服务。

## 本地开发

```bash
pnpm install
pnpm dev
```

常用检查：

```bash
pnpm typecheck
pnpm build
```

## 后端对接

复制环境变量示例并配置真实后端地址：

```bash
Copy-Item .env.example .env
```

```env
NUXT_PUBLIC_API_BASE=https://api.example.com
NUXT_PUBLIC_SITE_URL=https://www.example.com
```

- 所有接口统一返回 `{ code, message, data, timestamp }`。
- 前端接口入口为 `app/composables/useApi.ts`，会自动解包 `data`、携带 Cookie，并在 SSR 时透传 Cookie。
- 共享请求/响应模型位于 `shared/types/index.ts`。
- 当前模拟数据位于 `server/data`，账号模拟仓储位于 `server/utils/account.ts`；生产环境应替换为数据库和真实认证服务。
- 完整接口清单和接入约束见 `docs/backend-integration.md`。

## 数据边界

- 站点导航、页脚、热门词、侧栏入口、错误页入口、评分选项均由 `/api/site/config` 返回。
- 分类、工具、榜单、专题、搜索、静态页面、投稿选项均由对应 API 返回。
- 登录态使用 HttpOnly Cookie；收藏、历史、草稿、投稿、点评和账号资料不写入 `localStorage`。
- 主题偏好属于纯客户端展示设置，仍由 `@nuxtjs/color-mode` 在浏览器保存。

## 目录

```text
app/             Nuxt 页面、组件、状态与组合式函数
server/api/      Nitro API 路由（真实后端的契约参考）
server/data/     开发环境模拟数据
server/utils/    模拟仓储、校验和目录查询逻辑
shared/types/    前后端共享 TypeScript 契约
docs/            对接文档
```

> 当前 Nitro 仓储为进程内存实现，服务重启后账号写入数据会重置，仅用于开发演示。

# 后端接口对接说明

## 1. 通用约定

所有成功响应统一使用以下信封：

```json
{
  "code": 0,
  "message": "ok",
  "data": {},
  "timestamp": 1786266000000
}
```

- `Content-Type`: `application/json; charset=utf-8`
- 鉴权：HttpOnly Session Cookie
- 前端请求：始终使用 `credentials: include`
- 参数校验失败：HTTP `422`
- 未登录：HTTP `401`
- 资源不存在：HTTP `404`
- 状态冲突或重复操作：HTTP `409`
- 频率限制：HTTP `429`

若前后端跨域部署，后端必须：

1. 返回明确的 `Access-Control-Allow-Origin`，不能使用 `*`。
2. 返回 `Access-Control-Allow-Credentials: true`。
3. 生产 Cookie 使用 `Secure`，跨站部署时按实际拓扑设置 `SameSite=None`。
4. 允许 `GET, POST, PUT, PATCH, DELETE, OPTIONS`。

前端通过 `NUXT_PUBLIC_API_BASE` 切换真实后端，无需修改页面代码。

## 2. 鉴权与账号

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `POST` | `/api/auth/code` | 发送登录验证码，Body: `{ phone }` |
| `POST` | `/api/auth/login` | 验证并建立会话，Body: `{ phone, code }` |
| `GET` | `/api/auth/session` | 恢复当前会话与账号快照 |
| `POST` | `/api/auth/logout` | 注销并清除 Session Cookie |
| `GET` | `/api/account/overview` | 个人中心数据、导航、状态筛选与消息 |
| `PATCH` | `/api/account/profile` | 更新资料，Body: `{ nickname, bio, location }` |
| `POST` | `/api/account/favorites` | 切换收藏，Body: `{ toolSlug }` |
| `DELETE` | `/api/account/favorites/:slug` | 删除单条收藏 |
| `DELETE` | `/api/account/favorites` | 清空收藏 |
| `POST` | `/api/account/history` | 记录浏览，Body: `{ toolSlug }` |
| `DELETE` | `/api/account/history/:slug` | 删除单条历史 |
| `DELETE` | `/api/account/history` | 清空历史 |
| `PUT` | `/api/account/draft` | 保存投稿草稿 |
| `DELETE` | `/api/account/draft` | 删除投稿草稿 |
| `DELETE` | `/api/account/submissions/:id` | 撤回审核中的投稿 |
| `DELETE` | `/api/account/data` | 清空收藏、历史和草稿 |

`POST /api/auth/login` 的 `data` 对应 `LoginPayload`：

```ts
interface LoginPayload {
  session: {
    user: User
    expiresAt: string
  }
  account: AccountSnapshot
}
```

`AccountSnapshot` 是账号域唯一快照，包含 `user`、`favorites`、`history`、`submissions`、`draft` 和 `reviews`。后端返回空数组时前端会按真实空状态显示，不会回退演示数据。

## 3. 站点与内容

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `GET` | `/api/site/config` | 全站导航、页脚、侧栏、搜索词和评分选项 |
| `GET` | `/api/home` | 首页全部区块数据 |
| `GET` | `/api/categories` | 分类与子分类列表 |
| `GET` | `/api/categories/:slug` | 分类页数据 |
| `GET` | `/api/subcategories/:slug` | 子分类筛选和分页数据 |
| `GET` | `/api/tools` | 工具分页查询 |
| `GET` | `/api/tools/:slug` | 工具详情、评分、评价和推荐 |
| `POST` | `/api/tools/:slug/reviews` | 发布评价，Body: `{ rating, content }` |
| `POST` | `/api/tools/:slug/reviews/:id/like` | 点赞评价，同账号不可重复 |
| `GET` | `/api/ranking` | 榜单、周期和分类选项 |
| `GET` | `/api/topics` | 专题列表 |
| `GET` | `/api/topics/:slug` | 专题详情、筛选和排序选项 |
| `GET` | `/api/search` | 搜索结果、分面和排序选项 |
| `GET` | `/api/search/suggest` | 全局搜索建议 |
| `GET` | `/api/pages/:slug` | 关于、协议、隐私等静态内容 |
| `GET` | `/api/assets/favicon` | 图标代理，失败时回退站点图标 |

分页查询使用 `page` 和 `pageSize`，服务端会将 `pageSize` 限制在 `1-100`。排序枚举为：

```ts
type SearchSort = 'heat' | 'newest' | 'name'
```

未知枚举会回退默认值，不应直接进入数据库排序表达式。

## 4. 投稿与反馈

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `GET` | `/api/submissions/options` | 投稿分类、语言、标签、步骤和说明 |
| `POST` | `/api/submissions` | 创建投稿，需登录 |
| `GET` | `/api/feedback/options` | 反馈类型、占位提示和说明 |
| `POST` | `/api/feedback` | 提交反馈，需登录 |

投稿校验模型为 `SubmissionForm`，字段级错误格式：

```json
{
  "statusCode": 422,
  "statusMessage": "表单校验未通过",
  "data": {
    "errors": {
      "name": "请输入网站名称"
    }
  }
}
```

## 5. 替换模拟后端

推荐按以下顺序接入：

1. 先实现认证、`/api/auth/session` 和 `AccountSnapshot`。
2. 实现 `/api/site/config`、首页、分类、工具、搜索和专题只读接口。
3. 实现收藏、历史、草稿、投稿、评价和反馈写接口。
4. 设置 `NUXT_PUBLIC_API_BASE` 指向真实服务。
5. 对照 `shared/types/index.ts` 做契约测试。
6. 删除或停用部署环境中的 `server/data` 和模拟仓储路由。

生产实现中，服务端必须根据 `toolSlug` 查询并组装收藏/历史数据，不能信任客户端提交的工具名称、网址或分类；当前模拟接口已按此规则实现。

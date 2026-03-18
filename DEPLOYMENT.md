# 部署指南

本文档将指导你如何将 Image Background Remover 部署到 Cloudflare Pages 和 Cloudflare Workers。

## 📋 前置要求

1. 一个 [Cloudflare](https://www.cloudflare.com/) 账号
2. 一个 [remove.bg](https://www.remove.bg/api) API Key
3. [Node.js](https://nodejs.org/) 18.x 或更高版本
4. [Git](https://git-scm.com/)

## 🔑 获取 API Key

1. 访问 [remove.bg API](https://www.remove.bg/api)
2. 注册账号
3. 免费获取 API Key（每月 50 次调用）

## 🚀 部署步骤

### 方案 1：部署到 Cloudflare Pages（推荐）

#### 1. 克隆项目

```bash
git clone https://github.com/kechris8877-cpu/image-background-remover.git
cd image-background-remover
```

#### 2. 安装依赖

```bash
npm install
```

#### 3. 创建 `.env.local` 文件

```bash
echo "REMOVE_BG_API_KEY=your_api_key_here" > .env.local
```

#### 4. 本地测试

```bash
npm run dev
```

访问 http://localhost:3000 测试功能。

#### 5. 构建项目

```bash
npm run build
```

#### 6. 部署到 Cloudflare Pages

**方法 A：通过 Cloudflare Dashboard**

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages**
3. 点击 **Create application**
4. 选择 **Pages**
5. 点击 **Upload assets**
6. 上传 `.next` 文件夹（需要先手动构建）
7. 或者选择 **Connect to Git** 连接 GitHub 仓库

**方法 B：通过 Wrangler CLI**

```bash
# 安装 Wrangler CLI
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 部署到 Pages
npx wrangler pages deploy .next --project-name=image-background-remover
```

#### 7. 配置环境变量

在 Cloudflare Pages 项目设置中添加环境变量：

- 名称：`REMOVE_BG_API_KEY`
- 值：你的 remove.bg API Key

#### 8. 配置自定义域名（可选）

在 Cloudflare Pages 设置中添加自定义域名。

---

### 方案 2：部署到 Cloudflare Workers（API 代理）

如果需要使用 Cloudflare Workers 作为 API 代理层：

#### 1. 安装 Wrangler CLI

```bash
npm install -g wrangler
```

#### 2. 登录 Cloudflare

```bash
wrangler login
```

#### 3. 配置 `wrangler.toml`

编辑 `wrangler.toml` 文件，添加你的 API Key：

```toml
name = "image-background-remover-api"
main = "worker.js"
compatibility_date = "2024-04-01"

[env.production.vars]
REMOVE_BG_API_KEY = "your_actual_api_key_here"
```

#### 4. 部署 Worker

```bash
wrangler deploy
```

#### 5. 获取 Worker URL

部署完成后，你会得到一个类似这样的 URL：
```
https://image-background-remover-api.your-subdomain.workers.dev
```

#### 6. 更新前端 API 地址

在 `src/app/page.tsx` 中更新 API 地址：

```typescript
const response = await fetch("https://image-background-remover-api.your-subdomain.workers.dev/api/remove-bg", {
  method: "POST",
  body: formData,
});
```

---

### 方案 3：混合部署（推荐生产环境）

将前端部署到 Cloudflare Pages，API 部署到 Cloudflare Workers。

#### 1. 部署 API Worker

按照方案 2 的步骤部署 Worker。

#### 2. 部署前端 Pages

按照方案 1 的步骤部署前端。

#### 3. 配置 API 路由

在 Cloudflare Pages 中创建 `_worker.js` 文件来路由 API 请求：

```javascript
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    if (url.pathname.startsWith('/api/')) {
      // 转发 API 请求到 Cloudflare Worker
      const workerUrl = `https://image-background-remover-api.your-subdomain.workers.dev${url.pathname}`;
      return fetch(workerUrl, request);
    }
    
    // 返回前端静态文件
    return env.ASSETS.fetch(request);
  },
};
```

---

## 🔧 环境变量配置

### Cloudflare Pages

在 Cloudflare Dashboard 中配置：

1. 进入项目设置
2. 找到 **Environment variables**
3. 添加以下变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `REMOVE_BG_API_KEY` | `your_api_key_here` | remove.bg API 密钥 |

### Cloudflare Workers

在 `wrangler.toml` 中配置或通过命令行设置：

```bash
wrangler secret put REMOVE_BG_API_KEY
```

---

## 📊 监控与日志

### Cloudflare Pages

1. 进入项目 **Settings** → **Functions**
2. 查看 **Real-time logs** 和 **Analytics**

### Cloudflare Workers

1. 进入 Worker **Monitoring** 标签
2. 查看请求日志、错误率和性能指标

---

## 🛠️ 故障排查

### 问题 1：API 调用失败

**原因**：API Key 无效或过期

**解决方案**：
- 检查 API Key 是否正确
- 确认 remove.bg 账号状态
- 检查 API 额度是否用完

### 问题 2：文件上传失败

**原因**：文件过大或格式不支持

**解决方案**：
- 确保文件小于 10MB
- 使用 JPG、PNG、WebP 格式
- 检查网络连接

### 问题 3：部署失败

**原因**：Cloudflare 配置错误或权限问题

**解决方案**：
- 检查 `wrangler.toml` 配置
- 确认 Cloudflare 账号权限
- 查看 Cloudflare Dashboard 错误日志

---

## 📈 性能优化建议

1. **启用 Cloudflare 缓存**：缓存静态资源
2. **使用 Cloudflare Images**：优化图片加载
3. **配置 CDN**：利用全球 CDN 加速
4. **启用压缩**：减少传输数据量
5. **监控 API 调用**：控制成本

---

## 🔒 安全建议

1. **保护 API Key**：不要将 API Key 提交到 Git 仓库
2. **使用环境变量**：通过环境变量管理敏感信息
3. **启用 HTTPS**：确保所有通信都使用 HTTPS
4. **限制访问**：根据需要限制 API 访问频率
5. **定期更新**：及时更新依赖和配置

---

## 📚 相关资源

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)
- [remove.bg API 文档](https://www.remove.bg/api)

---

## 💡 提示

- 免费版 remove.bg 每月 50 次调用
- Cloudflare Workers 免费版每天 100,000 次请求
- 建议先部署测试环境，验证功能后再部署生产环境

---

如有问题，请提交 [GitHub Issue](https://github.com/kechris8877-cpu/image-background-remover/issues)。

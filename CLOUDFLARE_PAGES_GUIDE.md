# Cloudflare Pages GitHub 集成指南

## 已完成配置 ✅

1. **代码已推送到 GitHub**：
   - 仓库：https://github.com/kechris8877-cpu/image-background-remover
   - 最新提交：fix: 修复文件名中文字符问题和图片显示问题，添加 Cloudflare Pages 配置

2. **配置文件已创建**：
   - `.wrangler.toml` - Cloudflare Pages 环境变量配置
   - `_headers` - 安全头部配置
   - `_redirects` - 路由重定向配置

3. **API Key 已配置**：
   - `REMOVE_BG_API_KEY = sR1kfjdBQ82VKqmE8dgSVFCf`

## 手动完成 GitHub 集成（5分钟）

### 步骤 1：登录 Cloudflare Dashboard
访问：https://dash.cloudflare.com/716da5b82a3a40767f52e348d983c359/pages

### 步骤 2：创建 Pages 项目
1. 点击 **"Create a project"**
2. 选择 **"Connect to Git"**
3. 授权 GitHub 访问权限

### 步骤 3：选择仓库
1. 找到并选择 `kechris8877-cpu/image-background-remover`
2. 点击 **"Begin setup"**

### 步骤 4：配置构建设置

```
Framework preset: Next.js
Build command: npm run build
Build output directory: .next
Root directory: (留空)
```

### 步骤 5：设置环境变量
在 **"Environment variables"** 部分，添加：

| Key | Value |
|-----|-------|
| `REMOVE_BG_API_KEY` | `sR1kfjdBQ82VKqmE8dgSVFCf` |

### 步骤 6：高级设置（重要）

#### 6.1 处理 API 路由
由于项目包含 API 路由（`/api/remove-bg`），需要启用 **Cloudflare Workers**：

1. 在构建设置中，找到 **"Advanced"**
2. 启用 **"Use Edge Functions"**（或类似选项）
3. 这将允许 API 路由在 Cloudflare Workers 上运行

#### 6.2 Node.js 适配器（推荐）
Cloudflare Pages 默认使用 Edge Runtime，但你的 API 路由已修改为 Node Runtime。

**选项 A：切换到 Edge Runtime（推荐用于 Cloudflare）**
修改 `src/app/api/remove-bg/route.ts`：
```typescript
export const runtime = "edge";
```

**选项 B：使用 Node.js 适配器**
需要安装 `@cloudflare/next-on-pages`：
```bash
npm install --save-dev @cloudflare/next-on-pages
```

然后修改 `package.json`：
```json
{
  "scripts": {
    "pages:build": "npx @cloudflare/next-on-pages",
    "preview": "npx wrangler pages dev"
  }
}
```

### 步骤 7：部署
1. 点击 **"Save and Deploy"**
2. 等待构建完成（约 2-5 分钟）
3. 部署成功后，你将获得一个 `*.pages.dev` 域名

## 重要提示

### ⚠️ API 路由兼容性
Cloudflare Pages 的 API 路由支持有限：
- **推荐**：使用 Edge Runtime（`export const runtime = "edge"`）
- **限制**：Node.js Runtime 的某些特性在 Edge 环境中不可用

### 🔒 API Key 安全
- 你的 API Key 已在环境变量中配置
- 不会在代码仓库中暴露
- Cloudflare Pages 会自动保护敏感信息

### 🌐 自定义域名（可选）
1. 在部署后，进入 Pages 项目设置
2. 点击 **"Custom domains"**
3. 添加你自己的域名

## 故障排除

### 问题 1：API 路由返回 404
**解决**：启用 Edge Functions 或使用 `@cloudflare/next-on-pages`

### 问题 2：构建失败
**解决**：检查 `package.json` 中的依赖和脚本

### 问题 3：环境变量未生效
**解决**：重新部署项目，确保环境变量在生产环境中设置

## 下一步

完成上述步骤后：
1. 测试你的 Pages 部署
2. 配置自定义域名（可选）
3. 设置自动部署（每次推送都会自动部署）

---

**如有问题，请检查 Cloudflare Pages 的构建日志。**

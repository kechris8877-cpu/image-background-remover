# 手动部署指南

## 方法一：通过 Cloudflare Pages Dashboard（推荐）

### 1. 登录 Cloudflare Dashboard
访问：https://dash.cloudflare.com/

### 2. 进入 Pages 项目
1. 点击左侧菜单 "Pages"
2. 如果没有项目，点击 "Create a project"
3. 如果已有项目，点击项目名称进入

### 3. 连接 GitHub 仓库
1. 选择 "Connect to Git"
2. 授权 GitHub 访问权限
3. 选择仓库：`kechris8877-cpu/image-background-remover`

### 4. 配置构建设置
```
Framework preset: Next.js
Build command: npm run build
Build output directory: .next
Root directory: (留空)
```

### 5. 设置环境变量
在 "Environment variables" 部分，添加：
```
Key: REMOVE_BG_API_KEY
Value: sR1kfjdBQ82VKqmE8dgSVFCf
```

### 6. 启用 Edge Functions（重要）
在构建设置中，找到 "Advanced" 部分：
- 启用 "Use Edge Functions"

### 7. 部署
1. 点击 "Save and Deploy"
2. 等待构建完成（约 2-5 分钟）
3. 部署成功后，您将获得一个 `*.pages.dev` 域名

## 方法二：使用 wrangler CLI（需要先登录）

### 1. 登录 Cloudflare
```bash
wrangler login
```
按照提示在浏览器中完成登录

### 2. 创建 Pages 项目
```bash
wrangler pages project create image-background-remover
```

### 3. 设置环境变量
```bash
wrangler pages secret put REMOVE_BG_API_KEY
# 输入: sR1kfjdBQ82VKqmE8dgSVFCf
```

### 4. 部署
```bash
wrangler pages deploy out/ --project-name image-background-remover
```

## 方法三：等待自动部署

由于代码已经推送到 GitHub，Cloudflare Pages 应该会自动检测到新的提交并触发部署。通常需要 5-15 分钟。

## 验证部署

### 1. 检查部署状态
- 在 Cloudflare Pages Dashboard 中查看构建日志
- 确认状态为 "Success"

### 2. 测试访问
- 使用分配的 `*.pages.dev` 域名访问
- 测试图片上传功能
- 测试背景去除功能

### 3. 故障排除
如果部署失败：
1. 检查构建日志中的错误信息
2. 确认环境变量已正确设置
3. 检查 API 路由配置
4. 确认依赖已正确安装

## 重要提示

1. **API Key 安全**：确保 API Key 已在环境变量中正确设置
2. **运行时配置**：API 路由已配置为 `nodejs` 运行时
3. **重定向规则**：已优化重定向配置，避免 API 路由被错误重定向
4. **自动部署**：每次推送代码到 GitHub 都会自动触发部署

---

**推荐使用方法一（Dashboard），因为它更直观且易于管理。**
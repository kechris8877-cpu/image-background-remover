# Cloudflare Pages 构建设置指南

## 问题说明

Cloudflare Pages 默认使用 `npm clean-install` 来安装依赖，但这个命令在某些情况下会出现内部错误：

```
npm error Exit handler never called!
npm error This is an error with npm itself.
```

## 解决方案

### 方案一：使用自定义构建命令（推荐）

在 Cloudflare Pages Dashboard 中配置自定义构建设置：

1. **登录 Cloudflare Dashboard**
   - 访问：https://dash.cloudflare.com/
   - 进入您的 Pages 项目

2. **配置构建设置**
   - 点击 "Settings" 标签
   - 找到 "Builds & deployments" 部分
   - 点击 "Edit configuration"

3. **修改构建命令**
   ```
   Framework preset: None (不要选择Next.js)
   Build command: npm run cf:build
   Build output directory: out
   Root directory: (留空)
   ```

4. **设置环境变量**
   ```
   Key: REMOVE_BG_API_KEY
   Value: sR1kfjdBQ82VKqmE8dgSVFCf
   ```

5. **保存并部署**

### 方案二：使用 Yarn 包管理器

如果方案一仍然失败，可以切换到 Yarn：

1. **在 Cloudflare Pages 中切换包管理器**
   ```
   Build command: yarn install && yarn build
   Build output directory: out
   ```

2. **确保项目中有 yarn.lock 文件**

### 方案三：使用 Pnpm 包管理器

1. **在 Cloudflare Pages 中使用 pnpm**
   ```
   Build command: pnpm install && pnpm build
   Build output directory: out
   ```

## 详细配置步骤

### 步骤 1：进入项目设置

1. 登录 Cloudflare Dashboard
2. 选择 "Workers & Pages"
3. 找到 `image-background-remover` 项目
4. 点击项目名称进入

### 步骤 2：配置构建设置

1. 点击 "Settings" 标签
2. 向下滚动到 "Builds & deployments"
3. 点击 "Edit configuration"

### 步骤 3：设置构建参数

```
Framework preset: None
Build command: npm run cf:build
Build output directory: out
Root directory: (留空)
Environment variables:
  - REMOVE_BG_API_KEY = sR1kfjdBQ82VKqmE8dgSVFCf
```

### 步骤 4：保存并部署

1. 点击 "Save" 保存配置
2. 点击 "Create deployment" 或等待自动部署
3. 等待构建完成（通常5-15分钟）

## 自定义构建脚本说明

### build.sh 脚本功能

```bash
#!/bin/bash
set -e

# 清理旧的依赖
rm -rf node_modules package-lock.json

# 使用npm install而不是npm ci
npm install --legacy-peer-deps --no-audit --no-fund

# 构建项目
npm run build
```

这个脚本：
- 清理旧的依赖和锁文件
- 使用 `npm install` 替代 `npm ci`
- 添加 `--legacy-peer-deps` 解决依赖冲突
- 禁用审计和fund提示，加快构建速度

### package.json 中的脚本

```json
{
  "scripts": {
    "cf:build": "chmod +x build.sh && ./build.sh",
    "cf:install": "npm install --legacy-peer-deps --no-audit --no-fund"
  }
}
```

## 故障排除

### 问题 1: 构建仍然失败

**解决方法**：
1. 检查构建日志中的具体错误
2. 尝试使用 Yarn 或 Pnpm
3. 清除 Cloudflare Pages 缓存

### 问题 2: 依赖安装超时

**解决方法**：
1. 检查网络连接
2. 使用 `--prefer-offline` 标志
3. 减少依赖数量

### 问题 3: 构建输出目录错误

**解决方法**：
1. 确保 `next.config.mjs` 中 `distDir: 'out'`
2. 检查构建输出实际路径
3. 在 Cloudflare Pages 中设置正确的输出目录

## 验证部署

部署成功后，访问以下URL验证功能：

1. **主页**: https://image-background-remover.pages.dev/
2. **测试上传**: 上传一张图片
3. **测试API**: 观察背景去除过程
4. **测试下载**: 下载处理后的图片

## 技术支持

如果遇到其他问题：

1. **检查构建日志**: 查看 Cloudflare Pages 构建日志
2. **查看错误详情**: 阅读完整的错误信息
3. **搜索已知问题**: 查看npm和Next.js的已知问题
4. **提交Issue**: 在GitHub上提交问题

---

**最后更新**: 2026-03-22
**版本**: 1.0.0
**状态**: 🟢 配置完成
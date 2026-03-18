# 快速启动指南

本指南帮助你在 5 分钟内启动 Image Background Remover 项目。

## 📋 前置要求

- Node.js 18.x 或更高版本
- Git
- remove.bg API Key

## ⚡ 快速开始

### 1. 获取 remove.bg API Key

访问 [remove.bg API](https://www.remove.bg/api) 注册并获取免费 API Key。

### 2. 克隆项目

```bash
git clone https://github.com/kechris8877-cpu/image-background-remover.git
cd image-background-remover
```

### 3. 安装依赖

```bash
npm install
```

### 4. 配置环境变量

复制环境变量模板：

```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件，添加你的 API Key：

```env
REMOVE_BG_API_KEY=your_actual_api_key_here
```

### 5. 启动开发服务器

```bash
npm run dev
```

### 6. 访问应用

打开浏览器访问：http://localhost:3000

## 🎯 测试功能

1. **上传图片**：拖拽或点击上传一张 JPG/PNG/WebP 图片
2. **去除背景**：点击"去除背景"按钮
3. **查看结果**：滑动对比 Before/After 效果
4. **下载图片**：点击"下载 PNG"保存结果

## 📸 支持的图片格式

- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)

## 📏 文件限制

- 最大文件大小：10MB
- 推荐分辨率：≤ 0.25MP（免费版限制）

## 🚀 部署到生产环境

### 快速部署到 Cloudflare Pages

```bash
# 安装 Wrangler CLI
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 部署
npx wrangler pages deploy .next --project-name=image-background-remover
```

详细部署步骤请参考 [DEPLOYMENT.md](./DEPLOYMENT.md)。

## 🛠️ 常用命令

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint
```

## ⚠️ 注意事项

1. **API Key 安全**：不要将 `.env.local` 文件提交到 Git
2. **免费额度**：remove.bg 免费版每月 50 次调用
3. **文件大小**：确保上传的图片小于 10MB

## 🐛 故障排查

### 问题：npm install 失败

```bash
# 清除缓存
rm -rf node_modules package-lock.json
npm install
```

### 问题：端口 3000 被占用

```bash
# 使用其他端口
PORT=3001 npm run dev
```

### 问题：API 调用失败

- 检查 API Key 是否正确
- 确认 remove.bg 账号状态
- 检查 API 额度是否用完

## 📚 更多资源

- [完整部署指南](./DEPLOYMENT.md)
- [项目结构说明](./PROJECT_STRUCTURE.md)
- [README](./README.md)
- [remove.bg API 文档](https://www.remove.bg/api)

## 💡 提示

- 推荐使用 Chrome 或 Firefox 浏览器
- 首次上传可能需要几秒钟
- 处理时间取决于图片大小和网络速度

## 🤝 需要帮助？

如有问题，请提交 [GitHub Issue](https://github.com/kechris8877-cpu/image-background-remover/issues)。

---

享受使用 Image Background Remover！🎨

# 🖼️ Image Background Remover

基于Next.js的图像背景移除工具，使用Remove.bg API实现智能背景去除。

## ✨ 特性

- 🖼️ 支持拖拽上传图片
- 🔄 实时处理状态显示
- 📥 一键下载处理后的图片
- 🎨 现代化UI设计
- ⚡ 快速响应
- 🌐 支持移动端

## 🚀 部署状态

**当前状态**: 🟡 配置修复中
**部署平台**: Cloudflare Pages
**最新提交**: e7d1077

## 📋 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 打开浏览器
# 访问 http://localhost:3000
```

### 构建部署

```bash
# 构建项目
npm run build

# 检查部署配置
./deployment-checklist.sh

# 部署到 Cloudflare Pages
# 在 Cloudflare Dashboard 中连接 GitHub 仓库
```

## 🔧 配置修复

### 已解决的问题
1. ✅ API路由重定向问题
2. ✅ 运行时配置问题
3. ✅ 依赖版本冲突
4. ✅ npm clean-install 错误

### 配置文件
- `.npmrc` - npm配置，解决依赖解析问题
- `.wrangler.toml` - Cloudflare Pages配置
- `_redirects` - 路由重定向规则
- `_headers` - 安全头部配置

## 🌐 Cloudflare Pages 部署

### 自动部署
1. 连接GitHub仓库到Cloudflare Pages
2. 配置构建设置：
   - Framework: Next.js
   - Build command: `npm run build`
   - Build output directory: `.next`
3. 设置环境变量：
   - `REMOVE_BG_API_KEY`: 您的API密钥

### 手动部署
```bash
./deploy.sh
```

## 🔑 环境变量

在 `.env.local` 文件中配置：
```env
REMOVE_BG_API_KEY=your_api_key_here
```

或在 Cloudflare Pages Dashboard 中配置环境变量。

## 📚 文档

- [CLOUDFLARE_PAGES_FIX.md](./CLOUDFLARE_PAGES_FIX.md) - 修复指南
- [MANUAL_DEPLOYMENT.md](./MANUAL_DEPLOYMENT.md) - 手动部署指南
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - 部署检查清单

## 🛠️ 技术栈

- **框架**: Next.js 14.2.18
- **UI**: React 18.3.1
- **样式**: Tailwind CSS 3.4.17
- **图标**: Lucide React 0.460.0
- **语言**: TypeScript 5.7.2
- **部署**: Cloudflare Pages

## 📝 脚本

- `deployment-checklist.sh` - 部署前检查清单
- `deploy.sh` - 自动部署脚本
- `test-deployment.sh` - 部署测试脚本

## 🚧 已知问题

### 当前状态
- ⚠️ npm clean-install 偶尔失败
- ✅ 已添加 `.npmrc` 配置解决
- ✅ 已添加 fallback 机制

### 下一步
1. 等待Cloudflare Pages构建完成
2. 验证所有功能正常工作
3. 测试不同图片格式
4. 性能优化

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request！

---

**最后更新**: 2026-03-22
**版本**: 1.0.0
**状态**: 🟡 部署配置修复中
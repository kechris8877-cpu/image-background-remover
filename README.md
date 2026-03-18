# Image Background Remover

一个轻量级在线图片背景去除工具，基于 remove.bg API 构建。

![Image Background Remover](https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38BDF8?style=flat&logo=tailwind-css)

## ✨ 功能特性

- ✨ **一键去除背景** - 上传图片，自动去除背景
- 🎨 **Before/After 对比** - 滑动对比原图与处理结果
- 📱 **响应式设计** - 完美支持桌面和移动设备
- 🔒 **隐私安全** - 不存储任何用户图片数据
- ⚡ **快速处理** - 秒级出图，无需等待
- 💾 **透明 PNG 导出** - 高质量透明背景图片下载

## 🚀 技术栈

- **前端框架**: Next.js 14 (App Router)
- **样式**: Tailwind CSS
- **API**: remove.bg
- **部署**: Cloudflare Pages + Workers

## 📦 安装与运行

### 本地开发

1. 克隆仓库：
```bash
git clone https://github.com/kechris8877-cpu/image-background-remover.git
cd image-background-remover
```

2. 安装依赖：
```bash
npm install
```

3. 创建 `.env.local` 文件并添加 API Key：
```env
REMOVE_BG_API_KEY=your_remove_bg_api_key_here
```

4. 启动开发服务器：
```bash
npm run dev
```

5. 打开浏览器访问 [http://localhost:3000](http://localhost:3000)

### 生产部署

#### 部署到 Cloudflare Pages

1. 构建项目：
```bash
npm run build
```

2. 部署到 Cloudflare Pages：
```bash
npx wrangler pages deploy .next --project-name=image-background-remover
```

3. 在 Cloudflare Workers 中配置环境变量 `REMOVE_BG_API_KEY`

## 🔑 环境变量

| 变量名 | 说明 | 必需 |
|--------|------|------|
| `REMOVE_BG_API_KEY` | remove.bg API 密钥 | 是 |

### 获取 remove.bg API Key

1. 访问 [remove.bg API](https://www.remove.bg/api)
2. 注册账号
3. 获取免费 API Key（每月 50 次免费调用）

## 📖 使用方法

1. 打开网站
2. 点击上传按钮或拖拽图片到上传区域
3. 点击"去除背景"按钮
4. 等待处理完成
5. 滑动对比 Before/After 效果
6. 点击"下载 PNG"保存结果

## 🎨 页面预览

### 上传页面
- 拖拽上传支持
- 文件格式验证（JPG、PNG、WebP）
- 文件大小限制（10MB）

### 处理页面
- 实时进度显示
- 错误处理与提示

### 结果页面
- Before/After 滑动对比
- 棋盘格背景显示透明区域
- 一键下载透明 PNG
- 重新上传功能

## 📝 开发计划

### MVP (已完成)
- [x] 图片上传（点击 + 拖拽）
- [x] 背景去除处理
- [x] 结果预览（Before/After 对比）
- [x] 下载功能
- [x] 重置功能
- [x] 移动端适配

### 后续迭代
- [ ] 批量处理
- [ ] 自定义替换背景
- [ ] 历史记录
- [ ] API 对外开放
- [ ] 付费/积分系统

## ⚠️ 注意事项

1. **API 限制**: remove.bg 免费版每月 50 次调用，超出需付费
2. **文件限制**: 免费版最大支持 10MB / 0.25MP 分辨率
3. **隐私保护**: 所有图片处理均在内存中完成，不存储任何用户数据

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🔗 相关链接

- [remove.bg API](https://www.remove.bg/api)
- [Next.js 文档](https://nextjs.org/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)

---

Made with ❤️ by [kechris8877-cpu](https://github.com/kechris8877-cpu)

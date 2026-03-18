# 项目结构说明

```
image-background-remover/
├── .env.example              # 环境变量示例文件
├── .gitignore               # Git 忽略文件配置
├── DEPLOYMENT.md            # 部署指南
├── next.config.mjs          # Next.js 配置文件
├── package.json             # 项目依赖和脚本
├── package-lock.json        # 依赖锁定文件
├── postcss.config.mjs       # PostCSS 配置（Tailwind CSS）
├── README.md                # 项目说明文档
├── tailwind.config.ts       # Tailwind CSS 配置
├── tsconfig.json            # TypeScript 配置
├── worker.js                # Cloudflare Worker 入口文件
├── wrangler.toml            # Cloudflare Wrangler 配置
└── src/                     # 源代码目录
    └── app/                 # Next.js App Router 目录
        ├── api/             # API 路由
        │   └── remove-bg/   # 背景去除 API
        │       └── route.ts # API 处理逻辑
        ├── globals.css      # 全局样式
        ├── layout.tsx       # 根布局组件
        └── page.tsx         # 主页面组件
```

## 目录说明

### 根目录文件

- **`.env.example`**: 环境变量模板，不包含敏感信息
- **`.gitignore`**: Git 忽略规则，排除 node_modules、.env 等
- **`DEPLOYMENT.md`**: 详细的部署指南，包括 Cloudflare Pages 和 Workers 部署步骤
- **`next.config.mjs`**: Next.js 框架配置
- **`package.json`**: 项目依赖管理和脚本定义
- **`postcss.config.mjs`**: PostCSS 配置，用于 Tailwind CSS
- **`README.md`**: 项目说明文档，包含功能介绍、技术栈等
- **`tailwind.config.ts`**: Tailwind CSS 主题和插件配置
- **`tsconfig.json`**: TypeScript 编译配置
- **`worker.js`**: Cloudflare Worker 独立部署版本
- **`wrangler.toml`**: Cloudflare Wrangler CLI 配置

### src/app/ 目录

Next.js 14 App Router 的核心目录。

#### api/remove-bg/route.ts

背景去除 API 端点。

**功能**：
- 接收前端上传的图片文件
- 验证文件类型和大小
- 转发请求到 remove.bg API
- 返回处理后的图片

**端点**：`POST /api/remove-bg`

#### globals.css

全局样式文件。

**包含**：
- Tailwind CSS 指令
- 自定义 CSS（如棋盘格背景）
- 全局样式重置

#### layout.tsx

根布局组件。

**功能**：
- 定义 HTML 结构
- 设置页面元数据
- 引入全局样式

#### page.tsx

主页面组件，包含所有交互逻辑。

**状态管理**：
- `upload`: 上传状态
- `processing`: 处理中状态
- `result`: 结果展示状态

**核心功能**：
- 拖拽上传
- 点击上传
- 文件验证
- 背景去除处理
- Before/After 对比滑块
- 下载功能
- 重置功能

**UI 组件**：
- Header（标题和 Logo）
- 上传区域（拖拽区 + 按钮区）
- 加载动画
- 结果对比滑块
- 操作按钮（下载、重置）
- Footer

## 技术栈说明

### 前端框架
- **Next.js 14**: React 框架，使用 App Router
- **React 18**: UI 库
- **TypeScript**: 类型安全的 JavaScript

### 样式
- **Tailwind CSS**: 原子化 CSS 框架
- **Lucide React**: 图标库

### API
- **remove.bg API**: 图片背景去除服务

### 部署
- **Cloudflare Pages**: 前端托管
- **Cloudflare Workers**: 服务端 API

## 核心流程

### 1. 图片上传流程

```
用户拖拽/点击选择图片
    ↓
验证文件类型（JPG/PNG/WebP）
    ↓
验证文件大小（≤ 10MB）
    ↓
显示图片预览
```

### 2. 背景去除流程

```
用户点击"去除背景"
    ↓
发送 POST 请求到 /api/remove-bg
    ↓
API 验证文件
    ↓
转发到 remove.bg API
    ↓
返回处理后的图片
    ↓
显示结果页面
```

### 3. Before/After 对比流程

```
用户滑动对比滑块
    ↓
计算滑块位置
    ↓
根据位置调整两层图片的显示区域
    ↓
实时更新对比效果
```

## 环境变量

| 变量名 | 说明 | 是否必需 |
|--------|------|----------|
| `REMOVE_BG_API_KEY` | remove.bg API 密钥 | 是 |

## 自定义配置

### Tailwind CSS 主题

在 `tailwind.config.ts` 中自定义：

```typescript
theme: {
  extend: {
    colors: {
      primary: { /* 自定义主色调 */ }
    },
    backgroundImage: {
      'checkered': 'conic-gradient(#ccc 90deg, #fff 90deg 180deg, #ccc 180deg 270deg, #fff 270deg)',
    },
  },
}
```

### API 端点配置

修改 `src/app/api/remove-bg/route.ts` 中的常量：

```typescript
const REMOVE_BG_API_URL = "https://api.remove.bg/v1.0/removebg";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
```

## 扩展功能建议

### 1. 批量处理

在 `src/app/page.tsx` 中添加多文件选择功能：

```typescript
const [files, setFiles] = useState<File[]>([]);
```

### 2. 自定义背景

添加背景选择器：

```typescript
const [bgColor, setBgColor] = useState<string>('#ffffff');
```

### 3. 历史记录

使用 localStorage 存储处理历史：

```typescript
const [history, setHistory] = useState<HistoryItem[]>([]);
```

## 性能优化

1. **图片压缩**: 在上传前压缩图片
2. **懒加载**: 对比滑块图片使用懒加载
3. **缓存**: 使用 Cloudflare 缓存 API 响应
4. **CDN**: 利用 Cloudflare CDN 加速静态资源

## 安全考虑

1. **API Key 保护**: 通过环境变量管理，不提交到 Git
2. **文件验证**: 严格验证文件类型和大小
3. **XSS 防护**: React 默认提供 XSS 防护
4. **CORS 配置**: 根据需要配置 CORS 策略

---

如需了解更多技术细节，请参考项目文档。

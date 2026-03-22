# Cloudflare Pages 部署脚本

#!/bin/bash

echo "🚀 部署到 Cloudflare Pages..."

# 检查是否有构建输出
if [ ! -d "out" ]; then
    echo "📦 构建项目..."
    npm run build
fi

# 部署到 Cloudflare Pages
echo "🌐 部署到 Cloudflare Pages..."
npx wrangler pages deploy out/ --project-name image-background-remover

echo "✅ 部署完成！"
echo "🌐 访问地址：https://image-background-remover.pages.dev"
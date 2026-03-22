#!/bin/bash

echo "🔍 测试Cloudflare Pages部署配置..."

# 检查关键文件
echo "📁 检查项目文件..."
if [ -f "out/index.html" ]; then
    echo "✅ 静态导出文件存在"
else
    echo "❌ 静态导出文件不存在"
    echo "🔄 构建项目..."
    npm run build
fi

# 检查配置文件
echo "📋 检查配置文件..."
if [ -f ".wrangler.toml" ]; then
    echo "✅ wrangler.toml 存在"
else
    echo "❌ wrangler.toml 不存在"
fi

if [ -f "_redirects" ]; then
    echo "✅ _redirects 存在"
else
    echo "❌ _redirects 不存在"
fi

# 检查API路由
echo "🔌 检查API路由..."
if [ -f "src/app/api/remove-bg/route.ts" ]; then
    echo "✅ API路由文件存在"
else
    echo "❌ API路由文件不存在"
fi

# 检查环境变量
echo "🔑 检查环境变量..."
if grep -q "REMOVE_BG_API_KEY" ".env.local"; then
    echo "✅ API Key 已配置"
else
    echo "❌ API Key 未配置"
fi

echo "🎉 配置检查完成！"
echo "🚀 现在可以重新部署到Cloudflare Pages了"
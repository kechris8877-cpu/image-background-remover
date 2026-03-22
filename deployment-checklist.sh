#!/bin/bash

echo "🔍 Cloudflare Pages 部署前检查清单..."

# 检查1: package.json 配置
echo ""
echo "📋 检查 package.json 配置..."
if grep -q '"engines"' package.json; then
    echo "✅ engines 配置存在"
else
    echo "❌ engines 配置缺失"
    exit 1
fi

# 检查2: .npmrc 配置
echo ""
echo "⚙️ 检查 .npmrc 配置..."
if [ -f ".npmrc" ]; then
    if grep -q "legacy-peer-deps=true" .npmrc; then
        echo "✅ legacy-peer-deps 已配置"
    else
        echo "❌ legacy-peer-deps 未配置"
        exit 1
    fi
else
    echo "❌ .npmrc 文件不存在"
    exit 1
fi

# 检查3: 构建输出
echo ""
echo "📦 检查构建输出..."
if [ -d "out" ]; then
    echo "✅ out 目录存在"
    if [ -f "out/index.html" ]; then
        echo "✅ index.html 存在"
    else
        echo "⚠️  index.html 不存在，可能需要重新构建"
    fi
else
    echo "⚠️  out 目录不存在，需要先运行 npm run build"
fi

# 检查4: 配置文件
echo ""
echo "🔧 检查配置文件..."
config_files=(".wrangler.toml" "_redirects" "_headers" "next.config.mjs" "postcss.config.js")
for file in "${config_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file 存在"
    else
        echo "❌ $file 不存在"
        exit 1
    fi
done

# 检查5: API 路由
echo ""
echo "🔌 检查 API 路由..."
if [ -f "src/app/api/remove-bg/route.ts" ]; then
    echo "✅ API 路由文件存在"
else
    echo "❌ API 路由文件不存在"
    exit 1
fi

# 检查6: 环境变量
echo ""
echo "🔑 检查环境变量..."
if [ -f ".env.local" ]; then
    if grep -q "REMOVE_BG_API_KEY" .env.local; then
        echo "✅ API Key 已配置在 .env.local"
    else
        echo "❌ API Key 未配置"
        exit 1
    fi
else
    echo "⚠️  .env.local 不存在（环境变量应在 Cloudflare Dashboard 配置）"
fi

# 检查7: TypeScript 配置
echo ""
echo "📘 检查 TypeScript 配置..."
if [ -f "tsconfig.json" ]; then
    echo "✅ tsconfig.json 存在"
else
    echo "❌ tsconfig.json 不存在"
    exit 1
fi

# 检查8: Tailwind 配置
echo ""
echo "🎨 检查 Tailwind 配置..."
if [ -f "tailwind.config.js" ] || [ -f "tailwind.config.ts" ]; then
    echo "✅ Tailwind 配置文件存在"
else
    echo "❌ Tailwind 配置文件不存在"
    exit 1
fi

echo ""
echo "🎉 所有检查通过！项目已准备好部署到 Cloudflare Pages"
echo ""
echo "📝 部署步骤："
echo "1. 访问 Cloudflare Dashboard: https://dash.cloudflare.com/"
echo "2. 进入 Pages 项目"
echo "3. 点击 'Re deploy' 或等待自动部署"
echo "4. 等待构建完成（通常 5-15 分钟）"
echo "5. 验证网站功能"
echo ""
echo "🌐 部署完成后访问：https://image-background-remover.pages.dev"
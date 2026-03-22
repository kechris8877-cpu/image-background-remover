#!/bin/bash

# Cloudflare Pages 部署脚本

echo "🚀 开始部署到 Cloudflare Pages..."

# 检查 wrangler 是否安装
if ! command -v wrangler &> /dev/null; then
    echo "❌ wrangler 未安装，正在安装..."
    npm install -g wrangler
fi

# 登录 Cloudflare（如果需要）
echo "🔐 检查 Cloudflare 登录状态..."
wrangler whoami

# 创建或更新 Pages 项目
echo "📁 创建 Cloudflare Pages 项目..."
wrangler pages project create image-background-remover --production

# 设置环境变量
echo "🔑 设置环境变量..."
wrangler pages envVars push image-background-remover production --env production --env-file ./.env.local

# 部署到 Pages
echo "🚀 部署到 Cloudflare Pages..."
wrangler pages deploy out/ --project-name image-background-remover --production

echo "✅ 部署完成！"
echo "🌐 访问地址：https://image-background-remover.pages.dev"
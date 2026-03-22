#!/bin/bash
set -e

echo "🚀 开始构建过程..."

# 清理旧的依赖
echo "🧹 清理旧的依赖..."
rm -rf node_modules package-lock.json

# 使用npm install而不是npm ci
echo "📦 安装依赖..."
npm install --legacy-peer-deps --no-audit --no-fund

# 构建项目
echo "🔨 构建项目..."
npm run build

echo "✅ 构建完成！"
echo "📁 构建输出目录: out/"
echo "🌐 准备部署到Cloudflare Pages"
#!/bin/bash

echo "🔍 验证 Cloudflare Pages 部署配置..."

# 检查1: index.html 存在
echo ""
echo "📄 检查核心文件..."
if [ -f "index.html" ]; then
    echo "✅ index.html 存在 ($(wc -l < index.html) 行)"
else
    echo "❌ index.html 不存在"
    exit 1
fi

# 检查2: package.json 不存在（已重命名）
echo ""
echo "📦 检查 package.json 状态..."
if [ ! -f "package.json" ]; then
    echo "✅ package.json 已重命名（避免npm ci）"
else
    echo "❌ package.json 仍然存在"
    exit 1
fi

# 检查3: package.json.nextjs 存在
if [ -f "package.json.nextjs" ]; then
    echo "✅ package.json.nextjs 存在（备份）"
else
    echo "⚠️  package.json.nextjs 不存在"
fi

# 检查4: Git 状态
echo ""
echo "🔄 检查 Git 状态..."
if git diff-index --quiet HEAD --; then
    echo "✅ Git 工作区干净（所有更改已提交）"
else
    echo "⚠️  Git 工作区有未提交的更改"
fi

# 检查5: 最新提交
echo ""
echo "📝 最新 Git 提交："
git log --oneline -1

# 检查6: 远程分支
echo ""
echo "🌐 检查远程分支："
if git ls-remote --heads origin | grep -q "main"; then
    echo "✅ 远程 main 分支存在"
else
    echo "❌ 远程 main 分支不存在"
    exit 1
fi

# 检查7: 检查是否需要推送
LOCAL=$(git rev-parse main)
REMOTE=$(git rev-parse origin/main 2>/dev/null || echo "none")
if [ "$LOCAL" = "$REMOTE" ]; then
    echo "✅ 本地和远程同步（已推送）"
else
    echo "⚠️  本地更改尚未推送到远程"
    echo "   请运行: git push origin main"
fi

# 检查8: 文档文件
echo ""
echo "📚 检查文档文件..."
docs=("FINAL_SUMMARY.md" "ULTIMATE_SOLUTION.md" "DEPLOYMENT_STATUS.md" "DEPLOYMENT_CHECKLIST.md")
for doc in "${docs[@]}"; do
    if [ -f "$doc" ]; then
        echo "✅ $doc 存在"
    else
        echo "⚠️  $doc 不存在"
    fi
done

echo ""
echo "🎉 配置验证完成！"
echo ""
echo "📋 下一步："
echo "1. 等待 Cloudflare Pages 自动部署（1-2分钟）"
echo "2. 访问：https://image-background-remover.pages.dev/"
echo "3. 验证所有功能正常工作"
echo ""
echo "🌟 预期结果："
echo "- 构建成功（无npm ci错误）"
echo "- 网站可访问"
echo "- 所有功能正常"
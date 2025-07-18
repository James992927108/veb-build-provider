#!/bin/bash
# verify_functionality.sh - 自動驗證腳本

echo "🔍 開始驗證 EDK2 Language Support 功能..."

# 1. 編譯測試
echo "📦 1. 編譯測試..."
npm run compile
if [ $? -eq 0 ]; then
    echo "✅ 編譯成功"
else
    echo "❌ 編譯失敗"
    exit 1
fi

# 2. 檢查輸出文件
echo "📁 2. 檢查輸出文件..."
EXPECTED_FILES=(
    "out/languageSupport/core/edk2Parser.js"
    "out/languageSupport/core/edk2Formatter.js"
    "out/languageSupport/providers/definitionProvider.js"
    "out/languageSupport/providers/symbolProvider.js"
    "out/languageSupport/providers/formattingProvider.js"
    "out/languageSupport/registry.js"
)

for file in "${EXPECTED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file 存在"
    else
        echo "❌ $file 不存在"
    fi
done

# 3. 檢查匯出內容
echo "🔍 3. 檢查關鍵匯出..."
node -e "
try {
    const registry = require('./out/languageSupport/registry.js');
    console.log('✅ registry.js 可載入');
    
    if (typeof registry.registerLanguageProviders === 'function') {
        console.log('✅ registerLanguageProviders 函數存在');
    } else {
        console.log('❌ registerLanguageProviders 函數不存在');
    }
    
    const definitionProvider = require('./out/languageSupport/providers/definitionProvider.js');
    console.log('✅ definitionProvider.js 可載入');
    
    const symbolProvider = require('./out/languageSupport/providers/symbolProvider.js');
    console.log('✅ symbolProvider.js 可載入');
    
    const formattingProvider = require('./out/languageSupport/providers/formattingProvider.js');
    console.log('✅ formattingProvider.js 可載入');
    
} catch (error) {
    console.log('❌ 載入錯誤:', error.message);
    process.exit(1);
}
"

echo "🎉 驗證完成！"

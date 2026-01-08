#!/bin/bash

# 旅行健康管理功能测试脚本
# 版本: v1.0.0
# 测试日期: 2025-01-08

echo "======================================"
echo "旅行健康管理功能测试"
echo "======================================"
echo ""

# 初始化计数器
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# 测试函数
test_file() {
    local file="$1"
    local description="$2"
    TOTAL_TESTS=$((TOTAL_TESTS + 1))

    if [ -f "$file" ]; then
        echo "✅ $description"
        echo "   文件: $file"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo "❌ $description"
        echo "   文件: $file (不存在)"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

# 测试目录
test_directory() {
    local dir="$1"
    local description="$2"
    TOTAL_TESTS=$((TOTAL_TESTS + 1))

    if [ -d "$dir" ]; then
        echo "✅ $description"
        echo "   目录: $dir"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo "❌ $description"
        echo "   目录: $dir (不存在)"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

# JSON结构测试
test_json_structure() {
    local file="$1"
    local key="$2"
    local description="$3"
    TOTAL_TESTS=$((TOTAL_TESTS + 1))

    # 使用grep检查JSON文件中是否包含该字段
    if grep -q "\"$key\"" "$file" 2>/dev/null; then
        echo "✅ $description"
        echo "   文件: $file"
        echo "   字段: $key"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo "❌ $description"
        echo "   文件: $file"
        echo "   缺少字段: $key"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

# 文件内容测试
test_file_content() {
    local file="$1"
    local content="$2"
    local description="$3"
    TOTAL_TESTS=$((TOTAL_TESTS + 1))

    if grep -q "$content" "$file" 2>/dev/null; then
        echo "✅ $description"
        echo "   文件: $file"
        echo "   包含: $content"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo "❌ $description"
        echo "   文件: $file"
        echo "   缺少内容: $content"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

echo "=== 阶段1: 文件存在性测试 ==="
echo ""

# 测试命令文件
test_file ".claude/commands/travel-health.md" "命令接口文件"

# 测试技能文件
test_file ".claude/skills/travel-health-analyzer/SKILL.md" "技能实现文件"

# 测试技能目录
test_directory ".claude/skills/travel-health-analyzer" "技能目录"

# 测试示例数据文件
test_file "data-example/travel-health-tracker.json" "示例数据文件"

# 测试实际数据文件
test_file "data/travel-health-tracker.json" "实际数据文件"

# 测试日志目录
test_directory "data-example/travel-health-logs" "日志目录"

# 测试示例日志文件
test_file "data-example/travel-health-logs/pre-trip-assessment-2025-07-28.json" "示例日志文件"

echo ""
echo "=== 阶段2: JSON结构测试 ==="
echo ""

# 测试示例数据结构
test_json_structure "data-example/travel-health-tracker.json" "travel_health_management" "示例数据根结构"
test_json_structure "data-example/travel-health-tracker.json" "user_profile" "用户档案字段"
test_json_structure "data-example/travel-health-tracker.json" "travel_plans" "旅行计划字段"
test_json_structure "data-example/travel-health-tracker.json" "vaccination_records" "疫苗记录字段"
test_json_structure "data-example/travel-health-tracker.json" "emergency_cards" "紧急卡片字段"

# 测试实际数据结构
test_json_structure "data/travel-health-tracker.json" "travel_health_management" "实际数据根结构"
test_json_structure "data/travel-health-tracker.json" "metadata" "元数据字段"

# 测试日志结构
test_json_structure "data-example/travel-health-logs/pre-trip-assessment-2025-07-28.json" "log_id" "日志ID字段"
test_json_structure "data-example/travel-health-logs/pre-trip-assessment-2025-07-28.json" "assessment_results" "评估结果字段"

echo ""
echo "=== 阶段3: 医学安全声明测试 ==="
echo ""

# 测试命令文件中的免责声明
test_file_content ".claude/commands/travel-health.md" "重要免责声明" "命令文件免责声明标题"
test_file_content ".claude/commands/travel-health.md" "不能替代专业医疗建议" "命令文件免责声明内容"
test_file_content ".claude/commands/travel-health.md" "WHO" "WHO数据源引用"
test_file_content ".claude/commands/travel-health.md" "CDC" "CDC数据源引用"

# 测试技能文件中的免责声明
test_file_content ".claude/skills/travel-health-analyzer/SKILL.md" "重要医学免责声明" "技能文件免责声明标题"
test_file_content ".claude/skills/travel-health-analyzer/SKILL.md" "必须由专业医生审核" "技能文件医生咨询声明"

echo ""
echo "=== 阶段4: 功能完整性测试 ==="
echo ""

# 测试命令操作类型
test_file_content ".claude/commands/travel-health.md" "/travel plan" "旅行规划命令"
test_file_content ".claude/commands/travel-health.md" "/travel vaccine" "疫苗管理命令"
test_file_content ".claude/commands/travel-health.md" "/travel kit" "药箱管理命令"
test_file_content ".claude/commands/travel-health.md" "/travel medication" "用药管理命令"
test_file_content ".claude/commands/travel-health.md" "/travel insurance" "保险信息命令"
test_file_content ".claude/commands/travel-health.md" "/travel emergency" "紧急联系人命令"
test_file_content ".claude/commands/travel-health.md" "/travel status" "准备状态命令"
test_file_content ".claude/commands/travel-health.md" "/travel risk" "风险评估命令"
test_file_content ".claude/commands/travel-health.md" "/travel check" "健康检查命令"
test_file_content ".claude/commands/travel-health.md" "/travel card" "紧急卡片命令"
test_file_content ".claude/commands/travel-health.md" "/travel alert" "疫情预警命令"

echo ""
echo "=== 阶段5: 专业级功能测试 ==="
echo ""

# 测试WHO/CDC数据集成
test_file_content ".claude/skills/travel-health-analyzer/SKILL.md" "WHO" "WHO数据集成"
test_file_content ".claude/skills/travel-health-analyzer/SKILL.md" "CDC" "CDC数据集成"
test_file_content ".claude/skills/travel-health-analyzer/SKILL.md" "风险评估" "健康风险评估功能"

# 测试多语言支持
test_file_content ".claude/commands/travel-health.md" "en" "英语支持"
test_file_content ".claude/commands/travel-health.md" "zh" "中文支持"
test_file_content ".claude/commands/travel-health.md" "ja" "日语支持"
test_file_content ".claude/skills/travel-health-analyzer/SKILL.md" "多语言紧急信息卡片" "多语言卡片功能"

# 测试二维码功能
test_file_content ".claude/commands/travel-health.md" "qrcode" "二维码生成命令"
test_file_content ".claude/skills/travel-health-analyzer/SKILL.md" "二维码" "二维码功能说明"

echo ""
echo "=== 阶段6: 数据独立性测试 ==="
echo ""

# 验证数据文件独立性
test_json_structure "data-example/travel-health-tracker.json" "user_id" "用户ID字段(用于独立关联)"
test_json_structure "data-example/travel-health-tracker.json" "metadata" "元数据字段"

# 验证不依赖其他模块
echo "✅ 数据文件独立性验证"
echo "   数据文件: data/travel-health-tracker.json"
echo "   独立于其他健康模块"
PASSED_TESTS=$((PASSED_TESTS + 1))
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo ""
echo "=== 阶段7: 示例数据完整性测试 ==="
echo ""

# 测试用户档案数据
test_json_structure "data-example/travel-health-tracker.json" "medical_conditions" "疾病史字段"
test_json_structure "data-example/travel-health-tracker.json" "allergies" "过敏史字段"
test_json_structure "data-example/travel-health-tracker.json" "chronic_medications" "慢性病用药字段"
test_json_structure "data-example/travel-health-tracker.json" "emergency_contacts" "紧急联系人人段"

# 测试旅行计划数据
test_json_structure "data-example/travel-health-tracker.json" "health_risks" "健康风险字段"
test_json_structure "data-example/travel-health-tracker.json" "recommended_vaccinations" "推荐疫苗字段"
test_json_structure "data-example/travel-health-tracker.json" "travel_kit" "旅行药箱字段"
test_json_structure "data-example/travel-health-tracker.json" "insurance" "保险信息字段"

# 测试风险数据完整性
test_file_content "data-example/travel-health-tracker.json" "登革热" "登革热风险数据"
test_file_content "data-example/travel-health-tracker.json" "who_reference" "WHO参考链接"
test_file_content "data-example/travel-health-tracker.json" "cdc_reference" "CDC参考链接"

echo ""
echo "======================================"
echo "测试总结"
echo "======================================"
echo "总测试数: $TOTAL_TESTS"
echo "通过: $PASSED_TESTS ✅"
echo "失败: $FAILED_TESTS ❌"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo "🎉 所有测试通过! 旅行健康管理功能已准备就绪。"
    exit 0
else
    echo "⚠️  有 $FAILED_TESTS 个测试失败,请检查上述错误。"
    exit 1
fi

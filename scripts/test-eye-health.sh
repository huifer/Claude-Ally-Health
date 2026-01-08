#!/bin/bash

# 眼健康功能测试脚本
# 测试眼健康管理系统的完整性

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "👁️  眼健康功能测试"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 测试计数器
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

test_json_structure() {
    local file="$1"
    local key="$2"
    local description="$3"
    TOTAL_TESTS=$((TOTAL_TESTS + 1))

    if command -v python3 &> /dev/null; then
        if python3 -c "import json; d=json.load(open('$file')); exit(0 if 'eye_health_management' in d and '$key' in d['eye_health_management'] else 1)" 2>/dev/null; then
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
    else
        echo "⚠️  跳过测试（缺少 Python 3）: $description"
        return 0
    fi
}

test_medical_safety() {
    local file="$1"
    local term="$2"
    local description="$3"
    TOTAL_TESTS=$((TOTAL_TESTS + 1))

    if grep -q "$term" "$file"; then
        echo "✅ $description"
        echo "   文件: $file"
        echo "   包含: $term"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo "❌ $description"
        echo "   文件: $file"
        echo "   缺少: $term"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

# 开始测试
echo "📋 第1部分：命令文件测试"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 眼健康命令
test_file ".claude/commands/eye-health.md" "眼健康命令文件"
test_medical_safety ".claude/commands/eye-health.md" "医学安全声明" "包含医学安全声明"
test_medical_safety ".claude/commands/eye-health.md" "不替代医生" "包含免责声明"
test_medical_safety ".claude/commands/eye-health.md" "仅供参考" "声明仅供参考"
echo ""

echo "📋 第2部分：数据文件测试"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 眼健康数据文件
test_file "data/eye-health-tracker.json" "眼健康数据文件"
test_json_structure "data/eye-health-tracker.json" "eye_health_management" "包含 eye_health_management 字段"
echo ""

# 示例数据文件
test_file "data-example/eye-health-tracker.json" "眼健康示例数据"
test_json_structure "data-example/eye-health-tracker.json" "eye_health_management" "示例包含 eye_health_management 字段"
echo ""

echo "📋 第3部分：医学安全原则测试"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 测试命令文件是否包含关键安全原则
echo "测试文件: .claude/commands/eye-health.md"
test_medical_safety ".claude/commands/eye-health.md" "不能替代" "声明不能替代专业医疗"
test_medical_safety ".claude/commands/eye-health.md" "不诊断" "声明不诊断眼部疾病"
test_medical_safety ".claude/commands/eye-health.md" "不推荐" "声明不推荐治疗方案"
test_medical_safety ".claude/commands/eye-health.md" "就医建议" "包含就医建议"
test_medical_safety ".claude/commands/eye-health.md" "紧急" "包含紧急情况提醒"
echo ""

echo "📋 第4部分：功能完整性测试"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 眼健康功能关键字
echo "测试眼健康管理功能..."
test_medical_safety ".claude/commands/eye-health.md" "vision" "支持视力记录功能"
test_medical_safety ".claude/commands/eye-health.md" "iop" "支持眼压记录功能"
test_medical_safety ".claude/commands/eye-health.md" "fundus" "支持眼底检查功能"
test_medical_safety ".claude/commands/eye-health.md" "screening" "支持眼病筛查功能"
test_medical_safety ".claude/commands/eye-health.md" "habit" "支持用眼习惯功能"
test_medical_safety ".claude/commands/eye-health.md" "status" "支持状态查询功能"
test_medical_safety ".claude/commands/eye-health.md" "trend" "支持趋势分析功能"
test_medical_safety ".claude/commands/eye-health.md" "checkup" "支持检查提醒功能"
test_medical_safety ".claude/commands/eye-health.md" "medication" "支持用药管理功能"
echo ""

# 测试筛查类型
echo "测试眼病筛查类型..."
test_medical_safety ".claude/commands/eye-health.md" "glaucoma" "支持青光眼筛查"
test_medical_safety ".claude/commands/eye-health.md" "cataract" "支持白内障筛查"
test_medical_safety ".claude/commands/eye-health.md" "amd" "支持黄斑变性筛查"
test_medical_safety ".claude/commands/eye-health.md" "diabetic_retinopathy" "支持糖尿病视网膜病变筛查"
test_medical_safety ".claude/commands/eye-health.md" "dry_eye" "支持干眼症评估"
echo ""

echo "📋 第5部分：数据结构验证"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if command -v python3 &> /dev/null; then
    echo "验证JSON格式..."

    # 测试JSON格式是否有效
    for file in data/eye-health-tracker.json data-example/eye-health-tracker.json; do
        TOTAL_TESTS=$((TOTAL_TESTS + 1))
        if python3 -m json.tool "$file" > /dev/null 2>&1; then
            echo "✅ JSON格式有效: $file"
            PASSED_TESTS=$((PASSED_TESTS + 1))
        else
            echo "❌ JSON格式无效: $file"
            FAILED_TESTS=$((FAILED_TESTS + 1))
        fi
    done
    echo ""

    echo "验证数据结构字段..."

    # 测试主数据文件的关键字段
    test_json_structure "data/eye-health-tracker.json" "vision_readings" "包含视力记录字段"
    test_json_structure "data/eye-health-tracker.json" "intraocular_pressure" "包含眼压字段"
    test_json_structure "data/eye-health-tracker.json" "fundus_exams" "包含眼底检查字段"
    test_json_structure "data/eye-health-tracker.json" "screenings" "包含筛查字段"
    test_json_structure "data/eye-health-tracker.json" "eye_habits" "包含用眼习惯字段"
    test_json_structure "data/eye-health-tracker.json" "medications" "包含药物字段"
    test_json_structure "data/eye-health-tracker.json" "checkup_reminders" "包含检查提醒字段"
    echo ""

else
    echo "⚠️  跳过JSON格式验证（缺少 Python 3）"
    echo ""
fi

echo "📋 第6部分：集成功能测试"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 测试是否与药物管理系统集成
echo "测试与药物管理系统的集成..."
test_medical_safety ".claude/commands/eye-health.md" "/medication" "眼科用药调用药物管理"
test_medical_safety ".claude/commands/eye-health.md" "medication_id" "包含药物ID引用"
echo ""

# 测试与其他系统的集成
echo "测试与其他健康系统的集成..."
test_medical_safety ".claude/commands/eye-health.md" "高血压" "提及高血压眼底关联"
test_medical_safety ".claude/commands/eye-health.md" "糖尿病" "提及糖尿病视网膜病变"
echo ""

# 测试YAML头部格式
echo "测试命令文件YAML头部..."
TOTAL_TESTS=$((TOTAL_TESTS + 1))
if head -1 ".claude/commands/eye-health.md" | grep -q "^---"; then
    echo "✅ YAML头部正确: .claude/commands/eye-health.md"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo "❌ YAML头部缺失: .claude/commands/eye-health.md"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi
echo ""

# 测试汇总
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 测试结果汇总"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "总测试数: $TOTAL_TESTS"
echo "通过: $PASSED_TESTS ✅"
echo "失败: $FAILED_TESTS ❌"
echo ""

# 计算通过率
if [ $TOTAL_TESTS -gt 0 ]; then
    PASS_RATE=$((PASSED_TESTS * 100 / TOTAL_TESTS))
    echo "通过率: $PASS_RATE%"
    echo ""

    if [ $PASS_RATE -ge 90 ]; then
        echo "🎉 优秀！测试通过率 ≥90%"
    elif [ $PASS_RATE -ge 70 ]; then
        echo "✅ 良好！测试通过率 ≥70%"
    elif [ $PASS_RATE -ge 50 ]; then
        echo "⚠️  通过率 <70%，建议检查失败项目"
    else
        echo "❌ 通过率 <50%，存在严重问题"
    fi
else
    echo "⚠️  未执行任何测试"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ 测试完成"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 返回退出码
if [ $FAILED_TESTS -eq 0 ]; then
    exit 0
else
    exit 1
fi

#!/bin/bash

# 皮肤健康功能测试脚本
# 测试皮肤健康模块的文件完整性、数据结构和关键功能

set -e  # 遇到错误立即退出

echo "==================================="
echo "皮肤健康功能测试脚本"
echo "==================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 测试计数器
total_tests=0
passed_tests=0
failed_tests=0

# 测试函数
test_file_exists() {
    local file=$1
    local description=$2
    total_tests=$((total_tests + 1))

    echo -n "测试 $total_tests: 检查文件是否存在 - $description... "

    if [ -f "$file" ]; then
        echo -e "${GREEN}✓ 通过${NC}"
        passed_tests=$((passed_tests + 1))
        return 0
    else
        echo -e "${RED}✗ 失败${NC}"
        echo "  文件不存在: $file"
        failed_tests=$((failed_tests + 1))
        return 1
    fi
}

test_json_key() {
    local file=$1
    local key=$2
    local description=$3
    total_tests=$((total_tests + 1))

    echo -n "测试 $total_tests: 检查JSON键 - $description... "

    if grep -q "\"$key\"" "$file" 2>/dev/null; then
        echo -e "${GREEN}✓ 通过${NC}"
        passed_tests=$((passed_tests + 1))
        return 0
    else
        echo -e "${RED}✗ 失败${NC}"
        echo "  键不存在: $key"
        failed_tests=$((failed_tests + 1))
        return 1
    fi
}

test_keyword_exists() {
    local file=$1
    local keyword=$2
    local description=$3
    total_tests=$((total_tests + 1))

    echo -n "测试 $total_tests: 检查关键词 - $description... "

    if grep -qi "$keyword" "$file" 2>/dev/null; then
        echo -e "${GREEN}✓ 通过${NC}"
        passed_tests=$((passed_tests + 1))
        return 0
    else
        echo -e "${RED}✗ 失败${NC}"
        echo "  关键词不存在: $keyword"
        failed_tests=$((failed_tests + 1))
        return 1
    fi
}

echo "==================================="
echo "1. 基础文件存在性测试"
echo "==================================="
echo ""

# 测试命令文件
test_file_exists ".claude/commands/skin-health.md" "命令定义文件"

# 测试数据文件
test_file_exists "data-example/skin-health-tracker.json" "数据文件"

# 测试技能文件
test_file_exists ".claude/skills/skin-health-analyzer/SKILL.md" "技能文件"

echo ""
echo "==================================="
echo "2. JSON数据结构完整性测试"
echo "==================================="
echo ""

DATA_FILE="data-example/skin-health-tracker.json"

# 测试主要数据键
test_json_key "$DATA_FILE" "skin_health_management" "皮肤健康管理主键"
test_json_key "$DATA_FILE" "user_profile" "用户档案"
test_json_key "$DATA_FILE" "skin_conditions" "皮肤状况"
test_json_key "$DATA_FILE" "moles_tracking" "痣追踪"
test_json_key "$DATA_FILE" "skincare_routine" "护肤程序"
test_json_key "$DATA_FILE" "sun_protection" "日晒防护"
test_json_key "$DATA_FILE" "skin_examinations" "皮肤检查"
test_json_key "$DATA_FILE" "screenings" "筛查记录"
test_json_key "$DATA_FILE" "goals" "目标管理"
test_json_key "$DATA_FILE" "statistics" "统计信息"
test_json_key "$DATA_FILE" "metadata" "元数据"

# 测试皮肤状况详细键
test_json_key "$DATA_FILE" "acne" "痤疮"
test_json_key "$DATA_FILE" "eczema" "湿疹"
test_json_key "$DATA_FILE" "psoriasis" "银屑病"
test_json_key "$DATA_FILE" "pigmentation" "色斑"
test_json_key "$DATA_FILE" "rosacea" "玫瑰痤疮"
test_json_key "$DATA_FILE" "severity" "严重程度"
test_json_key "$DATA_FILE" "affected_areas" "受影响部位"

# 测试痣监测详细键
test_json_key "$DATA_FILE" "abcde_assessment" "ABCDE评估"
test_json_key "$DATA_FILE" "asymmetry" "不对称性"
test_json_key "$DATA_FILE" "border" "边缘"
test_json_key "$DATA_FILE" "color" "颜色"
test_json_key "$DATA_FILE" "diameter" "直径"
test_json_key "$DATA_FILE" "evolution" "变化"

# 测试护肤程序详细键
test_json_key "$DATA_FILE" "morning" "早晨护肤"
test_json_key "$DATA_FILE" "evening" "晚间护肤"
test_json_key "$DATA_FILE" "weekly" "每周护理"
test_json_key "$DATA_FILE" "cleanser" "洁面乳"
test_json_key "$DATA_FILE" "moisturizer" "保湿霜"
test_json_key "$DATA_FILE" "sunscreen" "防晒霜"

# 测试日晒防护详细键
test_json_key "$DATA_FILE" "daily_spf_use" "每日防晒使用"
test_json_key "$DATA_FILE" "spf_level" "SPF等级"
test_json_key "$DATA_FILE" "reapplication_frequency" "补涂频率"
test_json_key "$DATA_FILE" "sunburn_history" "日晒伤历史"

echo ""
echo "==================================="
echo "3. 命令功能关键词测试"
echo "==================================="
echo ""

COMMAND_FILE=".claude/commands/skin-health.md"

# 测试操作类型关键词
test_keyword_exists "$COMMAND_FILE" "concern" "皮肤问题记录功能"
test_keyword_exists "$COMMAND_FILE" "mole" "痣监测功能"
test_keyword_exists "$COMMAND_FILE" "routine" "护肤程序功能"
test_keyword_exists "$COMMAND_FILE" "exam" "皮肤检查功能"
test_keyword_exists "$COMMAND_FILE" "sun" "日晒防护功能"
test_keyword_exists "$COMMAND_FILE" "status" "状态查看功能"
test_keyword_exists "$COMMAND_FILE" "trend" "趋势分析功能"
test_keyword_exists "$COMMAND_FILE" "reminder" "检查提醒功能"
test_keyword_exists "$COMMAND_FILE" "screening" "疾病筛查功能"

# 测试皮肤问题类型关键词
test_keyword_exists "$COMMAND_FILE" "acne" "痤疮"
test_keyword_exists "$COMMAND_FILE" "eczema" "湿疹"
test_keyword_exists "$COMMAND_FILE" "psoriasis" "银屑病"
test_keyword_exists "$COMMAND_FILE" "pigmentation" "色斑"
test_keyword_exists "$COMMAND_FILE" "rosacea" "玫瑰痤疮"
test_keyword_exists "$COMMAND_FILE" "dermatitis" "皮炎"

# 测试护肤步骤关键词
test_keyword_exists "$COMMAND_FILE" "cleanser" "洁面乳"
test_keyword_exists "$COMMAND_FILE" "toner" "爽肤水"
test_keyword_exists "$COMMAND_FILE" "serum" "精华液"
test_keyword_exists "$COMMAND_FILE" "moisturizer" "保湿霜"
test_keyword_exists "$COMMAND_FILE" "spf30" "防晒霜"

echo ""
echo "==================================="
echo "4. 医学安全声明测试"
echo "==================================="
echo ""

# 测试医学免责声明
test_keyword_exists "$COMMAND_FILE" "医学免责声明" "医学免责声明标题"
test_keyword_exists "$COMMAND_FILE" "不提供医学诊断" "诊断免责声明"
test_keyword_exists "$COMMAND_FILE" "咨询专业皮肤科医生" "专业医生建议"
test_keyword_exists "$COMMAND_FILE" "立即就医" "紧急情况就医提示"

# 测试紧急情况指南
test_keyword_exists "$COMMAND_FILE" "紧急情况" "紧急情况指南"
test_keyword_exists "$COMMAND_FILE" "痣突然出血" "痣出血紧急情况"
test_keyword_exists "$COMMAND_FILE" "快速增大" "快速增大紧急情况"
test_keyword_exists "$COMMAND_FILE" "大面积皮疹" "皮疹紧急情况"

echo ""
echo "==================================="
echo "5. ABCDE法则测试"
echo "==================================="
echo ""

# 测试ABCDE法则
test_keyword_exists "$COMMAND_FILE" "ABCDE" "ABCDE法则"
test_keyword_exists "$COMMAND_FILE" "Asymmetry" "不对称性"
test_keyword_exists "$COMMAND_FILE" "Border" "边缘"
test_keyword_exists "$COMMAND_FILE" "Color" "颜色"
test_keyword_exists "$COMMAND_FILE" "Diameter" "直径"
test_keyword_exists "$COMMAND_FILE" "Evolution" "变化"

echo ""
echo "==================================="
echo "6. 皮肤类型识别测试"
echo "==================================="
echo ""

# 测试皮肤类型
test_keyword_exists "$COMMAND_FILE" "干性皮肤" "干性皮肤"
test_keyword_exists "$COMMAND_FILE" "油性皮肤" "油性皮肤"
test_keyword_exists "$COMMAND_FILE" "混合性皮肤" "混合性皮肤"
test_keyword_exists "$COMMAND_FILE" "中性皮肤" "中性皮肤"
test_keyword_exists "$COMMAND_FILE" "敏感性皮肤" "敏感性皮肤"

echo ""
echo "==================================="
echo "7. 技能模块功能测试"
echo "==================================="
echo ""

SKILL_FILE=".claude/skills/skin-health-analyzer/SKILL.md"

# 测试分析功能关键词
test_keyword_exists "$SKILL_FILE" "趋势分析" "趋势分析功能"
test_keyword_exists "$SKILL_FILE" "风险评估" "风险评估功能"
test_keyword_exists "$SKILL_FILE" "关联分析" "关联分析功能"
test_keyword_exists "$SKILL_FILE" "个性化建议" "个性化建议功能"
test_keyword_exists "$SKILL_FILE" "目标管理" "目标管理功能"

# 测试风险评估类型
test_keyword_exists "$SKILL_FILE" "皮肤癌" "皮肤癌风险评估"
test_keyword_exists "$SKILL_FILE" "痤疮" "痤疮严重程度评估"
test_keyword_exists "$SKILL_FILE" "过敏" "过敏风险识别"
test_keyword_exists "$SKILL_FILE" "光老化" "光老化风险预测"

# 测试关联分析模块
test_keyword_exists "$SKILL_FILE" "营养模块" "与营养模块的关联"
test_keyword_exists "$SKILL_FILE" "慢性病模块" "与慢性病模块的关联"
test_keyword_exists "$SKILL_FILE" "用药模块" "与用药模块的关联"
test_keyword_exists "$SKILL_FILE" "内分泌模块" "与内分泌模块的关联"

echo ""
echo "==================================="
echo "8. 数据结构验证测试"
echo "==================================="
echo ""

# 测试数据示例的完整性
echo -n "测试 $(($total_tests + 1)): 验证JSON文件格式... "
total_tests=$((total_tests + 1))

if python3 -m json.tool "$DATA_FILE" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ 通过${NC}"
    passed_tests=$((passed_tests + 1))
else
    echo -e "${RED}✗ 失败${NC}"
    echo "  JSON格式不正确"
    failed_tests=$((failed_tests + 1))
fi

# 测试皮肤状况记录
echo -n "测试 $(($total_tests + 1)): 检查皮肤状况记录... "
total_tests=$((total_tests + 1))

if grep -q "\"skin_conditions\"" "$DATA_FILE" && grep -q '"id": "cond_' "$DATA_FILE"; then
    echo -e "${GREEN}✓ 通过${NC}"
    passed_tests=$((passed_tests + 1))
else
    echo -e "${RED}✗ 失败${NC}"
    echo "  皮肤状况记录不存在或格式不正确"
    failed_tests=$((failed_tests + 1))
fi

# 测试痣追踪记录
echo -n "测试 $(($total_tests + 1)): 检查痣追踪记录... "
total_tests=$((total_tests + 1))

if grep -q "\"moles_tracking\"" "$DATA_FILE"; then
    echo -e "${GREEN}✓ 通过${NC}"
    passed_tests=$((passed_tests + 1))
else
    echo -e "${RED}✗ 失败${NC}"
    echo "  痣追踪记录不存在"
    failed_tests=$((failed_tests + 1))
fi

echo ""
echo "==================================="
echo "9. 集成功能测试"
echo "==================================="
echo ""

# 测试与其他模块的集成关键词
test_keyword_exists "$COMMAND_FILE" "营养模块" "与营养模块的集成说明"
test_keyword_exists "$COMMAND_FILE" "慢性病模块" "与慢性病模块的集成说明"
test_keyword_exists "$COMMAND_FILE" "用药模块" "与用药模块的集成说明"
test_keyword_exists "$COMMAND_FILE" "内分泌模块" "与内分泌模块的集成说明"

# 测试具体的集成场景
test_keyword_exists "$SKILL_FILE" "糖尿病" "糖尿病与皮肤的关联分析"
test_keyword_exists "$SKILL_FILE" "自身免疫病" "自身免疫病的皮肤表现"
test_keyword_exists "$SKILL_FILE" "甲状腺" "甲状腺疾病对皮肤的影响"
test_keyword_exists "$SKILL_FILE" "激素变化" "激素变化对皮肤的影响"

echo ""
echo "==================================="
echo "10. 预防和建议功能测试"
echo "==================================="
echo ""

# 测试预防建议关键词
test_keyword_exists "$COMMAND_FILE" "预防皮肤癌" "皮肤癌预防建议"
test_keyword_exists "$COMMAND_FILE" "管理痤疮" "痤疮管理建议"
test_keyword_exists "$COMMAND_FILE" "管理湿疹" "湿疹管理建议"
test_keyword_exists "$COMMAND_FILE" "预防光老化" "光老化预防建议"

# 测试健康建议
test_keyword_exists "$COMMAND_FILE" "防晒霜" "防晒建议"
test_keyword_exists "$COMMAND_FILE" "护肤" "护肤建议"
test_keyword_exists "$COMMAND_FILE" "定期检查" "定期检查建议"

echo ""
echo "==================================="
echo "11. 评分标准和统计测试"
echo "==================================="
echo ""

# 测试评分标准
test_keyword_exists "$COMMAND_FILE" "皮肤健康评分" "皮肤健康评分标准"
test_keyword_exists "$COMMAND_FILE" "日晒防护评分" "日晒防护评分标准"
test_keyword_exists "$COMMAND_FILE" "痣的风险分级" "痣的风险分级标准"

# 测试统计数据
test_json_key "$DATA_FILE" "skin_health_score" "皮肤健康评分"
test_json_key "$DATA_FILE" "total_moles" "痣总数"
test_json_key "$DATA_FILE" "concerning_moles" "可疑痣数量"
test_json_key "$DATA_FILE" "active_conditions" "活跃问题数"
test_json_key "$DATA_FILE" "skin_age" "皮肤年龄"

echo ""
echo "==================================="
echo "12. 目标管理功能测试"
echo "==================================="
echo ""

# 测试目标管理相关键
test_json_key "$DATA_FILE" "improve_acne" "改善痤疮目标"
test_json_key "$DATA_FILE" "reduce_pigmentation" "减淡色斑目标"
test_json_key "$DATA_FILE" "target" "目标值"
test_json_key "$DATA_FILE" "current" "当前值"
test_json_key "$DATA_FILE" "progress_percentage" "进度百分比"
test_json_key "$DATA_FILE" "deadline" "截止日期"
test_json_key "$DATA_FILE" "milestones" "目标里程碑"

echo ""
echo "==================================="
echo "测试总结"
echo "==================================="
echo ""
echo "总测试数: $total_tests"
echo -e "通过: ${GREEN}$passed_tests${NC}"
echo -e "失败: ${RED}$failed_tests${NC}"
echo ""

if [ $failed_tests -eq 0 ]; then
    echo -e "${GREEN}所有测试通过！皮肤健康功能实现完整。${NC}"
    exit 0
else
    pass_rate=$((passed_tests * 100 / total_tests))
    echo -e "通过率: ${pass_rate}%"

    if [ $pass_rate -ge 80 ]; then
        echo -e "${YELLOW}大部分测试通过，但有一些问题需要修复。${NC}"
        exit 1
    else
        echo -e "${RED}多个测试失败，需要全面检查实现。${NC}"
        exit 1
    fi
fi

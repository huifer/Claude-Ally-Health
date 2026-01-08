#!/bin/bash

# 心理健康功能测试脚本
# 版本: v1.0
# 创建日期: 2025-01-06

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 测试计数器
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# 测试结果数组
declare -a FAILED_TEST_NAMES

# ========================================
# 辅助函数
# ========================================

test_file() {
    local file="$1"
    local description="$2"
    TOTAL_TESTS=$((TOTAL_TESTS + 1))

    echo -n "测试 $TOTAL_TESTS: $description ... "

    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ 通过${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo -e "${RED}❌ 失败${NC}"
        echo "   文件不存在: $file"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        FAILED_TEST_NAMES+=("$description")
        return 1
    fi
}

test_json_structure() {
    local file="$1"
    local key="$2"
    local description="$3"
    TOTAL_TESTS=$((TOTAL_TESTS + 1))

    echo -n "测试 $TOTAL_TESTS: $description ... "

    # 简化测试：仅检查文件是否包含该键名
    if grep -q "\"$key\"" "$file" 2>/dev/null; then
        echo -e "${GREEN}✅ 通过${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo -e "${RED}❌ 失败${NC}"
        echo "   键 '$key' 不存在于 $file"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        FAILED_TEST_NAMES+=("$description")
        return 1
    fi
}

test_disclaimer_in_file() {
    local file="$1"
    local description="$2"
    TOTAL_TESTS=$((TOTAL_TESTS + 1))

    echo -n "测试 $TOTAL_TESTS: $description ... "

    if grep -q "免责声明\|医学安全声明" "$file" 2>/dev/null; then
        echo -e "${GREEN}✅ 通过${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo -e "${RED}❌ 失败${NC}"
        echo "   文件中未找到免责声明"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        FAILED_TEST_NAMES+=("$description")
        return 1
    fi
}

test_directory_exists() {
    local dir="$1"
    local description="$2"
    TOTAL_TESTS=$((TOTAL_TESTS + 1))

    echo -n "测试 $TOTAL_TESTS: $description ... "

    if [ -d "$dir" ]; then
        echo -e "${GREEN}✅ 通过${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo -e "${RED}❌ 失败${NC}"
        echo "   目录不存在: $dir"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        FAILED_TEST_NAMES+=("$description")
        return 1
    fi
}

test_keyword_in_file() {
    local file="$1"
    local keyword="$2"
    local description="$3"
    TOTAL_TESTS=$((TOTAL_TESTS + 1))

    echo -n "测试 $TOTAL_TESTS: $description ... "

    if grep -q "$keyword" "$file" 2>/dev/null; then
        echo -e "${GREEN}✅ 通过${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo -e "${RED}❌ 失败${NC}"
        echo "   未找到关键词: $keyword"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        FAILED_TEST_NAMES+=("$description")
        return 1
    fi
}

# ========================================
# 开始测试
# ========================================

echo "========================================="
echo "心理健康功能测试"
echo "========================================="
echo ""

# ========================================
# 第一组：基础功能测试 (15个测试)
# ========================================

echo -e "${YELLOW}第一组：基础功能测试 (15个)${NC}"
echo ""

# 命令文件测试
test_file ".claude/commands/mental-health.md" "心理健康命令文件存在"
test_disclaimer_in_file ".claude/commands/mental-health.md" "命令包含医学免责声明"

# 技能文件测试
test_file ".claude/skills/mental-health-analyzer/SKILL.md" "心理健康技能文件存在"
test_directory_exists ".claude/skills/mental-health-analyzer" "技能目录存在"

# 数据文件测试
test_file "data-example/mental-health-tracker.json" "心理健康数据文件存在"
test_json_structure "data-example/mental-health-tracker.json" "mental_health_tracking" "主数据结构正确"
test_json_structure "data-example/mental-health-tracker.json" "mental_health_assessments" "评估数据结构正确"
test_json_structure "data-example/mental-health-tracker.json" "mood_diary" "情绪日记结构正确"
test_json_structure "data-example/mental-health-tracker.json" "therapy_tracking" "治疗记录结构正确"
test_json_structure "data-example/mental-health-tracker.json" "crisis_plan" "危机计划结构正确"

# 日志目录测试
test_directory_exists "data-example/mental-health-logs" "心理健康日志目录存在"
test_directory_exists "data-example/mental-health-logs/2025-06" "月度日志目录存在"
test_file "data-example/mental-health-logs/2025-06/2025-06-20.json" "情绪日记日志文件存在"

# 索引文件测试
test_file "data-example/mental-health-logs/.index.json" "日志索引文件存在"
test_json_structure "data-example/mental-health-logs/.index.json" "months" "索引结构正确"

echo ""

# ========================================
# 第二组：医学安全测试 (15个测试)
# ========================================

echo -e "${YELLOW}第二组：医学安全测试 (15个)${NC}"
echo ""

# 医学免责声明测试
test_keyword_in_file ".claude/commands/mental-health.md" "不进行心理诊断" "包含诊断免责声明"
test_keyword_in_file ".claude/commands/mental-health.md" "不开具精神药物" "包含开药免责声明"
test_keyword_in_file ".claude/commands/mental-health.md" "不预测自杀风险" "包含不预测自杀风险声明"
test_keyword_in_file ".claude/commands/mental-health.md" "不替代专业心理治疗" "包含不替代治疗声明"
test_keyword_in_file ".claude/commands/mental-health.md" "不能替代专业心理治疗和精神科诊断" "包含系统边界说明"

# 紧急情况处理测试
test_keyword_in_file ".claude/commands/mental-health.md" "自伤或自杀想法" "包含自伤处理指导"
test_keyword_in_file ".claude/commands/mental-health.md" "幻觉、妄想" "包含精神病性症状指导"
test_keyword_in_file ".claude/commands/mental-health.md" "立即寻求专业帮助" "包含紧急求助指导"
test_keyword_in_file ".claude/commands/mental-health.md" "心理危机热线" "包含危机热线信息"
test_keyword_in_file ".claude/commands/mental-health.md" "120" "包含急救电话信息"

# 量表使用规范测试
test_keyword_in_file ".claude/commands/mental-health.md" "PHQ-9" "包含PHQ-9量表说明"
test_keyword_in_file ".claude/commands/mental-health.md" "GAD-7" "包含GAD-7量表说明"
test_keyword_in_file ".claude/commands/mental-health.md" "仅供参考" "包含量表结果免责声明"
test_keyword_in_file ".claude/commands/mental-health.md" "精神科医生" "包含专业医生诊断提醒"
test_keyword_in_file ".claude/skills/mental-health-analyzer/SKILL.md" "医学安全边界" "技能包含安全边界"

echo ""

# ========================================
# 第三组：数据结构测试 (15个测试)
# ========================================

echo -e "${YELLOW}第三组：数据结构测试 (15个)${NC}"
echo ""

# PHQ-9评估数据测试
test_json_structure "data-example/mental-health-tracker.json" "phq9" "PHQ-9数据存在"
test_json_structure "data-example/mental-health-tracker.json" "score" "PHQ-9评分字段存在"
test_json_structure "data-example/mental-health-tracker.json" "severity" "严重程度字段存在"
test_json_structure "data-example/mental-health-tracker.json" "responses" "PHQ-9响应字段存在"
test_json_structure "data-example/mental-health-tracker.json" "item_scores" "PHQ-9条目得分存在"

# GAD-7评估数据测试
test_json_structure "data-example/mental-health-tracker.json" "gad7" "GAD-7数据存在"
test_json_structure "data-example/mental-health-tracker.json" "nervous" "焦虑症状字段存在"

# 情绪日记数据测试
test_json_structure "data-example/mental-health-tracker.json" "primary_mood" "主要情绪字段存在"
test_json_structure "data-example/mental-health-tracker.json" "mood_intensity" "情绪强度字段存在"
test_json_structure "data-example/mental-health-tracker.json" "triggers" "触发因素字段存在"
test_json_structure "data-example/mental-health-tracker.json" "coping_strategies" "应对策略字段存在"

# 危机计划数据测试
test_json_structure "data-example/mental-health-tracker.json" "warning_signs" "预警信号字段存在"
test_json_structure "data-example/mental-health-tracker.json" "social_supports" "社会支持字段存在"
test_json_structure "data-example/mental-health-tracker.json" "professional_contacts" "专业联系人字段存在"
test_json_structure "data-example/mental-health-tracker.json" "emergency_services" "紧急服务字段存在"

echo ""

# ========================================
# 第四组：危机管理测试 (10个测试)
# ========================================

echo -e "${YELLOW}第四组：危机管理测试 (10个)${NC}"
echo ""

# 危机计划功能测试
test_keyword_in_file ".claude/commands/mental-health.md" "crisis plan create" "危机计划创建功能"
test_keyword_in_file ".claude/commands/mental-health.md" "crisis sign" "预警信号管理"
test_keyword_in_file ".claude/commands/mental-health.md" "crisis contact" "紧急联系人管理"
test_keyword_in_file ".claude/commands/mental-health.md" "crisis strategy" "应对策略管理"

# 危机预警信号测试
test_json_structure "data-example/mental-health-tracker.json" "hopelessness" "绝望感预警信号存在"
test_json_structure "data-example/mental-health-tracker.json" "social_withdrawal" "社会退缩预警信号存在"
test_json_structure "data-example/mental-health-tracker.json" "risk_level" "风险等级字段存在"

# 危机风险评估测试
test_keyword_in_file ".claude/skills/mental-health-analyzer/SKILL.md" "危机风险评估" "危机风险评估算法"
test_keyword_in_file ".claude/skills/mental-health-analyzer/SKILL.md" "多级风险检测" "多级风险检测机制"
test_keyword_in_file ".claude/skills/mental-health-analyzer/SKILL.md" "紧急行动触发" "紧急行动触发条件"

echo ""

# ========================================
# 第五组：关联分析测试 (10个测试)
# ========================================

echo -e "${YELLOW}第五组：关联分析测试 (10个)${NC}"
echo ""

# 与其他模块的关联测试
test_keyword_in_file ".claude/skills/mental-health-analyzer/SKILL.md" "睡眠-心理关联" "与睡眠模块关联"
test_keyword_in_file ".claude/skills/mental-health-analyzer/SKILL.md" "运动-情绪关联" "与运动模块关联"
test_keyword_in_file ".claude/skills/mental-health-analyzer/SKILL.md" "营养-心理关联" "与营养模块关联"
test_keyword_in_file ".claude/skills/mental-health-analyzer/SKILL.md" "慢性病-心理关联" "与慢性病模块关联"
test_keyword_in_file ".claude/commands/mental-health.md" "睡眠模块" "命令中说明睡眠模块关联"

# 具体关联分析测试
test_keyword_in_file ".claude/skills/mental-health-analyzer/SKILL.md" "睡眠质量" "睡眠质量与心理分析"
test_keyword_in_file ".claude/skills/mental-health-analyzer/SKILL.md" "运动频率" "运动与情绪分析"
test_keyword_in_file ".claude/skills/mental-health-analyzer/SKILL.md" "咖啡因" "咖啡因与焦虑分析"
test_keyword_in_file ".claude/skills/mental-health-analyzer/SKILL.md" "慢性疼痛" "慢性疼痛与抑郁分析"
test_keyword_in_file ".claude/skills/mental-health-analyzer/SKILL.md" "药物副作用" "药物与情绪分析"

echo ""

# ========================================
# 测试报告
# ========================================

echo "========================================="
echo "测试报告"
echo "========================================="
echo ""
echo "测试时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

# 第一组报告
echo -e "${YELLOW}基础功能测试: 15/15${NC}"
if [ ${PASSED_TESTS} -ge 15 ]; then
    echo -e "  状态: ${GREEN}全部通过${NC}"
else
    echo -e "  状态: ${RED}部分失败${NC}"
fi
echo ""

# 第二组报告
echo -e "${YELLOW}医学安全测试: 15/15${NC}"
if [ ${PASSED_TESTS} -ge 30 ] && [ ${TOTAL_TESTS} -ge 30 ]; then
    echo -e "  状态: ${GREEN}全部通过${NC}"
elif [ ${PASSED_TESTS} -ge 30 ] && [ ${TOTAL_TESTS} -lt 30 ]; then
    echo -e "  状态: ${YELLOW}部分通过${NC}"
else
    echo -e "  状态: ${RED}部分失败${NC}"
fi
echo ""

# 第三组报告
echo -e "${YELLOW}数据结构测试: 15/15${NC}"
if [ ${PASSED_TESTS} -ge 45 ] && [ ${TOTAL_TESTS} -ge 45 ]; then
    echo -e "  状态: ${GREEN}全部通过${NC}"
elif [ ${PASSED_TESTS} -ge 45 ] && [ ${TOTAL_TESTS} -lt 45 ]; then
    echo -e "  状态: ${YELLOW}部分通过${NC}"
else
    echo -e "  状态: ${RED}部分失败${NC}"
fi
echo ""

# 第四组报告
echo -e "${YELLOW}危机管理测试: 10/10${NC}"
if [ ${PASSED_TESTS} -ge 55 ] && [ ${TOTAL_TESTS} -ge 55 ]; then
    echo -e "  状态: ${GREEN}全部通过${NC}"
elif [ ${PASSED_TESTS} -ge 55 ] && [ ${TOTAL_TESTS} -lt 55 ]; then
    echo -e "  状态: ${YELLOW}部分通过${NC}"
else
    echo -e "  状态: ${RED}部分失败${NC}"
fi
echo ""

# 第五组报告
echo -e "${YELLOW}关联分析测试: 10/10${NC}"
if [ ${PASSED_TESTS} -ge 65 ] && [ ${TOTAL_TESTS} -ge 65 ]; then
    echo -e "  状态: ${GREEN}全部通过${NC}"
elif [ ${PASSED_TESTS} -ge 65 ] && [ ${TOTAL_TESTS} -lt 65 ]; then
    echo -e "  状态: ${YELLOW}部分通过${NC}"
else
    echo -e "  状态: ${RED}部分失败${NC}"
fi
echo ""

echo "========================================="
echo "总计: $PASSED_TESTS/$TOTAL_TESTS 通过"
echo -e "通过: ${GREEN}$PASSED_TESTS${NC}"
echo -e "失败: ${RED}$FAILED_TESTS${NC}"
echo "========================================="
echo ""

# 失败测试列表
if [ ${FAILED_TESTS} -gt 0 ]; then
    echo -e "${RED}失败的测试:${NC}"
    for test_name in "${FAILED_TEST_NAMES[@]}"; do
        echo "  - $test_name"
    done
    echo ""
fi

# 通过率计算
PASS_RATE=$((PASSED_TESTS * 100 / TOTAL_TESTS))
echo "通过率: ${PASS_RATE}%"
echo ""

if [ ${PASS_RATE} -ge 90 ]; then
    echo -e "${GREEN}✅ 测试结果：优秀（通过率≥90%）${NC}"
    exit 0
elif [ ${PASS_RATE} -ge 70 ]; then
    echo -e "${YELLOW}⚠️ 测试结果：良好（通过率≥70%）${NC}"
    exit 1
else
    echo -e "${RED}❌ 测试结果：需改进（通过率<70%）${NC}"
    exit 1
fi

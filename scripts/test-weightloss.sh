#!/bin/bash
# 科学运动健康减肥功能测试脚本
# 版本: v1.0
# 创建日期: 2025-01-14

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0
declare -a FAILED_TEST_NAMES

test_file() {
    local file="$1"
    local description="$2"
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -n "测试 $TOTAL_TESTS: $description ... "
    if [ -f "$file" ]; then
        echo -e "${GREEN}通过${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo -e "${RED}失败${NC}"
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
    if grep -q "\"$key\"" "$file" 2>/dev/null; then
        echo -e "${GREEN}通过${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo -e "${RED}失败${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        FAILED_TEST_NAMES+=("$description")
        return 1
    fi
}

echo "========================================="
echo "科学运动健康减肥功能测试"
echo "========================================="
echo ""

echo -e "${YELLOW}第一组：基础功能测试${NC}"
echo ""
test_file "scripts/weightloss_calculations.py" "计算模块存在"
test_file "scripts/test-weightloss.sh" "测试脚本存在"
test_file ".claude/skills/weightloss-analyzer/SKILL.md" "减肥分析技能存在"

echo ""
echo -e "${YELLOW}第二组：数据结构测试${NC}"
echo ""
test_file "data-example/fitness-tracker.json" "运动数据文件存在"
test_json_structure "data-example/fitness-tracker.json" "weight_loss_program" "减肥程序结构存在"
test_json_structure "data-example/fitness-tracker.json" "body_composition" "身体成分结构存在"
test_json_structure "data-example/fitness-tracker.json" "metabolic_profile" "代谢分析结构存在"

test_file "data-example/nutrition-tracker.json" "营养数据文件存在"
test_json_structure "data-example/nutrition-tracker.json" "weight_loss_energy" "能量管理结构存在"
test_json_structure "data-example/nutrition-tracker.json" "intermittent_fasting" "间歇性禁食结构存在"

echo ""
echo "========================================="
echo "测试完成"
echo "========================================="
echo -e "总计: ${TOTAL_TESTS} | ${GREEN}通过: ${PASSED_TESTS}${NC} | ${RED}失败: ${FAILED_TESTS}${NC}"

if [ $FAILED_TESTS -gt 0 ]; then
    echo ""
    echo "失败的测试:"
    for name in "${FAILED_TEST_NAMES[@]}"; do
        echo "  - $name"
    done
    exit 1
else
    echo ""
    echo -e "${GREEN}所有测试通过！${NC}"
    exit 0
fi

#!/bin/bash

# =============================================================================
# 儿童与青少年健康功能测试脚本
# Children's Health Feature Test Script
# =============================================================================
# 测试生长曲线追踪、青春期发育评估、疫苗接种三大模块
# Testing growth tracking, puberty assessment, and vaccination modules
# =============================================================================

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counters
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0

# Test result tracker
declare -a FAILED_TESTS

# =============================================================================
# Helper Functions
# =============================================================================

run_test() {
    local test_name="$1"
    local test_command="$2"

    TESTS_RUN=$((TESTS_RUN + 1))
    echo -n "Running test $TESTS_RUN: $test_name ... "

    if eval "$test_command" > /dev/null 2>&1; then
        echo -e "${GREEN}PASSED${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        return 0
    else
        echo -e "${RED}FAILED${NC}"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        FAILED_TESTS+=("$test_name")
        return 1
    fi
}

print_section() {
    echo ""
    echo -e "${YELLOW}═══════════════════════════════════════════════════${NC}"
    echo -e "${YELLOW}  $1${NC}"
    echo -e "${YELLOW}═══════════════════════════════════════════════════${NC}"
    echo ""
}

# =============================================================================
# Start Testing
# =============================================================================

echo ""
echo -e "${YELLOW}╔═══════════════════════════════════════════════════╗${NC}"
echo -e "${YELLOW}║   儿童与青少年健康功能测试套件                      ║${NC}"
echo -e "${YELLOW}║   Children's Health Feature Test Suite            ║${NC}"
echo -e "${YELLOW}╚═══════════════════════════════════════════════════╝${NC}"
echo ""

# =============================================================================
# Section 1: Command Files Validation
# =============================================================================

print_section "第一部分:命令文件验证 | Command Files Validation"

run_test "growth.md exists" \
    "test -f .claude/commands/growth.md"

run_test "puberty.md exists" \
    "test -f .claude/commands/puberty.md"

run_test "child-vaccine.md exists" \
    "test -f .claude/commands/child-vaccine.md"

run_test "pediatrics.md specialist exists" \
    "test -f .claude/specialists/pediatrics.md"

# =============================================================================
# Section 2: Data Files Validation
# =============================================================================

print_section "第二部分:数据文件验证 | Data Files Validation"

run_test "growth-tracker.json exists in data/" \
    "test -f data/growth-tracker.json"

run_test "child-vaccinations.json exists in data/" \
    "test -f data/child-vaccinations.json"

run_test "who-growth-standards.json exists in data/" \
    "test -f data/who-growth-standards.json"

run_test "child-vaccine-database.json exists in data/" \
    "test -f data/child-vaccine-database.json"

run_test "growth-tracker.json exists in data-example/" \
    "test -f data-example/growth-tracker.json"

run_test "child-vaccinations.json exists in data-example/" \
    "test -f data-example/child-vaccinations.json"

# =============================================================================
# Section 3: JSON Structure Validation
# =============================================================================

print_section "第三部分:JSON结构验证 | JSON Structure Validation"

run_test "growth-tracker.json is valid JSON" \
    "python3 -m json.tool data/growth-tracker.json > /dev/null"

run_test "child-vaccinations.json is valid JSON" \
    "python3 -m json.tool data/child-vaccinations.json > /dev/null"

run_test "who-growth-standards.json is valid JSON" \
    "python3 -m json.tool data/who-growth-standards.json > /dev/null"

run_test "child-vaccine-database.json is valid JSON" \
    "python3 -m json.tool data/child-vaccine-database.json > /dev/null"

run_test "growth-tracker example is valid JSON" \
    "python3 -m json.tool data-example/growth-tracker.json > /dev/null"

run_test "child-vaccinations example is valid JSON" \
    "python3 -m json.tool data-example/child-vaccinations.json > /dev/null"

# =============================================================================
# Section 4: Growth Tracking Structure
# =============================================================================

print_section "第四部分:生长追踪数据结构 | Growth Tracking Structure"

run_test "Growth tracker has child_profile section" \
    "python3 -c \"import json; d=json.load(open('data/growth-tracker.json')); exit(0 if 'child_profile' in d else 1)\""

run_test "Growth tracker has growth_tracking section" \
    "python3 -c \"import json; d=json.load(open('data/growth-tracker.json')); exit(0 if 'growth_tracking' in d else 1)\""

run_test "Growth tracker has puberty_tracking section" \
    "python3 -c \"import json; d=json.load(open('data/growth-tracker.json')); exit(0 if 'puberty_tracking' in d else 1)\""

run_test "Growth tracker has measurements array" \
    "python3 -c \"import json; d=json.load(open('data/growth-tracker.json')); exit(0 if isinstance(d.get('growth_tracking', {}).get('measurements'), list) else 1)\""

run_test "Growth tracker has growth_assessment object" \
    "python3 -c \"import json; d=json.load(open('data/growth-tracker.json')); exit(0 if 'growth_assessment' in d.get('growth_tracking', {}) else 1)\""

run_test "Child profile has birth_date" \
    "python3 -c \"import json; d=json.load(open('data/growth-tracker.json')); exit(0 if 'birth_date' in d.get('child_profile', {}) else 1)\""

run_test "Child profile has gender" \
    "python3 -c \"import json; d=json.load(open('data/growth-tracker.json')); exit(0 if 'gender' in d.get('child_profile', {}) else 1)\""

# =============================================================================
# Section 5: WHO Growth Standards Validation
# =============================================================================

print_section "第五部分:WHO生长标准验证 | WHO Growth Standards Validation"

run_test "WHO standards has height_for_age data" \
    "python3 -c \"import json; d=json.load(open('data/who-growth-standards.json')); exit(0 if 'height_for_age' in d else 1)\""

run_test "WHO standards has weight_for_age data" \
    "python3 -c \"import json; d=json.load(open('data/who-growth-standards.json')); exit(0 if 'weight_for_age' in d else 1)\""

run_test "WHO standards has bmi_for_age data" \
    "python3 -c \"import json; d=json.load(open('data/who-growth-standards.json')); exit(0 if 'bmi_for_age' in d else 1)\""

run_test "WHO standards has head_circumference data" \
    "python3 -c \"import json; d=json.load(open('data/who-growth-standards.json')); exit(0 if 'head_circumference_for_age' in d else 1)\""

run_test "WHO standards has boys data" \
    "python3 -c \"import json; d=json.load(open('data/who-growth-standards.json')); exit(0 if 'boys' in d.get('height_for_age', {}) else 1)\""

run_test "WHO standards has girls data" \
    "python3 -c \"import json; d=json.load(open('data/who-growth-standards.json')); exit(0 if 'girls' in d.get('height_for_age', {}) else 1)\""

# =============================================================================
# Section 6: Child Vaccination Structure
# =============================================================================

print_section "第六部分:儿童疫苗接种结构 | Child Vaccination Structure"

run_test "Child vaccination tracker has child_profile" \
    "python3 -c \"import json; d=json.load(open('data/child-vaccinations.json')); exit(0 if 'child_profile' in d else 1)\""

run_test "Child vaccination tracker has scheduled_vaccines array" \
    "python3 -c \"import json; d=json.load(open('data/child-vaccinations.json')); exit(0 if isinstance(d.get('scheduled_vaccines'), list) else 1)\""

run_test "Child vaccination tracker has upcoming array" \
    "python3 -c \"import json; d=json.load(open('data/child-vaccinations.json')); exit(0 if isinstance(d.get('upcoming'), list) else 1)\""

run_test "Child vaccination tracker has overdue array" \
    "python3 -c \"import json; d=json.load(open('data/child-vaccinations.json')); exit(0 if isinstance(d.get('overdue'), list) else 1)\""

run_test "Child vaccination tracker has completed array" \
    "python3 -c \"import json; d=json.load(open('data/child-vaccinations.json')); exit(0 if isinstance(d.get('completed'), list) else 1)\""

run_test "Child vaccination tracker has adverse_reactions array" \
    "python3 -c \"import json; d=json.load(open('data/child-vaccinations.json')); exit(0 if isinstance(d.get('adverse_reactions'), list) else 1)\""

# =============================================================================
# Section 7: Puberty Tracking Structure
# =============================================================================

print_section "第七部分:青春期追踪结构 | Puberty Tracking Structure"

run_test "Puberty tracking has female_development object" \
    "python3 -c \"import json; d=json.load(open('data/growth-tracker.json')); exit(0 if 'female_development' in d.get('puberty_tracking', {}) else 1)\""

run_test "Puberty tracking has male_development object" \
    "python3 -c \"import json; d=json.load(open('data/growth-tracker.json')); exit(0 if 'male_development' in d.get('puberty_tracking', {}) else 1)\""

run_test "Female development has breast_stage field" \
    "python3 -c \"import json; d=json.load(open('data/growth-tracker.json')); exit(0 if 'breast_stage' in d.get('puberty_tracking', {}).get('female_development', {}) else 1)\""

run_test "Female development has menarche object" \
    "python3 -c \"import json; d=json.load(open('data/growth-tracker.json')); exit(0 if 'menarche' in d.get('puberty_tracking', {}).get('female_development', {}) else 1)\""

run_test "Male development has testicular_volume object" \
    "python3 -c \"import json; d=json.load(open('data/growth-tracker.json')); exit(0 if 'testicular_volume' in d.get('puberty_tracking', {}).get('male_development', {}) else 1)\""

run_test "Puberty tracking has bone_age object" \
    "python3 -c \"import json; d=json.load(open('data/growth-tracker.json')); exit(0 if 'bone_age' in d.get('puberty_tracking', {}) else 1)\""

# =============================================================================
# Section 8: Command Content Validation
# =============================================================================

print_section "第八部分:命令内容验证 | Command Content Validation"

run_test "Growth command has record action" \
    "grep -q 'record' .claude/commands/growth.md"

run_test "Growth command has status action" \
    "grep -q 'status' .claude/commands/growth.md"

run_test "Growth command has percentile action" \
    "grep -q 'percentile' .claude/commands/growth.md"

run_test "Growth command has velocity action" \
    "grep -q 'velocity' .claude/commands/growth.md"

run_test "Puberty command has breast action" \
    "grep -q 'breast' .claude/commands/puberty.md"

run_test "Puberty command has menarche action" \
    "grep -q 'menarche' .claude/commands/puberty.md"

run_test "Puberty command has testicular action" \
    "grep -q 'testicular' .claude/commands/puberty.md"

run_test "Child-vaccine command has record action" \
    "grep -q 'record' .claude/commands/child-vaccine.md"

run_test "Child-vaccine command has schedule action" \
    "grep -q 'schedule' .claude/commands/child-vaccine.md"

# =============================================================================
# Section 9: Medical Safety Validation
# =============================================================================

print_section "第九部分:医学安全验证 | Medical Safety Validation"

run_test "No direct medication dosage (growth)" \
    "! grep -E '(推荐.*剂量|服用.*mg)' .claude/commands/growth.md | grep -v '^#' | grep -q ."

run_test "No direct medication dosage (puberty)" \
    "! grep -E '(推荐.*剂量|服用.*mg)' .claude/commands/puberty.md | grep -v '^#' | grep -q ."

run_test "Has medical disclaimer (growth)" \
    "grep -q '不能替代' .claude/commands/growth.md"

run_test "Has medical disclaimer (puberty)" \
    "grep -q '不能替代' .claude/commands/puberty.md"

run_test "Has medical disclaimer (child-vaccine)" \
    "grep -q '不能替代' .claude/commands/child-vaccine.md"

run_test "Has warning about consultation (growth)" \
    "grep -q '咨询.*医生' .claude/commands/growth.md"

run_test "Has warning about consultation (puberty)" \
    "grep -q '咨询.*医生' .claude/commands/puberty.md"

run_test "Has warning about consultation (child-vaccine)" \
    "grep -q '咨询.*医生' .claude/commands/child-vaccine.md"

# =============================================================================
# Section 10: Statistics Validation
# =============================================================================

print_section "第十部分:统计数据验证 | Statistics Validation"

run_test "Growth tracker has statistics section" \
    "python3 -c \"import json; d=json.load(open('data/growth-tracker.json')); exit(0 if 'statistics' in d else 1)\""

run_test "Child vaccination tracker has statistics section" \
    "python3 -c \"import json; d=json.load(open('data/child-vaccinations.json')); exit(0 if 'statistics' in d else 1)\""

run_test "Growth statistics has total_measurements" \
    "python3 -c \"import json; d=json.load(open('data/growth-tracker.json')); exit(0 if 'total_measurements' in d.get('statistics', {}) else 1)\""

run_test "Child vaccination statistics has class_1_completed" \
    "python3 -c \"import json; d=json.load(open('data/child-vaccinations.json')); exit(0 if 'class_1_completed' in d.get('statistics', {}) else 1)\""

# =============================================================================
# Final Summary
# =============================================================================

echo ""
echo -e "${YELLOW}═══════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}  测试总结 | Test Summary                             ${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════${NC}"
echo ""
echo -e "总测试数 | Total tests run:    ${TESTS_RUN}"
echo -e "${GREEN}通过数 | Passed:             ${TESTS_PASSED}${NC}"
echo -e "${RED}失败数 | Failed:             ${TESTS_FAILED}${NC}"
echo ""

if [ $TESTS_FAILED -gt 0 ]; then
    echo -e "${RED}失败的测试 | Failed tests:${NC}"
    for test in "${FAILED_TESTS[@]}"; do
        echo -e "${RED}  ✗ $test${NC}"
    done
    echo ""
    echo -e "${RED}❌ 测试未完全通过 | Some tests failed${NC}"
    exit 1
else
    echo -e "${GREEN}✅ 所有测试通过 | All tests passed!${NC}"
    echo ""
    echo -e "${GREEN}儿童与青少年健康功能开发完成！${NC}"
    echo -e "${GREEN}Children's health feature development completed!${NC}"
    echo ""
    echo -e "${YELLOW}已完成的模块 | Completed modules:${NC}"
    echo -e "  ✓ 生长曲线追踪 | Growth Tracking"
    echo -e "  ✓ 青春期发育评估 | Puberty Assessment"
    echo -e "  ✓ 儿童疫苗接种 | Child Vaccination"
    echo ""
    exit 0
fi

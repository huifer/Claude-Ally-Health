#!/bin/bash

# =============================================================================
# 男性健康功能测试脚本
# Male Health Feature Test Script
# =============================================================================
# 测试前列腺健康、男性不育、男性更年期三大模块
# Testing prostate health, male fertility, and male menopause modules
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
echo -e "${YELLOW}║   男性健康功能测试套件                              ║${NC}"
echo -e "${YELLOW}║   Male Health Feature Test Suite                   ║${NC}"
echo -e "${YELLOW}╚═══════════════════════════════════════════════════╝${NC}"
echo ""

# =============================================================================
# Section 1: Command Files Validation
# =============================================================================

print_section "第一部分:命令文件验证 | Command Files Validation"

run_test "prostate-health.md exists" \
    "test -f .claude/commands/prostate-health.md"

run_test "male-fertility.md exists" \
    "test -f .claude/commands/male-fertility.md"

run_test "male-menopause.md exists" \
    "test -f .claude/commands/male-menopause.md"

run_test "urology.md specialist exists" \
    "test -f .claude/specialists/urology.md"

# =============================================================================
# Section 2: Data Files Validation
# =============================================================================

print_section "第二部分:数据文件验证 | Data Files Validation"

run_test "prostate-tracker.json exists in data/" \
    "test -f data/prostate-tracker.json"

run_test "fertility-tracker.json exists in data/" \
    "test -f data/fertility-tracker.json"

run_test "andropause-tracker.json exists in data/" \
    "test -f data/andropause-tracker.json"

run_test "prostate-tracker.json exists in data-example/" \
    "test -f data-example/prostate-tracker.json"

run_test "fertility-tracker.json exists in data-example/" \
    "test -f data-example/fertility-tracker.json"

run_test "andropause-tracker.json exists in data-example/" \
    "test -f data-example/andropause-tracker.json"

# =============================================================================
# Section 3: JSON Structure Validation
# =============================================================================

print_section "第三部分:JSON结构验证 | JSON Structure Validation"

run_test "prostate-tracker.json is valid JSON" \
    "python3 -m json.tool data/prostate-tracker.json > /dev/null"

run_test "fertility-tracker.json is valid JSON" \
    "python3 -m json.tool data/fertility-tracker.json > /dev/null"

run_test "andropause-tracker.json is valid JSON" \
    "python3 -m json.tool data/andropause-tracker.json > /dev/null"

run_test "prostate-tracker example is valid JSON" \
    "python3 -m json.tool data-example/prostate-tracker.json > /dev/null"

run_test "fertility-tracker example is valid JSON" \
    "python3 -m json.tool data-example/fertility-tracker.json > /dev/null"

run_test "andropause-tracker example is valid JSON" \
    "python3 -m json.tool data-example/andropause-tracker.json > /dev/null"

# =============================================================================
# Section 4: Prostate Health Data Structure
# =============================================================================

print_section "第四部分:前列腺健康数据结构 | Prostate Health Structure"

run_test "Prostate tracker has prostate_health section" \
    "python3 -c \"import json; d=json.load(open('data/prostate-tracker.json')); exit(0 if 'prostate_health' in d else 1)\""

run_test "Prostate tracker has psa_history array" \
    "python3 -c \"import json; d=json.load(open('data/prostate-tracker.json')); exit(0 if isinstance(d.get('prostate_health', {}).get('psa_history'), list) else 1)\""

run_test "Prostate tracker has ipss_score object" \
    "python3 -c \"import json; d=json.load(open('data/prostate-tracker.json')); exit(0 if 'ipss_score' in d.get('prostate_health', {}) else 1)\""

run_test "Prostate tracker has psa_velocity object" \
    "python3 -c \"import json; d=json.load(open('data/prostate-tracker.json')); exit(0 if 'psa_velocity' in d.get('prostate_health', {}) else 1)\""

run_test "Prostate tracker has dre object" \
    "python3 -c \"import json; d=json.load(open('data/prostate-tracker.json')); exit(0 if 'dre' in d.get('prostate_health', {}) else 1)\""

run_test "Prostate tracker has prostate_volume object" \
    "python3 -c \"import json; d=json.load(open('data/prostate-tracker.json')); exit(0 if 'prostate_volume' in d.get('prostate_health', {}) else 1)\""

run_test "Prostate tracker has screening_plan object" \
    "python3 -c \"import json; d=json.load(open('data/prostate-tracker.json')); exit(0 if 'screening_plan' in d.get('prostate_health', {}) else 1)\""

run_test "Prostate tracker has family_history object" \
    "python3 -c \"import json; d=json.load(open('data/prostate-tracker.json')); exit(0 if 'family_history' in d.get('prostate_health', {}) else 1)\""

# =============================================================================
# Section 5: Fertility Health Data Structure
# =============================================================================

print_section "第五部分:生育健康数据结构 | Fertility Health Structure"

run_test "Fertility tracker has fertility_assessment section" \
    "python3 -c \"import json; d=json.load(open('data/fertility-tracker.json')); exit(0 if 'fertility_assessment' in d else 1)\""

run_test "Fertility tracker has semen_analysis object" \
    "python3 -c \"import json; d=json.load(open('data/fertility-tracker.json')); exit(0 if 'semen_analysis' in d.get('fertility_assessment', {}) else 1)\""

run_test "Fertility tracker has hormones object" \
    "python3 -c \"import json; d=json.load(open('data/fertility-tracker.json')); exit(0 if 'hormones' in d.get('fertility_assessment', {}) else 1)\""

run_test "Fertility tracker has varicocele object" \
    "python3 -c \"import json; d=json.load(open('data/fertility-tracker.json')); exit(0 if 'varicocele' in d.get('fertility_assessment', {}) else 1)\""

run_test "Fertility tracker has infections object" \
    "python3 -c \"import json; d=json.load(open('data/fertility-tracker.json')); exit(0 if 'infections' in d.get('fertility_assessment', {}) else 1)\""

run_test "Fertility tracker has genetic_testing object" \
    "python3 -c \"import json; d=json.load(open('data/fertility-tracker.json')); exit(0 if 'genetic_testing' in d.get('fertility_assessment', {}) else 1)\""

run_test "Semen analysis has volume field" \
    "python3 -c \"import json; d=json.load(open('data/fertility-tracker.json')); exit(0 if 'volume' in d.get('fertility_assessment', {}).get('semen_analysis', {}) else 1)\""

run_test "Semen analysis has concentration field" \
    "python3 -c \"import json; d=json.load(open('data/fertility-tracker.json')); exit(0 if 'concentration' in d.get('fertility_assessment', {}).get('semen_analysis', {}) else 1)\""

run_test "Semen analysis has motility object" \
    "python3 -c \"import json; d=json.load(open('data/fertility-tracker.json')); exit(0 if 'motility' in d.get('fertility_assessment', {}).get('semen_analysis', {}) else 1)\""

run_test "Semen analysis has morphology field" \
    "python3 -c \"import json; d=json.load(open('data/fertility-tracker.json')); exit(0 if 'morphology' in d.get('fertility_assessment', {}).get('semen_analysis', {}) else 1)\""

# =============================================================================
# Section 6: Andropause Data Structure
# =============================================================================

print_section "第六部分:更年期数据结构 | Andropause Structure"

run_test "Andropause tracker has andropause section" \
    "python3 -c \"import json; d=json.load(open('data/andropause-tracker.json')); exit(0 if 'andropause' in d else 1)\""

run_test "Andropause tracker has symptoms object" \
    "python3 -c \"import json; d=json.load(open('data/andropause-tracker.json')); exit(0 if 'symptoms' in d.get('andropause', {}) else 1)\""

run_test "Andropause tracker has testosterone_levels object" \
    "python3 -c \"import json; d=json.load(open('data/andropause-tracker.json')); exit(0 if 'testosterone_levels' in d.get('andropause', {}) else 1)\""

run_test "Andropause tracker has questionnaire_scores object" \
    "python3 -c \"import json; d=json.load(open('data/andropause-tracker.json')); exit(0 if 'questionnaire_scores' in d.get('andropause', {}) else 1)\""

run_test "Andropause tracker has trt object" \
    "python3 -c \"import json; d=json.load(open('data/andropause-tracker.json')); exit(0 if 'trt' in d.get('andropause', {}) else 1)\""

run_test "Andropause tracker has monitoring object" \
    "python3 -c \"import json; d=json.load(open('data/andropause-tracker.json')); exit(0 if 'monitoring' in d.get('andropause', {}) else 1)\""

run_test "Questionnaire scores has adam object" \
    "python3 -c \"import json; d=json.load(open('data/andropause-tracker.json')); exit(0 if 'adam' in d.get('andropause', {}).get('questionnaire_scores', {}) else 1)\""

run_test "Questionnaire scores has ams object" \
    "python3 -c \"import json; d=json.load(open('data/andropause-tracker.json')); exit(0 if 'ams' in d.get('andropause', {}).get('questionnaire_scores', {}) else 1)\""

# =============================================================================
# Section 7: Example Data Validation
# =============================================================================

print_section "第七部分:示例数据验证 | Example Data Validation"

run_test "Prostate example has PSA history entries" \
    "python3 -c \"import json; d=json.load(open('data-example/prostate-tracker.json')); exit(0 if len(d.get('prostate_health', {}).get('psa_history', [])) > 0 else 1)\""

run_test "Prostate example has IPSS score" \
    "python3 -c \"import json; d=json.load(open('data-example/prostate-tracker.json')); exit(0 if d.get('prostate_health', {}).get('ipss_score', {}).get('total_score') is not None else 1)\""

run_test "Fertility example has semen analysis date" \
    "python3 -c \"import json; d=json.load(open('data-example/fertility-tracker.json')); exit(0 if d.get('fertility_assessment', {}).get('semen_analysis', {}).get('date') is not None else 1)\""

run_test "Fertility example has hormone values" \
    "python3 -c \"import json; d=json.load(open('data-example/fertility-tracker.json')); exit(0 if d.get('fertility_assessment', {}).get('hormones', {}).get('date') is not None else 1)\""

run_test "Andropause example has testosterone values" \
    "python3 -c \"import json; d=json.load(open('data-example/andropause-tracker.json')); exit(0 if d.get('andropause', {}).get('testosterone_levels', {}).get('total_testosterone', {}).get('value') is not None else 1)\""

run_test "Andropause example has ADAM questionnaire" \
    "python3 -c \"import json; d=json.load(open('data-example/andropause-tracker.json')); exit(0 if len(d.get('andropause', {}).get('questionnaire_scores', {}).get('adam', {}).get('questions', [])) > 0 else 1)\""

# =============================================================================
# Section 8: Command Files Content Validation
# =============================================================================

print_section "第八部分:命令文件内容验证 | Command Content Validation"

run_test "Prostate command has PSA action" \
    "grep -q 'psa' .claude/commands/prostate-health.md"

run_test "Prostate command has IPSS action" \
    "grep -q 'ipss' .claude/commands/prostate-health.md"

run_test "Prostate command has screening action" \
    "grep -q 'screening' .claude/commands/prostate-health.md"

run_test "Fertility command has semen action" \
    "grep -q 'semen' .claude/commands/male-fertility.md"

run_test "Fertility command has hormone action" \
    "grep -q 'hormone' .claude/commands/male-fertility.md"

run_test "Andropause command has symptom action" \
    "grep -q 'symptom' .claude/commands/male-menopause.md"

run_test "Andropause command has testosterone action" \
    "grep -q 'testosterone' .claude/commands/male-menopause.md"

run_test "Andropause command has adam action" \
    "grep -q 'adam' .claude/commands/male-menopause.md"

run_test "Andropause command has trt action" \
    "grep -q 'trt' .claude/commands/male-menopause.md"

# =============================================================================
# Section 9: Medical Safety Validation
# =============================================================================

print_section "第九部分:医学安全验证 | Medical Safety Validation"

run_test "No direct medication dosage recommendations (prostate)" \
    "! grep -E '(推荐.*剂量|recommend.*dosage|服用.*mg)' .claude/commands/prostate-health.md | grep -v '^#' | grep -q ."

run_test "No direct medication dosage recommendations (fertility)" \
    "! grep -E '(推荐.*剂量|recommend.*dosage|服用.*mg)' .claude/commands/male-fertility.md | grep -v '^#' | grep -q ."

run_test "No direct medication dosage recommendations (andropause)" \
    "! grep -E '(推荐.*剂量|recommend.*dosage|服用.*mg)' .claude/commands/male-menopause.md | grep -v '^#' | grep -q ."

run_test "Has medical disclaimer (prostate)" \
    "grep -q '不能替代' .claude/commands/prostate-health.md"

run_test "Has medical disclaimer (fertility)" \
    "grep -q '不能替代' .claude/commands/male-fertility.md"

run_test "Has medical disclaimer (andropause)" \
    "grep -q '不能替代' .claude/commands/male-menopause.md"

run_test "Has warning about consultation (prostate)" \
    "grep -q '咨询.*医生' .claude/commands/prostate-health.md"

run_test "Has warning about consultation (fertility)" \
    "grep -q '咨询.*医生' .claude/commands/male-fertility.md"

run_test "Has warning about consultation (andropause)" \
    "grep -q '咨询.*医生' .claude/commands/male-menopause.md"

# =============================================================================
# Section 10: Statistics Validation
# =============================================================================

print_section "第十部分:统计数据验证 | Statistics Validation"

run_test "Prostate tracker has statistics section" \
    "python3 -c \"import json; d=json.load(open('data/prostate-tracker.json')); exit(0 if 'statistics' in d else 1)\""

run_test "Fertility tracker has statistics section" \
    "python3 -c \"import json; d=json.load(open('data/fertility-tracker.json')); exit(0 if 'statistics' in d else 1)\""

run_test "Andropause tracker has statistics section" \
    "python3 -c \"import json; d=json.load(open('data/andropause-tracker.json')); exit(0 if 'statistics' in d else 1)\""

run_test "Prostate statistics has total_psa_tests" \
    "python3 -c \"import json; d=json.load(open('data/prostate-tracker.json')); exit(0 if 'total_psa_tests' in d.get('statistics', {}) else 1)\""

run_test "Fertility statistics has total_semen_analyses" \
    "python3 -c \"import json; d=json.load(open('data/fertility-tracker.json')); exit(0 if 'total_semen_analyses' in d.get('statistics', {}) else 1)\""

run_test "Andropause statistics has tracking_duration_months" \
    "python3 -c \"import json; d=json.load(open('data/andropause-tracker.json')); exit(0 if 'tracking_duration_months' in d.get('statistics', {}) else 1)\""

# =============================================================================
# Section 11: Settings Validation
# =============================================================================

print_section "第十一部分:设置验证 | Settings Validation"

run_test "Prostate tracker has settings section" \
    "python3 -c \"import json; d=json.load(open('data/prostate-tracker.json')); exit(0 if 'settings' in d else 1)\""

run_test "Fertility tracker has settings section" \
    "python3 -c \"import json; d=json.load(open('data/fertility-tracker.json')); exit(0 if 'settings' in d else 1)\""

run_test "Andropause tracker has settings section" \
    "python3 -c \"import json; d=json.load(open('data/andropause-tracker.json')); exit(0 if 'settings' in d else 1)\""

run_test "Prostate settings has reminder_frequency" \
    "python3 -c \"import json; d=json.load(open('data/prostate-tracker.json')); exit(0 if 'reminder_frequency' in d.get('settings', {}) else 1)\""

run_test "Fertility settings has reminder_frequency" \
    "python3 -c \"import json; d=json.load(open('data/fertility-tracker.json')); exit(0 if 'reminder_frequency' in d.get('settings', {}) else 1)\""

run_test "Andropause settings has reminder_frequency" \
    "python3 -c \"import json; d=json.load(open('data/andropause-tracker.json')); exit(0 if 'reminder_frequency' in d.get('settings', {}) else 1)\""

# =============================================================================
# Section 12: Urology Specialist Validation
# =============================================================================

print_section "第十二部分:泌尿科专家验证 | Urology Specialist Validation"

run_test "Urology specialist has role definition" \
    "grep -q '泌尿外科专家' .claude/specialists/urology.md"

run_test "Urology specialist has safety boundaries" \
    "grep -q '安全红线' .claude/specialists/urology.md"

run_test "Urology specialist covers prostate health" \
    "grep -q '前列腺' .claude/specialists/urology.md"

run_test "Urology specialist covers male fertility" \
    "grep -q '男性不育' .claude/specialists/urology.md"

run_test "Urology specialist covers andropause" \
    "grep -q '性腺功能减退' .claude/specialists/urology.md"

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
    echo -e "${GREEN}男性健康功能开发完成！${NC}"
    echo -e "${GREEN}Male health feature development completed!${NC}"
    echo ""
    echo -e "${YELLOW}已完成的模块 | Completed modules:${NC}"
    echo -e "  ✓ 前列腺健康管理系统 | Prostate Health Management"
    echo -e "  ✓ 男性不育管理 | Male Fertility Management"
    echo -e "  ✓ 男性更年期管理 | Male Menopause Management"
    echo -e "  ✓ 泌尿科专科专家 | Urology Specialist"
    echo ""
    exit 0
fi

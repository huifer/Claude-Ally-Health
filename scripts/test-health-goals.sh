#!/bin/bash

# 健康目标与计划功能测试脚本
# 版本: v1.0
# 创建日期: 2025-01-08

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

    if grep -q "免责声明" "$file" 2>/dev/null; then
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

test_smart_goal() {
    local file="$1"
    local description="$2"
    TOTAL_TESTS=$((TOTAL_TESTS + 1))

    echo -n "测试 $TOTAL_TESTS: $description ... "

    if grep -q "smart_scores" "$file" 2>/dev/null && \
       grep -q "smart_grade" "$file" 2>/dev/null; then
        echo -e "${GREEN}✅ 通过${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo -e "${RED}❌ 失败${NC}"
        echo "   未找到SMART评分相关字段"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        FAILED_TEST_NAMES+=("$description")
        return 1
    fi
}

test_habit_streak() {
    local file="$1"
    local description="$2"
    TOTAL_TESTS=$((TOTAL_TESTS + 1))

    echo -n "测试 $TOTAL_TESTS: $description ... "

    if grep -q "current_streak" "$file" 2>/dev/null && \
       grep -q "longest_streak" "$file" 2>/dev/null && \
       grep -q "completion_rate" "$file" 2>/dev/null; then
        echo -e "${GREEN}✅ 通过${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo -e "${RED}❌ 失败${NC}"
        echo "   未找到习惯连续性相关字段"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        FAILED_TEST_NAMES+=("$description")
        return 1
    fi
}

test_achievement_system() {
    local file="$1"
    local description="$2"
    TOTAL_TESTS=$((TOTAL_TESTS + 1))

    echo -n "测试 $TOTAL_TESTS: $description ... "

    if grep -q "achievements" "$file" 2>/dev/null && \
       grep -q "unlocked" "$file" 2>/dev/null && \
       grep -q "连续" "$file" 2>/dev/null; then
        echo -e "${GREEN}✅ 通过${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo -e "${RED}❌ 失败${NC}"
        echo "   未找到成就系统相关字段"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        FAILED_TEST_NAMES+=("$description")
        return 1
    fi
}

test_html_report() {
    local file="$1"
    local description="$2"
    TOTAL_TESTS=$((TOTAL_TESTS + 1))

    echo -n "测试 $TOTAL_TESTS: $description ... "

    if grep -q "ECharts" "$file" 2>/dev/null || \
       grep -q "echarts" "$file" 2>/dev/null || \
       grep -q "可视化" "$file" 2>/dev/null; then
        echo -e "${GREEN}✅ 通过${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo -e "${RED}❌ 失败${NC}"
        echo "   未找到可视化报告相关内容"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        FAILED_TEST_NAMES+=("$description")
        return 1
    fi
}

# ========================================
# 开始测试
# ========================================

echo "========================================="
echo "健康目标与计划功能测试"
echo "========================================="
echo ""

# ========================================
# 第一组：基础功能测试 (15个测试)
# ========================================

echo -e "${YELLOW}第一组:基础功能测试 (15个)${NC}"
echo ""

# 命令文件测试
test_file ".claude/commands/goal.md" "目标命令文件存在"
test_disclaimer_in_file ".claude/commands/goal.md" "命令包含医学免责声明"

# 技能文件测试
test_file ".claude/skills/goal-analyzer/SKILL.md" "目标分析技能文件存在"
test_disclaimer_in_file ".claude/skills/goal-analyzer/SKILL.md" "技能包含医学免责声明"

# 数据文件测试
test_file "data-example/health-goals-tracker.json" "健康目标数据文件存在"
test_json_structure "data-example/health-goals-tracker.json" "health_goals" "数据结构正确"
test_json_structure "data-example/health-goals-tracker.json" "active_goals" "活跃目标字段存在"
test_json_structure "data-example/health-goals-tracker.json" "habits" "习惯字段存在"
test_json_structure "data-example/health-goals-tracker.json" "achievements" "成就系统字段存在"

# 日志目录测试
test_directory_exists "data-example/health-goals-logs" "日志目录存在"
test_directory_exists "data-example/health-goals-logs/2025-01" "2025年1月日志目录存在"
test_directory_exists "data-example/health-goals-logs/2025-03" "2025年3月日志目录存在"

# 日志文件测试
test_file "data-example/health-goals-logs/2025-01/2025-01-01.json" "示例日志文件1存在"
test_file "data-example/health-goals-logs/2025-03/2025-03-20.json" "示例日志文件2存在"

echo ""

# ========================================
# 第二组:医学安全测试 (10个测试)
# ========================================

echo -e "${YELLOW}第二组:医学安全测试 (10个)${NC}"
echo ""

# 命令文件医学安全测试
test_keyword_in_file ".claude/commands/goal.md" "不构成医疗诊断" "命令包含能力范围声明"
test_keyword_in_file ".claude/commands/goal.md" "不能替代" "命令包含不能替代声明"
test_keyword_in_file ".claude/commands/goal.md" "何时需要咨询" "命令包含转介建议"
test_keyword_in_file ".claude/commands/goal.md" "极端目标" "命令包含极端目标警告"

# 技能文件医学安全测试
test_keyword_in_file ".claude/skills/goal-analyzer/SKILL.md" "能力范围声明" "技能包含能力范围声明"
test_keyword_in_file ".claude/skills/goal-analyzer/SKILL.md" "危险信号识别" "技能包含危险信号识别"
test_keyword_in_file ".claude/skills/goal-analyzer/SKILL.md" "转介建议" "技能包含转介建议"
test_keyword_in_file ".claude/skills/goal-analyzer/SKILL.md" "每周0.5-1公斤" "技能包含健康减重速度建议"
test_keyword_in_file ".claude/skills/goal-analyzer/SKILL.md" "进食障碍" "技能包含进食障碍警示"
test_keyword_in_file ".claude/skills/goal-analyzer/SKILL.md" "强迫行为" "技能包含强迫行为警示"

echo ""

# ========================================
# 第三组:目标管理测试 (15个测试)
# ========================================

echo -e "${YELLOW}第三组:目标管理测试 (15个)${NC}"
echo ""

# 目标类型测试
test_keyword_in_file ".claude/commands/goal.md" "weight-loss" "支持减重目标"
test_keyword_in_file ".claude/commands/goal.md" "exercise" "支持运动目标"
test_keyword_in_file ".claude/commands/goal.md" "diet" "支持饮食目标"
test_keyword_in_file ".claude/commands/goal.md" "health-metric" "支持健康指标目标"
test_keyword_in_file ".claude/commands/goal.md" "sleep" "支持睡眠目标"

# SMART目标测试
test_smart_goal "data-example/health-goals-tracker.json" "数据包含SMART评分字段"
test_smart_goal ".claude/skills/goal-analyzer/SKILL.md" "技能包含SMART验证说明"
test_keyword_in_file ".claude/skills/goal-analyzer/SKILL.md" "Specific" "SMART原则包含具体性"
test_keyword_in_file ".claude/skills/goal-analyzer/SKILL.md" "Measurable" "SMART原则包含可衡量性"
test_keyword_in_file ".claude/skills/goal-analyzer/SKILL.md" "Achievable" "SMART原则包含可实现性"

# 目标进度测试
test_json_structure "data-example/health-goals-tracker.json" "progress" "目标包含进度字段"
test_json_structure "data-example/health-goals-tracker.json" "current_value" "目标包含当前值字段"
test_json_structure "data-example/health-goals-tracker.json" "target_value" "目标包含目标值字段"
test_json_structure "data-example/health-goals-tracker.json" "motivation" "目标包含动机字段"
test_json_structure "data-example/health-goals-tracker.json" "action_plan" "目标包含行动计划字段"

echo ""

# ========================================
# 第四组:进度追踪测试 (10个测试)
# ========================================

echo -e "${YELLOW}第四组:进度追踪测试 (10个)${NC}"
echo ""

# 进度命令测试
test_keyword_in_file ".claude/commands/goal.md" "/goal progress" "支持进度更新命令"
test_keyword_in_file ".claude/commands/goal.md" "完成百分比" "支持百分比显示"
test_keyword_in_file ".claude/commands/goal.md" "预计完成时间" "支持时间预测"

# 进度分析功能测试
test_keyword_in_file ".claude/skills/goal-analyzer/SKILL.md" "进度追踪" "技能包含进度追踪功能"
test_keyword_in_file ".claude/skills/goal-analyzer/SKILL.md" "速度分析" "技能包含速度分析"
test_keyword_in_file ".claude/skills/goal-analyzer/SKILL.md" "趋势识别" "技能包含趋势识别"
test_keyword_in_file ".claude/skills/goal-analyzer/SKILL.md" "进度评级" "技能包含进度评级"

# 数据分析测试
test_json_structure "data-example/health-goals-tracker.json" "goal_analytics" "包含分析数据"
test_json_structure "data-example/health-goals-tracker.json" "progress_history" "包含进度历史"
test_json_structure "data-example/health-goals-tracker.json" "correlations" "包含相关性分析"

echo ""

# ========================================
# 第五组:习惯养成测试 (10个测试)
# ========================================

echo -e "${YELLOW}第五组:习惯养成测试 (10个)${NC}"
echo ""

# 习惯命令测试
test_keyword_in_file ".claude/commands/goal.md" "/goal habit" "支持习惯命令"
test_keyword_in_file ".claude/commands/goal.md" "habit set" "支持设定习惯"
test_keyword_in_file ".claude/commands/goal.md" "habit stack" "支持习惯堆叠"

# 习惯追踪功能测试
test_habit_streak "data-example/health-goals-tracker.json" "数据包含习惯连续性字段"
test_json_structure "data-example/health-goals-tracker.json" "strength_score" "包含习惯强度评分"
test_json_structure "data-example/health-goals-tracker.json" "stage" "包含习惯阶段字段"
test_json_structure "data-example/health-goals-tracker.json" "completion_rate" "包含完成率字段"
test_json_structure "data-example/health-goals-tracker.json" "habit_streaks" "分析数据包含习惯连续性"

# 习惯养成阶段测试
test_keyword_in_file ".claude/skills/goal-analyzer/SKILL.md" "启动期" "包含习惯启动期说明"
test_keyword_in_file ".claude/skills/goal-analyzer/SKILL.md" "形成期" "包含习惯形成期说明"
test_keyword_in_file ".claude/skills/goal-analyzer/SKILL.md" "巩固期" "包含习惯巩固期说明"

echo ""

# ========================================
# 第六组:动机管理测试 (5个测试)
# ========================================

echo -e "${YELLOW}第六组:动机管理测试 (5个)${NC}"
echo ""

# 动机评估测试
test_keyword_in_file ".claude/commands/goal.md" "动机评估" "命令包含动机评估说明"
test_keyword_in_file ".claude/skills/goal-analyzer/SKILL.md" "动机评分" "技能包含动机评分功能"
test_json_structure "data-example/health-goals-tracker.json" "motivation_trends" "数据包含动机趋势"
test_keyword_in_file ".claude/skills/goal-analyzer/SKILL.md" "动机低谷" "技能包含动机低谷识别"
test_keyword_in_file ".claude/skills/goal-analyzer/SKILL.md" "激励建议" "技能包含激励建议"

echo ""

# ========================================
# 第七组:成就系统测试 (5个测试)
# ========================================

echo -e "${YELLOW}第七组:成就系统测试 (5个)${NC}"
echo ""

# 成就系统功能测试
test_achievement_system ".claude/commands/goal.md" "命令包含成就系统说明"
test_achievement_system ".claude/skills/goal-analyzer/SKILL.md" "技能包含成就系统管理"
test_achievement_system "data-example/health-goals-tracker.json" "数据包含成就系统"
test_keyword_in_file ".claude/commands/goal.md" "首次目标" "包含首次目标成就"
test_keyword_in_file ".claude/commands/goal.md" "连续7天" "包含连续打卡成就"

echo ""

# ========================================
# 第八组:数据结构测试 (5个测试)
# ========================================

echo -e "${YELLOW}第八组:数据结构测试 (5个)${NC}"
echo ""

# 主数据结构测试
test_json_structure "data-example/health-goals-tracker.json" "user_profile" "包含用户配置"
test_json_structure "data-example/health-goals-tracker.json" "completed_goals" "包含已完成目标"
test_json_structure "data-example/health-goals-tracker.json" "statistics" "包含统计数据"
test_json_structure "data-example/health-goals-tracker.json" "metadata" "包含元数据"

# 日志数据结构测试
test_json_structure "data-example/health-goals-logs/2025-01/2025-01-01.json" "goal_updates" "日志包含目标更新"
test_json_structure "data-example/health-goals-logs/2025-01/2025-01-01.json" "habit_log" "日志包含习惯记录"
test_json_structure "data-example/health-goals-logs/2025-01/2025-01-01.json" "achievements_unlocked" "日志包含成就解锁"

echo ""

# ========================================
# 第九组:可视化报告测试 (5个测试)
# ========================================

echo -e "${YELLOW}第九组:可视化报告测试 (5个)${NC}"
echo ""

# 报告命令测试
test_keyword_in_file ".claude/commands/goal.md" "/goal report" "支持报告生成命令"
test_keyword_in_file ".claude/commands/goal.md" "progress-trend" "支持进度趋势报告"
test_keyword_in_file ".claude/commands/goal.md" "habit-heatmap" "支持习惯热图报告"
test_keyword_in_file ".claude/commands/goal.md" "multi-goal" "支持多目标对比报告"

# HTML报告功能测试
test_html_report ".claude/skills/goal-analyzer/SKILL.md" "技能包含可视化报告生成"

echo ""

# ========================================
# 测试结果汇总
# ========================================

echo "========================================="
echo "测试结果汇总"
echo "========================================="
echo ""
echo -e "总计: ${YELLOW}$TOTAL_TESTS${NC}个测试"
echo -e "通过: ${GREEN}$PASSED_TESTS${NC}"
echo -e "失败: ${RED}$FAILED_TESTS${NC}"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}🎉 所有测试通过!${NC}"
    exit 0
else
    echo -e "${RED}❌ 有 $FAILED_TESTS 个测试失败${NC}"
    echo ""
    echo "失败的测试:"
    for test_name in "${FAILED_TEST_NAMES[@]}"; do
        echo "  - $test_name"
    done
    exit 1
fi

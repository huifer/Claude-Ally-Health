#!/bin/bash

# 性健康功能测试脚本
# 测试性健康模块的文件完整性、数据结构和关键功能

set -e  # 遇到错误立即退出

echo "==================================="
echo "性健康功能测试脚本"
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
test_file_exists ".claude/commands/sexual-health.md" "命令定义文件"

# 测试数据文件
test_file_exists "data-example/sexual-health-tracker.json" "数据文件"

# 测试技能文件
test_file_exists ".claude/skills/sexual-health-analyzer/SKILL.md" "技能文件"

echo ""
echo "==================================="
echo "2. JSON数据结构完整性测试"
echo "==================================="
echo ""

DATA_FILE="data-example/sexual-health-tracker.json"

# 测试主要数据键
test_json_key "$DATA_FILE" "sexual_health_management" "性健康追踪主键"
test_json_key "$DATA_FILE" "user_profile" "用户档案"
test_json_key "$DATA_FILE" "male_sexual_health" "男性性健康"
test_json_key "$DATA_FILE" "female_sexual_health" "女性性健康"
test_json_key "$DATA_FILE" "std_screening" "STD筛查"
test_json_key "$DATA_FILE" "contraception" "避孕管理"
test_json_key "$DATA_FILE" "sexual_activity_log" "性活动日志"
test_json_key "$DATA_FILE" "medications" "用药记录"
test_json_key "$DATA_FILE" "goals" "目标管理"
test_json_key "$DATA_FILE" "statistics" "统计信息"
test_json_key "$DATA_FILE" "metadata" "元数据"

# 测试用户档案详细键
test_json_key "$DATA_FILE" "gender" "性别"
test_json_key "$DATA_FILE" "age" "年龄"
test_json_key "$DATA_FILE" "sexual_orientation" "性取向"
test_json_key "$DATA_FILE" "risk_factors" "风险因素"

# 测试男性性健康详细键
test_json_key "$DATA_FILE" "iief5_history" "IIEF-5历史记录"
test_json_key "$DATA_FILE" "libido_assessment" "性欲评估"
test_json_key "$DATA_FILE" "ejaculation_function" "射精功能"
test_json_key "$DATA_FILE" "testosterone_level" "睾酮水平"
test_json_key "$DATA_FILE" "last_psa_test" "最后PSA检查"

# 测试IIEF-5问卷键
test_json_key "$DATA_FILE" "q1_score" "问题1得分"
test_json_key "$DATA_FILE" "q2_score" "问题2得分"
test_json_key "$DATA_FILE" "q3_score" "问题3得分"
test_json_key "$DATA_FILE" "q4_score" "问题4得分"
test_json_key "$DATA_FILE" "q5_score" "问题5得分"
test_json_key "$DATA_FILE" "total_score" "IIEF-5总分"
test_json_key "$DATA_FILE" "severity" "ED严重程度"

# 测试女性性健康键
test_json_key "$DATA_FILE" "fsfi_scores" "FSFI评分"
test_json_key "$DATA_FILE" "libido_notes" "性欲备注"
test_json_key "$DATA_FILE" "dyspareunia" "性交痛"

# 测试STD筛查详细键
test_json_key "$DATA_FILE" "last_screening" "最后筛查日期"
test_json_key "$DATA_FILE" "next_screening" "下次筛查日期"
test_json_key "$DATA_FILE" "screening_history" "筛查历史"
test_json_key "$DATA_FILE" "hiv" "HIV检测"
test_json_key "$DATA_FILE" "syphilis" "梅毒检测"
test_json_key "$DATA_FILE" "chlamydia" "衣原体检测"
test_json_key "$DATA_FILE" "gonorrhea" "淋病检测"
test_json_key "$DATA_FILE" "hpv" "HPV检测"

# 测试避孕管理详细键
test_json_key "$DATA_FILE" "current_method" "当前避孕方法"
test_json_key "$DATA_FILE" "effectiveness" "有效性"
test_json_key "$DATA_FILE" "side_effects" "副作用"
test_json_key "$DATA_FILE" "satisfaction" "满意度"

# 测试性活动日志键
test_json_key "$DATA_FILE" "activity_type" "活动类型"
test_json_key "$DATA_FILE" "protection_used" "是否使用保护措施"
test_json_key "$DATA_FILE" "satisfaction" "满意度"
test_json_key "$DATA_FILE" "privacy_flag" "隐私标记"

# 测试用药记录键
test_json_key "$DATA_FILE" "dosage" "剂量"
test_json_key "$DATA_FILE" "frequency" "使用频率"
test_json_key "$DATA_FILE" "effectiveness" "药物效果"
test_json_key "$DATA_FILE" "side_effects" "药物副作用"

# 测试目标管理键
test_json_key "$DATA_FILE" "target_score" "目标IIEF-5评分"
test_json_key "$DATA_FILE" "current_score" "当前IIEF-5评分"
test_json_key "$DATA_FILE" "action_plan" "行动计划"
test_json_key "$DATA_FILE" "milestones" "里程碑"

# 测试风险评分键
test_json_key "$DATA_FILE" "ed_risk_score" "ED风险评分"
test_json_key "$DATA_FILE" "std_risk_score" "STD风险评分"
test_json_key "$DATA_FILE" "primary_ed_risk_factors" "主要ED风险因素"

echo ""
echo "==================================="
echo "3. 命令功能关键词测试"
echo "==================================="
echo ""

COMMAND_FILE=".claude/commands/sexual-health.md"

# 测试操作类型关键词
test_keyword_exists "$COMMAND_FILE" "checkup" "检查记录功能"
test_keyword_exists "$COMMAND_FILE" "iief5" "IIEF-5问卷功能"
test_keyword_exists "$COMMAND_FILE" "fsfi" "FSFI评分功能"
test_keyword_exists "$COMMAND_FILE" "std" "STD筛查功能"
test_keyword_exists "$COMMAND_FILE" "contraception" "避孕管理功能"
test_keyword_exists "$COMMAND_FILE" "activity" "性活动日志功能"
test_keyword_exists "$COMMAND_FILE" "medication" "用药记录功能"
test_keyword_exists "$COMMAND_FILE" "status" "状态查看功能"
test_keyword_exists "$COMMAND_FILE" "trend" "趋势分析功能"
test_keyword_exists "$COMMAND_FILE" "reminder" "提醒设置功能"

# 测试IIEF-5问卷关键词
test_keyword_exists "$COMMAND_FILE" "问题1" "IIEF-5问题1"
test_keyword_exists "$COMMAND_FILE" "问题2" "IIEF-5问题2"
test_keyword_exists "$COMMAND_FILE" "问题3" "IIEF-5问题3"
test_keyword_exists "$COMMAND_FILE" "问题4" "IIEF-5问题4"
test_keyword_exists "$COMMAND_FILE" "问题5" "IIEF-5问题5"
test_keyword_exists "$COMMAND_FILE" "勃起信心" "勃起信心问题"
test_keyword_exists "$COMMAND_FILE" "勃起获得" "勃起获得问题"
test_keyword_exists "$COMMAND_FILE" "插入伴侣" "插入能力问题"
test_keyword_exists "$COMMAND_FILE" "维持勃起" "勃起维持问题"
test_keyword_exists "$COMMAND_FILE" "性交满意度" "满意度问题"

# 测试IIEF-5评分标准
test_keyword_exists "$COMMAND_FILE" "22-25" "正常功能评分"
test_keyword_exists "$COMMAND_FILE" "17-21" "轻度ED评分"
test_keyword_exists "$COMMAND_FILE" "12-16" "轻中度ED评分"
test_keyword_exists "$COMMAND_FILE" "8-11" "中度ED评分"
test_keyword_exists "$COMMAND_FILE" "5-7" "重度ED评分"

# 测试STD类型关键词
test_keyword_exists "$COMMAND_FILE" "HIV" "HIV筛查"
test_keyword_exists "$COMMAND_FILE" "梅毒" "梅毒筛查"
test_keyword_exists "$COMMAND_FILE" "衣原体" "衣原体筛查"
test_keyword_exists "$COMMAND_FILE" "淋病" "淋病筛查"
test_keyword_exists "$COMMAND_FILE" "HPV" "HPV筛查"
test_keyword_exists "$COMMAND_FILE" "Hepatitis B" "乙肝筛查"
test_keyword_exists "$COMMAND_FILE" "疱疹" "疱疹筛查"

# 测试避孕方法关键词
test_keyword_exists "$COMMAND_FILE" "避孕套" "避孕套方法"
test_keyword_exists "$COMMAND_FILE" "口服避孕药" "口服避孕药方法"
test_keyword_exists "$COMMAND_FILE" "宫内节育器" "IUD方法"
test_keyword_exists "$COMMAND_FILE" "皮下埋植" "埋植方法"
test_keyword_exists "$COMMAND_FILE" "体外射精" "体外射精方法"
test_keyword_exists "$COMMAND_FILE" "安全期" "安全期方法"
test_keyword_exists "$COMMAND_FILE" "结扎" "结扎手术"

# 测试药物类型关键词
test_keyword_exists "$COMMAND_FILE" "西地那非" "西地那非药物"
test_keyword_exists "$COMMAND_FILE" "他达拉非" "他达拉非药物"
test_keyword_exists "$COMMAND_FILE" "伐地那非" "伐地那非药物"
test_keyword_exists "$COMMAND_FILE" "PDE5抑制剂" "PDE5抑制剂类别"

echo ""
echo "==================================="
echo "4. 医学安全声明测试"
echo "==================================="
echo ""

# 测试医学免责声明
test_keyword_exists "$COMMAND_FILE" "医学免责声明" "医学免责声明标题"
test_keyword_exists "$COMMAND_FILE" "不提供医学诊断" "诊断免责声明"
test_keyword_exists "$COMMAND_FILE" "咨询专业医生" "专业医生建议"
test_keyword_exists "$COMMAND_FILE" "泌尿科" "泌尿科医生建议"
test_keyword_exists "$COMMAND_FILE" "妇科医生" "妇科医生建议"
test_keyword_exists "$COMMAND_FILE" "立即就医" "紧急情况就医提示"

# 测试紧急情况指南
test_keyword_exists "$COMMAND_FILE" "何时寻求专业帮助" "专业帮助指南标题"
test_keyword_exists "$COMMAND_FILE" "睾丸剧烈疼痛" "睾丸疼痛紧急情况"
test_keyword_exists "$COMMAND_FILE" "异常持续勃起" "持续勃起紧急情况"
test_keyword_exists "$COMMAND_FILE" "剧烈盆腔疼痛" "盆腔疼痛紧急情况"
test_keyword_exists "$COMMAND_FILE" "异常大量阴道出血" "异常出血紧急情况"

echo ""
echo "==================================="
echo "5. 技能模块功能测试"
echo "==================================="
echo ""

SKILL_FILE=".claude/skills/sexual-health-analyzer/SKILL.md"

# 测试分析功能关键词
test_keyword_exists "$SKILL_FILE" "IIEF-5 评分分析" "IIEF-5评分分析功能"
test_keyword_exists "$SKILL_FILE" "STD 筛查管理" "STD筛查管理功能"
test_keyword_exists "$SKILL_FILE" "避孕管理" "避孕管理功能"
test_keyword_exists "$SKILL_FILE" "性活动日志" "性活动日志功能"
test_keyword_exists "$SKILL_FILE" "关联分析" "关联分析功能"
test_keyword_exists "$SKILL_FILE" "风险评估" "风险评估功能"
test_keyword_exists "$SKILL_FILE" "个性化建议" "个性化建议功能"
test_keyword_exists "$SKILL_FILE" "预警系统" "预警系统功能"

# 测试IIEF-5详细分析
test_keyword_exists "$SKILL_FILE" "交互式问卷" "交互式问卷功能"
test_keyword_exists "$SKILL_FILE" "ED严重程度评估" "ED严重程度评估"
test_keyword_exists "$SKILL_FILE" "趋势分析" "趋势分析功能"
test_keyword_exists "$SKILL_FILE" "风险因素分析" "风险因素分析"
test_keyword_exists "$SKILL_FILE" "改善建议" "改善建议功能"

# 测试ED风险因素
test_keyword_exists "$SKILL_FILE" "糖尿病" "糖尿病风险因素"
test_keyword_exists "$SKILL_FILE" "心血管疾病" "心血管疾病风险因素"
test_keyword_exists "$SKILL_FILE" "高血压" "高血压风险因素"
test_keyword_exists "$SKILL_FILE" "吸烟" "吸烟风险因素"
test_keyword_exists "$SKILL_FILE" "肥胖" "肥胖风险因素"
test_keyword_exists "$SKILL_FILE" "压力" "压力风险因素"

# 测试STD详细分析
test_keyword_exists "$SKILL_FILE" "筛查项目详解" "筛查项目详解"
test_keyword_exists "$SKILL_FILE" "风险评估" "STD风险评估"
test_keyword_exists "$SKILL_FILE" "筛查频率建议" "筛查频率建议"
test_keyword_exists "$SKILL_FILE" "阳性结果管理" "阳性结果管理"

# 测试避孕详细分析
test_keyword_exists "$SKILL_FILE" "避孕方法详细分析" "避孕方法详细分析"
test_keyword_exists "$SKILL_FILE" "效果评估" "避孕效果评估"
test_keyword_exists "$SKILL_FILE" "副作用追踪" "副作用追踪"
test_keyword_exists "$SKILL_FILE" "切换历史" "切换历史"

# 测试关联分析模块
test_keyword_exists "$SKILL_FILE" "与用药模块的关联" "与用药模块的关联"
test_keyword_exists "$SKILL_FILE" "与慢性病模块的关联" "与慢性病模块的关联"
test_keyword_exists "$SKILL_FILE" "与心理健康模块的关联" "与心理模块的关联"
test_keyword_exists "$SKILL_FILE" "与营养模块的关联" "与营养模块的关联"
test_keyword_exists "$SKILL_FILE" "与运动模块的关联" "与运动模块的关联"

# 测试生活方式改善建议
test_keyword_exists "$SKILL_FILE" "戒烟" "戒烟建议"
test_keyword_exists "$SKILL_FILE" "运动" "运动建议"
test_keyword_exists "$SKILL_FILE" "健康饮食" "健康饮食建议"
test_keyword_exists "$SKILL_FILE" "压力管理" "压力管理建议"
test_keyword_exists "$SKILL_FILE" "盆底肌训练" "盆底肌训练建议"

echo ""
echo "==================================="
echo "6. 数据验证测试"
echo "==================================="
echo ""

# 测试JSON文件格式
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

# 测试IIEF-5历史记录
echo -n "测试 $(($total_tests + 1)): 检查IIEF-5历史记录... "
total_tests=$((total_tests + 1))

if grep -q "\"iief5_history\"" "$DATA_FILE" && grep -q "\"iief5_20250106\"" "$DATA_FILE"; then
    echo -e "${GREEN}✓ 通过${NC}"
    passed_tests=$((passed_tests + 1))
else
    echo -e "${RED}✗ 失败${NC}"
    echo "  IIEF-5历史记录不存在或格式不正确"
    failed_tests=$((failed_tests + 1))
fi

# 测试性活动日志记录
echo -n "测试 $(($total_tests + 1)): 检查性活动日志... "
total_tests=$((total_tests + 1))

if grep -q "\"sexual_activity_log\"" "$DATA_FILE" && grep -q "\"activity_20250105_001\"" "$DATA_FILE"; then
    echo -e "${GREEN}✓ 通过${NC}"
    passed_tests=$((passed_tests + 1))
else
    echo -e "${RED}✗ 失败${NC}"
    echo "  性活动日志不存在或格式不正确"
    failed_tests=$((failed_tests + 1))
fi

# 测试用药记录
echo -n "测试 $(($total_tests + 1)): 检查用药记录... "
total_tests=$((total_tests + 1))

if grep -q "\"medications\"" "$DATA_FILE" && grep -q "\"med_20240601\"" "$DATA_FILE"; then
    echo -e "${GREEN}✓ 通过${NC}"
    passed_tests=$((passed_tests + 1))
else
    echo -e "${RED}✗ 失败${NC}"
    echo "  用药记录不存在或格式不正确"
    failed_tests=$((failed_tests + 1))
fi

# 测试隐私标记
echo -n "测试 $(($total_tests + 1)): 检查隐私标记... "
total_tests=$((total_tests + 1))

if grep -q "\"privacy_flag\"" "$DATA_FILE"; then
    echo -e "${GREEN}✓ 通过${NC}"
    passed_tests=$((passed_tests + 1))
else
    echo -e "${RED}✗ 失败${NC}"
    echo "  隐私标记不存在"
    failed_tests=$((failed_tests + 1))
fi

echo ""
echo "==================================="
echo "7. 集成功能测试"
echo "==================================="
echo ""

# 测试与其他模块的集成关键词
test_keyword_exists "$COMMAND_FILE" "## 与其他模块的集成" "与其他模块的集成章节"
test_keyword_exists "$COMMAND_FILE" "### 1. 用药管理模块" "用药模块集成"
test_keyword_exists "$COMMAND_FILE" "### 2. 慢性病管理模块" "慢性病模块集成"
test_keyword_exists "$COMMAND_FILE" "### 3. 心理健康模块" "心理模块集成"
test_keyword_exists "$COMMAND_FILE" "### 4. 营养管理模块" "营养模块集成"
test_keyword_exists "$COMMAND_FILE" "### 5. 运动管理模块" "运动模块集成"

# 测试具体的集成场景
test_keyword_exists "$SKILL_FILE" "PDE5抑制剂" "PDE5抑制剂效果追踪"
test_keyword_exists "$SKILL_FILE" "抗抑郁药" "抗抑郁药对性功能的影响"
test_keyword_exists "$SKILL_FILE" "糖尿病与ED" "糖尿病与ED的关联"
test_keyword_exists "$SKILL_FILE" "高血压与性功能" "高血压与性功能的关联"
test_keyword_exists "$SKILL_FILE" "焦虑与性功能" "焦虑对性功能的影响"
test_keyword_exists "$SKILL_FILE" "抑郁与性功能" "抑郁对性功能的影响"

# 测试营养因素
test_keyword_exists "$SKILL_FILE" "锌" "锌对性功能的影响"
test_keyword_exists "$SKILL_FILE" "精氨酸" "精氨酸对性功能的影响"
test_keyword_exists "$SKILL_FILE" "维生素D" "维生素D对性功能的影响"

# 测试运动因素
test_keyword_exists "$SKILL_FILE" "有氧运动" "有氧运动对性功能的改善"
test_keyword_exists "$SKILL_FILE" "力量训练" "力量训练对性功能的影响"
test_keyword_exists "$SKILL_FILE" "盆底肌训练" "盆底肌训练(凯格尔运动)"

echo ""
echo "==================================="
echo "8. 评分标准测试"
echo "==================================="
echo ""

# 测试ED风险评分
test_keyword_exists "$COMMAND_FILE" "ED风险因素" "ED风险因素表"
test_keyword_exists "$COMMAND_FILE" "STD风险因素" "STD风险因素表"
test_json_key "$DATA_FILE" "ed_risk_score" "ED风险评分"
test_json_key "$DATA_FILE" "ed_risk_level" "ED风险等级"
test_json_key "$DATA_FILE" "std_risk_score" "STD风险评分"
test_json_key "$DATA_FILE" "std_risk_level" "STD风险等级"

echo ""
echo "==================================="
echo "9. 预警系统测试"
echo "==================================="
echo ""

# 测试预警系统关键词
test_keyword_exists "$SKILL_FILE" "定期检查提醒" "定期检查提醒"
test_keyword_exists "$SKILL_FILE" "问题预警" "问题预警"
test_keyword_exists "$SKILL_FILE" "趋势预警" "趋势预警"

# 测试提醒数据
test_json_key "$DATA_FILE" "reminders" "提醒设置"
test_json_key "$DATA_FILE" "std_screening" "STD筛查提醒"
test_json_key "$DATA_FILE" "sexual_health_checkup" "性健康检查提醒"
test_json_key "$DATA_FILE" "medication_refill" "用药续方提醒"

echo ""
echo "==================================="
echo "10. 统计分析测试"
echo "==================================="
echo ""

# 测试统计数据
test_json_key "$DATA_FILE" "avg_iief5_score" "平均IIEF-5评分"
test_json_key "$DATA_FILE" "iief5_trend" "IIEF-5趋势"
test_json_key "$DATA_FILE" "sexual_activity_frequency" "性活动频率"
test_json_key "$DATA_FILE" "avg_satisfaction_score" "平均满意度评分"
test_json_key "$DATA_FILE" "overall_sexual_health_score" "整体性健康评分"

echo ""
echo "==================================="
echo "11. 隐私保护测试"
echo "==================================="
echo ""

# 测试隐私保护关键词
test_keyword_exists "$COMMAND_FILE" "数据隐私" "数据隐私章节"
test_keyword_exists "$COMMAND_FILE" "隐私级别" "隐私级别说明"
test_keyword_exists "$COMMAND_FILE" "标准隐私保护" "标准隐私保护级别"
test_json_key "$DATA_FILE" "privacy_level" "隐私级别"

echo ""
echo "==================================="
echo "12. 常见问题测试"
echo "==================================="
echo ""

# 测试常见问题
test_keyword_exists "$COMMAND_FILE" "常见问题" "常见问题章节"
test_keyword_exists "$COMMAND_FILE" "Q:" "问题格式"

echo ""
echo "==================================="
echo "13. 目标管理功能测试"
echo "==================================="
echo ""

# 测试目标管理相关键
test_json_key "$DATA_FILE" "improve_iief5_score" "改善IIEF-5评分目标"
test_json_key "$DATA_FILE" "target" "目标值"
test_json_key "$DATA_FILE" "deadline" "截止日期"
test_json_key "$DATA_FILE" "status" "目标状态"
test_json_key "$DATA_FILE" "action_plan" "行动计划"

echo ""
echo "==================================="
echo "14. 数据质量测试"
echo "==================================="
echo ""

# 测试元数据
test_json_key "$DATA_FILE" "created_at" "创建日期"
test_json_key "$DATA_FILE" "last_updated" "最后更新日期"
test_json_key "$DATA_FILE" "version" "版本号"
test_json_key "$DATA_FILE" "data_quality" "数据质量"

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
    echo -e "${GREEN}所有测试通过!性健康功能实现完整。${NC}"
    exit 0
else
    pass_rate=$((passed_tests * 100 / total_tests))
    echo -e "通过率: ${pass_rate}%"

    if [ $pass_rate -ge 80 ]; then
        echo -e "${YELLOW}大部分测试通过,但有一些问题需要修复。${NC}"
        exit 1
    else
        echo -e "${RED}多个测试失败,需要全面检查实现。${NC}"
        exit 1
    fi
fi

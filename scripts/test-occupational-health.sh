#!/bin/bash

# 职业健康功能测试脚本
# 测试职业健康模块的文件完整性、数据结构和关键功能

set -e  # 遇到错误立即退出

echo "==================================="
echo "职业健康功能测试脚本"
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
test_file_exists ".claude/commands/occupational-health.md" "命令定义文件"

# 测试数据文件
test_file_exists "data-example/occupational-health-tracker.json" "数据文件"

# 测试技能文件
test_file_exists ".claude/skills/occupational-health-analyzer/SKILL.md" "技能文件"

echo ""
echo "==================================="
echo "2. JSON数据结构完整性测试"
echo "==================================="
echo ""

DATA_FILE="data-example/occupational-health-tracker.json"

# 测试主要数据键
test_json_key "$DATA_FILE" "occupational_health_management" "职业健康管理主键"
test_json_key "$DATA_FILE" "user_profile" "用户档案"
test_json_key "$DATA_FILE" "work_pattern" "工作模式"
test_json_key "$DATA_FILE" "risk_assessment" "风险评估"
test_json_key "$DATA_FILE" "work_related_issues" "工作相关问题"
test_json_key "$DATA_FILE" "ergonomic_assessment" "人机工程评估"
test_json_key "$DATA_FILE" "occupational_screening" "职业病筛查"
test_json_key "$DATA_FILE" "work_environment" "工作环境"
test_json_key "$DATA_FILE" "interventions" "干预措施"
test_json_key "$DATA_FILE" "goals" "目标管理"
test_json_key "$DATA_FILE" "statistics" "统计信息"
test_json_key "$DATA_FILE" "metadata" "元数据"

# 测试风险评估详细键
test_json_key "$DATA_FILE" "sedentary_risk" "久坐风险"
test_json_key "$DATA_FILE" "vdt_risk" "视屏终端风险"
test_json_key "$DATA_FILE" "shift_work_risk" "倒班工作风险"
test_json_key "$DATA_FILE" "rsi_risk" "重复性劳损风险"
test_json_key "$DATA_FILE" "stress_risk" "工作压力风险"

# 测试工作相关问题详细键
test_json_key "$DATA_FILE" "neck_pain" "颈痛问题"
test_json_key "$DATA_FILE" "eye_strain" "眼疲劳问题"
test_json_key "$DATA_FILE" "severity" "严重程度"
test_json_key "$DATA_FILE" "frequency" "频率"
test_json_key "$DATA_FILE" "aggravating_factors" "加重因素"
test_json_key "$DATA_FILE" "relieving_factors" "缓解因素"

# 测试人机工程评估详细键
test_json_key "$DATA_FILE" "chair_adjustable" "椅子可调节性"
test_json_key "$DATA_FILE" "monitor_height" "显示器高度"
test_json_key "$DATA_FILE" "monitor_distance" "显示器距离"
test_json_key "$DATA_FILE" "lighting_quality" "照明质量"
test_json_key "$DATA_FILE" "overall_ergonomic_score" "人机工程总分"

# 测试职业病筛查详细键
test_json_key "$DATA_FILE" "hearing_test" "听力测试"
test_json_key "$DATA_FILE" "vision_test" "视力测试"
test_json_key "$DATA_FILE" "lung_function" "肺功能检查"
test_json_key "$DATA_FILE" "msk_assessment" "肌肉骨骼评估"

echo ""
echo "==================================="
echo "3. 命令功能关键词测试"
echo "==================================="
echo ""

COMMAND_FILE=".claude/commands/occupational-health.md"

# 测试操作类型关键词
test_keyword_exists "$COMMAND_FILE" "assess" "职业健康评估功能"
test_keyword_exists "$COMMAND_FILE" "issue" "工作相关问题记录功能"
test_keyword_exists "$COMMAND_FILE" "ergonomic" "人机工程学评估功能"
test_keyword_exists "$COMMAND_FILE" "screening" "职业病筛查功能"
test_keyword_exists "$COMMAND_FILE" "environment" "工作环境评估功能"
test_keyword_exists "$COMMAND_FILE" "status" "状态查看功能"
test_keyword_exists "$COMMAND_FILE" "trend" "趋势分析功能"
test_keyword_exists "$COMMAND_FILE" "recommend" "改进建议功能"

# 测试问题类型关键词
test_keyword_exists "$COMMAND_FILE" "neck_pain" "颈痛"
test_keyword_exists "$COMMAND_FILE" "shoulder_pain" "肩痛"
test_keyword_exists "$COMMAND_FILE" "back_pain" "背痛"
test_keyword_exists "$COMMAND_FILE" "wrist_pain" "腕痛"
test_keyword_exists "$COMMAND_FILE" "carpal_tunnel" "腕管综合征"
test_keyword_exists "$COMMAND_FILE" "eye_strain" "眼疲劳"
test_keyword_exists "$COMMAND_FILE" "headache" "紧张性头痛"
test_keyword_exists "$COMMAND_FILE" "fatigue" "疲劳"
test_keyword_exists "$COMMAND_FILE" "stress" "工作压力"
test_keyword_exists "$COMMAND_FILE" "sleep_disturbance" "睡眠障碍"

# 测试工作类型关键词
test_keyword_exists "$COMMAND_FILE" "office_work" "办公室工作"
test_keyword_exists "$COMMAND_FILE" "manual_labor" "体力劳动"
test_keyword_exists "$COMMAND_FILE" "shift_work" "倒班工作"
test_keyword_exists "$COMMAND_FILE" "noisy_environment" "噪音环境工作"
test_keyword_exists "$COMMAND_FILE" "dust_chemical_environment" "粉尘化学环境工作"

echo ""
echo "==================================="
echo "4. 医学安全声明测试"
echo "==================================="
echo ""

# 测试医学免责声明
test_keyword_exists "$COMMAND_FILE" "医学免责声明" "医学免责声明标题"
test_keyword_exists "$COMMAND_FILE" "职业病诊断" "职业病诊断免责声明"
test_keyword_exists "$COMMAND_FILE" "职业医学专科医生" "专业医生建议"
test_keyword_exists "$COMMAND_FILE" "立即就医" "紧急情况就医提示"

# 测试紧急情况指南
test_keyword_exists "$COMMAND_FILE" "紧急情况指南" "紧急情况指南"
test_keyword_exists "$COMMAND_FILE" "严重呼吸困难" "呼吸困难紧急情况"
test_keyword_exists "$COMMAND_FILE" "胸痛或心悸" "胸痛紧急情况"
test_keyword_exists "$COMMAND_FILE" "突然视力丧失" "视力丧失紧急情况"
test_keyword_exists "$COMMAND_FILE" "持续加重的疼痛" "疼痛加重情况"

echo ""
echo "==================================="
echo "5. 风险评估标准测试"
echo "==================================="
echo ""

# 测试风险评估标准
test_keyword_exists "$COMMAND_FILE" "久坐风险" "久坐风险评估标准"
test_keyword_exists "$COMMAND_FILE" "视屏终端风险" "视屏终端风险评估标准"
test_keyword_exists "$COMMAND_FILE" "倒班工作风险" "倒班工作风险评估标准"
test_keyword_exists "$COMMAND_FILE" "高风险" "高风险等级"
test_keyword_exists "$COMMAND_FILE" "中风险" "中风险等级"
test_keyword_exists "$COMMAND_FILE" "低风险" "低风险等级"

echo ""
echo "==================================="
echo "6. 20-20-20法则测试"
echo "==================================="
echo ""

# 测试20-20-20法则
test_keyword_exists "$COMMAND_FILE" "20-20-20" "20-20-20法则"
test_keyword_exists "$COMMAND_FILE" "20分钟" "20分钟间隔"
test_keyword_exists "$COMMAND_FILE" "20英尺" "20英尺距离"
test_keyword_exists "$COMMAND_FILE" "20秒" "20秒持续时间"

echo ""
echo "==================================="
echo "7. 人机工程设置指南测试"
echo "==================================="
echo ""

# 测试人机工程设置
test_keyword_exists "$COMMAND_FILE" "人机工程设置指南" "人机工程设置指南"
test_keyword_exists "$COMMAND_FILE" "显示器设置" "显示器设置"
test_keyword_exists "$COMMAND_FILE" "椅子设置" "椅子设置"
test_keyword_exists "$COMMAND_FILE" "键盘和鼠标" "键盘和鼠标设置"
test_keyword_exists "$COMMAND_FILE" "工作台" "工作台设置"

echo ""
echo "==================================="
echo "8. 技能模块功能测试"
echo "==================================="
echo ""

SKILL_FILE=".claude/skills/occupational-health-analyzer/SKILL.md"

# 测试分析功能关键词
test_keyword_exists "$SKILL_FILE" "风险评估" "风险评估功能"
test_keyword_exists "$SKILL_FILE" "趋势分析" "趋势分析功能"
test_keyword_exists "$SKILL_FILE" "关联分析" "关联分析功能"
test_keyword_exists "$SKILL_FILE" "预警系统" "预警系统功能"
test_keyword_exists "$SKILL_FILE" "职业病筛查" "职业病筛查功能"

# 测试风险类型
test_keyword_exists "$SKILL_FILE" "久坐风险" "久坐风险评估"
test_keyword_exists "$SKILL_FILE" "视屏终端风险" "视屏终端风险评估"
test_keyword_exists "$SKILL_FILE" "倒班工作" "倒班工作风险评估"
test_keyword_exists "$SKILL_FILE" "重复性劳损" "重复性劳损风险评估"
test_keyword_exists "$SKILL_FILE" "工作压力" "工作压力风险评估"

# 测试关联分析模块
test_keyword_exists "$SKILL_FILE" "睡眠-职业健康关联" "与睡眠模块的关联"
test_keyword_exists "$SKILL_FILE" "运动-职业健康关联" "与运动模块的关联"
test_keyword_exists "$SKILL_FILE" "心理健康-职业健康关联" "与心理健康模块的关联"
test_keyword_exists "$SKILL_FILE" "慢性病" "与慢性病模块的关联"

echo ""
echo "==================================="
echo "9. 数据结构验证测试"
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

# 测试工作相关问题记录
echo -n "测试 $(($total_tests + 1)): 检查工作相关问题记录... "
total_tests=$((total_tests + 1))

if grep -q "\"work_related_issues\"" "$DATA_FILE" && grep -q '"id": "issue_' "$DATA_FILE"; then
    echo -e "${GREEN}✓ 通过${NC}"
    passed_tests=$((passed_tests + 1))
else
    echo -e "${RED}✗ 失败${NC}"
    echo "  工作相关问题记录不存在或格式不正确"
    failed_tests=$((failed_tests + 1))
fi

# 测试人机工程评估记录
echo -n "测试 $(($total_tests + 1)): 检查人机工程评估记录... "
total_tests=$((total_tests + 1))

if grep -q "\"ergonomic_assessment\"" "$DATA_FILE"; then
    echo -e "${GREEN}✓ 通过${NC}"
    passed_tests=$((passed_tests + 1))
else
    echo -e "${RED}✗ 失败${NC}"
    echo "  人机工程评估记录不存在"
    failed_tests=$((failed_tests + 1))
fi

# 测试职业病筛查记录
echo -n "测试 $(($total_tests + 1)): 检查职业病筛查记录... "
total_tests=$((total_tests + 1))

if grep -q "\"occupational_screening\"" "$DATA_FILE"; then
    echo -e "${GREEN}✓ 通过${NC}"
    passed_tests=$((passed_tests + 1))
else
    echo -e "${RED}✗ 失败${NC}"
    echo "  职业病筛查记录不存在"
    failed_tests=$((failed_tests + 1))
fi

echo ""
echo "==================================="
echo "10. 集成功能测试"
echo "==================================="
echo ""

# 测试与其他模块的集成关键词
test_keyword_exists "$COMMAND_FILE" "睡眠模块" "与睡眠模块的集成说明"
test_keyword_exists "$COMMAND_FILE" "运动模块" "与运动模块的集成说明"
test_keyword_exists "$COMMAND_FILE" "心理健康模块" "与心理健康模块的集成说明"
test_keyword_exists "$COMMAND_FILE" "慢性病模块" "与慢性病模块的集成说明"

# 测试具体的集成场景
test_keyword_exists "$SKILL_FILE" "倒班工作" "倒班工作影响分析"
test_keyword_exists "$SKILL_FILE" "久坐工作" "久坐工作影响分析"
test_keyword_exists "$SKILL_FILE" "工作压力" "工作压力关联分析"

echo ""
echo "==================================="
echo "11. 预防和建议功能测试"
echo "==================================="
echo ""

# 测试预防建议关键词
test_keyword_exists "$COMMAND_FILE" "预防肌肉骨骼问题" "肌肉骨骼问题预防建议"
test_keyword_exists "$COMMAND_FILE" "保护眼睛健康" "眼睛健康保护建议"
test_keyword_exists "$COMMAND_FILE" "管理工作压力" "工作压力管理建议"
test_keyword_exists "$COMMAND_FILE" "改善睡眠质量" "睡眠质量改善建议"
test_keyword_exists "$COMMAND_FILE" "预防职业病" "职业病预防建议"

# 测试健康建议
test_keyword_exists "$COMMAND_FILE" "正确的工作姿势" "工作姿势建议"
test_keyword_exists "$COMMAND_FILE" "定期休息" "休息建议"
test_keyword_exists "$COMMAND_FILE" "人机工程设备" "人机工程设备建议"

echo ""
echo "==================================="
echo "12. 评分标准和统计测试"
echo "==================================="
echo ""

# 测试评分标准
test_keyword_exists "$COMMAND_FILE" "职业健康评分" "职业健康评分标准"
test_keyword_exists "$COMMAND_FILE" "人机工程评分" "人机工程评分标准"
test_keyword_exists "$COMMAND_FILE" "风险等级" "风险等级标准"

# 测试统计数据
test_json_key "$DATA_FILE" "occupational_health_score" "职业健康评分"
test_json_key "$DATA_FILE" "total_issues" "总问题数"
test_json_key "$DATA_FILE" "active_issues" "活跃问题数"
test_json_key "$DATA_FILE" "improving_issues" "改善中的问题数"
test_json_key "$DATA_FILE" "worsening_issues" "恶化中的问题数"
test_json_key "$DATA_FILE" "high_risk_factors" "高风险因素数量"

echo ""
echo "==================================="
echo "13. 目标管理功能测试"
echo "==================================="
echo ""

# 测试目标管理相关键
test_json_key "$DATA_FILE" "reduce_neck_pain" "减轻颈痛目标"
test_json_key "$DATA_FILE" "increase_movement" "增加运动目标"
test_json_key "$DATA_FILE" "improve_eye_health" "改善眼健康目标"
test_json_key "$DATA_FILE" "progress_percentage" "进度百分比"
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
    echo -e "${GREEN}所有测试通过！职业健康功能实现完整。${NC}"
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

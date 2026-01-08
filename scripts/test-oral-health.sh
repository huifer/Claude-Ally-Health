#!/bin/bash

# 口腔健康功能测试脚本
# 测试口腔健康模块的文件完整性、数据结构和关键功能

set -e  # 遇到错误立即退出

echo "==================================="
echo "口腔健康功能测试脚本"
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
test_file_exists ".claude/commands/oral-health.md" "命令定义文件"

# 测试数据文件
test_file_exists "data-example/oral-health-tracker.json" "数据文件"

# 测试技能文件
test_file_exists ".claude/skills/oral-health-analyzer/SKILL.md" "技能文件"

echo ""
echo "==================================="
echo "2. JSON数据结构完整性测试"
echo "==================================="
echo ""

DATA_FILE="data-example/oral-health-tracker.json"

# 测试主要数据键
test_json_key "$DATA_FILE" "oral_health_tracking" "口腔健康追踪主键"
test_json_key "$DATA_FILE" "user_profile" "用户档案"
test_json_key "$DATA_FILE" "oral_examination" "口腔检查"
test_json_key "$DATA_FILE" "treatment_history" "治疗历史"
test_json_key "$DATA_FILE" "hygiene_habits" "卫生习惯"
test_json_key "$DATA_FILE" "oral_problems" "口腔问题"
test_json_key "$DATA_FILE" "screenings" "筛查记录"
test_json_key "$DATA_FILE" "goals" "目标管理"
test_json_key "$DATA_FILE" "statistics" "统计信息"
test_json_key "$DATA_FILE" "metadata" "元数据"

# 测试口腔检查详细键
test_json_key "$DATA_FILE" "teeth_status" "牙齿状态"
test_json_key "$DATA_FILE" "periodontal_status" "牙周状况"
test_json_key "$DATA_FILE" "missing" "缺失牙齿"
test_json_key "$DATA_FILE" "filled" "充填牙齿"
test_json_key "$DATA_FILE" "caries" "龋齿"
test_json_key "$DATA_FILE" "crown" "牙冠"
test_json_key "$DATA_FILE" "implant" "种植牙"

# 测试牙周状况详细键
test_json_key "$DATA_FILE" "bleeding_on_probing" "探诊出血"
test_json_key "$DATA_FILE" "probing_depth" "探诊深度"
test_json_key "$DATA_FILE" "plaque_index" "菌斑指数"
test_json_key "$DATA_FILE" "gingival_recession" "牙龈退缩"

echo ""
echo "==================================="
echo "3. 命令功能关键词测试"
echo "==================================="
echo ""

COMMAND_FILE=".claude/commands/oral-health.md"

# 测试操作类型关键词
test_keyword_exists "$COMMAND_FILE" "checkup" "检查记录功能"
test_keyword_exists "$COMMAND_FILE" "treatment" "治疗记录功能"
test_keyword_exists "$COMMAND_FILE" "hygiene" "卫生习惯功能"
test_keyword_exists "$COMMAND_FILE" "issue" "口腔问题功能"
test_keyword_exists "$COMMAND_FILE" "status" "状态查看功能"
test_keyword_exists "$COMMAND_FILE" "trend" "趋势分析功能"
test_keyword_exists "$COMMAND_FILE" "reminder" "检查提醒功能"
test_keyword_exists "$COMMAND_FILE" "screening" "疾病筛查功能"

# 测试治疗类型关键词
test_keyword_exists "$COMMAND_FILE" "filling" "补牙治疗"
test_keyword_exists "$COMMAND_FILE" "root_canal" "根管治疗"
test_keyword_exists "$COMMAND_FILE" "extraction" "拔牙治疗"
test_keyword_exists "$COMMAND_FILE" "implant" "种植牙"
test_keyword_exists "$COMMAND_FILE" "crown" "牙冠"
test_keyword_exists "$COMMAND_FILE" "scaling" "洁牙"

# 测试问题类型关键词
test_keyword_exists "$COMMAND_FILE" "toothache" "牙痛"
test_keyword_exists "$COMMAND_FILE" "bleeding" "出血"
test_keyword_exists "$COMMAND_FILE" "ulcer" "溃疡"
test_keyword_exists "$COMMAND_FILE" "sensitivity" "敏感"

echo ""
echo "==================================="
echo "4. 医学安全声明测试"
echo "==================================="
echo ""

# 测试医学免责声明
test_keyword_exists "$COMMAND_FILE" "医学免责声明" "医学免责声明标题"
test_keyword_exists "$COMMAND_FILE" "不提供医学诊断" "诊断免责声明"
test_keyword_exists "$COMMAND_FILE" "咨询专业牙科医生" "专业医生建议"
test_keyword_exists "$COMMAND_FILE" "立即就医" "紧急情况就医提示"

# 测试紧急情况指南
test_keyword_exists "$COMMAND_FILE" "紧急情况" "紧急情况指南"
test_keyword_exists "$COMMAND_FILE" "剧烈牙痛" "牙痛紧急情况"
test_keyword_exists "$COMMAND_FILE" "外伤" "外伤紧急情况"
test_keyword_exists "$COMMAND_FILE" "面部肿胀" "肿胀紧急情况"

echo ""
echo "==================================="
echo "5. 牙位标记系统测试"
echo "==================================="
echo ""

# 测试FDI牙位标记法
test_keyword_exists "$COMMAND_FILE" "FDI" "FDI牙位标记法"
test_keyword_exists "$COMMAND_FILE" "牙位标记" "牙位标记说明"
test_keyword_exists "$COMMAND_FILE" "恒牙" "恒牙编号说明"
test_keyword_exists "$COMMAND_FILE" "乳牙" "乳牙编号说明"

echo ""
echo "==================================="
echo "6. 技能模块功能测试"
echo "==================================="
echo ""

SKILL_FILE=".claude/skills/oral-health-analyzer/SKILL.md"

# 测试分析功能关键词
test_keyword_exists "$SKILL_FILE" "趋势分析" "趋势分析功能"
test_keyword_exists "$SKILL_FILE" "风险评估" "风险评估功能"
test_keyword_exists "$SKILL_FILE" "关联分析" "关联分析功能"
test_keyword_exists "$SKILL_FILE" "个性化建议" "个性化建议功能"
test_keyword_exists "$SKILL_FILE" "目标管理" "目标管理功能"

# 测试风险评估类型
test_keyword_exists "$SKILL_FILE" "龋齿风险" "龋齿风险评估"
test_keyword_exists "$SKILL_FILE" "牙周病" "牙周病风险评估"
test_keyword_exists "$SKILL_FILE" "口腔癌" "口腔癌风险评估"

# 测试关联分析模块
test_keyword_exists "$SKILL_FILE" "营养模块" "与营养模块的关联"
test_keyword_exists "$SKILL_FILE" "慢性病模块" "与慢性病模块的关联"
test_keyword_exists "$SKILL_FILE" "用药模块" "与用药模块的关联"
test_keyword_exists "$SKILL_FILE" "眼健康模块" "与眼健康模块的关联"

echo ""
echo "==================================="
echo "7. 数据结构验证测试"
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

# 测试治疗历史记录
echo -n "测试 $(($total_tests + 1)): 检查治疗历史记录... "
total_tests=$((total_tests + 1))

if grep -q "\"treatment_history\"" "$DATA_FILE" && grep -q "\[{" "$DATA_FILE"; then
    echo -e "${GREEN}✓ 通过${NC}"
    passed_tests=$((passed_tests + 1))
else
    echo -e "${RED}✗ 失败${NC}"
    echo "  治疗历史记录不存在或格式不正确"
    failed_tests=$((failed_tests + 1))
fi

echo ""
echo "==================================="
echo "8. 集成功能测试"
echo "==================================="
echo ""

# 测试与其他模块的集成关键词
test_keyword_exists "$COMMAND_FILE" "营养模块" "与营养模块的集成说明"
test_keyword_exists "$COMMAND_FILE" "慢性病模块" "与慢性病模块的集成说明"
test_keyword_exists "$COMMAND_FILE" "用药模块" "与用药模块的集成说明"
test_keyword_exists "$COMMAND_FILE" "眼健康模块" "与眼健康模块的集成说明"

# 测试具体的集成场景
test_keyword_exists "$SKILL_FILE" "糖尿病" "糖尿病与牙周病的关联分析"
test_keyword_exists "$SKILL_FILE" "心血管疾病" "心血管疾病与牙周病的关联"
test_keyword_exists "$SKILL_FILE" "妊娠期" "妊娠期口腔健康管理"
test_keyword_exists "$SKILL_FILE" "干燥综合征" "干燥综合征的多系统影响"

echo ""
echo "==================================="
echo "9. 预防和建议功能测试"
echo "==================================="
echo ""

# 测试预防建议关键词
test_keyword_exists "$COMMAND_FILE" "预防龋齿" "龋齿预防建议"
test_keyword_exists "$COMMAND_FILE" "预防牙周病" "牙周病预防建议"
test_keyword_exists "$COMMAND_FILE" "预防口腔癌" "口腔癌预防建议"
test_keyword_exists "$COMMAND_FILE" "改善口腔卫生" "卫生习惯改善建议"

# 测试健康建议
test_keyword_exists "$COMMAND_FILE" "刷牙" "刷牙建议"
test_keyword_exists "$COMMAND_FILE" "牙线" "牙线使用建议"
test_keyword_exists "$COMMAND_FILE" "定期检查" "定期检查建议"

echo ""
echo "==================================="
echo "10. 评分标准和统计测试"
echo "==================================="
echo ""

# 测试评分标准
test_keyword_exists "$COMMAND_FILE" "卫生习惯评分" "卫生习惯评分标准"
test_keyword_exists "$COMMAND_FILE" "龋齿风险等级" "龋齿风险等级标准"
test_keyword_exists "$COMMAND_FILE" "牙周健康分级" "牙周健康分级标准"

# 测试统计数据
test_json_key "$DATA_FILE" "hygiene_score" "卫生习惯评分"
test_json_key "$DATA_FILE" "oral_health_age" "口腔健康年龄"
test_json_key "$DATA_FILE" "total_treatments" "总治疗次数"
test_json_key "$DATA_FILE" "total_problems" "总问题数"

echo ""
echo "==================================="
echo "11. 目标管理功能测试"
echo "==================================="
echo ""

# 测试目标管理相关键
test_json_key "$DATA_FILE" "improve_flossing_frequency" "改善牙线使用频率目标"
test_json_key "$DATA_FILE" "target" "目标值"
test_json_key "$DATA_FILE" "current" "当前值"
test_json_key "$DATA_FILE" "deadline" "截止日期"
test_json_key "$DATA_FILE" "status" "目标状态"
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
    echo -e "${GREEN}所有测试通过！口腔健康功能实现完整。${NC}"
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

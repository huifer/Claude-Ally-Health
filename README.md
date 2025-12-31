# 个人医疗数据中心 (Personal Health Information System)

基于文件系统的个人医疗健康数据管理系统，使用 Claude Code 命令行工具进行数据管理。

## 系统特点

- 📁 纯文件系统存储，无需数据库
- 🖼️ 支持医疗检查单图片智能识别
- 📊 自动提取生化检查指标和参考范围
- 🔍 支持影像检查结构化数据提取
- 👨‍⚕️ 多学科专家会诊系统（MDT）
- 🔬 9大专科智能分析
- ☢️ 医学辐射剂量追踪和管理
- 👤 用户基础档案管理
- 💾 本地存储，数据完全私有
- 🚀 使用 Claude Code 命令操作，无需编程

## 目录结构

```
my-his/
├── .claude/
│   ├── commands/
│   │   ├── save-report.md    # 保存检查单命令
│   │   ├── query.md          # 查询记录命令
│   │   ├── profile.md        # 用户基础参数设置命令
│   │   ├── radiation.md      # 辐射暴露管理命令
│   │   ├── consult.md        # 多学科专家会诊命令
│   │   └── specialist.md     # 单专科咨询命令
│   └── specialists/
│       ├── cardiology.md            # 心内科专家 Skill
│       ├── endocrinology.md         # 内分泌科专家 Skill
│       ├── gastroenterology.md      # 消化科专家 Skill
│       ├── nephrology.md            # 肾内科专家 Skill
│       ├── hematology.md            # 血液科专家 Skill
│       ├── respiratory.md           # 呼吸科专家 Skill
│       ├── neurology.md             # 神经内科专家 Skill
│       ├── oncology.md              # 肿瘤科专家 Skill
│       ├── general.md               # 全科专家 Skill
│       └── consultation-coordinator.md # 会诊协调器
├── data/
│   ├── profile.json          # 用户基础档案
│   ├── radiation-records.json # 辐射暴露记录
│   ├── 生化检查/             # 生化检验数据
│   │   └── YYYY-MM/
│   │       └── YYYY-MM-DD_检查项目.json
│   ├── 影像检查/             # 影像检查数据
│   │   └── YYYY-MM/
│   │       ├── YYYY-MM-DD_检查项目_部位.json
│   │       └── images/       # 原始图片备份
│   └── index.json            # 全局索引文件
└── README.md
```

## 使用方法

### 0. 设置用户基础参数（首次使用必须）

使用 `/profile` 命令设置基础参数：

```bash
# 设置完整参数
/profile set 175 70 1990-01-01

# 或使用参数名
/profile set height=175 weight=70 birth_date=1990-01-01

# 查看当前参数
/profile view
```

**需要设置的信息：**
- 身高（厘米）- 用于计算体表面积和BMI
- 体重（公斤）- 用于计算体表面积和BMI
- 出生日期（YYYY-MM-DD）- 用于计算年龄

**系统会自动计算：**
- BMI（身体质量指数）
- 体表面积（用于辐射剂量计算）
- 年龄

### 1. 保存检查单

使用 `/save-report` 命令保存医疗检查单：

```bash
/save-report /path/to/report-image.jpg
```

**支持的检查单类型：**
- ✅ 生化检查：血常规、尿常规、生化全项等
- ✅ 影像检查：B超、CT、MRI、X光等

**系统会自动：**
- 识别检查单类型
- 提取检查日期
- 提取各项指标数据
- 识别参考区间和异常标记
- 结构化保存为 JSON 格式
- 备份原始图片

### 2. 管理医学辐射暴露

使用 `/radiation` 命令记录和追踪医学影像检查的辐射暴露：

```bash
# 添加辐射检查记录
/radiation add CT 胸部
/radiation add CT 腹部 2025-12-30
/radiation add X光 胸部
/radiation add PET-CT 全身

# 查看当前累积状态
/radiation status

# 查看历史记录
/radiation history

# 清空所有记录
/radiation clear
```

**辐射管理系统功能：**
- 根据检查类型和部位自动计算辐射剂量
- 根据用户体表面积调整剂量
- 追踪年度累积辐射剂量
- 计算往年辐射残留（按50%/年衰减）
- 安全评估和风险提示
- 历史记录和统计分析

**支持的检查类型：**
- CT检查（头部、胸部、腹部、盆腔、脊柱、四肢）
- X光检查（胸部、腹部、四肢、牙齿）
- PET-CT、骨扫描、血管造影等

### 3. 查询医疗记录

使用 `/query` 命令查询记录：

```bash
# 查询所有记录
/query all

# 查询生化检查
/query biochemical

# 查询影像检查
/query imaging

# 查询最近N条记录
/query recent 5

# 按日期查询
/query date 2025-12
/query date 2025-12-31

# 查询异常指标
/query abnormal
```

### 4. 多学科专家会诊（MDT）

使用 `/consult` 命令启动多学科专家会诊：

```bash
# 分析所有数据进行会诊
/consult all

# 分析最近N条记录
/consult recent 5

# 分析指定日期的数据
/consult date 2025-12-31

# 分析指定日期范围
/consult date 2025-12-01 to 2025-12-31

# 自动分析（默认最近3条）
/consult
```

**会诊系统会：**
- 自动识别涉及的专科（心内科、内分泌科、消化科、肾内科等）
- 并行启动多个专科专家 subagent 进行独立分析
- 整合各专科意见，生成综合会诊报告
- 提供优先级排序和综合管理建议

**支持9大专科：**
- 心内科 - 心脏病、高血压、血脂异常
- 内分泌科 - 糖尿病、甲状腺疾病
- 消化科 - 肝病、胃肠疾病
- 肾内科 - 肾脏病、电解质紊乱
- 血液科 - 贫血、凝血异常
- 呼吸科 - 肺部感染、肺结节
- 神经内科 - 脑血管病、头痛头晕
- 肿瘤科 - 肿瘤标志物、肿瘤筛查
- 全科 - 综合评估、慢病管理

### 5. 单专科咨询

使用 `/specialist` 命令咨询特定专科：

```bash
# 查看支持的专科列表
/specialist list

# 咨询心内科
/specialist cardio recent 3

# 咨询内分泌科
/specialist endo all

# 咨询肿瘤科
/specialist onco date 2025-12-31
```

## 数据格式

### 生化检查数据结构

```json
{
  "id": "20251231123456789",
  "type": "生化检查",
  "date": "2025-12-31",
  "hospital": "XX医院",
  "items": [
    {
      "name": "白细胞计数",
      "value": "6.5",
      "unit": "×10^9/L",
      "min_ref": "3.5",
      "max_ref": "9.5",
      "is_abnormal": false
    }
  ]
}
```

### 影像检查数据结构

```json
{
  "id": "20251231123456789",
  "type": "影像检查",
  "subtype": "B超",
  "date": "2025-12-31",
  "hospital": "XX医院",
  "body_part": "腹部",
  "findings": {
    "description": "检查所见描述",
    "measurements": {
      "尺寸": "具体数值"
    },
    "conclusion": "检查结论"
  },
  "original_image": "images/original.jpg"
}
```

### 辐射记录数据结构

```json
{
  "id": "20251231123456789",
  "exam_type": "CT",
  "body_part": "胸部",
  "exam_date": "2025-12-31",
  "standard_dose": 7.0,
  "body_surface_area": 1.85,
  "adjustment_factor": 1.07,
  "actual_dose": 7.5,
  "dose_unit": "mSv"
}
```

### 用户档案数据结构

```json
{
  "basic_info": {
    "height": 175,
    "height_unit": "cm",
    "weight": 70,
    "weight_unit": "kg",
    "birth_date": "1990-01-01"
  },
  "calculated": {
    "age": 35,
    "bmi": 22.9,
    "bmi_status": "正常",
    "body_surface_area": 1.85,
    "bsa_unit": "m²"
  }
}
```

## 数据隐私

- 所有数据存储在本地文件系统
- 不上传到任何云端服务
- 不依赖外部数据库
- 完全私有化管理

## 技术实现

- **存储方式**: JSON 文件 + 文件系统目录结构
- **命令系统**: Claude Code Slash Commands
- **专家系统**: 多专科 Skill 定义 + Subagent 架构
- **会诊协调**: 并行处理 + 意见整合算法
- **图片识别**: AI 视觉分析
- **数据提取**: 智能文字识别与结构化
- **辐射计算**: 体表面积调整 + 指数衰减模型
- **剂量参考**: 基于医学标准的辐射剂量数据库

## 快速开始

1. 确保已安装 Claude Code
2. 在当前目录打开 Claude Code
3. 首次使用先设置基础参数：`/profile set 175 70 1990-01-01`
4. 使用 `/save-report /path/to/image.jpg` 保存第一张检查单
5. 使用 `/radiation add CT 胸部` 记录辐射检查
6. 使用 `/query all` 查看所有记录
7. 使用 `/consult` 启动多学科专家会诊

## 注意事项

- 首次使用必须先设置基础参数（身高、体重、出生日期）
- 确保检查单图片清晰可读
- 图片格式支持：JPG、PNG
- 建议定期备份 `data/` 目录
- 日期格式统一使用 YYYY-MM-DD
- 辐射剂量仅供参考，具体请咨询医生
- 建议定期查看 `/radiation status` 了解累积情况

## 专家会诊系统安全原则

本系统严格遵守以下医疗安全原则：

### ⚠️ 安全红线
1. **不给出具体用药剂量**
2. **不直接开具处方药名**
3. **不判断生死预后**
4. **不替代医生诊断**

### ✅ 系统能做到的
- 解读医疗检验指标的临床意义
- 识别异常指标和潜在风险
- 提供健康生活方式建议
- 推荐针对性检查项目
- 协助制定随访计划
- 整合多学科专家意见

### ⚠️ 重要声明
- **本系统所有分析报告仅供参考**
- **不作为医疗诊断依据**
- **所有诊疗决策需咨询专业医生**
- **如有紧急情况，请立即就医**

## 未来扩展

- [x] 添加多学科专家会诊系统
- [x] 支持9大专科智能分析
- [ ] 添加健康趋势分析
- [ ] 支持导出为 PDF 报告
- [ ] 添加指标对比功能
- [ ] 支持多维度统计
- [ ] 添加健康提醒功能

## 许可

本系统仅供个人健康管理使用，不作为医疗诊断依据。

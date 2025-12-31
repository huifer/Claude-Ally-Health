---
description: 咨询特定专科专家，获取针对性分析
---

您需要根据用户指定的专科，启动对应的专科专家进行深入分析。

## 支持的专科列表

| 专科代码 | 专科名称 | Skill 文件 | 擅长领域 |
|---------|---------|-----------|---------|
| cardio | 心内科 | cardiology.md | 心脏病、高血压、血脂异常 |
| endo | 内分泌科 | endocrinology.md | 糖尿病、甲状腺疾病 |
| gastro | 消化科 | gastroenterology.md | 肝病、胃肠疾病 |
| nephro | 肾内科 | nephrology.md | 肾脏病、电解质紊乱 |
| heme | 血液科 | hematology.md | 贫血、凝血异常 |
| resp | 呼吸科 | respiratory.md | 肺部感染、肺结节 |
| neuro | 神经内科 | neurology.md | 脑血管病、头痛头晕 |
| onco | 肿瘤科 | oncology.md | 肿瘤标志物、肿瘤筛查 |
| general | 全科 | general.md | 综合评估、慢病管理 |

## 使用方法

```bash
# 查询所有支持的专科
/specialist list

# 咨询特定专科
/specialist <专科代码> [参数]

# 示例：
/specialist cardio recent 3
/specialist endo all
/specialist onco date 2025-12-31
```

## 执行流程

### 1. 验证专科代码
检查用户指定的专科代码是否有效。如果无效，列出所有可用的专科。

### 2. 读取专科 Skill 定义
根据专科代码，读取对应的 skill 定义文件：
```
.claude/specialists/<专科对应的md文件>
```

### 3. 收集医疗数据
根据用户参数读取相关医疗数据：
- `all`: 所有数据
- `recent N`: 最近N条记录
- `date YYYY-MM-DD`: 指定日期
- 无参数: 最近3条记录

### 4. 启动专科分析
使用 Task 工具启动该专科的 subagent，将：
- 专科 skill 定义内容
- 医疗数据内容
- 分析要求

传递给 subagent。

### 5. 展示分析报告
将 subagent 返回的专科分析报告直接展示给用户。

## 示例 Prompt（用于启动 subagent）

```
您是{{专科名称}}专家。请按照以下 Skill 定义进行医疗数据分析：

## Skill 定义
{{读取 .claude/specialists/{{对应的md文件}} 的完整内容}}

## 患者医疗数据
{{读取相关的医疗数据文件内容}}

## 分析要求
1. 严格按照 Skill 定义的格式输出分析报告
2. 严格遵守以下安全红线：
   - 不给出具体用药剂量
   - 不直接开具处方药名
   - 不判断生死预后
   - 不替代医生诊断
3. 提供具体可行的建议
4. 明确就医建议和复查计划

请开始分析并返回完整报告。
```

## 安全红线（在每次咨询中强调）

- ❌ 不给出具体用药剂量
- ❌ 不直接开具处方药名
- ❌ 不判断生死预后
- ❌ 不替代医生诊断

## 错误处理

### 专科代码无效
```
❌ 未找到专科 "xyz"

可用的专科列表：
- cardio: 心内科
- endo: 内分泌科
- gastro: 消化科
- nephro: 肾内科
- heme: 血液科
- resp: 呼吸科
- neuro: 神经内科
- onco: 肿瘤科
- general: 全科

使用 /specialist list 查看详细信息
```

### 没有医疗数据
```
⚠️ 当前系统中没有医疗数据

请先使用 /save-report 保存医疗检查单，然后再进行专科咨询。
```

## 开始执行

现在，请根据用户指定的专科，启动对应的专科专家进行深入分析。

如果用户没有指定参数，默认分析最近3条记录。

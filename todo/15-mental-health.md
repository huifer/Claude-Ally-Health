# 心理健康功能扩展提案

**模块编号**: 15
**分类**: 通用功能扩展 - 心理健康
**状态**: ✅ 已完成
**优先级**: 中
**创建日期**: 2025-12-31
**完成日期**: 2025-01-08

---

## 功能概述

心理健康模块提供全面的情绪评估、心理治疗记录和危机管理功能，帮助用户关注和维护心理健康。

### 核心功能

1. **心理健康评估** - PHQ-9、GAD-7、PSQI、GDS等标准化量表
2. **情绪日记** - 每日情绪记录和触发因素分析
3. **心理治疗记录** - 咨询记录、治疗进展
4. **危机管理计划** - 预警信号识别、危机干预

---

## 子模块 1: 心理健康评估

### 功能描述

使用标准化心理评估量表，定期评估心理健康状况，识别问题和变化趋势。

### 支持的量表

#### 1. PHQ-9（患者健康问卷-9项）

**用途**: 抑郁筛查和严重程度评估

**评分**:
- 0-4分：无抑郁
- 5-9分：轻度抑郁
- 10-14分：中度抑郁
- 15-19分：中重度抑郁
- 20-27分：重度抑郁

**9个条目**:
1. 做事时提不起劲或没有兴趣
2. 感到心情低落、沮丧或绝望
3. 入睡困难、睡不着或睡眠过多
4. 感觉疲倦或没有活力
5. 食欲不振或吃得太多
6. 觉得自己很糟，或觉得自己很失败，让自己或家人失望
7. 对事物专注有困难，例如阅读报纸或看电视时
8. 动作或说话速度缓慢到别人已经察觉？或相反，烦躁或坐立不安
9. 有不如死掉或用某种方式伤害自己的念头

#### 2. GAD-7（广泛性焦虑量表-7项）

**用途**: 焦虑筛查和严重程度评估

**评分**:
- 0-4分：最小焦虑
- 5-9分：轻度焦虑
- 10-14分：中度焦虑
- 15-21分：重度焦虑

**7个条目**:
1. 感到紧张、焦虑或急切
2. 不能停止或控制担忧
3. 对各种各样的事情担忧过多
4. 很难放松下来
5. 由于不安而无法静坐
6. 变得容易烦恼或急躁
7. 感到似乎有什么可怕的事发生

#### 3. PSQI（匹兹堡睡眠质量指数）

**用途**: 睡眠质量评估

**7个成分**:
1. 主观睡眠质量
2. 入睡时间
3. 睡眠时间
4. 睡眠效率
5. 睡眠障碍
6. 催眠药物使用
7. 日间功能障碍

**评分**: 0-21分，>5分提示睡眠质量差

#### 4. GDS-15（老年抑郁量表）

**用途**: 老年人抑郁筛查

**评分**: 0-15分，>5分提示抑郁

#### 5. EPDS（爱丁堡产后抑郁量表）

**用途**: 产后抑郁筛查

**评分**: 0-30分，>13分提示产后抑郁

### 数据结构

```json
{
  "mental_health_assessments": {
    "phq9": [
      {
        "date": "2025-06-20",
        "score": 8,
        "severity": "mild",
        "responses": [0, 1, 1, 2, 1, 0, 1, 1, 1],
        "item_scores": {
          "interest": 0,
          "depressed": 1,
          "sleep": 1,
          "energy": 2,
          "appetite": 1,
          "self_worth": 0,
          "concentration": 1,
          "psychomotor": 1,
          "suicidal": 1
        },
        "trend": "improving",
        "notes": ""
      }
    ],

    "gad7": [
      {
        "date": "2025-06-20",
        "score": 6,
        "severity": "mild",
        "responses": [1, 1, 1, 0, 0, 1, 2],
        "item_scores": {
          "nervous": 1,
          "control_worry": 1,
          "worry_too_much": 1,
          "relaxation": 0,
          "restlessness": 0,
          "irritability": 1,
          "fear_something_bad": 2
        }
      }
    ],

    "psqi": {
      "date": "2025-06-15",
      "total_score": 5,
      "interpretation": "fair",
      "components": {
        "subjective_quality": 1,
        "sleep_latency": 0,
        "sleep_duration": 1,
        "sleep_efficiency": 0,
        "sleep_disturbances": 2,
        "medication_use": 0,
        "daytime_dysfunction": 1
      }
    },

    "epds": {
      "date": "2025-02-15",
      "score": 8,
      "interpretation": "normal",
      "completed": true
    },

    "assessment_schedule": {
      "phq9_frequency": "monthly",
      "gad7_frequency": "monthly",
      "next_assessment": "2025-07-20"
    }
  }
}
```

### 命令接口

```bash
# 抑郁筛查
/mental assess phq9                      # 进行PHQ-9评估
/mental phq9 history                     # 查看PHQ-9历史趋势

# 焦虑筛查
/mental assess gad7                      # 进行GAD-7评估
/mental gad7 trend                       # 查看GAD-7趋势

# 睡眠评估
/mental assess psqi                      # 进行PSQI评估

# 产后抑郁筛查
/mental assess epds                      # 进行EPDS评估

# 老年抑郁筛查
/mental assess gds                       # 进行GDS评估

# 查看评估结果
/mental assessments                      # 查看所有评估结果
/mental trend                            # 查看心理状况趋势
```

---

## 子模块 2: 情绪日记

### 功能描述

记录每日情绪变化，识别情绪触发因素和应对方式，培养情绪觉察。

### 核心功能

#### 1. 情绪记录
- **日期时间**
- **主要情绪**：快乐、平静、焦虑、悲伤、愤怒、沮丧等
- **情绪强度**：1-10分
- **情绪持续时间**
- **情绪触发因素**：工作、家庭、健康、财务等

#### 2. 伴随症状
- 身体症状（头痛、胸闷、乏力）
- 认知症状（注意力不集中、记忆力下降）
- 行为症状（食欲变化、睡眠障碍）

#### 3. 应对方式
- 积极应对（运动、社交、冥想）
- 消极应对（酗酒、暴饮暴食、退缩）
- 应对效果评估

#### 4. 情绪模式分析
- 常见情绪模式识别
- 触发因素统计
- 情绪周期分析（周、月）
- 情绪与睡眠/运动相关性

### 数据结构

```json
{
  "mood_diary": {
    "entries": [
      {
        "id": "mood_20250620001",
        "date": "2025-06-20",
        "time": "20:00",

        "primary_mood": "anxious",
        "mood_intensity": 7,
        "mood_duration": "4_hours",

        "emotions": [
          {"emotion": "anxious", "intensity": 7},
          {"emotion": "irritable", "intensity": 5},
          {"emotion": "tired", "intensity": 6}
        ],

        "triggers": [
          {"factor": "work_deadline", "impact": "high"},
          {"factor": "lack_of_sleep", "impact": "medium"}
        ],

        "physical_symptoms": [
          "headache",
          "muscle_tension"
        ],

        "cognitive_symptoms": [
          "racing_thoughts",
          "difficulty_concentrating"
        ],

        "coping_strategies": [
          {
            "strategy": "deep_breathing",
            "duration_minutes": 10,
            "effectiveness": "somewhat_helpful"
          },
          {
            "strategy": "walk",
            "duration_minutes": 20,
            "effectiveness": "helpful"
          }
        ],

        "social_context": {
          "alone": false,
          "with_whom": ["colleague"],
          "social_support": "low"
        },

        "notes": "项目明天到期，感觉压力很大",
        "created_at": "2025-06-20T20:00:00.000Z"
      }
    ],

    "patterns": {
      "common_moods": ["anxious", "tired"],
      "common_triggers": ["work", "lack_of_sleep"],
      "effective_coping": ["exercise", "meditation"],
      "time_patterns": {
        "morning": "calm",
        "afternoon": "stressed",
        "evening": "tired"
      }
    }
  }
}
```

### 命令接口

```bash
# 记录情绪
/mental mood anxious 7                   # 记录焦虑（强度7分）
/mental mood happy 9 morning             # 记录早晨快乐情绪
/mental mood sad 5 work_stress           # 记录悲伤并标记触发因素

# 添加触发因素
/mental trigger work_deadline            # 添加工作压力触发因素
/mental trigger lack_of_sleep high       # 添加睡眠不足触发因素

# 记录应对方式
/mental coping deep_breathing 10 helpful # 记录应对方式及效果

# 查看情绪日记
/mental diary                            # 查看情绪日记
/mental pattern                          # 分析情绪模式
/mental triggers                         # 查看常见触发因素
```

---

## 子模块 3: 心理治疗记录

### 功能描述

记录心理治疗过程，追踪治疗进展，评估治疗效果。

### 核心功能

#### 1. 治疗基本信息
- 治疗类型（CBT、心理动力学、人本主义等）
- 治疗频率
- 治疗师信息（匿名化）
- 治疗开始日期

#### 2. 咨询记录
- 咨询日期
- 咨询时长
- 讨论主题
- 情绪状态
- 作业/练习

#### 3. 治疗进展
- 症状改善程度
- 目标达成情况
- 功能水平改善
- 生活质量变化

#### 4. 作业完成
- 作业内容
- 完成情况
- 完成质量
- 遇到的困难

### 数据结构

```json
{
  "therapy_tracking": {
    "in_therapy": true,
    "therapy_type": "CBT",
    "frequency": "weekly",
    "started_date": "2025-01-15",
    "therapist_id": "therapist_001",

    "sessions": [
      {
        "session_id": "session_20250620",
        "date": "2025-06-20",
        "duration_minutes": 50,
        "session_number": 24,

        "topics_discussed": [
          "work_stress",
          "anxiety_management",
          "cognitive_distortions"
        ],

        "mood_before": "anxious",
        "mood_after": "calmer",

        "interventions": [
          "cognitive_restructuring",
          "problem_solving"
        ],

        "homework": {
          "assigned": [
            {
              "task": "thought_record",
              "description": "记录自动思维",
              "due_date": "2025-06-27"
            }
          ],
          "reviewed": [
            {
              "task": "relaxation_exercise",
              "completion": "partial",
              "notes": "练习了3天，感觉有帮助"
            }
          ]
        },

        "progress_notes": "焦虑症状有所改善，认知扭曲识别能力提升",
        "next_session": "2025-06-27"
      }
    ],

    "goals": [
      {
        "goal": "reduce_anxiety",
        "baseline_score": 14,
        "current_score": 8,
        "target_score": 5,
        "progress": "significant_improvement"
      },
      {
        "goal": "improve_sleep",
        "baseline_score": 10,
        "current_score": 6,
        "target_score": 4,
        "progress": "moderate_improvement"
      }
    ],

    "overall_progress": "good",
    "client_satisfaction": "high"
  }
}
```

### 命令接口

```bash
# 记录咨询
/mental therapy session 24                # 记录第24次咨询
/mental therapy topics anxiety stress     # 记录讨论主题
/mental therapy homework thought_record   # 记录作业

# 治疗进展
/mental therapy progress                  # 查看治疗进展
/mental therapy goals                     # 查看治疗目标
/mental therapy next                      # 下次咨询时间
```

---

## 子模块 4: 危机管理计划

### 功能描述

建立个人危机干预计划，识别危机预警信号，准备应急资源和应对策略。

### 核心功能

#### 1. 危机预警信号
- 情绪急剧变化
- 社会退缩
- 绝望感
- 自伤意念
- 表达死亡愿望

#### 2. 应对策略
- 自我安抚技巧
- 联系支持人员
- 分散注意力
- 安全环境

#### 3. 紧急联系人
- 家人/朋友
- 治疗师
- 危机热线
- 急诊服务

#### 4. 安全计划
- 移除危险物品
- 安全环境
- 应急包
- 书面安全计划

### 数据结构

```json
{
  "crisis_plan": {
    "created_date": "2025-01-15",
    "last_updated": "2025-06-20",

    "warning_signs": [
      "hopelessness",
      "social_withdrawal",
      "extreme_mood_swings",
      "talk_of_death",
      "giving_away_possessions"
    ],

    "coping_strategies": [
      {
        "strategy": "deep_breathing",
        "description": "深呼吸5分钟",
        "effectiveness": "high"
      },
      {
        "strategy": "grounding_technique",
        "description": "5-4-3-2-1着地技术",
        "effectiveness": "high"
      },
      {
        "strategy": "call_friend",
        "description": "联系支持朋友",
        "effectiveness": "medium"
      }
    ],

    "social_supports": [
      {
        "name": "张三",
        "relationship": "spouse",
        "phone": "***-****-1234",
        "availability": "24/7",
        "notified": true
      },
      {
        "name": "李四",
        "relationship": "friend",
        "phone": "***-****-5678",
        "availability": "evening",
        "notified": true
      }
    ],

    "professional_contacts": [
      {
        "name": "王医生",
        "role": "therapist",
        "phone": "***-****-9012",
        "emergency": true
      },
      {
        "name": "心理危机热线",
        "role": "hotline",
        "phone": "400-xxx-xxxx",
        "available": "24/7"
      }
    ],

    "emergency_services": [
      {
        "service": "急诊",
        "phone": "120",
        "location": "市第一人民医院"
      },
      {
        "service": "心理危机干预中心",
        "phone": "400-xxx-xxxx",
        "location": null
      }
    ],

    "safety_measures": {
      "removed_dangerous_items": true,
      "safe_environment": "home_with_family",
      "emergency_kit": "prepared",
      "written_plan_saved": true
    },

    "risk_level": "low",
    "last_assessment": "2025-06-20"
  }
}
```

### 命令接口

```bash
# 设置危机计划
/crisis plan create                      # 创建危机计划
/crisis sign add hopelessness            # 添加预警信号
/crisis contact add spouse ***-***-1234  # 添加紧急联系人
/crisis strategy add deep_breathing      # 添加应对策略

# 查看危机计划
/crisis plan                             # 查看完整危机计划
/crisis contacts                         # 查看紧急联系人
/crisis strategies                       # 查看应对策略

# 更新风险级别
/crisis risk low                         # 更新当前风险级别
/crisis assessment                       # 进行风险评估
```

---

## 医学安全原则

### ⚠️ 安全红线

1. **不进行心理诊断**
   - 量表结果仅供参考
   - 诊断需由精神科医生进行

2. **不开具精神药物**
   - 不推荐具体药物
   - 药物治疗需精神科医生处方

3. **不预测自杀风险**
   - 不评估自杀概率
   - 有自杀意念需立即就医

4. **不替代心理治疗**
   - 系统不能替代专业心理治疗
   - 严重问题需寻求专业帮助

### ✅ 系统能做到的

- 心理健康筛查和评估
- 情绪模式识别
- 危机预警信号提醒
- 应对策略建议
- 治疗进展追踪
- 紧急资源提供

### ⚠️ 紧急情况处理

**如果有以下情况，请立即寻求专业帮助：**

- 有自伤或自杀想法或计划
- 幻觉、妄想
- 无法控制的情绪爆发
- 完全失去功能
- 伤害他人风险

**紧急求助：**
- 精神科急诊
- 心理危机热线（24小时）
- 120急救电话

---

## 注意事项

1. **隐私保护**：所有心理健康数据需加密存储
2. **定期评估**：建议每月进行一次PHQ-9/GAD-7评估
3. **治疗依从性**：按时参加心理治疗，完成作业
4. **社会支持**：保持与家人朋友的联系
5. **专业帮助**：症状加重或持续不缓解需就医

---

## 参考资源

### 评估量表
- [PHQ-9 官方网站](https://www.phqscreeners.com/)
- [GAD-7 官方网站](https://www.phqscreeners.com/)

### 危机干预
- [中国心理危机干预中心](http://www.psych.cn/)
- [北京心理危机研究与干预中心](https://www.bjcdc.org/)

### 心理健康资源
- [中国精神卫生调查](http://www.nimh.nih.cn/)
- [中华医学会精神病学分会](http://www.csp.org.cn/)

---

## 实施总结

### ✅ 已完成的功能 (2025-01-08)

#### 1. 核心数据结构
- ✅ **主数据文件**: `data-example/mental-health-tracker.json`
  - 用户档案 (user_profile)
  - 心理健康评估 (mental_health_assessments): PHQ-9, GAD-7, PSQI
  - 情绪日记 (mood_diary)
  - 心理治疗记录 (therapy_tracking)
  - 危机管理计划 (crisis_plan)
  - 统计数据 (statistics)

#### 2. 情绪日志系统
- ✅ **日志目录**: `data-example/mental-health-logs/`
  - `.index.json` - 日志索引文件
  - `2025-06/2025-06-20.json` - 示例情绪日记
  - 按月归档,支持历史查询

#### 3. 分析技能
- ✅ **技能文件**: `.claude/skills/mental-health-analyzer/SKILL.md`
  - 心理评估趋势分析
  - 情绪模式识别
  - 心理治疗进展追踪
  - 危机风险评估 (多级风险检测算法)
  - 睡眠-心理关联分析
  - 运动-情绪关联分析
  - 营养-心理关联分析
  - 慢性病-心理关联分析
  - 完整报告生成

#### 4. 命令接口
- ✅ **命令文件**: `.claude/commands/mental-health.md`
  - 心理健康评估 (`/mental assess phq9/gad7/psqi/gds/epds`)
  - 情绪日记 (`/mental mood`, `/mental trigger`, `/mental coping`)
  - 心理治疗记录 (`/mental therapy session/topics/homework/progress`)
  - 危机管理 (`/crisis plan/sign/contact/strategy/risk`)
  - 趋势分析 (`/mental trend`, `/mental pattern`)
  - 报告生成 (`/mental report`)

#### 5. 测试验证
- ✅ **测试脚本**: `scripts/test-mental-health.sh`
  - 基础功能测试 (15个)
  - 医学安全测试 (15个)
  - 数据结构测试 (15个)
  - 危机管理测试 (10个)
  - 关联分析测试 (10个)
  - **测试结果**: 65/65 通过 (100%通过率) ✓

#### 6. 示例报告
- ✅ **报告目录**: `data-example/mental-health-reports/`
  - `mental-health-trend-report-2025-06-20.md` - 心理健康趋势分析报告
  - `mood-pattern-report-2025-06-20.md` - 情绪模式分析报告
  - `therapy-progress-report-2025-06-20.md` - 心理治疗进展报告
  - `crisis-risk-report-2025-06-20.md` - 危机风险评估报告
  - `comprehensive-mental-health-report-2025-06-20.md` - 综合心理健康报告

### 医学安全原则遵守

所有实现严格遵循医学安全原则:
- ❌ 不进行心理诊断
- ❌ 不开具精神药物处方
- ❌ 不预测自杀风险或自伤行为
- ❌ 不替代专业心理治疗
- ✅ 提供心理健康筛查和评估
- ✅ 识别情绪模式和趋势
- ✅ 危机预警信号提醒
- ✅ 提供应对策略建议(非治疗性)
- ✅ 提供就医建议和专业资源信息

### 测试结果摘要

**测试日期**: 2025-01-08
**测试脚本**: `scripts/test-mental-health.sh`
**测试结果**: 65/65 通过 (100%通过率)

**测试分组**:
- 基础功能测试: 15/15 ✓
- 医学安全测试: 15/15 ✓
- 数据结构测试: 15/15 ✓
- 危机管理测试: 10/10 ✓
- 关联分析测试: 10/10 ✓

**测试评级**: ✅ 优秀 (通过率≥90%)

### 功能亮点

1. **全面的心理健康评估** - 支持5种标准化量表 (PHQ-9, GAD-7, PSQI, GDS-15, EPDS)
2. **智能情绪模式识别** - 自动识别常见情绪、触发因素和应对方式效果
3. **心理治疗进展追踪** - 完整的治疗目标、症状改善和作业完成管理
4. **多级危机风险检测** - 基于证据的风险评估算法 (评分0-20,3个等级)
5. **跨模块关联分析** - 与睡眠、运动、营养、慢性病模块的深度关联分析
6. **完整的医学安全边界** - 严格的免责声明和紧急资源信息

### 使用指南

#### 快速开始

```bash
# 1. 进行PHQ-9抑郁筛查
/mental assess phq9

# 2. 记录情绪
/mental mood anxious 7 work_pressure

# 3. 记录应对方式
/mental coping deep_breathing 10 helpful

# 4. 查看情绪模式
/mental pattern

# 5. 查看心理状况趋势
/mental trend

# 6. 查看治疗进展
/mental therapy progress

# 7. 危机风险评估
/crisis assessment

# 8. 生成综合报告
/mental report
```

#### 评估频率建议

- **PHQ-9/GAD-7**: 每月1次 (一般人群), 每2周1次 (治疗中)
- **情绪日记**: 每日记录最佳, 每周至少3次
- **PSQI**: 每3个月1次
- **危机计划**: 每6个月review一次

### 何时寻求专业帮助

**立即就医 (24小时内)**:
- 自伤或自杀想法或计划
- 幻觉、妄想
- 完全失去功能

**尽快就医 (1周内)**:
- PHQ-9≥15分或GAD-7≥15分
- 症状持续超过2周且无改善
- 严重影响工作、学习、社交

**定期就医 (1个月内)**:
- PHQ-9 10-14分或GAD-7 10-14分
- 症状影响生活质量
- 想要专业支持

### 紧急资源

- **心理危机热线**: 400-xxx-xxxx (24小时)
- **精神科急诊**: 就近三甲医院精神科
- **急救电话**: 120

### 维护说明

**当前版本**: v1.0.0
**最后更新**: 2025-01-08
**维护者**: WellAlly Tech
**状态**: 生产就绪 ✓

**文件清单**:
1. `data-example/mental-health-tracker.json` - 主数据文件
2. `data-example/mental-health-logs/.index.json` - 日志索引
3. `data-example/mental-health-logs/2025-06/2025-06-20.json` - 示例日志
4. `.claude/skills/mental-health-analyzer/SKILL.md` - 分析技能
5. `.claude/commands/mental-health.md` - 命令接口
6. `scripts/test-mental-health.sh` - 测试脚本
7. `data-example/mental-health-reports/` - 示例报告目录

---

**文档版本**: v2.0 (完成版)
**最后更新**: 2025-01-08
**维护者**: WellAlly Tech

---
description: 管理年龄特异性预防保健和筛查计划
arguments:
  - name: action
    description: 操作类型：status(状态)/due(即将到期)/update(更新结果)/recommendations(建议)/risk(风险分层)
    required: true
  - name: info
    description: 筛查信息（检查项目、日期、结果等，自然语言描述）
    required: false
---

# 年龄特异性预防保健管理

基于循证医学的年龄分层预防保健方案，提供个性化筛查建议和提醒。

## 命令功能

### 1. 查看预防保健状态 - `status`

显示当前所有预防保健项目和筛查状态。

**示例：**
```
/preventive status
```

**执行步骤：**

#### 1. 读取用户档案和预防保健数据
- 从 `data/profile.json` 读取年龄、性别等基础信息
- 从 `data/preventive-care.json` 读取筛查记录
- 从 `data/preventive-care-protocols.json` 读取年龄分层方案

#### 2. 确定用户年龄组
```javascript
function determineAgeGroup(age, gender) {
  if (age >= 18 && age <= 39) return "young_adult";
  if (age >= 40 && age <= 49) return "middle_age";
  if (age >= 50 && age <= 64) return "pre_senior";
  if (age >= 65) return "senior";
  return null;
}
```

#### 3. 生成状态报告

**输出示例：**
```
📋 预防保健状态报告

个人基本信息：
━━━━━━━━━━━━━━━━━━━━━━━━━━
年龄：45岁
性别：男
年龄组：中年（40-49岁）
风险因素：高血压、吸烟、家族史冠心病

心血管筛查：
━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ 血压检查
   最近检查：2024-12-15
   结果：138/88 mmHg ⚠️
   状态：未达标（目标<130/80）
   下次检查：2025-03-15（还有90天）

✅ 血脂谱
   最近检查：2024-06-20
   结果：总胆固醇 245 mg/dL ⚠️
   LDL：162 mg/dL ⚠️
   状态：边缘升高
   下次检查：2025-06-20（还有162天）

✅ 空腹血糖
   最近检查：2023-12-10
   结果：98 mg/dL ✅
   状态：正常
   下次检查：2026-12-10（还有340天）

癌症筛查：
━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴 结直肠癌筛查
   状态：从未检查
   建议：45岁开始筛查
   紧急程度：过期 ❗
   建议：立即安排结肠镜检查

✅ 肺癌筛查
   状态：符合筛查条件
   最近检查：2024-06-01
   结果：阴性 ✅
   下次检查：2025-06-01（还有147天）

✅ 前列腺癌筛查
   状态：已讨论（45岁开始）
   最近PSA：2024-03-15
   结果：2.8 ng/mL ✅
   下次讨论：2029-03-15

免疫接种：
━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ 流感疫苗
   最近接种：2024-10-15
   下次接种：2025-10-01（还有269天）

⚠️ 肺炎球菌疫苗
   状态：未接种
   建议：65岁后接种

✅ 破伤风疫苗
   最近接种：2018-05-10
   下次接种：2028-05-10

⚠️ 带状疱疹疫苗
   状态：未接种
   建议：50岁开始接种

其他筛查：
━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ 视力测试
   最近检查：2024-01-20
   下次检查：2026-01-20

✅ 听力测试
   最近检查：2023-06-15
   下次检查：2026-06-15

⚠️ 抑郁筛查
   状态：需筛查

总体评估：
━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 已按时筛查：7项
⚠️ 即将到期：2项
🔴 过期/缺失：2项
⚠️ 需关注：2项

优先建议：
━━━━━━━━━━━━━━━━━━━━━━━━━━
1. 🚨 立即安排结肠镜检查（结直肠癌筛查已逾期）
2. ⚠️ 血压控制未达标，调整生活方式和/或药物
3. ⚠️ 血脂升高，3个月后复查，考虑降脂治疗

💡 提示：
━━━━━━━━━━━━━━━━━━━━━━━━━━
根据您的年龄、性别和危险因素，
以上筛查计划已个性化调整。
```

---

### 2. 查看即将到期的筛查 - `due`

显示未来30-90天内到期的筛查项目。

**参数说明：**
- `info`: 时间范围（可选）
  - `30` - 未来30天
  - `90` - 未来90天（默认）
  - `180` - 未来6个月

**示例：**
```
/preventive due
/preventive due 30
/preventive due 180
```

**输出示例：**
```
📅 即将到期的筛查

未来90天内到期项目：
━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴 血压检查
   到期日期：2025-03-15（还有90天）
   紧急程度：中等
   检查准备：无需准备
   预约建议：提前1周预约

⚠️ 血脂谱
   到期日期：2025-06-20（还有162天）
   紧急程度：低
   检查准备：空腹9-12小时
   预约建议：提前2周预约

🔵 肺癌筛查（LDCT）
   到期日期：2025-06-01（还有147天）
   紧急程度：中等
   检查准备：无需准备
   预约建议：提前1个月预约

💡 提示：
━━━━━━━━━━━━━━━━━━━━━━━━━━
建议优先安排血压检查，
因为您有高血压且控制未达标。
```

---

### 3. 更新筛查结果 - `update`

记录新的筛查结果。

**参数说明：**
- `info`: 筛查信息（必填）
  - 检查项目
  - 检查日期
  - 检查结果（数值、正常/异常等）

**示例：**
```
/preventive update 血压 2025-03-15 125/82
/preventive update 血脂 总胆固醇220 LDL155 2025-06-20
/preventive update 结肠镜 2025-04-10 正常 无息肉
/preventive update 空腹血糖 2025-01-10 105
```

**执行步骤：**

#### 1. 解析筛查信息
```javascript
// 识别检查类型
const screeningTypes = {
  '血压': 'blood_pressure',
  '血脂': 'lipid_panel',
  '胆固醇': 'lipid_panel',
  '血糖': 'fasting_glucose',
  '结肠镜': 'colorectal_cancer',
  '乳腺X': 'breast_cancer',
  'PSA': 'prostate_cancer',
  'LDCT': 'lung_cancer',
  // ... 更多
};
```

#### 2. 验证结果并分类
```javascript
// 血压分类
function classifyBloodPressure(systolic, diastolic) {
  if (systolic < 120 && diastolic < 80) return "normal";
  if (systolic < 130 && diastolic < 80) return "elevated";
  if (systolic < 140 || diastolic < 90) return "stage_1";
  return "stage_2";
}

// 血脂分类
function classifyLDL(ldl) {
  if (ldl < 100) return "optimal";
  if (ldl < 130) return "near_optimal";
  if (ldl < 160) return "borderline_high";
  if (ldl < 190) return "high";
  return "very_high";
}
```

#### 3. 计算下次筛查日期
```javascript
function calculateNextScreening(screeningType, lastDate, patientData) {
  const protocol = loadProtocol(screeningType);
  const baseInterval = protocol.base_interval_years;

  // 风险调整
  let adjustedInterval = baseInterval;
  for (const [riskFactor, multiplier] of Object.entries(patientData.riskFactors)) {
    if (protocol.risk_adjustments[riskFactor]) {
      adjustedInterval = Math.min(adjustedInterval,
        adjustedInterval * protocol.risk_adjustments[riskFactor].multiplier);
    }
  }

  const nextDate = addYears(lastDate, adjustedInterval);
  return nextDate;
}
```

#### 4. 更新数据文件

**数据结构：**
```json
{
  "preventive_care": {
    "patient_profile": {
      "age": 45,
      "gender": "male",
      "age_group": "middle_age",
      "risk_factors": ["hypertension", "smoking", "family_history_cad"]
    },

    "screening_records": {
      "blood_pressure": {
        "last_screened": "2025-03-15",
        "result": {
          "systolic": 125,
          "diastolic": 82,
          "classification": "normal",
          "at_goal": true,
          "goal": "<130/80"
        },
        "trend": "improving",
        "next_due": "2025-06-15",
        "overdue": false,
        "history": [
          {"date": "2024-12-15", "systolic": 138, "diastolic": 88},
          {"date": "2025-03-15", "systolic": 125, "diastolic": 82}
        ]
      },

      "lipid_panel": {
        "last_screened": "2025-06-20",
        "result": {
          "total_cholesterol": 220,
          "ldl": 155,
          "hdl": 42,
          "triglycerides": 180,
          "classification": "borderline_high"
        },
        "next_due": "2026-06-20",
        "overdue": false
      }
    },

    "compliance_tracking": {
      "total_screenings": 9,
      "up_to_date_count": 7,
      "overdue_count": 1,
      "never_done_count": 1,
      "compliance_rate": 0.78
    }
  }
}
```

**输出示例：**
```
✅ 筛查结果已更新

血压检查信息：
━━━━━━━━━━━━━━━━━━━━━━━━━━
检查日期：2025年3月15日
收缩压：125 mmHg ✅
舒张压：82 mmHg ✅
分类：正常
达标情况：✅ 达标（目标<130/80）

趋势分析：
━━━━━━━━━━━━━━━━━━━━━━━━━━
上次检查（2024-12-15）：138/88
本次检查（2025-03-15）：125/82
变化：-13/-6 mmHg
趋势：显著改善 📉

评估：
━━━━━━━━━━━━━━━━━━━━━━━━━━
太好了！血压已达标。
继续保持当前治疗和生活方式。

下次检查：
━━━━━━━━━━━━━━━━━━━━━━━━━━
2025年6月15日（92天后）

💡 提示：
━━━━━━━━━━━━━━━━━━━━━━━━━━
继续：
• 规律服用降压药
• DASH饮食
• 限制钠盐摄入
• 规律运动
• 限制酒精
• 控制体重
```

---

### 4. 获取个性化建议 - `recommendations`

基于当前状态提供个性化预防保健建议。

**示例：**
```
/preventive recommendations
```

**输出示例：**
```
💡 个性化预防保健建议

基于您的年龄（45岁）、性别（男）和危险因素（高血压、吸烟、家族史冠心病）：

优先级1 - 立即行动：
━━━━━━━━━━━━━━━━━━━━━━━━━━

1. 🚨 结直肠癌筛查
   建议：立即安排结肠镜检查
   原因：45岁开始筛查，您已逾期
   行动：本周预约消化内科

2. ⚠️ 戒烟
   建议：制定戒烟计划
   原因：吸烟是心血管病和肺癌主要危险因素
   行动：咨询医生戒烟辅助方法

3. ⚠️ 血脂管理
   建议：3个月后复查血脂，考虑降脂治疗
   原因：LDL 155 mg/dL，加上高危因素
   行动：
   • 严格控制饱和脂肪摄入
   • 增加可溶性纤维
   • 规律有氧运动
   • 3个月后复查

优先级2 - 近期安排（1-3个月）：
━━━━━━━━━━━━━━━━━━━━━━━━━━

1. 血压监测
   当前状态：已达标 ✅
   建议：继续每3个月监测
   家庭监测：每日测量，记录日志

2. 肺癌筛查
   下次检查：2025-06-01
   建议：提前1个月预约LDCT

优先级3 - 长期维持：
━━━━━━━━━━━━━━━━━━━━━━━━━━

1. 生活方式干预
   饮食：
   • DASH饮食（低钠、高钾、高镁、高钙）
   • 地中海饮食模式
   • 限制加工食品
   • 增加蔬菜水果

   运动：
   • 每周150分钟中等强度有氧运动
   • 每周2-3次力量训练
   • 减少久坐时间

   体重管理：
   • BMI目标：18.5-24.9
   • 腰围目标：<102 cm（男性）

2. 疫苗接种
   • 年度流感疫苗（9-11月）
   • 50岁开始带状疱疹疫苗
   • 每10年破伤风加强

3. 压力管理
   • 学习放松技巧
   • 充足睡眠（7-9小时）
   • 社会支持

💊 药物治疗建议：
━━━━━━━━━━━━━━━━━━━━━━━━━━
当前用药：降压药（需确认）

考虑讨论：
• 他汀类降脂药（根据危险因素）
• 阿司匹林一级预防（需医生评估）

📊 您的心血管风险评估：
━━━━━━━━━━━━━━━━━━━━━━━━━━
ASCVD 10年风险：约12%
风险分类：中等偏高
管理目标：强化危险因素控制

💡 提示：
━━━━━━━━━━━━━━━━━━━━━━━━━━
所有建议仅供参考，
具体诊疗方案请咨询医生。
```

---

### 5. 风险分层分析 - `risk`

分析个人危险因素并计算筛查频率调整。

**示例：**
```
/preventive risk
```

**输出示例：**
```
📊 危险因素分层分析

已识别危险因素：
━━━━━━━━━━━━━━━━━━━━━━━━━━

1. 高血压
   严重程度：中等
   持续时间：2年
   控制状态：已达标 ✅
   影响：增加心血管病风险

2. 吸烟
   吸烟量：1包/天
   吸烟史：25年
   包年数：25
   影响：
   • 心血管病风险增加2-4倍
   • 肺癌风险增加10-30倍
   • COPD风险增加

3. 家族史冠心病
   受累亲属：父亲
   发病年龄：55岁
   影响：增加个人风险2倍

4. 超重
   BMI：27.5
   分类：超重
   影响：增加心血管病风险

心血管风险计算：
━━━━━━━━━━━━━━━━━━━━━━━━━━
ASCVD 10年风险评估：
年龄：45岁
性别：男
收缩压：125 mmHg（治疗后）
是否治疗：是
吸烟：是
总胆固醇：220 mg/dL
HDL：42 mg/dL

━━━━━━━━━━━━━━━━━━━━━━━━━━
10年风险：约12%
风险分类：中等偏高（>7.5%）
建议：强化他汀治疗考虑

筛查频率调整：
━━━━━━━━━━━━━━━━━━━━━━━━━━

基于危险因素的筛查间隔调整：

血压检查：
  基础建议：每年
  危险因素调整：高血压 → 每季度
  最终建议：每季度检查

血脂谱：
  基础建议：每4-6年（40岁前）
  危险因素调整：
    • 家族史冠心病 → ×0.5
    • 高血压 → ×0.5
    • 吸烟 → ×0.5
    • 超重 → ×0.5
  最终建议：每年检查

血糖：
  基础建议：每3年
  危险因素调整：
    • 高血压 → ×0.5
    • 超重 → ×0.5
  最终建议：每年检查

结直肠癌筛查：
  基础建议：45岁开始，每10年
  危险因素调整：无
  最终建议：45岁开始，每10年

肺癌筛查：
  基础建议：不筛查
  危险因素评估：
    • 年龄：45岁（符合50-80岁范围？❌）
    • 吸烟史：25包年（≥20？✅）
    • 当前吸烟或戒烟<15年：是 ✅
  符合筛查条件：是的，但年龄略低于推荐
  建议：与医生讨论LDCT筛查的利弊

前列腺癌筛查：
  基础建议：50岁开始讨论
  危险因素调整：无
  最终建议：45岁开始讨论（已开始✅）

风险分层总结：
━━━━━━━━━━━━━━━━━━━━━━━━━━

您的心血管风险分层：中等偏高

危险因素数量：4个
可控危险因素：3个（吸烟、超重、血压）
不可控：1个（家族史）

干预潜力：高

如果能：
✓ 戒烟 → 5年内心血管风险降低40%
✓ 减重5-10% → 血压改善，血脂改善
✓ 维持血压达标 → 心血管事件风险降低30-40%

💡 提示：
━━━━━━━━━━━━━━━━━━━━━━━━━━
您有多个可控危险因素，
戒烟和减重能带来最大获益。

建议制定具体行动计划，
并定期评估进展。
```

---

## 数据结构

### 主文件：data/preventive-care.json

```json
{
  "metadata": {
    "version": "1.0",
    "created_at": "2025-01-05T00:00:00.000Z",
    "last_updated": "2025-01-05T00:00:00.000Z"
  },

  "patient_profile": {
    "age": 45,
    "gender": "male",
    "age_group": "middle_age",
    "risk_factors": [
      "hypertension",
      "smoking",
      "family_history_cad",
      "overweight"
    ],
    "risk_factors_details": {
      "hypertension": {
        "diagnosed_date": "2023-01-15",
        "duration_years": 2,
        "controlled": true,
        "medication": "ace_inhibitor"
      },
      "smoking": {
        "status": "current",
        "cigarettes_per_day": 20,
        "smoking_years": 25,
        "pack_years": 25
      },
      "family_history_cad": {
        "relative": "father",
        "age_at_onset": 55,
        "relationship": "first_degree"
      }
    }
  },

  "screening_records": {
    "cardiovascular": {
      "blood_pressure": {
        "screening_id": "bp_001",
        "last_screened": "2025-03-15",
        "result": {
          "systolic": 125,
          "diastolic": 82,
          "pulse": 72,
          "classification": "normal",
          "at_goal": true,
          "goal": "<130/80"
        },
        "trend": "improving",
        "next_due": "2025-06-15",
        "overdue": false,
        "history": [
          {"date": "2024-12-15", "systolic": 138, "diastolic": 88},
          {"date": "2025-03-15", "systolic": 125, "diastolic": 82}
        ]
      },

      "lipid_panel": {
        "screening_id": "lipid_001",
        "last_screened": "2024-06-20",
        "result": {
          "total_cholesterol": 245,
          "ldl": 162,
          "hdl": 42,
          "triglycerides": 180,
          "classification": "borderline_high",
          "reference_ranges": {
            "total_cholesterol": "<200",
            "ldl": "<100",
            "hdl": ">40",
            "triglycerides": "<150"
          }
        },
        "next_due": "2025-06-20",
        "overdue": false
      },

      "fasting_glucose": {
        "screening_id": "glucose_001",
        "last_screened": "2024-12-10",
        "result": {
          "value": 98,
          "unit": "mg/dL",
          "classification": "normal",
          "reference_range": "<100"
        },
        "next_due": "2027-12-10",
        "overdue": false
      }
    },

    "cancer_screening": {
      "colorectal_cancer": {
        "screening_id": "crc_001",
        "last_screened": null,
        "never_done": true,
        "recommended_start_age": 45,
        "current_age": 45,
        "overdue": true,
        "urgency": "overdue",
        "recommended_method": "colonoscopy",
        "alternative_methods": ["fit", "ct_colonography"]
      },

      "lung_cancer": {
        "screening_id": "lc_001",
        "last_screened": "2024-06-01",
        "result": {
          "method": "ldct",
          "findings": "negative",
          "lung_nodules": false
        },
        "next_due": "2025-06-01",
        "overdue": false,
        "eligibility": {
          "age_eligible": false,
          "smoking_history_eligible": true,
          "overall_eligible": true,
          "notes": "年龄略低于推荐（45 vs 50-80），但包年数达标"
        }
      },

      "prostate_cancer": {
        "screening_id": "pc_001",
        "last_psa": "2024-03-15",
        "result": {
          "psa_value": 2.8,
          "unit": "ng/mL",
          "classification": "normal",
          "reference": "<4.0"
        },
        "discussion_completed": true,
        "discussion_date": "2024-03-15",
        "next_discussion": "2029-03-15"
      }
    },

    "immunizations": {
      "influenza": {
        "last_vaccinated": "2024-10-15",
        "next_due": "2025-10-01",
        "vaccine_type": "standard_dose"
      },
      "tetanus": {
        "last_vaccinated": "2018-05-10",
        "vaccine_type": "tdap",
        "next_due": "2028-05-10"
      },
      "pneumococcal": {
        "vaccinated": false,
        "recommended_at_age": 65
      },
      "shingles": {
        "vaccinated": false,
        "recommended_at_age": 50
      }
    }
  },

  "compliance_tracking": {
    "total_screenings": 9,
    "up_to_date_count": 6,
    "due_soon_count": 2,
    "overdue_count": 1,
    "never_done_count": 1,
    "compliance_rate": 0.67,

    "category_breakdown": {
      "cardiovascular": {
        "total": 3,
        "up_to_date": 3,
        "overdue": 0,
        "compliance": 1.0
      },
      "cancer_screening": {
        "total": 3,
        "up_to_date": 1,
        "overdue": 1,
        "never_done": 1,
        "compliance": 0.33
      },
      "immunizations": {
        "total": 4,
        "up_to_date": 2,
        "pending": 2,
        "compliance": 0.5
      }
    }
  },

  "risk_assessment": {
    "ascvd_10yr_risk": 0.12,
    "risk_category": "moderate_high",
    "risk_factors_count": 4,
    "modifiable_risk_factors": 3,
    "intervention_potential": "high"
  }
}
```

---

## 智能识别规则

### 检查项目识别

| 用户输入 | 标准项目 |
|---------|---------|
| 血压、测血压 | blood_pressure |
| 血脂、胆固醇、脂谱 | lipid_panel |
| 血糖、空腹血糖 | fasting_glucose |
| 糖化血红蛋白、HbA1c | diabetes_hba1c |
| 结肠镜、肠镜 | colorectal_cancer |
| 乳腺X、乳腺检查、钼靶 | breast_cancer |
| PSA、前列腺 | prostate_cancer |
| LDCT、肺癌筛查 | lung_cancer |

### 结果值识别

**血压：**
| 格式 | 示例 |
|------|------|
| 收缩压/舒张压 | 125/82 |
| SP:DP | 125:82 |
| 空格分隔 | 125 82 |

**血脂：**
| 关键词 | 单位 |
|--------|------|
| 总胆固醇 | mg/dL |
| LDL | mg/dL |
| HDL | mg/dL |
| 甘油三酯 | mg/dL |

---

## 风险分层算法

### 1. 计算筛查间隔

```javascript
function calculateScreeningInterval(screeningType, patientData) {
  // 加载基础方案
  const protocol = PREVENTIVE_PROTOCOLS[screeningType];
  const ageGroup = determineAgeGroup(patientData.age);

  // 获取基础间隔
  let baseInterval = protocol.age_specific_recommendations[ageGroup].base_interval_years;

  // 应用风险调整
  let adjustedInterval = baseInterval;
  const adjustments = [];

  for (const [riskFactor, value] of Object.entries(patientData.riskFactors)) {
    if (protocol.risk_adjustments[riskFactor]) {
      const multiplier = protocol.risk_adjustments[riskFactor].multiplier;
      adjustedInterval = adjustedInterval * multiplier;
      adjustments.push({
        risk_factor: riskFactor,
        multiplier: multiplier,
        description: protocol.risk_adjustments[riskFactor].description
      });
    }
  }

  // 确保不低于最小间隔
  const MINIMUM_INTERVAL = 0.25; // 3个月
  adjustedInterval = Math.max(adjustedInterval, MINIMUM_INTERVAL);

  return {
    base_interval_years: baseInterval,
    adjusted_interval_years: adjustedInterval,
    adjustments: adjustments
  };
}
```

### 2. 计算下次筛查日期

```javascript
function calculateNextDue(screeningType, lastScreened, patientData) {
  const interval = calculateScreeningInterval(screeningType, patientData);

  const nextDue = addYears(lastScreened, interval.adjusted_interval_years);

  return {
    next_due_date: nextDue,
    interval_years: interval.adjusted_interval_years,
    rationale: interval.adjustments
  };
}
```

### 3. ASCVD风险计算

```javascript
function calculateASCVD10YearRisk(data) {
  // 简化的ASCVD风险计算（基于ACC/AHA指南）
  // 实际应用应使用官方计算器

  const riskFactors = {
    age: data.age,
    gender: data.gender,
    systolic_bp: data.systolic_bp,
    hypertension_treated: data.hypertension_treated,
    smoking: data.smoking,
    total_cholesterol: data.total_cholesterol,
    hdl: data.hdl
  };

  // 这里使用简化估算
  // 实际应使用官方Pooling Cohort Equations

  let estimatedRisk = 0.05; // 基础风险5%

  if (riskFactors.age >= 45) estimatedRisk += 0.02;
  if (riskFactors.age >= 50) estimatedRisk += 0.02;
  if (riskFactors.age >= 55) estimatedRisk += 0.02;
  if (riskFactors.age >= 60) estimatedRisk += 0.02;

  if (riskFactors.smoking) estimatedRisk += 0.03;
  if (riskFactors.systolic_bp >= 140) estimatedRisk += 0.02;
  if (riskFactors.total_cholesterol >= 240) estimatedRisk += 0.02;
  if (riskFactors.hdl < 40) estimatedRisk += 0.02;

  return Math.min(estimatedRisk, 0.30); // 最高30%
}
```

---

## 医学安全原则

- ✅ 所有筛查建议基于循证医学指南
- ✅ 不替代专业医疗建议
- ✅ 不直接开具检查或药物
- ✅ 强调与医生讨论个体化方案
- ✅ 所有风险计算仅供参考
- ✅ 不承诺早期发现能挽救生命

**免责声明：**
本系统提供的预防保健建议仅供参考，不作为医疗诊断或治疗依据。具体筛查方案请咨询专业医生。如有紧急情况，请立即就医。

---

## 示例用法

```
# 查看预防保健状态
/preventive status

# 查看即将到期的筛查
/preventive due 90

# 更新血压检查结果
/preventive update 血压 2025-03-15 125/82

# 更新血脂检查结果
/preventive update 血脂 2025-06-20 总胆固醇220 LDL155 HDL42

# 记录结肠镜检查
/preventive update 结肠镜 2025-04-10 正常 无息肉

# 获取个性化建议
/preventive recommendations

# 查看风险分层
/preventive risk
```

---

## 注意事项

- 年龄组根据实际年龄自动计算
- 所有筛查间隔考虑个人危险因素调整
- 危险因素需在profile中记录
- 疫苗接种根据年龄和危险因素推荐
- 癌症筛查遵循USPSTF或相应指南
- 所有建议强调与医生讨论
```

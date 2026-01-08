# 数据结构说明

## 生化检查数据结构

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

### 字段说明
- `id`: 唯一标识符（时间戳生成）
- `type`: 检查类型，固定为"生化检查"
- `date`: 检查日期（YYYY-MM-DD格式）
- `hospital`: 就诊医院名称
- `items`: 检查项目数组
  - `name`: 检查项目名称
  - `value`: 检查结果值
  - `unit`: 计量单位
  - `min_ref`: 参考范围下限
  - `max_ref`: 参考范围上限
  - `is_abnormal`: 是否异常（布尔值）

## 影像检查数据结构

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

### 字段说明
- `id`: 唯一标识符（时间戳生成）
- `type`: 检查类型，固定为"影像检查"
- `subtype`: 影像检查子类型（B超、CT、MRI、X光等）
- `date`: 检查日期（YYYY-MM-DD格式）
- `hospital`: 就诊医院名称
- `body_part`: 检查部位
- `findings`: 检查发现对象
  - `description`: 检查所见文字描述
  - `measurements`: 测量数据对象
  - `conclusion`: 检查结论
- `original_image`: 原始图片备份路径

## 辐射记录数据结构

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

### 字段说明
- `id`: 唯一标识符（时间戳生成）
- `exam_type`: 检查类型（CT、X光、PET-CT等）
- `body_part`: 检查部位
- `exam_date`: 检查日期（YYYY-MM-DD格式）
- `standard_dose`: 标准辐射剂量（mSv）
- `body_surface_area`: 用户体表面积（m²）
- `adjustment_factor`: 体表面积调整系数
- `actual_dose`: 实际辐射剂量（mSv）
- `dose_unit`: 剂量单位，固定为"mSv"

## 用户档案数据结构

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

### 字段说明
- `basic_info`: 基础信息对象
  - `height`: 身高数值
  - `height_unit`: 身高单位
  - `weight`: 体重数值
  - `weight_unit`: 体重单位
  - `birth_date`: 出生日期（YYYY-MM-DD格式）
- `calculated`: 自动计算的信息对象
  - `age`: 年龄（周岁）
  - `bmi`: BMI指数
  - `bmi_status`: BMI状态（偏瘦/正常/超重/肥胖）
  - `body_surface_area`: 体表面积（使用Mosteller公式计算）
  - `bsa_unit`: 体表面积单位

## 全局索引数据结构

```json
{
  "biochemical_exams": [
    {
      "id": "20251231123456789",
      "date": "2025-12-31",
      "type": "生化检查",
      "file_path": "data/生化检查/2025-12/2025-12-31_血常规.json"
    }
  ],
  "imaging_exams": [
    {
      "id": "20251231123456789",
      "date": "2025-12-31",
      "type": "影像检查",
      "subtype": "B超",
      "file_path": "data/影像检查/2025-12/2025-12-31_腹部B超.json"
    }
  ],
  "last_updated": "2025-12-31T12:34:56.789Z"
}
```

### 字段说明
- `biochemical_exams`: 生化检查索引数组
- `imaging_exams`: 影像检查索引数组
- `symptom_records`: 症状记录索引数组
- `last_updated`: 最后更新时间（ISO 8601格式）

## 症状记录数据结构

```json
{
  "id": "20251231123456789",
  "record_date": "2025-12-31",
  "symptom_date": "2025-12-31",
  "original_input": "用户原始输入",

  "standardized": {
    "main_symptom": "头痛",
    "category": "神经系统",
    "body_part": "头部",
    "severity": "轻度",
    "severity_level": 1,
    "characteristics": "胀痛感",
    "onset_time": "2025-12-31T10:00:00",
    "duration": "2小时",
    "frequency": "首次出现"
  },

  "associated_symptoms": [
    {
      "name": "恶心",
      "present": true
    },
    {
      "name": "呕吐",
      "present": false
    }
  ],

  "triggers": {
    "possible_causes": ["睡眠不足", "精神紧张"],
    "aggravating_factors": [],
    "relieving_factors": ["休息后略缓解"]
  },

  "medical_assessment": {
    "urgency": "observation",
    "urgency_level": 1,
    "recommendation": "居家观察",
    "advice": "建议充分休息，保证充足睡眠。如症状加重或持续超过24小时，建议就医。",
    "red_flags": []
  },

  "follow_up": {
    "needs_follow_up": false,
    "follow_up_date": null,
    "improvement": null
  },

  "metadata": {
    "created_at": "2025-12-31T12:34:56.789Z",
    "last_updated": "2025-12-31T12:34:56.789Z"
  }
}
```

### 字段说明
- `id`: 唯一标识符（时间戳生成）
- `record_date`: 记录创建日期（YYYY-MM-DD格式）
- `symptom_date`: 症状发生日期（YYYY-MM-DD格式）
- `original_input`: 用户原始输入的自然语言描述
- `standardized`: 标准化后的医学信息对象
  - `main_symptom`: 主要症状的标准医学术语
  - `category`: 症状所属系统分类
  - `body_part`: 症状发生的身体部位
  - `severity`: 严重程度描述（轻度/中度/重度/危急）
  - `severity_level`: 严重程度等级（1-4）
  - `characteristics`: 症状特点描述
  - `onset_time`: 症状开始时间（ISO 8601格式）
  - `duration`: 持续时间描述
  - `frequency`: 发生频率描述
- `associated_symptoms`: 伴随症状数组
  - `name`: 症状名称
  - `present`: 是否存在该症状（布尔值）
- `triggers`: 诱因和缓解因素对象
  - `possible_causes`: 可能原因数组
  - `aggravating_factors`: 加重因素数组
  - `relieving_factors`: 缓解因素数组
- `medical_assessment`: 医学评估对象
  - `urgency`: 紧急程度类别（observation/outpatient/urgent/emergency）
  - `urgency_level`: 紧急程度等级（1-4）
  - `recommendation`: 就医建议类别
  - `advice`: 具体建议内容
  - `red_flags`: 危险警示信号数组
- `follow_up`: 随访信息对象
  - `needs_follow_up`: 是否需要随访（布尔值）
  - `follow_up_date`: 随访日期（如有）
  - `improvement`: 改善情况（如有）
- `metadata`: 元数据对象
  - `created_at`: 记录创建时间（ISO 8601格式）
  - `last_updated`: 最后更新时间（ISO 8601格式）

### 紧急程度分类

- **observation（1级）**: 居家观察
- **outpatient（2级）**: 门诊就医（1周内）
- **urgent（3级）**: 尽快就医（今天或明天）
- **emergency（4级）**: 立即就医或拨打急救电话

### 症状系统分类

- 呼吸系统：咳嗽、咳痰、呼吸困难、胸痛等
- 心血管系统：心悸、胸闷、水肿等
- 消化系统：腹痛、恶心、呕吐、腹泻、便秘等
- 神经系统：头痛、头晕、失眠、抽搐等
- 泌尿系统：尿频、尿急、尿痛、血尿等
- 内分泌系统：多饮、多尿、体重变化等
- 肌肉骨骼：关节痛、肌肉痛、活动受限等
- 全身症状：发热、乏力、消瘦等

## 用药记录数据结构

### 药物信息数据结构

```json
{
  "medications": [
    {
      "id": "med_20251231123456789",
      "name": "阿司匹林",
      "generic_name": "阿司匹林",
      "dosage": {
        "value": 100,
        "unit": "mg"
      },
      "frequency": {
        "type": "daily",
        "times_per_day": 1,
        "interval_days": 1
      },
      "schedule": [
        {
          "weekday": 1,
          "time": "08:00",
          "timing_label": "早餐后",
          "dose": {
            "value": 100,
            "unit": "mg"
          }
        },
        {
          "weekday": 2,
          "time": "08:00",
          "timing_label": "早餐后",
          "dose": {
            "value": 100,
            "unit": "mg"
          }
        }
        ... (继续至星期日，共7条记录)
      ],
      "instructions": "早餐后服用",
      "notes": "",
      "active": true,
      "created_at": "2025-12-31T12:34:56.789Z",
      "last_updated": "2025-12-31T12:34:56.789Z"
    }
  ]
}
```

### 字段说明

- `medications`: 药物数组
  - `id`: 唯一标识符（前缀 med_ + 时间戳）
  - `name`: 药物名称（通用名或商品名）
  - `generic_name`: 通用名称
  - `dosage`: 剂量信息对象
    - `value`: 剂量数值
    - `unit`: 剂量单位（mg、g、ml、IU、片、粒等）
  - `frequency`: 用药频率对象
    - `type`: 频率类型（daily/weekly/every_other_day/as_needed）
    - `times_per_day`: 每天用药次数
    - `interval_days`: 用药间隔天数
  - `schedule`: 用药计划数组（强制要求明确指定每个星期几的用药计划）
    - `weekday`: 星期几（1-7，1表示周一，7表示周日）
    - `time`: 用药时间（HH:mm格式）
    - `timing_label`: 时间标签（早餐后、睡前等）
    - `dose`: 该时间点的剂量
  - `instructions`: 用药说明
  - `notes`: 备注信息
  - `active`: 是否活跃（true表示正在使用，false表示已停用）
  - `created_at`: 创建时间（ISO 8601格式）
  - `last_updated`: 最后更新时间（ISO 8601格式）

### schedule 数组生成规则

**重要：schedule 必须为每个星期几明确生成用药计划记录**

#### 每天1次的药物
生成 7 条记录（周一至周日各1条）
```json
"schedule": [
  {"weekday": 1, "time": "08:00", ...},
  {"weekday": 2, "time": "08:00", ...},
  {"weekday": 3, "time": "08:00", ...},
  {"weekday": 4, "time": "08:00", ...},
  {"weekday": 5, "time": "08:00", ...},
  {"weekday": 6, "time": "08:00", ...},
  {"weekday": 7, "time": "08:00", ...}
]
```

#### 每天2次的药物
生成 14 条记录（每天2次 × 7天）
```json
"schedule": [
  {"weekday": 1, "time": "08:00", ...},  // 周一早晨
  {"weekday": 1, "time": "20:00", ...},  // 周一晚上
  {"weekday": 2, "time": "08:00", ...},  // 周二早晨
  {"weekday": 2, "time": "20:00", ...},  // 周二晚上
  ... (继续至星期日)
]
```

#### 每天3次的药物
生成 21 条记录（每天3次 × 7天）
```json
"schedule": [
  {"weekday": 1, "time": "08:00", ...},  // 周一早餐后
  {"weekday": 1, "time": "12:30", ...},  // 周一午餐后
  {"weekday": 1, "time": "18:30", ...},  // 周一晚餐后
  {"weekday": 2, "time": "08:00", ...},  // 周二早餐后
  ... (继续至星期日)
]
```

#### 每周1次的药物
生成 1 条记录（指定的星期几）
```json
"schedule": [
  {"weekday": 1, "time": "08:00", ...}  // 每周一
]
```

#### 隔天1次的药物
生成 4 条记录（周一、三、五、日 或 二、四、六）
```json
"schedule": [
  {"weekday": 1, "time": "08:00", ...},
  {"weekday": 3, "time": "08:00", ...},
  {"weekday": 5, "time": "08:00", ...},
  {"weekday": 7, "time": "08:00", ...}
]
```

### 用药记录数据结构

```json
{
  "date": "2025-12-31",
  "logs": [
    {
      "id": "log_20251231080000001",
      "medication_id": "med_20251231123456789",
      "medication_name": "阿司匹林",
      "scheduled_time": "08:00",
      "actual_time": "2025-12-31T08:15:00",
      "status": "taken",
      "dose": {
        "value": 100,
        "unit": "mg"
      },
      "notes": "",
      "created_at": "2025-12-31T08:15:00.000Z"
    }
  ]
}
```

### 字段说明

- `date`: 用药日期（YYYY-MM-DD格式）
- `logs`: 用药记录数组
  - `id`: 记录唯一标识符（前缀 log_ + 时间戳）
  - `medication_id`: 关联的药物ID
  - `medication_name`: 药物名称
  - `scheduled_time`: 计划用药时间（HH:mm格式）
  - `actual_time`: 实际用药时间（ISO 8601格式，漏服时为null）
  - `status`: 用药状态（taken/missed/skipped/delayed）
  - `dose`: 实际剂量
  - `notes`: 备注（如漏服原因）
  - `created_at`: 记录创建时间（ISO 8601格式）

### 用药状态值说明

- **taken**: 已服用（按时或延迟服用）
- **missed**: 漏服（未服用）
- **skipped**: 跳过（医嘱停用或暂停）
- **delayed**: 延迟服用（已服用但时间延迟）

### 频率类型说明

- **daily**: 每日（times_per_day表示每天次数）
- **weekly**: 每周（times_per_day表示每周次数）
- **every_other_day**: 隔日一次
- **as_needed**: 按需服用（不计算依从性）

### 用药依从性计算

```
依从性百分比 = (实际服用次数 / 计划服用次数) × 100%

其中：
- 实际服用次数 = status为taken或delayed的记录数
- 计划服用次数 = 应服用的总次数（排除skipped和as_needed）
- 待服用状态不计入统计
```

### 依从性等级

- **优秀**: ≥ 90%
- **良好**: 70% - 89%
- **需改进**: < 70%

## 全局索引更新（用药记录）

```json
{
  "medications": [
    {
      "id": "med_20251231123456789",
      "name": "阿司匹林",
      "dosage_value": 100,
      "dosage_unit": "mg",
      "frequency_type": "daily",
      "file_path": "data/medications/medications.json",
      "active": true,
      "created_at": "2025-12-31T12:34:56.789Z"
    }
  ],
  "medication_logs": [
    {
      "id": "log_20251231080000001",
      "date": "2025-12-31",
      "medication_id": "med_20251231123456789",
      "medication_name": "阿司匹林",
      "status": "taken",
      "file_path": "data/medication-logs/2025-12/2025-12-31.json"
    }
  ]
}
```

## 年龄特异性预防保健数据结构

### 预防保健配置文件结构

**文件位置**: `data/preventive-care-protocols.json`

```json
{
  "metadata": {
    "version": "1.0",
    "created_at": "2025-01-05T00:00:00.000Z",
    "last_updated": "2025-01-05T00:00:00.000Z",
    "description": "年龄特异性预防保健方案配置文件"
  },

  "age_groups": {
    "young_adult": {
      "name": "青年成人（18-39岁）",
      "age_range": [18, 39],
      "description": "青年成人预防保健方案"
    },
    "middle_age": {
      "name": "中年（40-49岁）",
      "age_range": [40, 49],
      "description": "中年预防保健方案"
    },
    "pre_senior": {
      "name": "老年前期（50-64岁）",
      "age_range": [50, 64],
      "description": "老年前期预防保健方案"
    },
    "senior": {
      "name": "老年人（65岁以上）",
      "age_range": [65, 120],
      "description": "老年人预防保健方案"
    }
  },

  "screening_protocols": {
    "cardiovascular": {
      "name": "心血管筛查",
      "screenings": {
        "blood_pressure": {
          "name": "血压检查",
          "age_specific_recommendations": {
            "young_adult": {
              "recommendation": "annual",
              "frequency": "每年",
              "base_interval_years": 1
            }
          },
          "risk_adjustments": {
            "family_history_cad": {
              "multiplier": 0.5,
              "description": "冠心病家族史：筛查频率加倍"
            },
            "hypertension": {
              "multiplier": 0.25,
              "description": "已确诊高血压：每季度检查"
            }
          }
        }
      }
    }
  }
}
```

### 字段说明

**metadata**: 元数据对象
- `version`: 配置版本号
- `created_at`: 创建时间
- `last_updated`: 最后更新时间
- `description`: 描述

**age_groups**: 年龄组定义
- `young_adult`: 青年成人（18-39岁）
- `middle_age`: 中年（40-49岁）
- `pre_senior`: 老年前期（50-64岁）
- `senior`: 老年人（65岁以上）

每个年龄组包含：
- `name`: 显示名称
- `age_range`: 年龄范围数组 [最小值, 最大值]
- `description`: 描述

**screening_protocols**: 筛查方案配置
- `cardiovascular`: 心血管筛查
- `cancer_screening`: 癌症筛查
- `immunizations`: 免疫接种
- `other_screenings`: 其他筛查

每个筛查项目包含：
- `name`: 筛查项目名称
- `description`: 描述
- `age_specific_recommendations`: 年龄特异性建议
  - `recommendation`: 推荐方案代码
  - `frequency`: 频率描述
  - `base_interval_years`: 基础间隔（年）
  - `start_age`: 开始年龄（如适用）
  - `stop_age`: 停止年龄（如适用）
  - `description`: 详细说明
- `risk_adjustments`: 风险调整（可选）
  - 风险因素名称作为键
  - `multiplier`: 间隔调整乘数（<1表示更频繁）
  - `description`: 调整说明
- `gender_specific`: 性别特异性（可选）
- `preparation`: 检查准备（可选）

### 预防保健记录数据结构

**文件位置**: `data/preventive-care.json`

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

### 字段说明

**metadata**: 元数据对象
- `version`: 版本号
- `created_at`: 创建时间
- `last_updated`: 最后更新时间

**patient_profile**: 患者档案
- `age`: 年龄（周岁）
- `gender`: 性别（male/female）
- `age_group`: 年龄组分类
- `risk_factors`: 危险因素列表
- `risk_factors_details`: 危险因素详细信息
  - 各危险因素的具体信息（诊断日期、严重程度等）

**screening_records**: 筛查记录
- `cardiovascular`: 心血管筛查记录
- `cancer_screening`: 癌症筛查记录
- `immunizations`: 疫苗接种记录
- `other_screenings`: 其他筛查记录

每个筛查项目包含：
- `screening_id`: 筛查记录唯一标识
- `last_screened`: 最近检查日期（YYYY-MM-DD格式，如未检查则为null）
- `never_done`: 是否从未检查（布尔值）
- `result`: 检查结果对象（如已检查）
  - 具体结果值根据检查类型而定
  - `classification`: 结果分类（normal/abnormal等）
  - `at_goal`: 是否达标（如适用）
- `trend`: 趋势（improving/stable/worsening，如适用）
- `next_due`: 下次检查应到期日期（YYYY-MM-DD格式）
- `overdue`: 是否过期（布尔值）
- `urgency`: 紧急程度（overdue/due_soon/routine）
- `history`: 历史记录数组（可选）

**compliance_tracking**: 依从性追踪
- `total_screenings`: 总筛查项目数
- `up_to_date_count`: 按时完成的数量
- `due_soon_count`: 即将到期的数量
- `overdue_count`: 过期的数量
- `never_done_count`: 从未做的数量
- `compliance_rate`: 依从率（0-1）
- `category_breakdown`: 按类别分解的依从性统计

**risk_assessment**: 风险评估
- `ascvd_10yr_risk`: ASCVD 10年风险（0-1）
- `risk_category`: 风险分类（low/moderate/high/very_high）
- `risk_factors_count`: 危险因素总数
- `modifiable_risk_factors`: 可改变的危险因素数
- `intervention_potential`: 干预潜力（high/moderate/low）

### 筛查间隔计算规则

**基础间隔**: 根据年龄组从预防保健方案配置中获取

**风险调整**:
```javascript
adjusted_interval = base_interval × risk_multiplier
```

风险乘数示例：
- `0.25`: 间隔缩短为1/4（如每年→每季度）
- `0.5`: 间隔缩短为1/2（如每5年→每2.5年）
- `1.0`: 无调整
- `2.0`: 间隔延长为2倍

多个风险因素时取最小间隔：
```javascript
final_interval = min(all_adjusted_intervals)
```

**最小间隔限制**: 最短间隔不低于0.25年（3个月）

### 参考值范围

**血压分类**:
- `normal`: <120/80 mmHg
- `elevated`: 120-129/<80 mmHg
- `hypertension_stage_1`: 130-139/80-89 mmHg
- `hypertension_stage_2`: ≥140/≥90 mmHg
- `target_general`: <130/80 mmHg
- `target_diabetes_ckd`: <130/80 mmHg
- `target_over_65`: <140/90 mmHg

**血脂分类**:
- `total_cholesterol`: 正常<200，边缘升高200-239，升高≥240 mg/dL
- `ldl`: 最优<100，近乎正常100-129，边缘升高130-159，升高160-189，很高≥190 mg/dL
- `hdl`: 低（男）<40，低（女）<50 mg/dL
- `triglycerides`: 正常<150，边缘升高150-199，升高200-499，很高≥500 mg/dL

**血糖分类**:
- `fasting_glucose`: 正常<100，糖尿病前期100-125，糖尿病≥126 mg/dL
- `hba1c`: 正常<5.7%，糖尿病前期5.7-6.4%，糖尿病≥6.5%

**PSA分类**:
- `normal`: <4.0 ng/mL
- `borderline`: 4.0-10.0 ng/mL
- `high`: >10.0 ng/mL

### 使用示例

**查看预防保健状态**:
```
/preventive status
```

**更新筛查结果**:
```
/preventive update 血压 2025-03-15 125/82
/preventive update 血脂 2025-06-20 总胆固醇220 LDL155
```

**查看即将到期的筛查**:
```
/preventive due 90
```

**获取个性化建议**:
```
/preventive recommendations
```

**风险分层分析**:
```
/preventive risk
```



## 慢性病质量指标数据结构

### 慢性病档案数据结构

**文件位置**: `data/chronic-diseases.json`

慢性病质量指标管理系统存储高血压、糖尿病等慢性病的诊断信息、治疗方案、质量指标和并发症筛查记录。

主要包含：
- **patient_profile**: 患者慢性病诊断和合并症信息
- **hypertension_management**: 高血压管理数据（如确诊）
- **diabetes_management**: 糖尿病管理数据（如确诊）
- **complication_screening**: 并发症筛查记录
- **quality_assessment_history**: 质量评估历史
- **lifestyle_factors**: 生活方式因素

### 字段说明

**patient_profile**:
- `chronic_conditions`: 慢性病列表数组
  - `condition_id`: 疾病唯一标识符
  - `condition_type`: 疾病类型（hypertension/diabetes等）
  - `diagnosis_date`: 诊断日期
  - `severity_at_diagnosis`: 诊断时严重程度
  - `current_status`: 当前状态
  
- `comorbidities`: 合并症列表
  - 支持糖尿病、慢性肾病、冠心病、心衰、房颤、血脂异常

**hypertension_management**:
- `target_bp`: 个性化血压目标
  - `systolic_max/diastolic_max`: 目标值上限
  - `target_type`: 目标类型（standard/elderly/diabetes_ckd/pregnancy）
  
- `quality_metrics`: 质量指标
  - `goal_attainment_rate`: 达标率（0-1）
  - `grade`: 质量等级（A-F）
  - `current_classification`: 当前血压分类
  - `trend_analysis`: 趋势分析（improving/stable/worsening）
  - `variability`: 血压变异性评估
  - `home_monitoring_adherence`: 家庭监测依从性

**diabetes_management**:
- `target_hba1c`: 糖化血红蛋白目标
  - `target_value`: 目标值
  - `target_type`: 目标类型（strict/standard/lenient）
  
- `quality_metrics`: 糖尿病质量指标
  - `average_hba1c`: 平均HbA1c
  - `glucose_control`: 血糖控制情况
  - `hypoglycemia_episodes`: 低血糖发作记录

## 生命体征日志数据结构

### 血压日志

**文件位置**: `data/vital-signs-logs/YYYY-MM/YYYY-MM-DD.json`

```json
{
  "date": "2025-01-05",
  "readings": [
    {
      "id": "bp_2025010508000001",
      "type": "blood_pressure",
      "timestamp": "2025-01-05T08:15:00",
      "systolic": 128,
      "diastolic": 82,
      "pulse": 72,
      "measurement_context": "home",
      "position": "seated",
      "arm": "left",
      "notes": ""
    }
  ]
}
```

**字段说明**:
- `systolic/diastolic`: 收缩压/舒张压（mmHg）
- `pulse`: 脉率（次/分钟，可选）
- `measurement_context`: 测量环境（home/clinic）
- `position`: 体位（seated/standing/supine）
- `arm`: 测量手臂（left/right）

### 血糖日志

```json
{
  "date": "2025-01-05",
  "readings": [
    {
      "id": "glucose_2025010507000001",
      "type": "blood_glucose",
      "timestamp": "2025-01-05T07:30:00",
      "glucose_value": 5.8,
      "unit": "mmol/L",
      "timing": "fasting",
      "meal_related": true
    }
  ]
}
```

**字段说明**:
- `glucose_value`: 血糖值
- `unit`: 单位（mmol/L 或 mg/dL）
- `timing`: 测量时机（fasting/preprandial/postprandial/bedtime）
- `time_after_meal`: 餐后时间（分钟，postprandial时）

## 质量等级标准

### 血压控制质量
- **A（优秀）**: ≥90% 读数达标
- **B（良好）**: ≥80% 读数达标
- **C（中等）**: ≥70% 读数达标
- **D（较差）**: ≥60% 读数达标
- **F（差）**: <60% 读数达标

### 血糖控制质量
- **A（优秀）**: ≥90% 读数在目标范围内
- **B（良好）**: ≥80% 读数在目标范围内
- **C（中等）**: ≥70% 读数在目标范围内
- **D（较差）**: ≥60% 读数在目标范围内
- **F（差）**: <60% 读数在目标范围内

## 个性化目标

### 血压目标
| 目标类型 | 收缩压 | 舒张压 | 适用人群 |
|---------|--------|--------|---------|
| standard | <130 | <80 | 一般成人（<65岁）|
| elderly | <140 | <90 | ≥65岁老年人 |
| diabetes_ckd | <130 | <80 | 糖尿病或CKD |
| pregnancy | <140 | <90 | 孕期妇女 |

### HbA1c目标
| 目标类型 | 目标值 | 适用人群 |
|---------|--------|---------|
| strict | <6.5% | 年轻、无并发症 |
| standard | <7.0% | 一般成人 |
| lenient | <8.0% | 老年、有严重低血糖史 |

## 使用示例

**查看血压质量指标**:
```
/quality hypertension status
```

**记录家庭血压测量**:
```
/vitals bp 128/82 早上
```

**查看并发症筛查状态**:
```
/quality complications hypertension
```

**获取个性化建议**:
```
/quality recommendations
```

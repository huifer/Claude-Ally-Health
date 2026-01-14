# 科学运动健康减肥模块 - 详细设计文档

**模块编号**: 24
**创建日期**: 2025-01-14
**设计版本**: v1.0
**状态**: 设计完成，待实现

---

## 目录

1. [概述](#概述)
2. [整体架构](#整体架构)
3. [数据结构设计](#数据结构设计)
4. [命令接口设计](#命令接口设计)
5. [Python脚本扩展](#python脚本扩展)
6. [健康报告集成](#健康报告集成)
7. [错误处理与安全](#错误处理与安全)
8. [实现路线图](#实现路线图)

---

## 概述

### 设计目标

科学运动健康减肥模块采用**跨模块集成架构**，基于现有的 `fitness-tracker.json` 和 `nutrition-tracker.json` 扩展减肥专用功能，实现：

- 身体成分分析（体重、体脂、肌肉、围度）
- 基础代谢率计算（BMR/TDEE，多种公式）
- 能量缺口管理（科学热量控制）
- 减肥阶段管理（减重期/平台期/维持期）
- 饮食与运动平衡
- 防止反弹策略

### 设计原则

| 原则 | 说明 |
|-----|------|
| 集成优先 | 复用现有 fitness/nutrition 模块，避免重复造轮子 |
| 科学安全 | 遵循营养学和运动科学原理，设置安全底线 |
| 渐进实现 | 先搭框架再填充功能，确保架构一致性 |
| 可视化友好 | 集成健康报告，提供直观的图表展示 |

---

## 整体架构

### 跨模块集成架构

```
┌─────────────────────────────────────────────────────────┐
│                   减肥模块 (Weight Loss)                  │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────────────┐      ┌──────────────────────┐ │
│  │ /fitness:weightloss-* │      │ /nutrition:weightloss-*││
│  │                      │      │                      │ │
│  │ • body-composition   │      │ • deficit           │ │
│  │ • bmr/tdee           │◄────►│ • meal              │ │
│  │ • phase              │      │ • target            │ │
│  │ • progress           │      │ • balance           │ │
│  └──────────┬───────────┘      └──────────┬───────────┘ │
│             │                             │             │
│             └──────────┬──────────────────┘             │
│                        ▼                                │
│         ┌──────────────────────────┐                    │
│         │  fitness-tracker.json     │                    │
│         │  nutrition-tracker.json   │                    │
│         └──────────────────────────┘                    │
└─────────────────────────────────────────────────────────┘
```

### 数据层架构

**fitness-tracker.json 扩展内容**：
- `weight_loss_program.body_composition` - 身体成分记录
- `weight_loss_program.metabolic_profile` - 代谢率数据
- `weight_loss_program.phase_management` - 阶段管理
- `weight_loss_program.exercise_prescription` - 运动处方

**nutrition-tracker.json 扩展内容**：
- `weight_loss_energy` - 能量缺口追踪
- `weight_loss_meal_plan` - 减肥饮食计划
- `intermittent_fasting` - 间歇性禁食设置

---

## 数据结构设计

### fitness-tracker.json 扩展

```json
{
  "fitness_tracking": {
    "weight_loss_program": {
      "active": false,
      "start_date": null,

      "body_composition": {
        "current": {
          "date": "2025-01-15",
          "weight_kg": 75.5,
          "height_cm": 170,
          "body_fat_percentage": 28.5,
          "muscle_mass_kg": 32.5,
          "waist_cm": 92,
          "hip_cm": 98,
          "thigh_cm": 58,
          "arm_cm": 32
        },
        "history": [
          {
            "date": "2025-01-01",
            "weight_kg": 78.0,
            "body_fat_percentage": 30.0,
            "waist_cm": 95
          }
        ],
        "goals": {
          "target_weight_kg": 68.0,
          "target_body_fat_percentage": 20,
          "target_waist_cm": 85,
          "timeline_months": 6
        },
        "analysis": {
          "bmi": 26.1,
          "bmi_category": "overweight",
          "ideal_weight": 63.6,
          "weight_to_lose": 7.5,
          "waist_hip_ratio": 0.94,
          "abdominal_obesity": true
        }
      },

      "metabolic_profile": {
        "personal_info": {
          "gender": "male",
          "age": 35,
          "height_cm": 170,
          "weight_kg": 75.5,
          "body_fat_percentage": 28.5
        },
        "bmr_calculations": {
          "harris_benedict": {
            "bmr": 1728,
            "formula": "original_1919"
          },
          "mifflin_st_jeor": {
            "bmr": 1650,
            "formula": "recommended",
            "used": true
          },
          "katch_mcardle": {
            "lean_body_mass_kg": 54.0,
            "bmr": 1536,
            "formula": "based_on_lean_mass"
          }
        },
        "activity_level": {
          "current": "moderate",
          "factor": 1.55,
          "description": "每周3-5天中度运动"
        },
        "tdee": {
          "calories": 2558,
          "calculation": "BMR_1650 × 1.55",
          "breakdown": {
            "bmr_percent": 65,
            "exercise_percent": 20,
            "neat_percent": 15
          }
        },
        "last_calculated": "2025-01-15"
      },

      "phase_management": {
        "current_phase": "weight_loss",
        "phase_start_date": "2025-01-01",
        "phases": {
          "weight_loss": {
            "start_date": "2025-01-01",
            "target_weight_loss_kg": 10,
            "actual_weight_loss_kg": 2.5,
            "progress": 0.25,
            "status": "on_track"
          },
          "plateau": {
            "occurrences": 0,
            "current_plateau": false,
            "breakthrough_methods": []
          },
          "maintenance": {
            "start_date": null,
            "goal_weight": 68.0,
            "allowable_range_kg": 2.0
          }
        },
        "milestones": [
          {
            "title": "减重2.5公斤",
            "target_value": 72.5,
            "achieved_date": null,
            "achieved": false
          }
        ]
      },

      "exercise_prescription": {
        "goals": ["fat_loss", "muscle_preservation"],
        "fitness_level": "intermediate",

        "cardio_prescription": {
          "frequency": "5_days_per_week",
          "sessions": [
            {
              "day": "monday",
              "type": "running",
              "duration_minutes": 45,
              "intensity": "moderate"
            },
            {
              "day": "saturday",
              "type": "hiit",
              "duration_minutes": 20,
              "intensity": "high"
            }
          ]
        },

        "strength_prescription": {
          "frequency": "3_days_per_week",
          "split": "full_body",
          "exercises": [
            {
              "name": "goblet_squat",
              "sets": 3,
              "reps": "12-15"
            },
            {
              "name": "push_up",
              "sets": 3,
              "reps": "8-12"
            }
          ]
        }
      }
    }
  }
}
```

### nutrition-tracker.json 扩展

```json
{
  "nutrition_tracking": {
    "weight_loss_energy": {
      "calorie_target": 2058,
      "deficit_target": 500,

      "daily_tracking": {
        "date": "2025-01-15",
        "intake_calories": 1980,
        "exercise_burn": 400,
        "neat_burn": 300,
        "deficit_achieved": 520,
        "deficit_target_met": true
      },

      "daily_history": [],

      "weekly_summary": {
        "week_start": "2025-01-13",
        "avg_intake": 2030,
        "avg_burn": 2510,
        "avg_deficit": 480,
        "days_on_target": 5,
        "days_off_target": 2,
        "estimated_weight_loss_kg": 0.44
      },

      "macros_target": {
        "protein": {
          "grams": 154,
          "calories": 616,
          "percentage": 30
        },
        "carbs": {
          "grams": 206,
          "calories": 824,
          "percentage": 40
        },
        "fat": {
          "grams": 68,
          "calories": 618,
          "percentage": 30
        }
      },

      "intermittent_fasting": {
        "enabled": false,
        "method": "16_8",
        "eating_window_start": "12:00",
        "eating_window_end": "20:00",
        "fasting_window_start": "20:00",
        "fasting_window_end": "12:00"
      }
    },

    "weight_loss_meal_plan": {
      "approach": "balanced_deficit",
      "meals_per_day": 4,
      "timing": ["08:00", "12:00", "16:00", "20:00"],

      "structure": {
        "breakfast": {
          "calories": 450,
          "protein": 30,
          "carbs": 50,
          "fat": 15,
          "example": "鸡蛋2个 + 燕麦50g + 牛奶250ml"
        },
        "lunch": {
          "calories": 600,
          "protein": 40,
          "carbs": 60,
          "fat": 20,
          "example": "鸡胸肉150g + 糙米150g + 蔬菜200g"
        },
        "snack": {
          "calories": 200,
          "protein": 15,
          "carbs": 15,
          "fat": 10,
          "example": "希腊酸奶100g + 坚果20g"
        },
        "dinner": {
          "calories": 550,
          "protein": 45,
          "carbs": 45,
          "fat": 18,
          "example": "鱼肉150g + 红薯150g + 蔬菜200g"
        }
      }
    }
  }
}
```

---

## 命令接口设计

### /fitness 模块命令

```bash
# 身体成分记录
/fitness:weightloss-record weight 75.5           # 记录体重(kg)
/fitness:weightloss-record body-fat 28.5%        # 记录体脂率
/fitness:weightloss-record muscle 32.5kg         # 记录肌肉量
/fitness:weightloss-record waist 92              # 记录腰围(cm)
/fitness:weightloss-record hip 98                # 记录臀围(cm)

# 身体成分分析
/fitness:weightloss-body                         # 完整身体成分分析
/fitness:weightless-trend weight                 # 体重趋势分析
/fitness:weightloss-trend body-fat               # 体脂趋势分析
/fitness:weightloss-progress                     # 减肥进度报告

# 代谢率计算
/fitness:weightloss-bmr                          # 计算BMR（显示多种公式）
/fitness:weightloss-tdee                         # 计算TDEE
/fitness:weightloss-activity moderate            # 设置活动水平
# 活动水平选项: sedentary, light, moderate, active, very_active

# 阶段管理
/fitness:weightloss-phase weight-loss            # 设置为减重期
/fitness:weightloss-phase plateau                # 标记进入平台期
/fitness:weightloss-phase breakdown <method>     # 记录突破方法
/fitness:weightloss-maintenance start            # 进入维持期
/fitness:weightloss-maintenance weight 68.0      # 设定维持体重

# 运动处方
/fitness:weightloss-exercise plan                # 生成运动处方
/fitness:weightloss-exercise schedule            # 查看运动日程
```

### /nutrition 模块命令

```bash
# 能量缺口追踪
/nutrition:weightloss-deficit                    # 查看今日能量缺口
/nutrition:weightloss-target                     # 查看热量目标
/nutrition:weightloss-balance                    # 能量平衡报告
/nutrition:weightloss-estimate-loss              # 估算减重

# 饮食记录
/nutrition:weightloss-meal breakfast 450         # 记录早餐热量
/nutrition:weightloss-meal dinner 600            # 记录晚餐热量
/nutrition:weightloss-intake 1980                # 记录全天摄入
/nutrition:weightloss-protein                    # 蛋白质摄入分析
/nutrition:weightloss-adherence                  # 饮食依从性分析

# 间歇性禁食
/nutrition:weightloss-if 16-8                    # 启用16:8禁食
/nutrition:weightloss-if 5-2                     # 启用5:2禁食
/nutrition:weightloss-if window 12:00-20:00      # 设置进食窗口
/nutrition:weightloss-if disable                 # 禁用间歇性禁食
```

### 跨模块组合命令

```bash
# 综合分析（读取两个文件）
/fitness:weightloss-comprehensive                # 综合减肥报告
# 或简写
/wl:report                                      # 减肥综合报告

# 里程碑记录
/fitness:weightloss-milestone 5kg new-clothes    # 记录里程碑
/fitness:weightloss-milestones list              # 查看所有里程碑
```

---

## Python脚本扩展

### 创建 weightloss_calculations.py

**文件路径**: `scripts/weightloss_calculations.py

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
科学减肥计算模块
提供BMR、TDEE、身体成分、能量缺口等科学计算
"""

from typing import Dict, Any, Tuple, Optional
from datetime import date, datetime
import json


# ==================== 常量定义 ====================

# 身体数据验证范围
VALID_WEIGHT_RANGE = (30, 300)  # kg
VALID_HEIGHT_RANGE = (100, 250)  # cm
VALID_BODY_FAT_RANGE = (3, 50)   # %
VALID_WAIST_RANGE = (50, 150)    # cm

# 活动系数
ACTIVITY_FACTORS = {
    "sedentary": 1.2,      # 久坐不动
    "light": 1.375,        # 轻度活动
    "moderate": 1.55,      # 中度活动
    "active": 1.725,       # 高度活动
    "very_active": 1.9     # 极度活动
}

# 体脂率标准
BODY_FAT_STANDARDS = {
    "male": {
        "essential": (2, 5),
        "athletic": (6, 13),
        "fitness": (14, 17),
        "average": (18, 24),
        "obese": (25, None)
    },
    "female": {
        "essential": (10, 13),
        "athletic": (14, 20),
        "fitness": (21, 24),
        "average": (25, 31),
        "obese": (32, None)
    }
}

# 能量缺口标准 (7700大卡 = 1kg脂肪)
CALORIES_PER_KG_FAT = 7700


# ==================== BMR计算公式 ====================

def calculate_bmr_harris_benedict(
    gender: str,
    weight_kg: float,
    height_cm: float,
    age: int
) -> int:
    """
    Harris-Benedict 原始公式 (1919)

    男性: BMR = 88.362 + (13.397 × 体重) + (4.799 × 身高) - (5.677 × 年龄)
    女性: BMR = 447.593 + (9.247 × 体重) + (3.098 × 身高) - (4.330 × 年龄)
    """
    if gender.lower() == "male":
        bmr = 88.362 + (13.397 * weight_kg) + (4.799 * height_cm) - (5.677 * age)
    else:
        bmr = 447.593 + (9.247 * weight_kg) + (3.098 * height_cm) - (4.330 * age)
    return int(bmr)


def calculate_bmr_mifflin_st_jeor(
    gender: str,
    weight_kg: float,
    height_cm: float,
    age: int
) -> int:
    """
    Mifflin-St Jeor 公式 (推荐，更准确)

    男性: BMR = (10 × 体重) + (6.25 × 身高) - (5 × 年龄) + 5
    女性: BMR = (10 × 体重) + (6.25 × 身高) - (5 × 年龄) - 161
    """
    if gender.lower() == "male":
        bmr = (10 * weight_kg) + (6.25 * height_cm) - (5 * age) + 5
    else:
        bmr = (10 * weight_kg) + (6.25 * height_cm) - (5 * age) - 161
    return int(bmr)


def calculate_bmr_katch_mcardle(
    weight_kg: float,
    body_fat_percentage: float
) -> int:
    """
    Katch-McArdle 公式 (基于去脂体重)

    BMR = 370 + (21.6 × 去脂体重kg)
    """
    lean_mass_kg = weight_kg * (1 - body_fat_percentage / 100)
    bmr = 370 + (21.6 * lean_mass_kg)
    return int(bmr)


def calculate_all_bmr(
    gender: str,
    weight_kg: float,
    height_cm: float,
    age: int,
    body_fat_percentage: Optional[float] = None
) -> Dict[str, Any]:
    """计算所有BMR公式，返回对比结果"""
    results = {
        "harris_benedict": {
            "bmr": calculate_bmr_harris_benedict(gender, weight_kg, height_cm, age),
            "formula": "original_1919"
        },
        "mifflin_st_jeor": {
            "bmr": calculate_bmr_mifflin_st_jeor(gender, weight_kg, height_cm, age),
            "formula": "recommended",
            "used": True
        }
    }

    if body_fat_percentage is not None:
        results["katch_mcardle"] = {
            "bmr": calculate_bmr_katch_mcardle(weight_kg, body_fat_percentage),
            "formula": "based_on_lean_mass",
            "lean_body_mass_kg": round(weight_kg * (1 - body_fat_percentage / 100), 1)
        }

    return results


def calculate_tdee(bmr: int, activity_level: str) -> int:
    """计算每日总能量消耗 (TDEE)"""
    factor = ACTIVITY_FACTORS.get(activity_level, 1.2)
    return int(bmr * factor)


# ==================== 身体成分分析 ====================

def calculate_bmi(weight_kg: float, height_cm: float) -> float:
    """计算身体质量指数 BMI"""
    height_m = height_cm / 100
    return round(weight_kg / (height_m ** 2), 1)


def get_bmi_category(bmi: float) -> str:
    """获取BMI分类 (亚洲标准)"""
    if bmi < 18.5:
        return "underweight"
    elif bmi < 24:
        return "normal"
    elif bmi < 28:
        return "overweight"
    else:
        return "obese"


def calculate_ideal_weight(height_cm: float) -> float:
    """计算理想体重 (亚洲标准 BMI=22)"""
    height_m = height_cm / 100
    return round(height_m ** 2 * 22, 1)


def calculate_waist_hip_ratio(waist_cm: float, hip_cm: float) -> float:
    """计算腰臀比"""
    return round(waist_cm / hip_cm, 2)


def has_abdominal_obesity(gender: str, waist_cm: float) -> bool:
    """判断是否有腹型肥胖"""
    if gender.lower() == "male":
        return waist_cm > 90
    else:
        return waist_cm > 85


def get_body_fat_category(gender: str, body_fat_pct: float) -> str:
    """获取体脂率分类"""
    standards = BODY_FAT_STANDARDS.get(gender.lower(), BODY_FAT_STANDARDS["male"])

    for category, (low, high) in standards.items():
        if high is None:
            if body_fat_pct >= low:
                return category
        elif low <= body_fat_pct <= high:
            return category

    return "obese"


# ==================== 能量缺口计算 ====================

def calculate_deficit(
    intake_calories: int,
    bmr: int,
    exercise_burn: int = 0,
    neat_burn: int = 0,
    tef_factor: float = 0.1
) -> Dict[str, Any]:
    """
    计算能量缺口

    能量摄入 < 能量消耗 = 减重
    能量消耗 = BMR + 运动 + NEAT + 食物热效应(TEF)
    """
    tef = int(intake_calories * tef_factor)
    total_expenditure = bmr + exercise_burn + neat_burn + tef
    deficit = total_expenditure - intake_calories

    return {
        "intake": intake_calories,
        "expenditure": {
            "bmr": bmr,
            "exercise": exercise_burn,
            "neat": neat_burn,
            "tef": tef,
            "total": total_expenditure
        },
        "deficit": deficit if deficit > 0 else 0,
        "surplus": -deficit if deficit < 0 else 0
    }


def estimate_weight_loss(
    deficit_calories: int,
    days: int = 7
) -> float:
    """
    估算减重量

    减重1kg脂肪需要消耗约7700大卡
    """
    total_deficit = deficit_calories * days
    weight_loss_kg = total_deficit / CALORIES_PER_KG_FAT
    return round(weight_loss_kg, 2)


def calculate_macros(
    target_calories: int,
    protein_pct: float = 0.30,
    carbs_pct: float = 0.40,
    fat_pct: float = 0.30
) -> Dict[str, Dict[str, Any]]:
    """计算宏量营养素分配"""
    protein_cals = int(target_calories * protein_pct)
    carbs_cals = int(target_calories * carbs_pct)
    fat_cals = int(target_calories * fat_pct)

    return {
        "protein": {
            "grams": round(protein_cals / 4),
            "calories": protein_cals,
            "percentage": int(protein_pct * 100)
        },
        "carbs": {
            "grams": round(carbs_cals / 4),
            "calories": carbs_cals,
            "percentage": int(carbs_pct * 100)
        },
        "fat": {
            "grams": round(fat_cals / 9),
            "calories": fat_cals,
            "percentage": int(fat_pct * 100)
        }
    }


# ==================== 阶段管理 ====================

def detect_plateau(
    weight_history: list,
    weeks: int = 2,
    threshold_kg: float = 0.5
) -> Dict[str, Any]:
    """
    检测是否进入平台期

    判断标准：指定周数内体重变化小于阈值
    """
    if len(weight_history) < weeks:
        return {"in_plateau": False, "reason": "数据不足"}

    recent = weight_history[-weeks:]
    weights = [w.get("weight", 0) for w in recent]

    weight_change = abs(weights[-1] - weights[0])

    if weight_change < threshold_kg:
        return {
            "in_plateau": True,
            "duration_weeks": weeks,
            "weight_change_kg": round(weight_change, 2),
            "recent_weights": weights
        }

    return {"in_plateau": False, "weight_change_kg": round(weight_change, 2)}


def suggest_plateau_breakthrough(
    plateau_duration_weeks: int
) -> list:
    """根据平台期时长建议突破方法"""
    suggestions = []

    if plateau_duration_weeks <= 2:
        suggestions = [
            "继续坚持，不要放弃",
            "检查饮食记录是否准确",
            "增加NEAT（日常活动）"
        ]
    elif plateau_duration_weeks <= 4:
        suggestions = [
            "调整热量：再减少100-200大卡",
            "增加有氧运动时间10-15分钟",
            "尝试新的运动类型刺激代谢"
        ]
    else:
        suggestions = [
            "考虑饮食假期（维持热量1-2周）",
            "尝试碳水循环法",
            "尝试间歇性禁食（16:8）",
            "建议咨询营养师"
        ]

    return suggestions


# ==================== 安全验证 ====================

def validate_calorie_target(
    target_calories: int,
    bmr: int,
    gender: str
) -> Dict[str, Any]:
    """验证热量目标是否安全"""
    minimum_safe = int(bmr * 1.2)

    result = {"safe": True, "warnings": []}

    if target_calories < minimum_safe:
        result["safe"] = False
        result["minimum"] = minimum_safe
        result["warnings"].append(
            f"热量目标({target_calories})低于安全底线({minimum_safe})，"
            "可能影响代谢健康"
        )

    gender_minimum = 1200 if gender.lower() == "female" else 1500
    if target_calories < gender_minimum:
        result["warnings"].append(
            f"热量目标低于{gender_minimum}大卡的最低推荐值"
        )

    return result


def validate_weight_loss_rate(
    weight_loss_kg: float,
    weeks: int
) -> Dict[str, Any]:
    """验证减重速度是否安全"""
    weekly_rate = weight_loss_kg / weeks

    result = {"safe": True, "warnings": [], "weekly_rate": round(weekly_rate, 2)}

    if weekly_rate > 1.5:
        result["safe"] = False
        result["warnings"].append(
            f"减重速度({weekly_rate:.1f}kg/周)过快，需医生监督"
        )
    elif weekly_rate > 1.0:
        result["warnings"].append(
            f"减重速度({weekly_rate:.1f}kg/周)较快，建议控制在0.5-1kg/周"
        )

    return result


# ==================== 主分析函数 ====================

def analyze_body_composition(
    gender: str,
    age: int,
    height_cm: float,
    weight_kg: float,
    body_fat_percentage: Optional[float] = None,
    waist_cm: Optional[float] = None,
    hip_cm: Optional[float] = None
) -> Dict[str, Any]:
    """综合身体成分分析"""
    result = {
        "assessment_date": str(date.today()),
        "personal_info": {
            "gender": gender,
            "age": age,
            "height_cm": height_cm,
            "weight_kg": weight_kg
        }
    }

    # BMI分析
    bmi = calculate_bmi(weight_kg, height_cm)
    result["bmi"] = {
        "value": bmi,
        "category": get_bmi_category(bmi),
        "ideal_weight": calculate_ideal_weight(height_cm),
        "weight_to_lose": round(weight_kg - calculate_ideal_weight(height_cm), 1)
    }

    # 体脂分析
    if body_fat_percentage:
        result["body_fat"] = {
            "percentage": body_fat_percentage,
            "category": get_body_fat_category(gender, body_fat_percentage),
            "mass_kg": round(weight_kg * body_fat_percentage / 100, 1)
        }

    # 围度分析
    if waist_cm:
        waist_data = {"waist_cm": waist_cm}
        if hip_cm:
            waist_data["hip_cm"] = hip_cm
            waist_data["waist_hip_ratio"] = calculate_waist_hip_ratio(waist_cm, hip_cm)
        waist_data["abdominal_obesity"] = has_abdominal_obesity(gender, waist_cm)
        result["circumferences"] = waist_data

    return result


def analyze_metabolic_profile(
    gender: str,
    age: int,
    height_cm: float,
    weight_kg: float,
    activity_level: str = "moderate",
    body_fat_percentage: Optional[float] = None
) -> Dict[str, Any]:
    """综合代谢分析"""
    # 计算BMR
    bmr_results = calculate_all_bmr(
        gender, weight_kg, height_cm, age, body_fat_percentage
    )
    primary_bmr = bmr_results["mifflin_st_jeor"]["bmr"]

    # 计算TDEE
    tdee = calculate_tdee(primary_bmr, activity_level)

    result = {
        "assessment_date": str(date.today()),
        "personal_info": {
            "gender": gender,
            "age": age,
            "height_cm": height_cm,
            "weight_kg": weight_kg,
            "activity_level": activity_level
        },
        "bmr_calculations": bmr_results,
        "activity_level": {
            "current": activity_level,
            "factor": ACTIVITY_FACTORS[activity_level],
            "description": _get_activity_description(activity_level)
        },
        "tdee": {
            "calories": tdee,
            "calculation": f"BMR_{primary_bmr} × {ACTIVITY_FACTORS[activity_level]}"
        },
        "target_calories": {
            "weight_loss_maintenance": tdee,
            "mild_deficit_250": tdee - 250,
            "moderate_deficit_500": tdee - 500,
            "aggressive_deficit_750": tdee - 750,
            "recommended": tdee - 500
        }
    }

    return result


def _get_activity_description(level: str) -> str:
    """获取活动水平描述"""
    descriptions = {
        "sedentary": "久坐不动，几乎不运动",
        "light": "每周1-3天轻度运动",
        "moderate": "每周3-5天中度运动",
        "active": "每周6-7天高强度运动",
        "very_active": "体力劳动或每天训练"
    }
    return descriptions.get(level, "")


if __name__ == "__main__":
    # 测试代码
    print("=== 减肥计算模块测试 ===\n")

    # 示例：35岁男性，170cm，75.5kg，体脂28.5%
    gender, age = "male", 35
    height, weight = 170, 75.5
    body_fat = 28.5

    print("1. 身体成分分析:")
    body_analysis = analyze_body_composition(
        gender, age, height, weight, body_fat, waist_cm=92
    )
    print(json.dumps(body_analysis, indent=2, ensure_ascii=False))

    print("\n2. 代谢分析:")
    metabolic = analyze_metabolic_profile(
        gender, age, height, weight, "moderate", body_fat
    )
    print(json.dumps(metabolic, indent=2, ensure_ascii=False))

    print("\n3. 能量缺口分析:")
    deficit = calculate_deficit(intake_calories=1980, bmr=1650, exercise_burn=400, neat_burn=300)
    print(json.dumps(deficit, indent=2, ensure_ascii=False))
```

---

## 健康报告集成

### 报告章节结构

在 `generate_health_report.py` 中添加减肥章节：

```python
def generate_weight_loss_section(data: Dict) -> str:
    """生成减肥章节HTML"""

    html = '''
    <section id="weight-loss" class="mb-8">
        <div class="flex items-center gap-2 mb-4">
            <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
            <h2 class="text-xl font-bold text-gray-800">科学运动健康减肥</h2>
        </div>

        <!-- 身体成分概览 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="bg-white rounded-lg shadow p-4">
                <div class="text-sm text-gray-500">体重</div>
                <div class="text-2xl font-bold text-gray-800">75.5 kg</div>
                <div class="text-xs text-emerald-600 mt-1">目标: 68.0 kg</div>
                <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div class="bg-emerald-600 h-2 rounded-full" style="width: 35%"></div>
                </div>
            </div>
            <!-- 更多卡片... -->
        </div>

        <!-- 体重趋势图 -->
        <div class="bg-white rounded-lg shadow p-4 mb-6">
            <h3 class="text-lg font-semibold mb-4">体重变化趋势</h3>
            <canvas id="weightTrendChart" height="200"></canvas>
        </div>

        <!-- 能量缺口图 -->
        <div class="bg-white rounded-lg shadow p-4">
            <h3 class="text-lg font-semibold mb-4">能量缺口追踪</h3>
            <canvas id="deficitChart" height="200"></canvas>
        </div>
    </section>
    '''

    return html
```

### 图表配置

使用 Chart.js 绘制减肥相关图表：

```javascript
// 体重趋势图
const weightTrendCtx = document.getElementById('weightTrendChart').getContext('2d');
new Chart(weightTrendCtx, {
    type: 'line',
    data: {
        labels: ['1月1日', '1月8日', '1月15日'],
        datasets: [{
            label: '体重 (kg)',
            data: [78.0, 76.5, 75.5],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.4
        }]
    },
    options: {
        responsive: true,
        plugins: {
            annotation: {
                annotations: {
                    targetLine: {
                        type: 'line',
                        yMin: 68.0,
                        yMax: 68.0,
                        borderColor: '#f59e0b',
                        borderDash: [5, 5],
                        label: { display: true, content: '目标' }
                    }
                }
            }
        }
    }
});
```

---

## 错误处理与安全

### 数据验证规则

```python
VALID_WEIGHT_RANGE = (30, 300)  # kg
VALID_HEIGHT_RANGE = (100, 250)  # cm
VALID_BODY_FAT_RANGE = (3, 50)   # %
VALID_WAIST_RANGE = (50, 150)    # cm
```

### 安全边界检查

| 检查项 | 安全阈值 | 处理方式 |
|-------|---------|---------|
| 最低热量 | BMR × 1.2 | 警告并拒绝 |
| 减重速度 | ≤1.5 kg/周 | 警告 |
| 最低体脂 | 男≥15%, 女≥20% | 警告 |
| 最低BMI | ≥21 | 警告 |

### 医学免责声明

每次输出减肥相关分析时，自动添加：

```
⚠️ 免责声明：本工具提供的减肥建议基于一般科学原理，
不构成医疗诊断或处方。极端减重、进食障碍、肥胖相关
疾病请咨询专业医师。
```

---

## 实现路线图

### 阶段0：框架搭建

| 任务 | 文件 | 说明 |
|-----|------|------|
| 扩展 fitness-tracker.json | `data-example/` | 添加 weight_loss_program 结构 |
| 扩展 nutrition-tracker.json | `data-example/` | 添加 weight_loss_energy 结构 |
| 更新真实数据文件 | `data/` | 同步更新用户数据文件 |
| 创建结构验证测试 | `scripts/test-weightloss.sh` | 验证数据结构完整性 |

### 阶段1：核心计算

| 任务 | 文件 | 说明 |
|-----|------|------|
| 创建计算模块 | `scripts/weightloss_calculations.py` | BMR/TDEE/身体成分计算 |
| 实现BMR计算 | 上述文件 | 3种公式（Harris-Benedict, Mifflin-St Jeor, Katch-McArdle） |
| 实现身体成分分析 | 上述文件 | BMI、体脂评估、围度分析 |
| 实现能量缺口计算 | 上述文件 | 摄入vs消耗、减重估算 |
| 扩展测试脚本 | `scripts/test-weightloss.sh` | 验证计算准确性 |

### 阶段2：命令接口

| 任务 | 文件 | 说明 |
|-----|------|------|
| 实现 fitness 命令 | `/fitness:weightloss-*` | 身体成分、BMR、阶段管理 |
| 实现 nutrition 命令 | `/nutrition:weightloss-*` | 能量缺口、饮食记录 |
| 添加数据持久化 | 各模块处理函数 | 读写JSON数据 |
| 实现趋势分析 | 计算模块 | 历史数据分析和可视化 |

### 阶段3：报告集成

| 任务 | 文件 | 说明 |
|-----|------|------|
| 扩展报告生成器 | `scripts/generate_health_report.py` | 添加减肥章节 |
| 创建HTML模板 | 上述文件内联 | 医疗风格布局 |
| 集成Chart.js | 上述文件内联 | 体重趋势、能量缺口图表 |
| 实现里程碑可视化 | 上述文件内联 | 进度条、里程碑标记 |

### 阶段4：高级功能（按需填充）

| 任务 | 优先级 | 说明 |
|-----|-------|------|
| 平台期检测与建议 | 中 | 自动识别并提供突破建议 |
| 间歇性禁食追踪 | 中 | 16:8、5:2 方法支持 |
| 运动处方生成 | 低 | FITT原则个性化方案 |
| 维持期预警系统 | 低 | 体重反弹提醒 |

---

## 附录

### 引用标准

- [中国肥胖症诊疗指南](https://www.csco.org.cn/)
- [AHA/ACC肥胖成人管理指南](https://www.heart.org/)
- [ACSM运动测试与处方指南](https://www.acsm.org/)
- [中国居民膳食指南](http://www.cnsoc.org/)

### 版本历史

| 版本 | 日期 | 说明 |
|-----|------|------|
| v1.0 | 2025-01-14 | 初始设计文档 |

---

**文档维护**: WellAlly Tech
**最后更新**: 2025-01-14

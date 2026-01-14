# 科学运动健康减肥模块 - 实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 扩展现有的 fitness-tracker.json 和 nutrition-tracker.json，添加科学减肥功能，包括身体成分分析、BMR/TDEE计算、能量缺口管理和减肥阶段追踪。

**Architecture:** 采用跨模块集成架构，在现有数据文件中添加减肥专用数据段，使用 `模块:功能` 格式的命令接口（如 `/fitness:weightloss-body`、`/nutrition:weightloss-deficit`），复用现有测试脚本模式。

**Tech Stack:** Python 3.6+、Bash、JSON、Chart.js、Tailwind CSS

---

## 项目结构

```
Claude-Ally-Health/
├── .claude/
│   ├── commands/
│   │   ├── fitness.md          # 扩展：添加 weightloss 命令
│   │   └── nutrition.md        # 扩展：添加 weightloss 命令
│   └── skills/
│       └── weightloss-analyzer/  # 新建：减肥分析技能
│           └── SKILL.md
├── scripts/
│   ├── weightloss_calculations.py  # 新建：核心计算模块
│   ├── test-weightloss.sh          # 新建：测试脚本
│   └── generate_health_report.py   # 修改：添加减肥章节
├── data-example/
│   ├── fitness-tracker.json    # 修改：添加 weight_loss_program
│   └── nutrition-tracker.json  # 修改：添加 weight_loss_energy
└── data/
    ├── fitness-tracker.json    # 修改：同步用户数据
    └── nutrition-tracker.json  # 修改：同步用户数据
```

---

## 任务概览

| 任务 | 描述 | 预计时间 |
|-----|------|---------|
| 任务1-5 | 阶段0：框架搭建（数据结构） | 30分钟 |
| 任务6-15 | 阶段1：核心计算模块 | 45分钟 |
| 任务16-25 | 阶段2：命令接口扩展 | 45分钟 |
| 任务26-35 | 阶段3：测试脚本 | 30分钟 |
| 任务36-40 | 阶段4：报告集成 | 30分钟 |

---

## 阶段0：框架搭建（数据结构）

### Task 1: 扩展 data-example/fitness-tracker.json

**Files:**
- Modify: `data-example/fitness-tracker.json`

**Step 1: 备份原文件**

```bash
cp data-example/fitness-tracker.json data-example/fitness-tracker.json.backup
```

**Step 2: 添加 weight_loss_program 结构**

在 `fitness_tracking` 对象中添加 `weight_loss_program` 字段：

```json
"weight_loss_program": {
  "active": false,
  "start_date": null,

  "body_composition": {
    "current": {
      "date": null,
      "weight_kg": null,
      "height_cm": null,
      "body_fat_percentage": null,
      "muscle_mass_kg": null,
      "waist_cm": null,
      "hip_cm": null,
      "thigh_cm": null,
      "arm_cm": null
    },
    "history": [],
    "goals": {
      "target_weight_kg": null,
      "target_body_fat_percentage": null,
      "target_waist_cm": null,
      "timeline_months": null
    },
    "analysis": {
      "bmi": null,
      "bmi_category": null,
      "ideal_weight": null,
      "weight_to_lose": null,
      "waist_hip_ratio": null,
      "abdominal_obesity": null
    }
  },

  "metabolic_profile": {
    "personal_info": {
      "gender": null,
      "age": null,
      "height_cm": null,
      "weight_kg": null,
      "body_fat_percentage": null
    },
    "bmr_calculations": {
      "harris_benedict": {"bmr": null, "formula": "original_1919"},
      "mifflin_st_jeor": {"bmr": null, "formula": "recommended", "used": true},
      "katch_mcardle": {"bmr": null, "formula": "based_on_lean_mass"}
    },
    "activity_level": {
      "current": "moderate",
      "factor": 1.55,
      "description": "每周3-5天中度运动"
    },
    "tdee": {
      "calories": null,
      "calculation": null,
      "breakdown": {
        "bmr_percent": 65,
        "exercise_percent": 20,
        "neat_percent": 15
      }
    },
    "last_calculated": null
  },

  "phase_management": {
    "current_phase": null,
    "phase_start_date": null,
    "phases": {
      "weight_loss": {
        "start_date": null,
        "target_weight_loss_kg": null,
        "actual_weight_loss_kg": null,
        "progress": null,
        "status": null
      },
      "plateau": {
        "occurrences": 0,
        "current_plateau": false,
        "breakthrough_methods": []
      },
      "maintenance": {
        "start_date": null,
        "goal_weight": null,
        "allowable_range_kg": 2.0
      }
    },
    "milestones": []
  }
}
```

**Step 3: 验证JSON格式**

```bash
jq . data-example/fitness-tracker.json > /dev/null
echo $?  # 应该输出 0
```

**Step 4: 提交**

```bash
git add data-example/fitness-tracker.json
git commit -m "feat: add weight_loss_program structure to fitness-tracker.json"
```

---

### Task 2: 扩展 data-example/nutrition-tracker.json

**Files:**
- Modify: `data-example/nutrition-tracker.json`

**Step 1: 备份原文件**

```bash
cp data-example/nutrition-tracker.json data-example/nutrition-tracker.json.backup
```

**Step 2: 添加 weight_loss_energy 结构**

在 `nutrition_tracking` 对象中添加 `weight_loss_energy` 字段：

```json
"weight_loss_energy": {
  "calorie_target": null,
  "deficit_target": null,

  "daily_tracking": {
    "date": null,
    "intake_calories": null,
    "exercise_burn": null,
    "neat_burn": null,
    "deficit_achieved": null,
    "deficit_target_met": null
  },

  "daily_history": [],

  "weekly_summary": {
    "week_start": null,
    "avg_intake": null,
    "avg_burn": null,
    "avg_deficit": null,
    "days_on_target": null,
    "days_off_target": null,
    "estimated_weight_loss_kg": null
  },

  "macros_target": {
    "protein": {"grams": null, "calories": null, "percentage": 30},
    "carbs": {"grams": null, "calories": null, "percentage": 40},
    "fat": {"grams": null, "calories": null, "percentage": 30}
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
```

**Step 3: 验证JSON格式**

```bash
jq . data-example/nutrition-tracker.json > /dev/null
echo $?  # 应该输出 0
```

**Step 4: 提交**

```bash
git add data-example/nutrition-tracker.json
git commit -m "feat: add weight_loss_energy structure to nutrition-tracker.json"
```

---

### Task 3: 同步用户数据文件 data/fitness-tracker.json

**Files:**
- Modify: `data/fitness-tracker.json` (如果存在)

**Step 1: 检查文件是否存在**

```bash
if [ -f "data/fitness-tracker.json" ]; then
    echo "文件存在，准备扩展"
    cp data/fitness-tracker.json data/fitness-tracker.json.backup
else
    echo "文件不存在，跳过"
fi
```

**Step 2: 添加相同的 weight_loss_program 结构**

使用与 Task 1 相同的 JSON 结构添加到用户数据文件。

**Step 3: 验证并提交**

```bash
jq . data/fitness-tracker.json > /dev/null && git add data/fitness-tracker.json
git commit -m "feat: add weight_loss_program to user fitness-tracker.json"
```

---

### Task 4: 同步用户数据文件 data/nutrition-tracker.json

**Files:**
- Modify: `data/nutrition-tracker.json` (如果存在)

**Step 1: 检查并备份**

```bash
if [ -f "data/nutrition-tracker.json" ]; then
    cp data/nutrition-tracker.json data/nutrition-tracker.json.backup
fi
```

**Step 2: 添加相同的 weight_loss_energy 结构**

使用与 Task 2 相同的 JSON 结构。

**Step 3: 验证并提交**

```bash
jq . data/nutrition-tracker.json > /dev/null && git add data/nutrition-tracker.json
git commit -m "feat: add weight_loss_energy to user nutrition-tracker.json"
```

---

### Task 5: 创建减肥分析技能目录

**Files:**
- Create: `.claude/skills/weightloss-analyzer/SKILL.md`

**Step 1: 创建目录**

```bash
mkdir -p .claude/skills/weightloss-analyzer
```

**Step 2: 创建 SKILL.md 文件**

```markdown
---
description: 分析减肥数据、计算代谢率、追踪能量缺口、管理减肥阶段
---

# 减肥分析技能

## 功能

1. **身体成分分析**
   - BMI计算与分类
   - 体脂率评估
   - 围度分析（腰围、臀围、腰臀比）
   - 理想体重计算

2. **代谢率计算**
   - Harris-Benedict公式
   - Mifflin-St Jeor公式（推荐）
   - Katch-McArdle公式
   - TDEE计算

3. **能量缺口管理**
   - 每日能量摄入追踪
   - 能量消耗计算
   - 缺口达标分析
   - 减重估算

4. **阶段管理**
   - 减重期追踪
   - 平台期检测
   - 维持期管理

## 使用方法

通过 `/fitness:weightloss-*` 和 `/nutrition:weightloss-*` 命令调用。

## 安全原则

- 不推荐 <1200大卡/天（女性），<1500大卡/天（男性）
- 减重速度控制在 0.5-1kg/周
- 最低热量不低于 BMR × 1.2
- 医学免责声明
```

**Step 3: 提交**

```bash
git add .claude/skills/weightloss-analyzer/SKILL.md
git commit -m "feat: create weightloss-analyzer skill"
```

---

## 阶段1：核心计算模块

### Task 6: 创建 weightloss_calculations.py 框架

**Files:**
- Create: `scripts/weightloss_calculations.py`

**Step 1: 创建文件头部和常量**

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
    "sedentary": 1.2,
    "light": 1.375,
    "moderate": 1.55,
    "active": 1.725,
    "very_active": 1.9
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


def main():
    """测试入口"""
    print("减肥计算模块")


if __name__ == "__main__":
    main()
```

**Step 2: 测试运行**

```bash
python3 scripts/weightloss_calculations.py
# 预期输出: 减肥计算模块
```

**Step 3: 提交**

```bash
git add scripts/weightloss_calculations.py
git commit -m "feat: create weightloss_calculations.py framework"
```

---

### Task 7: 实现 BMR 计算函数

**Files:**
- Modify: `scripts/weightloss_calculations.py`

**Step 1: 添加三个BMR计算公式**

在常量定义后添加：

```python
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
```

**Step 2: 更新main函数测试**

```python
def main():
    """测试BMR计算"""
    # 测试数据：35岁男性，170cm，75.5kg
    gender, age = "male", 35
    height, weight = 170, 75.5

    print("=== BMR计算测试 ===")
    print(f"Harris-Benedict: {calculate_bmr_harris_benedict(gender, weight, height, age)}")
    print(f"Mifflin-St Jeor: {calculate_bmr_mifflin_st_jeor(gender, weight, height, age)}")
    print(f"Katch-McArdle (体脂28.5%): {calculate_bmr_katch_mcardle(weight, 28.5)}")
```

**Step 3: 运行测试**

```bash
python3 scripts/weightloss_calculations.py
# 预期输出:
# === BMR计算测试 ===
# Harris-Benedict: 1728
# Mifflin-St Jeor: 1650
# Katch-McArdle (体脂28.5%): 1536
```

**Step 4: 提交**

```bash
git add scripts/weightloss_calculations.py
git commit -m "feat: implement BMR calculation formulas"
```

---

### Task 8: 实现身体成分分析函数

**Files:**
- Modify: `scripts/weightloss_calculations.py`

**Step 1: 添加身体成分分析函数**

```python
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
```

**Step 2: 添加测试到main函数**

```python
def main():
    """测试身体成分分析"""
    print("=== 身体成分分析测试 ===")

    # 测试数据：170cm, 75.5kg
    height, weight = 170, 75.5
    bmi = calculate_bmi(weight, height)
    print(f"BMI: {bmi} ({get_bmi_category(bmi)})")
    print(f"理想体重: {calculate_ideal_weight(height)}kg")
    print(f"腰臀比 (92/98): {calculate_waist_hip_ratio(92, 98)}")
    print(f"腹型肥胖 (男, 92cm): {has_abdominal_obesity('male', 92)}")
    print(f"体脂分类 (男, 28.5%): {get_body_fat_category('male', 28.5)}")
```

**Step 3: 运行测试**

```bash
python3 scripts/weightloss_calculations.py
# 预期输出:
# === 身体成分分析测试 ===
# BMI: 26.1 (overweight)
# 理想体重: 63.6kg
# 腰臀比 (92/98): 0.94
# 腹型肥胖 (男, 92cm): True
# 体脂分类 (男, 28.5%): obese
```

**Step 4: 提交**

```bash
git add scripts/weightloss_calculations.py
git commit -m "feat: implement body composition analysis functions"
```

---

### Task 9: 实现能量缺口计算函数

**Files:**
- Modify: `scripts/weightloss_calculations.py`

**Step 1: 添加能量缺口计算函数**

```python
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
```

**Step 2: 添加测试到main函数**

```python
def main():
    """测试能量缺口计算"""
    print("=== 能量缺口计算测试 ===")

    deficit = calculate_deficit(intake_calories=1980, bmr=1650, exercise_burn=400, neat_burn=300)
    print(f"摄入: {deficit['intake']} 大卡")
    print(f"消耗: {deficit['expenditure']['total']} 大卡")
    print(f"缺口: {deficit['deficit']} 大卡")
    print(f"预计周减重: {estimate_weight_loss(deficit['deficit'], 7)} kg")

    macros = calculate_macros(2058)
    print(f"\n宏量营养素 (2058大卡):")
    print(f"  蛋白质: {macros['protein']['grams']}g ({macros['protein']['percentage']}%)")
    print(f"  碳水: {macros['carbs']['grams']}g ({macros['carbs']['percentage']}%)")
    print(f"  脂肪: {macros['fat']['grams']}g ({macros['fat']['percentage']}%)")
```

**Step 3: 运行测试**

```bash
python3 scripts/weightloss_calculations.py
# 预期输出包含:
# 缺口: 520 大卡
# 预计周减重: 0.47 kg
```

**Step 4: 提交**

```bash
git add scripts/weightloss_calculations.py
git commit -m "feat: implement energy deficit calculation functions"
```

---

### Task 10: 实现平台期检测函数

**Files:**
- Modify: `scripts/weightloss_calculations.py`

**Step 1: 添加平台期检测函数**

```python
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
```

**Step 2: 添加测试到main函数**

```python
def main():
    """测试平台期检测"""
    print("=== 平台期检测测试 ===")

    # 模拟体重历史
    weight_history = [
        {"date": "2025-01-01", "weight": 78.0},
        {"date": "2025-01-08", "weight": 77.8},
        {"date": "2025-01-15", "weight": 77.7},  # 变化0.3kg，小于0.5kg阈值
    ]

    plateau = detect_plateau(weight_history, weeks=2)
    print(f"平台期: {plateau['in_plateau']}")
    if plateau.get('in_plateau'):
        print(f"持续时间: {plateau['duration_weeks']}周")
        print(f"体重变化: {plateau['weight_change_kg']}kg")
        print(f"突破建议: {suggest_plateau_breakthrough(plateau['duration_weeks'])}")
```

**Step 3: 运行测试**

```bash
python3 scripts/weightloss_calculations.py
# 预期输出: 平台期: True
```

**Step 4: 提交**

```bash
git add scripts/weightloss_calculations.py
git commit -m "feat: implement plateau detection functions"
```

---

### Task 11-15: 实现综合分析函数和辅助函数

**省略详细步骤，简要描述**：

**Task 11**: 实现 `calculate_tdee()` 和 `calculate_all_bmr()` 函数
**Task 12**: 实现 `validate_calorie_target()` 和 `validate_weight_loss_rate()` 安全验证函数
**Task 13**: 实现 `analyze_body_composition()` 综合分析函数
**Task 14**: 实现 `analyze_metabolic_profile()` 综合代谢分析函数
**Task 15**: 完善 main() 函数，添加完整测试套件

每个任务遵循：编写代码 → 运行测试 → 提交

---

## 阶段2：命令接口扩展

### Task 16: 扩展 .claude/commands/fitness.md

**Files:**
- Modify: `.claude/commands/fitness.md`

**Step 1: 在文件末尾添加减肥命令部分**

```markdown
---

## 减肥管理命令

⚠️ **减肥安全声明**
本系统提供的减肥建议基于科学原理，不构成医疗处方。
极端减重、进食障碍请咨询医生。

### 身体成分记录

```bash
# 记录体重
/fitness:weightloss-record weight 75.5

# 记录体脂率
/fitness:weightloss-record body-fat 28.5%

# 记录围度
/fitness:weightloss-record waist 92
/fitness:weightloss-record hip 98
```

### 身体成分分析

```bash
/fitness:weightloss-body              # 完整身体成分分析
/fitness:weightloss-trend weight      # 体重趋势
/fitness:weightless-progress          # 减肥进度
```

### 代谢率计算

```bash
/fitness:weightloss-bmr               # 计算BMR
/fitness:weightloss-tdee              # 计算TDEE
/fitness:weightloss-activity moderate  # 设置活动水平
```

### 阶段管理

```bash
/fitness:weightloss-phase weight-loss     # 设置为减重期
/fitness:weightloss-phase plateau         # 标记平台期
/fitness:weightloss-maintenance start     # 进入维持期
```
```

**Step 2: 提交**

```bash
git add .claude/commands/fitness.md
git commit -m "feat: add weightloss commands to fitness.md"
```

---

### Task 17: 扩展 .claude/commands/nutrition.md

**Files:**
- Modify: `.claude/commands/nutrition.md`

**Step 1: 在文件末尾添加减肥饮食命令部分**

```markdown
---

## 减肥饮食管理

### 能量缺口追踪

```bash
/nutrition:weightloss-deficit          # 查看今日能量缺口
/nutrition:weightloss-target           # 查看热量目标
/nutrition:weightloss-balance          # 能量平衡报告
```

### 饮食记录

```bash
/nutrition:weightloss-meal breakfast 450   # 记录早餐
/nutrition:weightloss-intake 1980          # 记录全天摄入
/nutrition:weightloss-protein              # 蛋白质分析
```

### 间歇性禁食

```bash
/nutrition:weightloss-if 16-8                   # 启用16:8禁食
/nutrition:weightloss-if window 12:00-20:00     # 设置进食窗口
/nutrition:weightloss-if disable                # 禁用
```
```

**Step 2: 提交**

```bash
git add .claude/commands/nutrition.md
git commit -m "feat: add weightloss commands to nutrition.md"
```

---

### Task 18-25: 实现命令处理逻辑

**由于当前项目使用 Claude Code 技能系统处理命令**，这些任务主要是确保技能文件能正确解析和响应新命令。

简要描述：
- Task 18: 验证 `/fitness:weightloss-*` 命令能被正确路由
- Task 19: 验证 `/nutrition:weightloss-*` 命令能被正确路由
- Task 20-25: 各个命令的功能实现（在技能文件中）

---

## 阶段3：测试脚本

### Task 26: 创建 test-weightloss.sh 框架

**Files:**
- Create: `scripts/test-weightloss.sh`

**Step 1: 创建测试脚本框架**

```bash
#!/bin/bash

# 科学运动健康减肥功能测试脚本
# 版本: v1.0
# 创建日期: 2025-01-14

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 测试计数器
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0
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

# ========================================
# 开始测试
# ========================================

echo "========================================="
echo "科学运动健康减肥功能测试"
echo "========================================="
echo ""

# 第一组：基础功能测试
echo -e "${YELLOW}第一组：基础功能测试${NC}"
echo ""

test_file "scripts/weightloss_calculations.py" "计算模块存在"
test_file "scripts/test-weightloss.sh" "测试脚本存在"
test_file ".claude/skills/weightloss-analyzer/SKILL.md" "减肥分析技能存在"

echo ""

# 第二组：数据结构测试
echo -e "${YELLOW}第二组：数据结构测试${NC}"
echo ""

test_file "data-example/fitness-tracker.json" "运动数据文件存在"
test_json_structure "data-example/fitness-tracker.json" "weight_loss_program" "减肥程序结构存在"
test_json_structure "data-example/fitness-tracker.json" "body_composition" "身体成分结构存在"
test_json_structure "data-example/fitness-tracker.json" "metabolic_profile" "代谢分析结构存在"

test_file "data-example/nutrition-tracker.json" "营养数据文件存在"
test_json_structure "data-example/nutrition-tracker.json" "weight_loss_energy" "能量管理结构存在"
test_json_structure "data-example/nutrition-tracker.json" "intermittent_fasting" "间歇性禁食结构存在"

echo ""

# 第三组：命令接口测试
echo -e "${YELLOW}第三组：命令接口测试${NC}"
echo ""

test_disclaimer_in_file ".claude/commands/fitness.md" "fitness命令包含免责声明"
test_disclaimer_in_file ".claude/commands/nutrition.md" "nutrition命令包含免责声明"

echo ""
echo "========================================="
echo "测试完成"
echo "========================================="
echo -e "总计: ${TOTAL_TESTS} | ${GREEN}通过: ${PASSED_TESTS}${NC} | ${RED}失败: ${FAILED_TESTS}${NC}"

if [ $FAILED_TESTS -gt 0 ]; then
    echo ""
    echo "失败的测试:"
    for name in "${FAILED_TEST_NAMES[@]}"; do
        echo "  - $name"
    done
    exit 1
else
    echo ""
    echo -e "${GREEN}所有测试通过！${NC}"
    exit 0
fi
```

**Step 2: 添加执行权限**

```bash
chmod +x scripts/test-weightloss.sh
```

**Step 3: 运行测试**

```bash
bash scripts/test-weightloss.sh
```

**Step 4: 提交**

```bash
git add scripts/test-weightloss.sh
git commit -m "feat: create weightloss test script"
```

---

### Task 27-35: 完善测试脚本

添加更多测试用例：
- Task 27: 添加医学安全测试
- Task 28: 添加命令格式测试
- Task 29: 添加计算函数单元测试
- Task 30-35: 其他边缘情况测试

---

## 阶段4：报告集成

### Task 36: 在 generate_health_report.py 中添加减肥章节函数

**Files:**
- Modify: `scripts/generate_health_report.py`

**Step 1: 添加减肥章节生成函数**

在文件中找到其他章节函数的位置，添加：

```python
def generate_weight_loss_section(data: Dict) -> str:
    """
    生成减肥章节HTML

    包含：身体成分概览、代谢分析、能量平衡、减肥进度
    """
    html = '''
    <section id="weight-loss" class="mb-8">
        <div class="flex items-center gap-2 mb-4">
            <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
            <h2 class="text-xl font-bold text-gray-800">科学运动健康减肥</h2>
        </div>

        <div class="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
            <div class="flex">
                <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                </div>
                <div class="ml-3">
                    <p class="text-sm text-amber-700">
                        <strong>免责声明：</strong>本工具提供的减肥建议基于一般科学原理，不构成医疗诊断或处方。
                        极端减重、进食障碍、肥胖相关疾病请咨询专业医师。
                    </p>
                </div>
            </div>
        </div>

        <!-- 身体成分概览 -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-white rounded-lg shadow p-4">
                <div class="text-sm text-gray-500">体重</div>
                <div class="text-2xl font-bold text-gray-800">{{ weight }} kg</div>
                <div class="text-xs text-emerald-600 mt-1">目标: {{ target_weight }} kg</div>
            </div>
            <!-- 更多卡片... -->
        </div>

        <!-- 体重趋势图 -->
        <div class="bg-white rounded-lg shadow p-4 mb-6">
            <h3 class="text-lg font-semibold mb-4">体重变化趋势</h3>
            <canvas id="weightTrendChart" height="200"></canvas>
        </div>
    </section>
    '''

    return html
```

**Step 2: 提交**

```bash
git add scripts/generate_health_report.py
git commit -m "feat: add weight loss section to health report"
```

---

### Task 37-40: 完善报告图表和集成

- Task 37: 添加体重趋势 Chart.js 图表
- Task 38: 添加能量缺口图表
- Task 39: 在主报告生成函数中调用减肥章节
- Task 40: 测试完整报告生成

---

## 完成检查清单

在完成所有任务后，验证：

- [ ] `data-example/fitness-tracker.json` 包含 `weight_loss_program` 结构
- [ ] `data-example/nutrition-tracker.json` 包含 `weight_loss_energy` 结构
- [ ] `scripts/weightloss_calculations.py` 所有计算函数正常工作
- [ ] `scripts/test-weightloss.sh` 所有测试通过
- [ ] `/fitness:weightloss-*` 和 `/nutrition:weightloss-*` 命令可用
- [ ] 健康报告包含减肥章节

---

## 运行完整测试

```bash
# 运行减肥模块测试
bash scripts/test-weightloss.sh

# 测试计算模块
python3 scripts/weightloss_calculations.py

# 生成健康报告（验证集成）
python3 scripts/generate_health_report.py comprehensive
```

---

**计划版本**: v1.0
**创建日期**: 2025-01-14
**预计总时长**: 3-4小时

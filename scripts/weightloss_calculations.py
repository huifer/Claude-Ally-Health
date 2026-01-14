#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
科学减肥计算模块

提供减肥相关的各种科学计算功能，包括：
- 基础代谢率(BMR)计算
- 身体成分分析(BMI、体脂、腰臀比等)
- 能量缺口计算与预测
- 平台期检测与突破建议

Author: Claude-Ally-Health
Date: 2025
"""

from typing import Dict, List, Optional
from datetime import datetime, timedelta


# ============================================================================
# 常量定义
# ============================================================================

# 有效体重范围(kg)
VALID_WEIGHT_RANGE = (30, 300)

# 有效身高范围(cm)
VALID_HEIGHT_RANGE = (100, 250)

# 有效体脂率范围(%)
VALID_BODY_FAT_RANGE = (3, 50)

# 有效腰围范围(cm)
VALID_WAIST_RANGE = (50, 180)

# 1公斤脂肪约等于7700大卡
CALORIES_PER_KG_FAT = 7700

# 活动系数
ACTIVITY_FACTORS = {
    "sedentary": 1.2,      # 久坐不动，几乎不运动
    "light": 1.375,        # 轻度活动，每周1-3天轻度运动
    "moderate": 1.55,      # 中度活动，每周3-5天中等运动
    "active": 1.725,       # 高度活动，每周6-7天高强度运动
    "extra_active": 1.9    # 极高活动，体力工作或每天高强度训练
}

# 体脂率标准(基于年龄和性别)
BODY_FAT_STANDARDS = {
    "male": {
        "essential": (2, 5),      # 必需脂肪
        "athletic": (6, 13),      # 运动员型
        "fitness": (14, 17),      # 健身型
        "average": (18, 24),      # 平均型
        "obese": (25, float('inf'))  # 肥胖
    },
    "female": {
        "essential": (10, 13),    # 必需脂肪
        "athletic": (14, 20),     # 运动员型
        "fitness": (21, 24),      # 健身型
        "average": (25, 31),      # 平均型
        "obese": (32, float('inf'))  # 肥胖
    }
}

# 腰围肥胖标准(腹部肥胖)
WAIST_OBESITY_THRESHOLD = {
    "male": 90,    # 男性 >= 90cm
    "female": 85   # 女性 >= 85cm
}

# BMI分类标准(亚洲标准)
BMI_CATEGORIES = {
    "underweight": 18.5,
    "normal": 24.0,
    "overweight": 28.0,
    "obese": float('inf')
}

# 理想BMI值(亚洲人)
IDEAL_BMI_ASIAN = 22.0


# ============================================================================
# BMR计算函数
# ============================================================================

def calculate_bmr_harris_benedict(gender: str, weight_kg: float, height_cm: int, age: int) -> int:
    """
    使用Harris-Benedict公式计算基础代谢率

    该公式是经典的BMR计算方法，1984年修订版

    Args:
        gender: 性别 "male" 或 "female"
        weight_kg: 体重(公斤)
        height_cm: 身高(厘米)
        age: 年龄(岁)

    Returns:
        基础代谢率(大卡/天)

    Formula:
        男性: BMR = 88.362 + (13.397 × 体重kg) + (4.799 × 身高cm) - (5.677 × 年龄)
        女性: BMR = 447.593 + (9.247 × 体重kg) + (3.098 × 身高cm) - (4.330 × 年龄)
    """
    gender = gender.lower()
    if gender == "male":
        bmr = 88.362 + (13.397 * weight_kg) + (4.799 * height_cm) - (5.677 * age)
    else:  # female
        bmr = 447.593 + (9.247 * weight_kg) + (3.098 * height_cm) - (4.330 * age)
    return int(bmr)


def calculate_bmr_mifflin_st_jeor(gender: str, weight_kg: float, height_cm: int, age: int) -> int:
    """
    使用Mifflin-St Jeor公式计算基础代谢率

    该公式被认为是最准确的BMR计算方法(1990年)

    Args:
        gender: 性别 "male" 或 "female"
        weight_kg: 体重(公斤)
        height_cm: 身高(厘米)
        age: 年龄(岁)

    Returns:
        基础代谢率(大卡/天)

    Formula:
        男性: BMR = (10 × 体重kg) + (6.25 × 身高cm) - (5 × 年龄) + 5
        女性: BMR = (10 × 体重kg) + (6.25 × 身高cm) - (5 × 年龄) - 161
    """
    gender = gender.lower()
    if gender == "male":
        bmr = (10 * weight_kg) + (6.25 * height_cm) - (5 * age) + 5
    else:  # female
        bmr = (10 * weight_kg) + (6.25 * height_cm) - (5 * age) - 161
    return int(bmr)


def calculate_bmr_katch_mcardle(weight_kg: float, body_fat_percentage: float) -> int:
    """
    使用Katch-McArdle公式计算基础代谢率

    该公式基于瘦体重(lean body mass)计算，需要体脂率数据

    Args:
        weight_kg: 体重(公斤)
        body_fat_percentage: 体脂率(百分比，如28.5表示28.5%)

    Returns:
        基础代谢率(大卡/天)

    Formula:
        BMR = 370 + (21.6 × 瘦体重kg)
        瘦体重 = 体重 × (1 - 体脂率/100)
    """
    lean_mass_kg = weight_kg * (1 - body_fat_percentage / 100)
    bmr = 370 + (21.6 * lean_mass_kg)
    return int(bmr)


# ============================================================================
# 身体成分分析函数
# ============================================================================

def calculate_bmi(weight_kg: float, height_cm: int) -> float:
    """
    计算身体质量指数(BMI)

    Args:
        weight_kg: 体重(公斤)
        height_cm: 身高(厘米)

    Returns:
        BMI值，保留1位小数
    """
    height_m = height_cm / 100
    bmi = weight_kg / (height_m * height_m)
    return round(bmi, 1)


def get_bmi_category(bmi: float) -> str:
    """
    根据BMI值获取分类(亚洲标准)

    Args:
        bmi: BMI值

    Returns:
        BMI分类: "underweight"(偏瘦), "normal"(正常), "overweight"(超重), "obese"(肥胖)

    亚洲标准:
        < 18.5: 偏瘦
        18.5 - 23.9: 正常
        24.0 - 27.9: 超重
        >= 28.0: 肥胖
    """
    if bmi < BMI_CATEGORIES["underweight"]:
        return "underweight"
    elif bmi < BMI_CATEGORIES["normal"]:
        return "normal"
    elif bmi < BMI_CATEGORIES["overweight"]:
        return "overweight"
    else:
        return "obese"


def get_bmi_category_chinese(bmi: float) -> str:
    """返回中文BMI分类"""
    category_map = {
        "underweight": "偏瘦",
        "normal": "正常",
        "overweight": "超重",
        "obese": "肥胖"
    }
    return category_map.get(get_bmi_category(bmi), "未知")


def calculate_ideal_weight(height_cm: int) -> float:
    """
    计算理想体重(基于亚洲人理想BMI=22)

    Args:
        height_cm: 身高(厘米)

    Returns:
        理想体重(公斤)，保留1位小数
    """
    height_m = height_cm / 100
    ideal_weight = IDEAL_BMI_ASIAN * height_m * height_m
    return round(ideal_weight, 1)


def calculate_waist_hip_ratio(waist_cm: float, hip_cm: float) -> float:
    """
    计算腰臀比

    Args:
        waist_cm: 腰围(厘米)
        hip_cm: 臀围(厘米)

    Returns:
        腰臀比，保留2位小数
    """
    if hip_cm <= 0:
        return 0.0
    return round(waist_cm / hip_cm, 2)


def has_abdominal_obesity(gender: str, waist_cm: float) -> bool:
    """
    判断是否有腹部肥胖

    Args:
        gender: 性别 "male" 或 "female"
        waist_cm: 腰围(厘米)

    Returns:
        True表示有腹部肥胖
    """
    gender = gender.lower()
    threshold = WAIST_OBESITY_THRESHOLD.get(gender, 90)
    return waist_cm >= threshold


def get_body_fat_category(gender: str, body_fat_pct: float) -> str:
    """
    根据体脂率获取分类

    Args:
        gender: 性别 "male" 或 "female"
        body_fat_pct: 体脂率(百分比)

    Returns:
        体脂分类: "essential"(必需), "athletic"(运动员), "fitness"(健身),
                 "average"(平均), "obese"(肥胖)
    """
    gender = gender.lower()
    standards = BODY_FAT_STANDARDS.get(gender, BODY_FAT_STANDARDS["male"])

    for category, (low, high) in standards.items():
        if low <= body_fat_pct <= high:
            return category
    return "obese"


def get_body_fat_category_chinese(gender: str, body_fat_pct: float) -> str:
    """返回中文体脂分类"""
    category_map = {
        "essential": "必需脂肪",
        "athletic": "运动员型",
        "fitness": "健身型",
        "average": "平均型",
        "obese": "肥胖"
    }
    return category_map.get(get_body_fat_category(gender, body_fat_pct), "未知")


# ============================================================================
# 能量缺口计算函数
# ============================================================================

def calculate_deficit(
    intake_calories: int,
    bmr: int,
    exercise_burn: int = 0,
    neat_burn: int = 0,
    tef_factor: float = 0.1
) -> Dict[str, any]:
    """
    计算每日能量缺口

    Args:
        intake_calories: 摄入热量(大卡)
        bmr: 基础代谢率(大卡/天)
        exercise_burn: 运动消耗(大卡)
        neat_burn: 非运动性活动消耗(大卡)
        tef_factor: 食物热效应系数(默认0.1，即10%)

    Returns:
        包含能量缺口详细信息的字典:
        {
            "intake": 摄入热量,
            "bmr": 基础代谢,
            "exercise_burn": 运动消耗,
            "neat_burn": 非运动消耗,
            "tef": 食物热效应,
            "total_burn": 总消耗,
            "deficit": 能量缺口,
            "is_deficit": 是否为缺口(True)或盈余(False),
            "percentage": 缺口占BMR的百分比
        }
    """
    tef = intake_calories * tef_factor
    total_burn = bmr + exercise_burn + neat_burn + tef
    deficit = total_burn - intake_calories

    return {
        "intake": intake_calories,
        "bmr": bmr,
        "exercise_burn": exercise_burn,
        "neat_burn": neat_burn,
        "tef": round(tef, 1),
        "total_burn": round(total_burn, 1),
        "deficit": round(deficit, 1),
        "is_deficit": deficit > 0,
        "percentage": round((deficit / bmr) * 100, 1) if bmr > 0 else 0
    }


def estimate_weight_loss(deficit_calories: float, days: int = 7) -> float:
    """
    根据能量缺口估算减重量

    Args:
        deficit_calories: 每日平均能量缺口(大卡)
        days: 天数(默认7天)

    Returns:
        预计减重重量(公斤)，保留2位小数

    Note:
        每1公斤脂肪约等于7700大卡
        公式: 减重kg = (缺口大卡 × 天数) / 7700
    """
    total_deficit = deficit_calories * days
    weight_loss = total_deficit / CALORIES_PER_KG_FAT
    return round(weight_loss, 2)


def calculate_macros(
    target_calories: int,
    protein_pct: float = 0.30,
    carbs_pct: float = 0.40,
    fat_pct: float = 0.30
) -> Dict[str, any]:
    """
    计算宏量营养素分配

    Args:
        target_calories: 目标热量(大卡)
        protein_pct: 蛋白质占比(默认0.30)
        carbs_pct: 碳水化合物占比(默认0.40)
        fat_pct: 脂肪占比(默认0.30)

    Returns:
        包含宏量营养素详细信息的字典:
        {
            "calories": 总热量,
            "protein": {"calories": 蛋白质热量, "grams": 蛋白质克数, "percentage": 占比},
            "carbs": {"calories": 碳水热量, "grams": 碳水克数, "percentage": 占比},
            "fat": {"calories": 脂肪热量, "grams": 脂肪克数, "percentage": 占比}
        }

    Note:
        蛋白质: 4大卡/克
        碳水化合物: 4大卡/克
        脂肪: 9大卡/克
    """
    # 验证比例总和为1
    total_pct = protein_pct + carbs_pct + fat_pct
    if abs(total_pct - 1.0) > 0.01:
        # 如果总和不为1，按比例归一化
        protein_pct = protein_pct / total_pct
        carbs_pct = carbs_pct / total_pct
        fat_pct = fat_pct / total_pct

    protein_cals = target_calories * protein_pct
    carbs_cals = target_calories * carbs_pct
    fat_cals = target_calories * fat_pct

    return {
        "calories": target_calories,
        "protein": {
            "calories": round(protein_cals, 1),
            "grams": round(protein_cals / 4, 1),
            "percentage": round(protein_pct * 100, 1)
        },
        "carbs": {
            "calories": round(carbs_cals, 1),
            "grams": round(carbs_cals / 4, 1),
            "percentage": round(carbs_pct * 100, 1)
        },
        "fat": {
            "calories": round(fat_cals, 1),
            "grams": round(fat_cals / 9, 1),
            "percentage": round(fat_pct * 100, 1)
        }
    }


# ============================================================================
# 平台期检测函数
# ============================================================================

def detect_plateau(
    weight_history: List[Dict],
    weeks: int = 2,
    threshold_kg: float = 0.5
) -> Dict[str, any]:
    """
    检测是否处于减肥平台期

    Args:
        weight_history: 体重历史记录列表，每个元素包含 {"date": "YYYY-MM-DD", "weight": 75.5}
        weeks: 检测周数(默认2周)
        threshold_kg: 体重变化阈值(默认0.5公斤)

    Returns:
        包含平台期分析结果的字典:
        {
            "in_plateau": 是否处于平台期,
            "weeks": 平台持续周数,
            "start_weight": 期初体重,
            "end_weight": 期末体重,
            "weight_change": 体重变化,
            "avg_weight": 平均体重,
            "analysis": 分析描述
        }
    """
    if not weight_history or len(weight_history) < 2:
        return {
            "in_plateau": False,
            "weeks": 0,
            "start_weight": None,
            "end_weight": None,
            "weight_change": 0,
            "avg_weight": None,
            "analysis": "数据不足，无法判断"
        }

    # 获取最近的体重记录
    recent_records = sorted(weight_history, key=lambda x: x.get("date", ""), reverse=True)[:weeks + 1]

    if len(recent_records) < 2:
        return {
            "in_plateau": False,
            "weeks": 0,
            "start_weight": None,
            "end_weight": None,
            "weight_change": 0,
            "avg_weight": None,
            "analysis": "数据不足，无法判断"
        }

    start_weight = recent_records[-1].get("weight", 0)
    end_weight = recent_records[0].get("weight", 0)
    weight_change = abs(start_weight - end_weight)

    in_plateau = weight_change <= threshold_kg

    # 计算平均体重
    weights = [r.get("weight", 0) for r in recent_records]
    avg_weight = sum(weights) / len(weights) if weights else 0

    analysis = ""
    if in_plateau:
        if weight_change < 0.1:
            analysis = f"体重基本无变化({weeks}周内变化{weight_change:.1f}kg)，处于明显平台期"
        else:
            analysis = f"体重变化较小({weeks}周内变化{weight_change:.1f}kg)，可能处于平台期"
    else:
        analysis = f"体重有明显变化({weeks}周内变化{weight_change:.1f}kg)，未进入平台期"

    return {
        "in_plateau": in_plateau,
        "weeks": weeks,
        "start_weight": start_weight,
        "end_weight": end_weight,
        "weight_change": round(weight_change, 2),
        "avg_weight": round(avg_weight, 1),
        "analysis": analysis
    }


def suggest_plateau_breakthrough(plateau_duration_weeks: int) -> List[str]:
    """
    根据平台期持续时间提供突破建议

    Args:
        plateau_duration_weeks: 平台期持续周数

    Returns:
        突破建议列表
    """
    suggestions = []

    # 基础建议(适用于所有平台期)
    suggestions.extend([
        "1. 重新计算每日热量需求，根据最新体重调整摄入量",
        "2. 增加运动强度或改变运动方式(尝试HIIT或力量训练)",
        "3. 检查并记录饮食准确性，可能存在隐性热量摄入",
        "4. 增加日常活动量(多走路、爬楼梯等)"
    ])

    # 根据平台期持续时间添加额外建议
    if plateau_duration_weeks >= 2:
        suggestions.append("5. 实施碳水循环法(高/低碳日交替)")
        suggestions.append("6. 尝试间歇性禁食(如16:8方法)")

    if plateau_duration_weeks >= 4:
        suggestions.append("7. 安排1-2周的'欺骗日'或饮食休息期")
        suggestions.append("8. 调整宏量营养素比例(增加蛋白质，适当减少碳水)")
        suggestions.append("9. 检查睡眠质量和压力水平，皮质醇过高会影响减重")

    if plateau_duration_weeks >= 8:
        suggestions.append("10. 建议进行体检，排除甲状腺等健康问题")
        suggestions.append("11. 考虑咨询专业营养师或减重专家")
        suggestions.append("12. 重新评估目标体重是否合理")

    return suggestions


# ============================================================================
# 额外分析函数
# ============================================================================

def calculate_tdee(bmr: int, activity_level: str = "moderate") -> int:
    """
    计算每日总能量消耗(TDEE)

    Args:
        bmr: 基础代谢率(大卡/天)
        activity_level: 活动水平
            - "sedentary": 久坐不动，几乎不运动
            - "light": 轻度活动，每周1-3天轻度运动
            - "moderate": 中度活动，每周3-5天中等运动
            - "active": 高度活动，每周6-7天高强度运动
            - "extra_active": 极高活动，体力工作或每天高强度训练

    Returns:
        每日总能量消耗(大卡/天)
    """
    activity_level = activity_level.lower()
    # 标准化别名
    activity_map = {
        "sedentary": "sedentary",
        "light": "light",
        "moderate": "moderate",
        "active": "active",
        "extra_active": "extra_active",
        "extra-active": "extra_active",
        "very_active": "active",
        "very-active": "active",
    }
    normalized_level = activity_map.get(activity_level, "moderate")
    factor = ACTIVITY_FACTORS.get(normalized_level, 1.55)
    return int(bmr * factor)


def calculate_all_bmr(
    gender: str,
    weight_kg: float,
    height_cm: int,
    age: int,
    body_fat_percentage: Optional[float] = None
) -> Dict[str, any]:
    """
    计算所有三种BMR公式

    Args:
        gender: 性别 "male" 或 "female"
        weight_kg: 体重(公斤)
        height_cm: 身高(厘米)
        age: 年龄(岁)
        body_fat_percentage: 体脂率(可选，用于Katch-McArdle公式)

    Returns:
        包含所有BMR结果的字典:
        {
            "harris_benedict": Harris-Benedict公式结果,
            "mifflin_st_jeor": Mifflin-St Jeor公式结果,
            "katch_mcardle": Katch-McArdle公式结果(如果有体脂率),
            "recommended": 推荐使用的BMR值,
            "note": 说明文字
        }
    """
    harris_benedict = calculate_bmr_harris_benedict(gender, weight_kg, height_cm, age)
    mifflin_st_jeor = calculate_bmr_mifflin_st_jeor(gender, weight_kg, height_cm, age)

    result = {
        "harris_benedict": harris_benedict,
        "mifflin_st_jeor": mifflin_st_jeor,
        "katch_mcardle": None,
        "recommended": mifflin_st_jeor,
        "note": "推荐使用Mifflin-St Jeor公式(最准确)"
    }

    # 如果有体脂率，计算Katch-McArdle
    if body_fat_percentage is not None:
        katch_mcardle = calculate_bmr_katch_mcardle(weight_kg, body_fat_percentage)
        result["katch_mcardle"] = katch_mcardle
        result["note"] = "有体脂率数据时，推荐使用Katch-McArdle公式"
        result["recommended"] = katch_mcardle

    return result


def validate_calorie_target(target_calories: int, bmr: int, gender: str) -> Dict[str, any]:
    """
    验证热量目标是否安全

    Args:
        target_calories: 目标每日热量(大卡)
        bmr: 基础代谢率(大卡/天)
        gender: 性别 "male" 或 "female"

    Returns:
        验证结果字典:
        {
            "is_safe": 是否安全,
            "target": 目标热量,
            "minimum_safe": 最低安全热量,
            "bmr": 基础代谢率,
            "difference": 与最低安全热量的差值,
            "warning": 警告信息(如有),
            "recommendation": 建议
        }
    """
    # 最低安全热量为BMR的1.2倍(久坐活动水平)
    minimum_safe = int(bmr * 1.2)
    difference = target_calories - minimum_safe
    is_safe = target_calories >= minimum_safe

    warning = None
    recommendation = "热量目标在安全范围内"

    if not is_safe:
        warning = f"目标热量({target_calories})低于最低安全值({minimum_safe}大卡)"
        recommendation = f"建议将每日热量至少提高到{minimum_safe}大卡以保证基础代谢和营养需求"
    elif difference < 200:
        warning = f"目标热量接近最低安全值，建议谨慎"
        recommendation = "建议密切监测身体状况，如出现疲劳、脱发等症状请增加热量"

    return {
        "is_safe": is_safe,
        "target": target_calories,
        "minimum_safe": minimum_safe,
        "bmr": bmr,
        "difference": difference,
        "warning": warning,
        "recommendation": recommendation
    }


def validate_weight_loss_rate(weight_loss_kg: float, weeks: int) -> Dict[str, any]:
    """
    验证减重速度是否安全

    Args:
        weight_loss_kg: 减重重量(公斤)
        weeks: 减重所用周数

    Returns:
        验证结果字典:
        {
            "is_safe": 是否安全,
            "rate_kg_per_week": 每周减重速度,
            "total_kg": 总减重量,
            "weeks": 周数,
            "category": 安全分类,
            "warning": 警告信息(如有),
            "recommendation": 建议
        }
    """
    if weeks <= 0:
        return {
            "is_safe": False,
            "rate_kg_per_week": 0,
            "total_kg": weight_loss_kg,
            "weeks": weeks,
            "category": "invalid",
            "warning": "周数必须大于0",
            "recommendation": "请输入有效的周数"
        }

    rate_per_week = weight_loss_kg / weeks

    # 安全标准
    if rate_per_week <= 0.5:
        category = "safe"
        is_safe = True
        recommendation = "减重速度在安全范围内，继续保持"
    elif rate_per_week <= 1.0:
        category = "moderate"
        is_safe = True
        recommendation = "减重速度较快但仍在可接受范围，建议确保营养充足"
    elif rate_per_week <= 1.5:
        category = "aggressive"
        is_safe = True
        recommendation = "减重速度较快，建议密切监测身体状况并确保蛋白质摄入充足"
    else:
        category = "unsafe"
        is_safe = False
        recommendation = "减重速度过快，存在健康风险，建议降低减重速度至每周0.5-1公斤"

    warning = None
    if category == "aggressive":
        warning = f"减重速度({rate_per_week:.2f}kg/周)接近安全上限"
    elif category == "unsafe":
        warning = f"减重速度({rate_per_week:.2f}kg/周)超过安全上限(1.5kg/周)"

    return {
        "is_safe": is_safe,
        "rate_kg_per_week": round(rate_per_week, 2),
        "total_kg": weight_loss_kg,
        "weeks": weeks,
        "category": category,
        "warning": warning,
        "recommendation": recommendation
    }


def analyze_body_composition(
    gender: str,
    age: int,
    height_cm: int,
    weight_kg: float,
    body_fat_percentage: Optional[float] = None,
    waist_cm: Optional[float] = None,
    hip_cm: Optional[float] = None
) -> Dict[str, any]:
    """
    综合身体成分分析

    Args:
        gender: 性别 "male" 或 "female"
        age: 年龄(岁)
        height_cm: 身高(厘米)
        weight_kg: 体重(公斤)
        body_fat_percentage: 体脂率(可选)
        waist_cm: 腰围(可选)
        hip_cm: 臀围(可选)

    Returns:
        身体成分分析结果字典
    """
    # BMI分析
    bmi = calculate_bmi(weight_kg, height_cm)
    bmi_category = get_bmi_category(bmi)
    bmi_category_cn = get_bmi_category_chinese(bmi)
    ideal_weight = calculate_ideal_weight(height_cm)
    weight_difference = weight_kg - ideal_weight

    result = {
        "bmi": {
            "value": bmi,
            "category": bmi_category,
            "category_chinese": bmi_category_cn,
            "ideal_weight": ideal_weight,
            "difference_from_ideal": round(weight_difference, 1),
            "weight_status": "正常" if abs(weight_difference) < 5 else ("偏重" if weight_difference > 0 else "偏轻")
        },
        "body_fat": None,
        "waist_hip": None,
        "overall_assessment": None,
        "recommendations": []
    }

    # 体脂分析
    if body_fat_percentage is not None:
        bf_category = get_body_fat_category(gender, body_fat_percentage)
        bf_category_cn = get_body_fat_category_chinese(gender, body_fat_percentage)

        # 计算瘦体重
        lean_mass_kg = weight_kg * (1 - body_fat_percentage / 100)

        result["body_fat"] = {
            "percentage": body_fat_percentage,
            "category": bf_category,
            "category_chinese": bf_category_cn,
            "lean_mass_kg": round(lean_mass_kg, 1),
            "fat_mass_kg": round(weight_kg - lean_mass_kg, 1)
        }

    # 腰臀比分析
    if waist_cm is not None:
        has_abdominal = has_abdominal_obesity(gender, waist_cm)

        waist_data = {
            "waist_cm": waist_cm,
            "has_abdominal_obesity": has_abdominal,
            "threshold_cm": WAIST_OBESITY_THRESHOLD.get(gender, 90)
        }

        if hip_cm is not None and hip_cm > 0:
            whr = calculate_waist_hip_ratio(waist_cm, hip_cm)
            waist_data["hip_cm"] = hip_cm
            waist_data["ratio"] = whr

            # 腰臀比健康标准
            if gender == "male":
                whr_ok = whr < 0.9
            else:
                whr_ok = whr < 0.85
            waist_data["ratio_healthy"] = whr_ok

        result["waist_hip"] = waist_data

    # 综合评估
    concerns = []
    if bmi_category in ["overweight", "obese"]:
        concerns.append(f"BMI偏高({bmi})")

    if body_fat_percentage is not None:
        bf_cat = get_body_fat_category(gender, body_fat_percentage)
        if bf_cat in ["average", "obese"]:
            concerns.append(f"体脂率偏高({body_fat_percentage}%)")

    if waist_cm is not None and has_abdominal_obesity(gender, waist_cm):
        concerns.append(f"存在腹部肥胖(腰围{waist_cm}cm)")

    if not concerns:
        overall_assessment = "身体成分指标良好"
    else:
        overall_assessment = f"需要注意: {', '.join(concerns)}"

    result["overall_assessment"] = overall_assessment

    # 生成建议
    recommendations = []
    if bmi_category == "underweight":
        recommendations.append("建议适当增加热量摄入，进行适量力量训练增加肌肉量")
    elif bmi_category in ["overweight", "obese"]:
        recommendations.append("建议通过合理饮食和运动减重")
        recommendations.append(f"目标体重可参考理想体重: {ideal_weight}kg")

    if body_fat_percentage is not None:
        bf_cat = get_body_fat_category(gender, body_fat_percentage)
        if bf_cat == "obese":
            recommendations.append("体脂率较高，建议增加有氧运动，控制饮食")
        elif bf_cat == "athletic" or bf_cat == "fitness":
            recommendations.append("体脂率状况良好，继续保持")

    if waist_cm is not None and has_abdominal_obesity(gender, waist_cm):
        recommendations.append("腹部肥胖是心血管疾病风险因素，建议重点减腹")
        recommendations.append("建议增加核心训练和有氧运动")

    result["recommendations"] = recommendations

    return result


def analyze_metabolic_profile(
    gender: str,
    age: int,
    height_cm: int,
    weight_kg: float,
    activity_level: str = "moderate",
    body_fat_percentage: Optional[float] = None
) -> Dict[str, any]:
    """
    代谢分析

    Args:
        gender: 性别 "male" 或 "female"
        age: 年龄(岁)
        height_cm: 身高(厘米)
        weight_kg: 体重(公斤)
        activity_level: 活动水平
        body_fat_percentage: 体脂率(可选)

    Returns:
        代谢分析结果字典
    """
    # 计算BMR
    bmr_result = calculate_all_bmr(gender, weight_kg, height_cm, age, body_fat_percentage)
    bmr = bmr_result["recommended"]

    # 计算TDEE
    tdee = calculate_tdee(bmr, activity_level)

    # 计算每日热量范围
    maintenance = tdee
    mild_deficit = int(tdee * 0.85)  # 15%缺口
    moderate_deficit = int(tdee * 0.75)  # 25%缺口
    aggressive_deficit = int(tdee * 0.65)  # 35%缺口

    # 预计减重速度
    mild_loss_weekly = round((tdee - mild_deficit) * 7 / CALORIES_PER_KG_FAT, 2)
    moderate_loss_weekly = round((tdee - moderate_deficit) * 7 / CALORIES_PER_KG_FAT, 2)
    aggressive_loss_weekly = round((tdee - aggressive_deficit) * 7 / CALORIES_PER_KG_FAT, 2)

    # 代谢率评估
    bmi = calculate_bmi(weight_kg, height_cm)

    # 年龄代谢调整说明
    metabolic_note = ""
    if age < 30:
        metabolic_note = "年轻时代谢较活跃，是建立良好代谢习惯的最佳时期"
    elif age < 50:
        metabolic_note = "30岁后代谢每十年下降约2-5%，需通过运动维持"
    else:
        metabolic_note = "50岁后代谢下降明显，建议通过力量训练维持肌肉量"

    return {
        "basal_metabolic_rate": {
            "harris_benedict": bmr_result["harris_benedict"],
            "mifflin_st_jeor": bmr_result["mifflin_st_jeor"],
            "katch_mcardle": bmr_result.get("katch_mcardle"),
            "recommended": bmr,
            "note": bmr_result["note"]
        },
        "total_daily_energy_expenditure": {
            "value": tdee,
            "activity_level": activity_level,
            "activity_factor": ACTIVITY_FACTORS.get(activity_level, 1.55)
        },
        "calorie_targets": {
            "maintenance": maintenance,
            "mild_weight_loss": mild_deficit,
            "moderate_weight_loss": moderate_deficit,
            "aggressive_weight_loss": aggressive_deficit
        },
        "projected_weight_loss": {
            "mild_deficit_kg_per_week": mild_loss_weekly,
            "moderate_deficit_kg_per_week": moderate_loss_weekly,
            "aggressive_deficit_kg_per_week": aggressive_loss_weekly
        },
        "macro_distribution": calculate_macros(moderate_deficit),
        "metabolic_assessment": {
            "bmi": bmi,
            "age_factor_note": metabolic_note,
            "activity_impact": f"当前活动水平({activity_level})下，每日消耗约{tdee}大卡"
        },
        "recommendations": [
            f"维持体重: 每日约{maintenance}大卡",
            f"温和减重: 每日约{mild_deficit}大卡(预计周减重{mild_loss_weekly}kg)",
            f"适度减重: 每日约{moderate_deficit}大卡(预计周减重{moderate_loss_weekly}kg)",
            "不建议超过35%热量缺口，以免影响代谢和健康"
        ]
    }


# ============================================================================
# 主函数 - 测试
# ============================================================================

def main():
    """测试所有计算函数"""
    # 测试数据：35岁男性，170cm，75.5kg，体脂28.5%
    gender, age = "male", 35
    height, weight = 170, 75.5
    body_fat = 28.5

    print("=== 科学减肥计算模块测试 ===")
    print()

    # BMR计算
    print("--- BMR计算 ---")
    bmr_hb = calculate_bmr_harris_benedict(gender, weight, height, age)
    print(f"Harris-Benedict: {bmr_hb}")
    bmr_msj = calculate_bmr_mifflin_st_jeor(gender, weight, height, age)
    print(f"Mifflin-St Jeor: {bmr_msj}")
    bmr_km = calculate_bmr_katch_mcardle(weight, body_fat)
    print(f"Katch-McArdle: {bmr_km}")

    # 身体成分
    print("\n--- 身体成分分析 ---")
    bmi = calculate_bmi(weight, height)
    print(f"BMI: {bmi} ({get_bmi_category_chinese(bmi)})")
    print(f"理想体重: {calculate_ideal_weight(height)}kg")
    print(f"体脂分类: {get_body_fat_category_chinese(gender, body_fat)}")
    print(f"腹部肥胖: {'是' if has_abdominal_obesity(gender, 95) else '否'} (腰围95cm)")

    # 能量缺口
    print("\n--- 能量缺口分析 ---")
    deficit = calculate_deficit(1980, 1650, 400, 300)
    print(f"摄入: {deficit['intake']} 大卡")
    print(f"消耗: {deficit['total_burn']} 大卡")
    print(f"缺口: {deficit['deficit']} 大卡")
    print(f"预计周减重: {estimate_weight_loss(deficit['deficit'])} kg")

    # 宏量营养素
    print("\n--- 宏量营养素分配 ---")
    macros = calculate_macros(1800)
    print(f"蛋白质: {macros['protein']['grams']}g ({macros['protein']['percentage']}%)")
    print(f"碳水: {macros['carbs']['grams']}g ({macros['carbs']['percentage']}%)")
    print(f"脂肪: {macros['fat']['grams']}g ({macros['fat']['percentage']}%)")

    # 平台期检测
    print("\n--- 平台期检测 ---")
    history = [
        {"date": "2025-01-01", "weight": 78.0},
        {"date": "2025-01-08", "weight": 77.8},
        {"date": "2025-01-15", "weight": 77.7}
    ]
    plateau = detect_plateau(history)
    print(f"平台期: {plateau['in_plateau']}")
    print(f"分析: {plateau['analysis']}")

    # 突破建议
    print("\n--- 平台期突破建议(4周) ---")
    for suggestion in suggest_plateau_breakthrough(4):
        print(suggestion)


if __name__ == "__main__":
    main()

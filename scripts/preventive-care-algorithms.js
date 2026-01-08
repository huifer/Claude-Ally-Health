/**
 * 年龄特异性预防保健 - 风险分层算法
 * Age-Specific Preventive Care - Risk Stratification Algorithms
 *
 * 基于循证医学指南的筛查间隔计算和风险分层
 */

const fs = require('fs');
const path = require('path');

// 加载预防保健方案配置
const PROTOCOLS_FILE = path.join(__dirname, '../data/preventive-care-protocols.json');
const PROFILE_FILE = path.join(__dirname, '../data/profile.json');
const PREVENTIVE_CARE_FILE = path.join(__dirname, '../data/preventive-care.json');

/**
 * 确定用户年龄组
 */
function determineAgeGroup(age) {
  if (age >= 18 && age <= 39) return 'young_adult';
  if (age >= 40 && age <= 49) return 'middle_age';
  if (age >= 50 && age <= 64) return 'pre_senior';
  if (age >= 65) return 'senior';
  return null;
}

/**
 * 计算筛查间隔（考虑风险调整）
 */
function calculateScreeningInterval(screeningType, patientData) {
  // 加载方案配置
  const protocols = JSON.parse(fs.readFileSync(PROTOCOLS_FILE, 'utf8'));
  const ageGroup = determineAgeGroup(patientData.age);

  if (!ageGroup) {
    return {
      error: '年龄超出预防保健范围（18-120岁）'
    };
  }

  // 获取筛查项目配置
  const screeningPath = screeningType.split('.');
  let screeningConfig = protocols.screening_protocols;
  for (const key of screeningPath) {
    if (screeningConfig[key]) {
      screeningConfig = screeningConfig[key];
    }
  }

  if (!screeningConfig || !screeningConfig.age_specific_recommendations) {
    return {
      error: `未找到筛查项目配置: ${screeningType}`
    };
  }

  const ageRecommendation = screeningConfig.age_specific_recommendations[ageGroup];

  // 获取基础间隔
  let baseInterval = ageRecommendation.base_interval_years || null;
  if (!baseInterval) {
    return {
      screening_type: screeningType,
      age_group: ageGroup,
      recommendation: ageRecommendation.recommendation,
      note: '该筛查项目在此年龄组无固定间隔'
    };
  }

  // 应用风险调整
  let adjustedInterval = baseInterval;
  const adjustments = [];

  if (screeningConfig.risk_adjustments && patientData.risk_factors) {
    for (const [riskFactor, multiplier] of Object.entries(screeningConfig.risk_adjustments)) {
      if (patientData.risk_factors.includes(riskFactor)) {
        const oldInterval = adjustedInterval;
        adjustedInterval = adjustedInterval * multiplier;
        adjustments.push({
          risk_factor: riskFactor,
          multiplier: multiplier,
          description: multiplier.description,
          interval_change: {
            from: oldInterval,
            to: adjustedInterval
          }
        });
      }
    }
  }

  // 确保不低于最小间隔
  const MINIMUM_INTERVAL = 0.25; // 3个月
  adjustedInterval = Math.max(adjustedInterval, MINIMUM_INTERVAL);

  return {
    screening_type: screeningType,
    age_group: ageGroup,
    base_interval_years: baseInterval,
    adjusted_interval_years: Math.round(adjustedInterval * 100) / 100,
    adjustments: adjustments,
    recommendation: ageRecommendation.recommendation,
    description: ageRecommendation.description
  };
}

/**
 * 计算下次筛查日期
 */
function calculateNextDue(screeningType, lastScreened, patientData) {
  const interval = calculateScreeningInterval(screeningType, patientData);

  if (interval.error) {
    return interval;
  }

  if (!interval.adjusted_interval_years) {
    return {
      ...interval,
      next_due: null,
      note: interval.note
    };
  }

  const lastDate = new Date(lastScreened);
  const nextDue = new Date(lastDate);
  nextDue.setFullYear(nextDue.getFullYear() + interval.adjusted_interval_years);

  const today = new Date();
  const daysUntilNext = Math.ceil((nextDue - today) / (1000 * 60 * 60 * 24));
  const overdue = daysUntilNext < 0;

  return {
    screening_type: screeningType,
    last_screened: lastScreened,
    next_due: nextDue.toISOString().split('T')[0],
    days_until_next: daysUntilNext,
    overdue: overdue,
    urgency: overdue ? 'overdue' : (daysUntilNext < 30 ? 'urgent' : (daysUntilNext < 90 ? 'due_soon' : 'routine')),
    interval_years: interval.adjusted_interval_years,
    rationale: interval.adjustments
  };
}

/**
 * 血压分类
 */
function classifyBloodPressure(systolic, diastolic) {
  if (systolic < 120 && diastolic < 80) {
    return {
      category: 'normal',
      classification: 'normal',
      target_met: true,
      recommendation: '继续保持'
    };
  }

  if (systolic < 130 && diastolic < 80) {
    return {
      category: 'elevated',
      classification: 'elevated',
      target_met: false,
      recommendation: '生活方式干预'
    };
  }

  if ((systolic >= 130 && systolic < 140) || (diastolic >= 80 && diastolic < 90)) {
    return {
      category: 'stage_1',
      classification: 'hypertension_stage_1',
      target_met: false,
      recommendation: '考虑药物治疗'
    };
  }

  if (systolic >= 140 || diastolic >= 90) {
    return {
      category: 'stage_2',
      classification: 'hypertension_stage_2',
      target_met: false,
      recommendation: '需要药物治疗'
    };
  }

  return {
    category: 'unknown',
    classification: 'unknown',
    target_met: false
  };
}

/**
 * 血脂分类
 */
function classifyLipidPanel(total, ldl, hdl, triglycerides) {
  const classifications = {
    total_cholesterol: {
      value: total,
      category: total < 200 ? 'normal' : (total < 240 ? 'borderline_high' : 'high'),
      target: '<200 mg/dL'
    },
    ldl: {
      value: ldl,
      category: ldl < 100 ? 'optimal' : (ldl < 130 ? 'near_optimal' : (ldl < 160 ? 'borderline_high' : (ldl < 190 ? 'high' : 'very_high'))),
      target: '<100 mg/dL (一般人群)，<70 mg/dL (高危人群)'
    },
    hdl: {
      value: hdl,
      category: hdl < 40 ? 'low' : 'normal',
      target: '>40 mg/dL (男)，>50 mg/dL (女)'
    },
    triglycerides: {
      value: triglycerides,
      category: triglycerides < 150 ? 'normal' : (triglycerides < 200 ? 'borderline_high' : (triglycerides < 500 ? 'high' : 'very_high')),
      target: '<150 mg/dL'
    }
  };

  const anyAbnormal = Object.values(classifications).some(c => c.category !== 'normal' && c.category !== 'optimal');

  return {
    classifications: classifications,
    any_abnormal: anyAbnormal,
    overall_status: anyAbnormal ? 'abnormal' : 'normal'
  };
}

/**
 * 空腹血糖分类
 */
function classifyFastingGlucose(value) {
  if (value < 100) {
    return {
      category: 'normal',
      classification: 'normal',
      target_met: true,
      recommendation: '保持健康生活方式'
    };
  }

  if (value < 126) {
    return {
      category: 'prediabetes',
      classification: 'prediabetes',
      target_met: false,
      recommendation: '糖尿病前期：需要生活方式干预，每年复查'
    };
  }

  return {
    category: 'diabetes',
    classification: 'diabetes',
    target_met: false,
    recommendation: '建议立即就医评估'
  };
}

/**
 * HbA1c分类
 */
function classifyHbA1c(value) {
  if (value < 5.7) {
    return {
      category: 'normal',
      classification: 'normal',
      target_met: true,
      recommendation: '保持健康生活方式'
    };
  }

  if (value < 6.5) {
    return {
      category: 'prediabetes',
      classification: 'prediabetes',
      target_met: false,
      recommendation: '糖尿病前期：需要生活方式干预'
    };
  }

  return {
    category: 'diabetes',
    classification: 'diabetes',
    target_met: false,
    recommendation: '建议立即就医评估'
  };
}

/**
 * 计算ASCVD 10年风险（简化版）
 * 实际应用应使用官方Pooling Cohort Equations
 */
function calculateASCVD10YearRisk(data) {
  const { age, gender, systolic_bp, hypertension_treated, smoking, total_cholesterol, hdl } = data;

  let estimatedRisk = 0.01; // 基础风险1%

  // 年龄因素
  if (age >= 40) estimatedRisk += 0.01;
  if (age >= 45) estimatedRisk += 0.02;
  if (age >= 50) estimatedRisk += 0.02;
  if (age >= 55) estimatedRisk += 0.03;
  if (age >= 60) estimatedRisk += 0.03;
  if (age >= 65) estimatedRisk += 0.04;
  if (age >= 70) estimatedRisk += 0.05;

  // 性别因素
  if (gender === 'male') estimatedRisk += 0.02;

  // 收缩压因素
  if (systolic_bp >= 140 && !hypertension_treated) estimatedRisk += 0.03;
  if (systolic_bp >= 140 && hypertension_treated) estimatedRisk += 0.02;
  if (systolic_bp >= 160) estimatedRisk += 0.02;

  // 吸烟因素
  if (smoking) estimatedRisk += 0.04;

  // 血脂因素
  if (total_cholesterol >= 240) estimatedRisk += 0.02;
  if (total_cholesterol >= 280) estimatedRisk += 0.02;
  if (hdl < 40 && gender === 'male') estimatedRisk += 0.02;
  if (hdl < 50 && gender === 'female') estimatedRisk += 0.02;

  // 限制最大风险值
  estimatedRisk = Math.min(estimatedRisk, 0.30);

  // 风险分类
  let riskCategory = 'low';
  if (estimatedRisk >= 0.075 && estimatedRisk < 0.20) riskCategory = 'borderline';
  if (estimatedRisk >= 0.20 && estimatedRisk < 0.30) riskCategory = 'high';
  if (estimatedRisk >= 0.30) riskCategory = 'very_high';

  return {
    estimated_risk: Math.round(estimatedRisk * 1000) / 10, // 百分比，保留一位小数
    risk_category: riskCategory,
    recommendation: getASCVDRecommendation(riskCategory, estimatedRisk)
  };
}

/**
 * 获取ASCVD风险分层建议
 */
function getASCVDRecommendation(riskCategory, risk) {
  if (riskCategory === 'low') {
    return '低风险：继续保持健康生活方式';
  }

  if (riskCategory === 'borderline') {
    return '临界风险：考虑危险因素强化治疗';
  }

  if (riskCategory === 'high') {
    return '高风险：建议启动他汀治疗';
  }

  if (riskCategory === 'very_high') {
    return '极高风险：需要强化他汀治疗，目标LDL<70 mg/dL';
  }

  return '请咨询医生进行风险评估';
}

/**
 * 判断是否符合肺癌筛查条件
 */
function isEligibleForLungCancerScreening(data) {
  const { age, smoking_history_years, cigarettes_per_day, quit_years_ago } = data;

  // 计算包年数
  const packYears = (smoking_history_years * cigarettes_per_day) / 20;

  // USPSTF标准：50-80岁，≥20包年，当前吸烟或戒烟<15年
  const ageEligible = age >= 50 && age <= 80;
  const packYearsEligible = packYears >= 20;
  const smokingStatusEligible = quit_years_ago === null || quit_years_ago < 15;

  return {
    eligible: ageEligible && packYearsEligible && smokingStatusEligible,
    age_eligible: ageEligible,
    pack_years_eligible: packYearsEligible,
    smoking_status_eligible: smokingStatusEligible,
    pack_years: packYears,
    criteria: {
      age_range: '50-80岁',
      smoking_history: '≥20包年',
      current_smoker_or_quit_recently: '当前吸烟或戒烟<15年'
    }
  };
}

/**
 * 判断是否符合结肠镜筛查条件
 */
function isEligibleForColorectalCancerScreening(data) {
  const { age, family_history_colorectal_cancer, inflammatory_bowel_disease } = data;

  let eligible = false;
  let startAge = 50;
  let interval = 10;

  // 一般人群：45-75岁
  if (age >= 45 && age <= 75) {
    eligible = true;
    startAge = 45;
  }

  // 家族史：40岁或比家族诊断年龄小10岁
  if (family_history_colorectal_cancer) {
    startAge = Math.min(40, family_history_colorectal_cancer.age_at_diagnosis - 10);
    interval = 5;
    eligible = age >= startAge && age <= 75;
  }

  // 炎症性肠病：确诊后8-10年开始
  if (inflammatory_bowel_disease) {
    startAge = inflammatory_bowel_disease.diagnosis_age + 8;
    interval = 1;
    eligible = age >= startAge;
  }

  return {
    eligible: eligible,
    start_age: startAge,
    screening_interval_years: interval,
    recommended_method: 'colonoscopy',
    alternative_methods: ['fit', 'flexible_sigmoidoscopy', 'ct_colonography']
  };
}

/**
 * 导出所有函数
 */
module.exports = {
  determineAgeGroup,
  calculateScreeningInterval,
  calculateNextDue,
  classifyBloodPressure,
  classifyLipidPanel,
  classifyFastingGlucose,
  classifyHbA1c,
  calculateASCVD10YearRisk,
  isEligibleForLungCancerScreening,
  isEligibleForColorectalCancerScreening
};

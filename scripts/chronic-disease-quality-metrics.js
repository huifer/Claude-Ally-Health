/**
 * 慢性病质量指标计算算法
 * Chronic Disease Quality Metrics Calculation Algorithms
 *
 * 用于评估和管理慢性病（高血压、糖尿病等）的质量指标
 */

const fs = require('fs');
const path = require('path');

// 参考值范围（基于JNC 8、ACC/AHA、ADA等指南）
const REFERENCE_RANGES = {
  hypertension: {
    blood_pressure: {
      // 一般人群目标
      general_target: {
        systolic: { min: 0, max: 130, unit: 'mmHg' },
        diastolic: { min: 0, max: 80, unit: 'mmHg' }
      },
      // 糖尿病/肾病患者目标
      diabetes_ckd_target: {
        systolic: { min: 0, max: 130, unit: 'mmHg' },
        diastolic: { min: 0, max: 80, unit: 'mmHg' }
      },
      // 65岁以上目标（较宽松）
      over_65_target: {
        systolic: { min: 0, max: 140, unit: 'mmHg' },
        diastolic: { min: 0, max: 90, unit: 'mmHg' }
      },
      // 分类标准
      classification: {
        normal: { systolic_max: 120, diastolic_max: 80 },
        elevated: { systolic_max: 129, diastolic_max: 80, systolic_min: 120 },
        stage_1: { systolic_max: 139, diastolic_max: 89, systolic_min: 130, diastolic_min: 80 },
        stage_2: { systolic_min: 140, diastolic_min: 90 }
      }
    },
    home_monitoring: {
      // 7天血压谱目标
      seven_day_profile: {
        readings_per_day: 2,  // 早晚各一次
        total_days: 7,
        minimum_readings: 12,  // 至少12次有效读数
        target_days: 5  // 至少5天达标
      }
    }
  },
  diabetes: {
    hba1c: {
      // 一般成人目标
      general_target: { min: 0, max: 7.0, unit: '%' },
      // 更严格目标（年轻、病程短、无并发症）
      tight_target: { min: 0, max: 6.5, unit: '%' },
      // 较宽松目标（老年、有并发症、低血糖风险）
      loose_target: { min: 0, max: 8.0, unit: '%' },
      // 分类标准
      classification: {
        normal: { max: 5.6 },
        prediabetes: { min: 5.7, max: 6.4 },
        diabetes: { min: 6.5 }
      }
    },
    fasting_glucose: {
      target: { min: 0, max: 7.0, unit: 'mmol/L' },
      classification: {
        normal: { max: 5.5 },  // mg/dL: 100
        impaired: { min: 5.6, max: 6.9 },  // mg/dL: 100-125
        diabetes: { min: 7.0 }  // mg/dL: 126
      }
    },
    time_in_range: {
      // TIR目标范围（70-180 mg/dL = 3.9-10.0 mmol/L）
      target_min: 3.9,  // mg/dL: 70
      target_max: 10.0,  // mg/dL: 180
      target_percentage: 70,  // 目标至少70%的时间在范围内
      very_high_threshold: 10.0,  // >250 mg/dL
      very_low_threshold: 3.9   // <54 mg/dL
    }
  },
  lipids: {
    ldl: {
      // 一般人群目标
      general_target: { max: 100, unit: 'mg/dL' },
      // 高危人群目标（ASCVD风险≥7.5%）
      high_risk_target: { max: 70, unit: 'mg/dL' },
      // 极高危人群
      very_high_risk_target: { max: 55, unit: 'mg/dL' },
      classification: {
        optimal: { max: 100 },
        near_optimal: { min: 101, max: 129 },
        borderline_high: { min: 130, max: 159 },
        high: { min: 160, max: 189 },
        very_high: { min: 190 }
      }
    },
    total_cholesterol: {
      target: { max: 200, unit: 'mg/dL' },
      classification: {
        desirable: { max: 200 },
        borderline_high: { min: 201, max: 239 },
        high: { min: 240 }
      }
    },
    hdl: {
      male_target: { min: 40, unit: 'mg/dL' },
      female_target: { min: 50, unit: 'mg/dL' },
      low: {
        male: { max: 40 },
        female: { max: 50 }
      }
    },
    triglycerides: {
      target: { max: 150, unit: 'mg/dL' },
      classification: {
        normal: { max: 150 },
        borderline_high: { min: 151, max: 199 },
        high: { min: 200 },
        very_high: { min: 500 }
      }
    }
  }
};

/**
 * 高血压质量指标计算
 */
function calculateHypertensionQualityMetrics(bpData, patientProfile) {
  if (!bpData || bpData.length === 0) {
    return {
      error: '无血压数据'
    };
  }

  // 确定个性化血压目标
  const target = determineBloodPressureTarget(patientProfile);

  // 计算达标率
  const totalReadings = bpData.length;
  const readingsAtGoal = bpData.filter(bp =>
    bp.systolic <= target.systolic_max && bp.diastolic <= target.diastolic_max
  ).length;

  const goalAttainmentRate = totalReadings > 0 ? readingsAtGoal / totalReadings : 0;

  // 计算平均血压
  const avgSystolic = bpData.reduce((sum, bp) => sum + bp.systolic, 0) / totalReadings;
  const avgDiastolic = bpData.reduce((sum, bp) => sum + bp.diastolic, 0) / totalReadings;

  // 计算趋势（最近7天 vs 之前7天）
  const trend = calculateBloodPressureTrend(bpData);

  // 计算变异性（血压波动程度）
  const variability = calculateBPVariability(bpData);

  // 计算家庭监测依从性
  const adherence = calculateHomeMonitoringAdherence(bpData, patientProfile);

  return {
    overall: {
      goal_attainment_rate: Math.round(goalAttainmentRate * 1000) / 10,  // 百分比，保留一位小数
      grade: getQualityGrade(goalAttainmentRate),
      total_readings: totalReadings,
      readings_at_goal: readingsAtGoal
    },
    blood_pressure_average: {
      systolic: Math.round(avgSystolic),
      diastolic: Math.round(avgDiastolic),
      at_goal: avgSystolic <= target.systolic_max && avgDiastolic <= target.diastolic_max
    },
    target: {
      systolic_max: target.systolic_max,
      diastolic_max: target.diastolic_max,
      rationale: target.rationale
    },
    trend: trend,
    variability: variability,
    home_monitoring_adherence: adherence,
    classification: classifyHypertensionControl(goalAttainmentRate, avgSystolic, avgDiastolic, target),
    recommendations: generateHypertensionRecommendations(goalAttainmentRate, avgSystolic, avgDiastolic, target, trend)
  };
}

/**
 * 确定个性化血压目标
 */
function determineBloodPressureTarget(patientProfile) {
  const age = patientProfile.age || 0;
  const hasDiabetes = patientProfile.risk_factors && patientProfile.risk_factors.includes('diabetes');
  const hasCKD = patientProfile.risk_factors && patientProfile.risk_factors.includes('ckd');

  // 65岁以上老年人
  if (age >= 65) {
    return {
      systolic_max: REFERENCE_RANGES.hypertension.blood_pressure.over_65_target.systolic.max,
      diastolic_max: REFERENCE_RANGES.hypertension.blood_pressure.over_65_target.diastolic.max,
      rationale: '≥65岁老年人目标<140/90 mmHg（JNC 8）'
    };
  }

  // 糖尿病或CKD患者
  if (hasDiabetes || hasCKD) {
    return {
      systolic_max: REFERENCE_RANGES.hypertension.blood_pressure.diabetes_ckd_target.systolic.max,
      diastolic_max: REFERENCE_RANGES.hypertension.blood_pressure.diabetes_ckd_target.diastolic.max,
      rationale: '糖尿病/CKD患者目标<130/80 mmHg（ADA/KDIGO）'
    };
  }

  // 一般人群
  return {
    systolic_max: REFERENCE_RANGES.hypertension.blood_pressure.general_target.systolic.max,
    diastolic_max: REFERENCE_RANGES.hypertension.blood_pressure.general_target.diastolic.max,
    rationale: '一般人群目标<130/80 mmHg（ACC/AHA 2017）'
  };
}

/**
 * 计算血压趋势
 */
function calculateBloodPressureTrend(bpData) {
  if (bpData.length < 2) {
    return { trend: 'insufficient_data', description: '数据不足，无法分析趋势' };
  }

  // 按日期排序
  const sortedData = [...bpData].sort((a, b) => new Date(a.date) - new Date(b.date));

  // 取最近7次读数
  const recent = sortedData.slice(-7);

  // 计算移动平均
  const avgSystolicRecent = recent.reduce((sum, bp) => sum + bp.systolic, 0) / recent.length;
  const avgDiastolicRecent = recent.reduce((sum, bp) => sum + bp.diastolic, 0) / recent.length;

  // 如果有更早的数据，比较前半部分和后半部分
  if (sortedData.length >= 10) {
    const half = Math.floor(sortedData.length / 2);
    const earlier = sortedData.slice(0, half);
    const later = sortedData.slice(half);

    const avgSystolicEarlier = earlier.reduce((sum, bp) => sum + bp.systolic, 0) / earlier.length;
    const avgSystolicLater = later.reduce((sum, bp) => sum + bp.systolic, 0) / later.length;

    const changeSystolic = avgSystolicLater - avgSystolicEarlier;
    const changePercent = (changeSystolic / avgSystolicEarlier) * 100;

    if (changePercent > 10) {
      return {
        trend: 'worsening',
        change_systolic: Math.round(changeSystolic),
        change_percent: Math.round(changePercent * 10) / 10,
        description: `血压恶化：最近平均${Math.round(avgSystolicLater)} vs 之前${Math.round(avgSystolicEarlier)} mmHg`
      };
    } else if (changePercent < -10) {
      return {
        trend: 'improving',
        change_systolic: Math.round(changeSystolic),
        change_percent: Math.round(changePercent * 10) / 10,
        description: `血压改善：最近平均${Math.round(avgSystolicLater)} vs 之前${Math.round(avgSystolicEarlier)} mmHg`
      };
    }
  }

  return {
    trend: 'stable',
    avg_systolic: Math.round(avgSystolicRecent),
    avg_diastolic: Math.round(avgDiastolicRecent),
    description: '血压稳定'
  };
}

/**
 * 计算血压变异性
 */
function calculateBPVariability(bpData) {
  if (bpData.length < 3) {
    return { status: 'insufficient_data', cv: null };
  }

  // 计算收缩压标准差（作为变异性的指标）
  const systolicValues = bpData.map(bp => bp.systolic);
  const mean = systolicValues.reduce((a, b) => a + b, 0) / systolicValues.length;
  const variance = systolicValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / systolicValues.length;
  const stdDev = Math.sqrt(variance);

  // 变异系数（标准差/平均值）
  const cv = mean > 0 ? (stdDev / mean) * 100 : 0;

  return {
    standard_deviation: Math.round(stdDev * 10) / 10,
    coefficient_of_variation: Math.round(cv * 10) / 10,
    interpretation: cv > 10 ? '高变异性' : (cv > 5 ? '中等变异性' : '低变异性'),
    clinical_significance: cv > 10 ? '血压波动大，可能与依从性差或白大衣高血压有关' : '血压相对稳定'
  };
}

/**
 * 计算家庭血压监测依从性
 */
function calculateHomeMonitoringAdherence(bpData, patientProfile) {
  // 理想情况：每天早晚各测量一次
  const daysInPeriod = 7;  // 考虑最近7天
  const targetReadingsPerDay = 2;
  const targetTotalReadings = daysInPeriod * targetReadingsPerDay;

  // 计算最近7天的实际读数
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const recentReadings = bpData.filter(bp => {
    const readingDate = new Date(bp.date);
    return readingDate >= sevenDaysAgo && readingDate <= now;
  });

  const actualReadings = recentReadings.length;
  const adherenceRate = targetTotalReadings > 0 ? actualReadings / targetTotalReadings : 0;

  // 计算是否有足够的天数进行了监测
  const daysMeasured = new Set(recentReadings.map(bp => bp.date.split('T')[0])).size;
  const daysWithReadings = daysMeasured.size;

  return {
    adherence_rate: Math.round(adherenceRate * 1000) / 10,  // 百分比
    target_readings: targetTotalReadings,
    actual_readings: actualReadings,
    days_measured: daysWithReadings,
    target_days: daysInPeriod,
    grade: getAdherenceGrade(adherenceRate),
    recommendation: adherenceRate < 0.5 ?
      '建议增加监测频率，目标：每天早晚各1次' :
      '监测频率良好'
  };
}

/**
 * 糖尿病质量指标计算
 */
function calculateDiabetesQualityMetrics(hba1cData, glucoseData, patientProfile) {
  const metrics = {
    overall: {
      composite_score: null,
      grade: null
    },
    glycemic_control: {
      hba1c: null,
      fasting_glucose_average: null
    },
    complication_screening: {
      retinopathy: null,
      nephropathy: null,
      neuropathy: null,
      foot_exam: null
    },
    recommendations: []
  };

  // HbA1c评估
  if (hba1cData && hba1cData.length > 0) {
    const latestHbA1c = hba1cData[hba1cData.length - 1];
    const target = determineHbA1cTarget(patientProfile);

    metrics.glycemic_control.hba1c = {
      value: latestHbA1c.value,
      date: latestHbA1c.date,
      target: target.max,
      at_goal: latestHbA1c.value <= target.max,
      classification: classifyHbA1c(latestHbA1c.value),
      trend: calculateHbA1cTrend(hba1cData),
      target_rationale: target.rationale
    };

    // 计算HbA1c达标率
    const readingsAtGoal = hba1cData.filter(h => h.value <= target.max).length;
    metrics.glycemic_control.hba1c.goal_attainment_rate = Math.round(
      (readingsAtGoal / hba1cData.length) * 1000
    ) / 10;
  }

  // 空腹血糖评估
  if (glucoseData && glucoseData.length > 0) {
    const avgGlucose = glucoseData.reduce((sum, g) => sum + g.value, 0) / glucoseData.length;

    metrics.glycemic_control.fasting_glucose_average = {
      value: Math.round(avgGlucose * 10) / 10,
      unit: 'mmol/L',
      target_max: REFERENCE_RANGES.diabetes.fasting_glucose.target.max,
      classification: classifyFastingGlucose(avgGlucose)
    };
  }

  // 计算综合评分
  const scores = [];
  if (metrics.glycemic_control.hba1c) {
    scores.push(metrics.glycemic_control.hba1c.at_goal ? 1 : 0);
  }

  if (scores.length > 0) {
    metrics.overall.composite_score = Math.round(
      (scores.reduce((a, b) => a + b, 0) / scores.length) * 100
    );
    metrics.overall.grade = getQualityGrade(metrics.overall.composite_score / 100);
  }

  return metrics;
}

/**
 * 确定HbA1c目标
 */
function determineHbA1cTarget(patientProfile) {
  const age = patientProfile.age || 0;
  const complications = patientProfile.complications || [];

  // 老年、有严重低血糖风险、严重并发症
  if (age >= 65 || complications.includes('severe_hypoglycemia') || complications.includes('advanced_complications')) {
    return {
      max: REFERENCE_RANGES.diabetes.hba1c.loose_target.max,
      rationale: '宽松目标<8.0%（老年/低血糖风险/严重并发症）'
    };
  }

  // 年轻、病程短、无并发症
  if (age < 45 && (!complications || complications.length === 0)) {
    return {
      max: REFERENCE_RANGES.diabetes.hba1c.tight_target.max,
      rationale: '严格目标<6.5%（年轻/无并发症）'
    };
  }

  // 一般目标
  return {
    max: REFERENCE_RANGES.diabetes.hba1c.general_target.max,
    rationale: '一般目标<7.0%（ADA标准）'
  };
}

/**
 * HbA1c分类
 */
function classifyHbA1c(value) {
  const range = REFERENCE_RANGES.diabetes.hba1c.classification;

  if (value < range.normal.max) return { category: 'normal', label: '正常' };
  if (value >= range.prediabetes.min && value <= range.prediabetes.max) {
    return { category: 'prediabetes', label: '糖尿病前期' };
  }
  return { category: 'diabetes', label: '糖尿病' };
}

/**
 * 空腹血糖分类
 */
function classifyFastingGlucose(value) {
  const range = REFERENCE_RANGES.diabetes.fasting_glucose.classification;

  if (value < range.normal.max) return { category: 'normal', label: '正常' };
  if (value >= range.impaired.min && value <= range.impaired.max) {
    return { category: 'impaired', label: '糖尿病前期' };
  }
  return { category: 'diabetes', label: '糖尿病' };
}

/**
 * 计算HbA1c趋势
 */
function calculateHbA1cTrend(hba1cData) {
  if (hba1cData.length < 2) {
    return { trend: 'insufficient_data' };
  }

  const latest = hba1cData[hba1cData.length - 1];
  const previous = hba1cData[hba1cData.length - 2];

  const change = latest.value - previous.value;

  if (change > 0.3) {
    return {
      trend: 'worsening',
      change: change,
      description: `HbA1c升高${change.toFixed(1)}%（${previous.value.toFixed(1)}% → ${latest.value.toFixed(1)}%）`
    };
  } else if (change < -0.3) {
    return {
      trend: 'improving',
      change: change,
      description: `HbA1c降低${Math.abs(change).toFixed(1)}%（${previous.value.toFixed(1)}% → ${latest.value.toFixed(1)}%）`
    };
  }

  return {
    trend: 'stable',
    latest_value: latest.value,
    description: 'HbA1c稳定'
  };
}

/**
 * 高血压控制分类
 */
function classifyHypertensionControl(goalRate, avgSystolic, avgDiastolic, target) {
  const atGoal = avgSystolic <= target.systolic_max && avgDiastolic <= target.diastolic_max;

  if (goalRate >= 0.8 && atGoal) {
    return {
      category: 'optimal',
      label: '理想控制',
      description: '血压控制良好，继续保持'
    };
  }

  if (goalRate >= 0.5 && atGoal) {
    return {
      category: 'good',
      label: '良好控制',
      description: '血压达标，但达标率需提高'
    };
  }

  if (goalRate >= 0.3) {
    return {
      category: 'fair',
      label: '一般控制',
      description: '部分时间达标，需加强干预'
    };
  }

  return {
    category: 'poor',
    label: '控制不佳',
    description: '血压持续不达标，需要调整治疗方案'
  };
}

/**
 * 生成高血压管理建议
 */
function generateHypertensionRecommendations(goalRate, avgSystolic, avgDiastolic, target, trend) {
  const recommendations = [];

  // 1. 评估达标情况
  if (goalRate < 0.5) {
    recommendations.push({
      priority: 'urgent',
      category: 'medication_adjustment',
      recommendation: '血压达标率低于50%，建议咨询医生调整治疗方案',
      actions: ['讨论增加剂量或添加药物', '考虑依从性问题', '评估继发性高血压可能']
    });
  }

  // 2. 评估生活方式
  if (avgSystolic > target.systolic_max || avgDiastolic > target.diastolic_max) {
    recommendations.push({
      priority: 'high',
      category: 'lifestyle_modification',
      recommendation: '血压未达标，强化生活方式干预',
      actions: [
        'DASH饮食（限钠<5g/天，增加钾、镁、钙摄入）',
        '规律有氧运动（每周150分钟中等强度）',
        '限制酒精（男性≤2杯/天，女性≤1杯/天）',
        '减重（每减重1kg，血压降低约1 mmHg）',
        '减轻压力，充足睡眠（7-8小时/天）'
      ]
    });
  }

  // 3. 评估监测依从性
  recommendations.push({
    priority: 'medium',
    category: 'monitoring',
    recommendation: '继续家庭血压监测',
    actions: [
      '每天早晚各测量1次',
      '记录血压日志',
      '每次测量后静坐5分钟',
      '使用合适的袖带尺寸'
    ]
  });

  // 4. 趋势分析
  if (trend.trend === 'worsening') {
    recommendations.push({
      priority: 'urgent',
      category: 'trend_alert',
      recommendation: '血压恶化警报',
      actions: [
        `最近血压升高${Math.abs(trend.change_systolic)} mmHg`,
        '立即咨询医生',
        '评估诱因（药物依从性、疼痛、应激等）',
        '考虑24小时动态血压监测'
      ]
    });
  } else if (trend.trend === 'improving') {
    recommendations.push({
      priority: 'positive',
      category: 'positive_feedback',
      recommendation: '血压改善，继续保持！',
      actions: [
        `血压已降低${Math.abs(trend.change_systolic)} mmHg`,
        '当前治疗方案有效',
        '继续保持生活方式干预'
      ]
    });
  }

  return recommendations;
}

/**
 * 质量等级
 */
function getQualityGrade(score) {
  if (score >= 0.9) return { grade: 'A', label: '优秀', color: 'green' };
  if (score >= 0.8) return { grade: 'B', label: '良好', color: 'blue' };
  if (score >= 0.7) return { grade: 'C', label: '及格', color: 'yellow' };
  if (score >= 0.6) return { grade: 'D', label: '需改进', color: 'orange' };
  return { grade: 'F', label: '不佳', color: 'red' };
}

/**
 * 依从性等级
 */
function getAdherenceGrade(rate) {
  if (rate >= 0.9) return { grade: '优秀', label: '优秀' };
  if (rate >= 0.7) return { grade: '良好', label: '良好' };
  if (rate >= 0.5) return { grade: '一般', label: '一般' };
  return { grade: '差', label: '差' };
}

/**
 * 计算并发症筛查状态
 */
function calculateComplicationScreeningStatus(condition, screeningData, patientProfile) {
  const screeningProtocols = {
    hypertension: {
      screenings: [
        {
          name: 'echocardiogram',
          display_name: '心脏超声',
          frequency: '每2-5年',
          target_organ: 'heart',
          purpose: '左心室肥厚评估'
        },
        {
          name: 'uacr',
          display_name: '尿微量白蛋白/肌酐比',
          frequency: '每年',
          target_organ: 'kidney',
          purpose: '早期肾病检测'
        },
        {
          name: 'egfr',
          display_name: '肾小球滤过率',
          frequency: '每6个月',
          target_organ: 'kidney',
          purpose: '肾功能评估'
        },
        {
          name: 'fundus_exam',
          display_name: '眼底检查',
          frequency: '每年',
          target_organ: 'retina',
          purpose: '高血压视网膜病变'
        }
      ]
    },
    diabetes: {
      screenings: [
        {
          name: 'retinopathy_screening',
          display_name: '糖尿病视网膜病变筛查',
          frequency: '每年',
          target_organ: 'retina',
          purpose: '糖尿病视网膜病变'
        },
        {
          name: 'nephropathy_screening',
          display_name: '糖尿病肾病筛查',
          frequency: '每年',
          target_organ: 'kidney',
          purpose: '糖尿病肾病'
        },
        {
          name: 'neuropathy_screening',
          display_name: '糖尿病神经病变筛查',
          frequency: '每年',
          target_organ: 'nerves',
          purpose: '糖尿病神经病变'
        },
        {
          name: 'foot_exam',
          display_name: '足部检查',
          frequency: '每年',
          target_organ: 'foot',
          purpose: '糖尿病足'
        }
      ]
    }
  };

  const protocol = screeningProtocols[condition];
  if (!protocol) {
    return { error: '未找到该疾病的筛查方案' };
  }

  const results = protocol.screenings.map(screening => {
    const lastScreening = screeningData[screening.name];

    if (!lastScreening) {
      return {
        name: screening.display_name,
        status: 'never_done',
        urgency: 'unknown',
        recommendation: `建议安排${screening.display_name}`,
        frequency: screening.frequency
      };
    }

    // 计算是否过期
    const lastDate = new Date(lastScreening.date);
    const today = new Date();
    const daysSinceLast = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));

    // 解析频率（简单实现）
    const frequencyMonths = parseFrequency(screening.frequency);
    const overdueDays = frequencyMonths * 30 - daysSinceLast;

    return {
      name: screening.display_name,
      last_date: lastScreening.date,
      days_since_last: daysSinceLast,
      overdue: overdueDays > 0,
      urgency: overdueDays > 30 ? 'overdue' : (overdueDays > 0 ? 'due_soon' : 'up_to_date'),
      recommendation: overdueDays > 0 ? `已逾期${overdueDays}天，建议尽快安排` : '按计划进行',
      next_due: new Date(lastDate.getTime() + frequencyMonths * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
  });

  return {
    condition: condition,
    screenings: results,
    overall_compliance: calculateOverallScreeningCompliance(results)
  };
}

/**
 * 解析频率字符串
 */
function parseFrequency(frequencyString) {
  // 简单实现
  if (frequencyString.includes('每年')) return 12;
  if (frequencyString.includes('每2年')) return 24;
  if (frequencyString.includes('每5年')) return 60;
  if (frequencyString.includes('每6个月')) return 6;
  return 12;  // 默认每年
}

/**
 * 计算总体筛查依从性
 */
function calculateOverallScreeningCompliance(screeningResults) {
  const total = screeningResults.length;
  const upToDate = screeningResults.filter(s => !s.overdue && s.status !== 'never_done').length;

  return {
    total: total,
    up_to_date: upToDate,
    overdue: screeningResults.filter(s => s.overdue).length,
    never_done: screeningResults.filter(s => s.status === 'never_done').length,
    compliance_rate: Math.round((upToDate / total) * 1000) / 10
  };
}

/**
 * 导出所有函数
 */
module.exports = {
  // 高血压质量管理
  calculateHypertensionQualityMetrics,
  determineBloodPressureTarget,
  calculateBloodPressureTrend,
  calculateBPVariability,
  calculateHomeMonitoringAdherence,
  classifyHypertensionControl,
  generateHypertensionRecommendations,

  // 糖尿病质量管理
  calculateDiabetesQualityMetrics,
  determineHbA1cTarget,
  classifyHbA1c,
  classifyFastingGlucose,
  calculateHbA1cTrend,

  // 并发症筛查
  calculateComplicationScreeningStatus,

  // 工具函数
  getQualityGrade,
  getAdherenceGrade,

  // 参考值
  REFERENCE_RANGES
};

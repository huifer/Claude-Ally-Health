/**
 * 疾病风险评估引擎
 *
 * 功能：
 * 1. ASCVD心血管风险计算（基于2013 ACC/AHA指南）
 * 2. 风险分层（低/中/高/很高）
 * 3. 干预效果预测
 * 4. 个性化建议生成
 */

class RiskAssessmentEngine {
  constructor() {
    // ASCVD风险计算的beta系数（基于Pooled Cohort Equations）
    this.coefficients = {
      whiteMale: {
        intercept: -19.2383,
        age: 4.2246,
        ageSquared: -1.5469,
        systolicBP: 1.6838,
        treatedBP: 0,
        smoker: 0.6314,
        totalCholesterol: 0.1883,
        hdlCholesterol: -0.5824,
        diabetic: 0.6592
      },
      whiteFemale: {
        intercept: -29.1817,
        age: 4.0053,
        ageSquared: -1.3829,
        systolicBP: 1.6578,
        treatedBP: 0,
        smoker: 0.2895,
        totalCholesterol: 0.1143,
        hdlCholesterol: -0.5084,
        diabetic: 0.7426
      },
      // 可以添加其他人种/族群的系数
    };
  }

  /**
   * 主评估方法
   * @param {Object} patientData - 患者数据
   * @param {Object} options - 选项
   * @returns {Object} 评估结果
   */
  async assess(patientData, options = {}) {
    // 1. 数据验证
    const validatedData = this.validateData(patientData);

    // 2. 计算ASCVD风险
    const ascvdRisk = this.calculateASCVDRisk(validatedData);

    // 3. 风险分层
    const riskCategory = this.categorizeRisk(ascvdRisk.risk10Year);

    // 4. 干预效果预测
    const interventionEffects = this.predictInterventionEffects(validatedData, ascvdRisk);

    // 5. 生成建议
    const recommendations = this.generateRecommendations(validatedData, ascvdRisk, riskCategory, interventionEffects);

    // 6. 生成综合报告
    return {
      timestamp: new Date().toISOString(),
      patientData: patientData,

      summary: this.generateSummary(validatedData, ascvdRisk, riskCategory),

      riskFactors: this.identifyRiskFactors(validatedData),
      modifiableFactors: this.identifyModifiableFactors(validatedData),
      nonModifiableFactors: this.identifyNonModifiableFactors(validatedData),

      ascvdRisk: ascvdRisk,
      riskCategory: riskCategory,
      interventionEffects: interventionEffects,

      recommendations: recommendations,

      visualization: {
        riskBarChart: null,
        interventionComparison: null
      }
    };
  }

  /**
   * 验证数据完整性
   */
  validateData(patientData) {
    const required = ['age', 'gender', 'systolicBP', 'totalCholesterol', 'hdlCholesterol', 'smoker', 'diabetic'];
    const validated = { ...patientData };

    // 默认值
    if (!validated.treatedBP) {
      validated.treatedBP = validated.antihypertensive ? 'yes' : 'no';
    }

    if (!validated.race) {
      validated.race = 'white'; // 默认使用白人系数
    }

    return validated;
  }

  /**
   * 计算ASCVD 10年风险（基于2013 ACC/AHA指南）
   */
  calculateASCVDRisk(data) {
    try {
      const age = parseFloat(data.age);
      const sbp = parseFloat(data.systolicBP);
      const tc = parseFloat(data.totalCholesterol);
      const hdl = parseFloat(data.hdlCholesterol);
      const smoker = data.smoker === 'yes' || data.smoker === true;
      const diabetic = data.diabetic === 'yes' || data.diabetic === true;
      const treated = data.treatedBP === 'yes' || data.treatedBP === true;
      const gender = data.gender;
      const race = data.race || 'white';

      // 选择系数
      const key = gender === 'female' ? race + 'Female' : race + 'Male';
      const beta = this.coefficients[key] || this.coefficients['white' + (gender === 'female' ? 'Female' : 'Male')];

      // 计算总和
      let sum = beta.intercept;
      sum += beta.age * Math.log(age);
      sum += beta.ageSquared * Math.log(age) * Math.log(age);
      sum += beta.systolicBP * Math.log(sbp);
      if (treated) {
        sum += beta.treatedBP;
      }
      sum += beta.smoker * (smoker ? 1 : 0);
      sum += beta.totalCholesterol * Math.log(tc);
      sum += beta.hdlCholesterol * Math.log(hdl);
      sum += beta.diabetic * (diabetic ? 1 : 0);

      // 计算10年风险
      const risk = 1 - Math.pow(0.9573, Math.exp(sum - 28.1567));

      return {
        risk10Year: Math.round(risk * 1000) / 10, // 保留一位小数
        riskPercentage: (risk * 100).toFixed(1),
        calculation: '2013 ACC/AHA Pooled Cohort Equations',
        applicable: age >= 40 && age <= 79
      };
    } catch (error) {
      console.error('ASCVD风险计算错误:', error.message);
      return {
        risk10Year: null,
        riskPercentage: '计算失败',
        calculation: '2013 ACC/AHA Pooled Cohort Equations',
        applicable: false,
        error: error.message
      };
    }
  }

  /**
   * 风险分层
   */
  categorizeRisk(risk10Year) {
    if (risk10Year === null) {
      return { category: 'unknown', label: '无法评估', color: 'gray' };
    }

    const risk = parseFloat(risk10Year);

    if (risk < 5) {
      return {
        category: 'low',
        label: '低风险',
        description: '<5% 10年风险',
        color: 'green',
        recommendations: '保持健康生活方式'
      };
    } else if (risk < 7.5) {
      return {
        category: 'borderline',
        label: '边界风险',
        description: '5-7.5% 10年风险',
        color: 'yellow',
        recommendations: '建议生活方式干预'
      };
    } else if (risk < 10) {
      return {
        category: 'intermediate',
        label: '中等风险',
        description: '7.5-10% 10年风险',
        color: 'orange',
        recommendations: '建议考虑药物治疗'
      };
    } else if (risk < 20) {
      return {
        category: 'high',
        label: '高风险',
        description: '10-20% 10年风险',
        color: 'red',
        recommendations: '建议药物治疗'
      };
    } else {
      return {
        category: 'very_high',
        label: '很高风险',
        description: '>20% 10年风险',
        color: 'darkred',
        recommendations: '积极药物治疗，强化控制'
      };
    }
  }

  /**
   * 识别风险因素
   */
  identifyRiskFactors(data) {
    const factors = {
      nonModifiable: [],
      modifiable: []
    };

    // 不可改变因素
    if (parseFloat(data.age) >= 55) {
      factors.nonModifiable.push({ name: '年龄≥55岁', impact: 'moderate' });
    }
    if (data.gender === 'male') {
      factors.nonModifiable.push({ name: '男性', impact: 'moderate' });
    }
    if (data.familyHistory === 'yes' || data.familyHistoryOfCAD) {
      factors.nonModifiable.push({ name: '心血管病家族史', impact: 'high' });
    }

    // 可改变因素
    if (data.systolicBP >= 140) {
      factors.modifiable.push({
        name: '高血压',
        value: data.systolicBP + ' mmHg',
        impact: 'high',
        relativeRisk: 2.0
      });
    }

    if (parseFloat(data.totalCholesterol) >= 5.2) {
      factors.modifiable.push({
        name: '高胆固醇',
        value: data.totalCholesterol + ' mmol/L',
        impact: 'moderate',
        relativeRisk: 1.5
      });
    }

    if (parseFloat(data.hdlCholesterol) < 1.0) {
      factors.modifiable.push({
        name: '低HDL-C',
        value: data.hdlCholesterol + ' mmol/L',
        impact: 'moderate',
        relativeRisk: 1.3
      });
    }

    if (data.smoker === 'yes' || data.smoker === true) {
      factors.modifiable.push({
        name: '吸烟',
        impact: 'very_high',
        relativeRisk: 2.0
      });
    }

    if (data.diabetic === 'yes' || data.diabetic === true) {
      factors.modifiable.push({
        name: '糖尿病',
        impact: 'high',
        relativeRisk: 2.0
      });
    }

    return factors;
  }

  /**
   * 识别可改变因素
   */
  identifyModifiableFactors(data) {
    const factors = this.identifyRiskFactors(data);
    return factors.modifiable || [];
  }

  /**
   * 识别不可改变因素
   */
  identifyNonModifiableFactors(data) {
    const factors = this.identifyRiskFactors(data);
    return factors.nonModifiable || [];
  }

  /**
   * 预测干预效果
   */
  predictInterventionEffects(data, ascvdRisk) {
    const effects = {
      baselineRisk: ascvdRisk.risk10Year,
      interventions: []
    };

    // 戒烟效果
    if (data.smoker === 'yes' || data.smoker === true) {
      const riskReduction = effects.baselineRisk * 0.5; // 戒烟可降低约50%风险
      effects.interventions.push({
        name: '戒烟',
        riskReduction: Math.round(riskReduction * 10) / 10,
        newRisk: Math.round((effects.baselineRisk - riskReduction) * 10) / 10,
        timeToEffect: '戒烟后5年内风险显著降低',
        recommendation: '最高优先级干预，最大获益潜力'
      });
    }

    // 血压控制效果（目标<130/80）
    const currentSBP = parseFloat(data.systolicBP);
    if (currentSBP >= 140) {
      const sbpReduction = currentSBP - 125; // 降至125 mmHg
      const riskReduction = (sbpReduction / currentSBP) * effects.baselineRisk * 0.3; // 约30%的血压风险可转化为ASCVD风险降低
      effects.interventions.push({
        name: '血压控制',
        current: currentSBP + ' mmHg',
        target: '<130/80 mmHg',
        riskReduction: Math.round(riskReduction * 10) / 10,
        newRisk: Math.round((effects.baselineRisk - riskReduction) * 10) / 10,
        recommendation: 'ACEI或ARB类降压药，DASH饮食，限钠，运动'
      });
    }

    // 他汀类药物效果
    const tc = parseFloat(data.totalCholesterol);
    if (tc >= 4.1) { // LDL-C升高
      const riskReduction = effects.baselineRisk * 0.25; // 他汀可降低约25-30%心血管风险
      effects.interventions.push({
        name: '他汀类药物',
        riskReduction: Math.round(riskReduction * 10) / 10,
        newRisk: Math.round((effects.baselineRisk - riskReduction) * 10) / 10,
        timeToEffect: '1-2年内风险显著降低',
        recommendation: '中等强度他汀（如阿托伐他汀10-20mg）'
      });
    }

    // 生活方式综合干预效果
    effects.interventions.push({
      name: '综合生活方式干预',
      components: ['DASH饮食', '规律运动', '减重', '限酒'],
      riskReduction: Math.round(effects.baselineRisk * 0.3 * 10) / 10,
      newRisk: Math.round(effects.baselineRisk * 0.7 * 10) / 10,
      timeToEffect: '3-6个月开始见效',
      recommendation: '最经济有效的干预方式'
    });

    return effects;
  }

  /**
   * 生成建议
   */
  generateRecommendations(data, ascvdRisk, riskCategory, interventionEffects) {
    const recommendations = {
      priority: [],
      lifestyle: [],
      pharmacological: [],
      screening: [],
      followUp: []
    };

    // 基于风险分层推荐
    if (riskCategory.category === 'low') {
      recommendations.lifestyle.push('保持当前健康生活方式');
      recommendations.lifestyle.push('每年进行健康体检');
    } else if (riskCategory.category === 'borderline') {
      recommendations.lifestyle.push('开始DASH饮食');
      recommendations.lifestyle.push('每周150分钟中等强度运动');
      recommendations.lifestyle.push('如吸烟，强烈建议戒烟');
    } else if (riskCategory.category === 'intermediate') {
      recommendations.lifestyle.push('DASH饮食 + 限钠（<1500mg/天）');
      recommendations.lifestyle.push('每周150分钟中等强度有氧运动');
      recommendations.lifestyle.push('减重5-10%（如超重）');
      recommendations.lifestyle.push('戒烟、限酒');
      recommendations.pharmacological.push('与医生讨论是否需要他汀类药物');
    } else if (riskCategory.category === 'high' || riskCategory.category === 'very_high') {
      recommendations.lifestyle.push('强化生活方式干预');
      recommendations.pharmacological.push('中等强度他汀类药物治疗');
      if (parseFloat(data.systolicBP) >= 140) {
        recommendations.pharmacological.push('降压药物治疗（ACEI或ARB）');
      }
      recommendations.priority.push('尽快就诊心内科');
      recommendations.priority.push('完善心血管检查（心电图、超声心动图）');
    }

    // 特定因素建议
    if (data.diabetic === 'yes') {
      recommendations.screening.push('每年糖尿病并发症筛查');
      recommendations.screening.push('尿微量白蛋白/肌酐比');
      recommendations.screening.push('眼底检查');
    }

    if (data.smoker === 'yes') {
      recommendations.priority.push('戒烟是最重要的干预措施');
    }

    // 随访计划
    if (riskCategory.category === 'low') {
      recommendations.followUp.push('每年复查风险评估');
    } else if (riskCategory.category === 'borderline' || riskCategory.category === 'intermediate') {
      recommendations.followUp.push('3-6个月后复查');
      recommendations.followUp.push('重新评估风险');
    } else {
      recommendations.followUp.push('1个月后复查');
      recommendations.followUp.push('评估干预效果');
      recommendations.followUp.push('调整治疗方案');
    }

    return recommendations;
  }

  /**
   * 生成摘要
   */
  generateSummary(data, ascvdRisk, riskCategory) {
    if (ascvdRisk.risk10Year === null) {
      return `年龄${data.age}岁${data.gender === 'male' ? '男性' : '女性'}，ASCVD风险评估模型适用范围为40-79岁。当前年龄${data.age}岁${data.age < 40 ? '低于' : '高于'}模型适用范围。`;
    }

    const risk = ascvdRisk.riskPercentage;
    const category = riskCategory.label;
    const color = riskCategory.color;

    return `评估结果：${category}（${risk}% 10年ASCVD风险）

这意味：未来10年内，每${Math.round(100 / ascvdRisk.risk10Year)}个与您相似的人中，可能有1人会发生心血管事件（心梗、脑卒中）。

风险分层：${color === 'green' ? '✅ 低风险' : color === 'yellow' ? '⚠️ 边界风险' : color === 'orange' ? '⚠️ 中等风险' : '🚨 高风险'}

建议：${riskCategory.recommendations}`;
  }
}

module.exports = RiskAssessmentEngine;

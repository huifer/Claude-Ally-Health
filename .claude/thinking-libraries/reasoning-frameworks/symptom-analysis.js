/**
 * 症状分析推理引擎
 *
 * 功能：
 * 1. 症状特征提取（部位、性质、持续时间、严重程度）
 * 2. 鉴别诊断生成（基于知识库）
 * 3. 证据权重评估（支持点/反对点）
 * 4. 可能性排序（概率 + 危害性）
 * 5. 危险信号识别
 * 6. 建议检查生成
 */

const fs = require('fs');
const path = require('path');

class SymptomAnalysisEngine {
  constructor() {
    this.knowledgeBase = this.loadKnowledgeBase();
  }

  /**
   * 加载症状-疾病知识库
   */
  loadKnowledgeBase() {
    const dbPath = path.join(__dirname, '../knowledge-bases/symptom-disease-db.json');
    try {
      const data = fs.readFileSync(dbPath, 'utf8');
      const db = JSON.parse(data);
      return db.symptoms;
    } catch (error) {
      console.error('无法加载症状知识库:', error.message);
      return {};
    }
  }

  /**
   * 主分析方法
   * @param {Object} userInput - 用户输入的症状信息
   * @param {Object} patientData - 患者数据
   * @returns {Object} 分析结果
   */
  async analyze(userInput, patientData = {}) {
    // 1. 解析症状特征
    const symptoms = this.parseSymptoms(userInput);

    // 2. 对每个症状进行分析
    const analyses = [];
    for (const symptom of symptoms) {
      const analysis = await this.analyzeSingleSymptom(symptom, patientData);
      analyses.push(analysis);
    }

    // 3. 生成综合报告
    return this.generateComprehensiveReport(analyses, userInput, patientData);
  }

  /**
   * 解析用户输入的症状
   * @param {Object} userInput
   * @returns {Array} 症状列表
   */
  parseSymptoms(userInput) {
    const symptoms = [];

    // 主症状
    const mainSymptom = this.identifyMainSymptom(userInput.description || '');
    if (mainSymptom) {
      symptoms.push({
        name: mainSymptom,
        ...this.extractFeatures(userInput.description || ''),
        duration: userInput.duration || null,
        severity: userInput.severity || this.assessSeverity(userInput.description || ''),
        timing: userInput.timing || null
      });
    }

    // 伴随症状
    if (userInput.associated_symptoms && userInput.associated_symptoms.length > 0) {
      userInput.associated_symptoms.forEach(symptom => {
        const identified = this.identifyMainSymptom(symptom);
        if (identified && identified !== mainSymptom) {
          symptoms.push({
            name: identified,
            isAssociated: true
          });
        }
      });
    }

    return symptoms;
  }

  /**
   * 识别主症状（匹配知识库）
   * @param {String} description
   * @returns {String|null} 标准症状名称
   */
  identifyMainSymptom(description) {
    const lowerDesc = description.toLowerCase();

    // 症状关键词映射
    const symptomKeywords = {
      '头痛': ['头痛', '头疼', '头部疼痛'],
      '胸痛': ['胸痛', '胸部疼痛', '胸闷胸痛'],
      '腹痛': ['腹痛', '胃痛', '肚子痛', '腹部疼痛'],
      '发热': ['发热', '发烧', '体温升高', '发热'],
      '咳嗽': ['咳嗽', '咳', '咳嗽'],
      '呼吸困难': ['呼吸困难', '气促', '气短', '呼吸急促', '喘不上气'],
      '心悸': ['心悸', '心慌', '心跳快', '心跳加速'],
      '水肿': ['水肿', '浮肿', '肿胀', '腿肿'],
      '恶心呕吐': ['恶心', '呕吐', '想吐'],
      '腹泻': ['腹泻', '拉肚子', '便溏', '大便次数多'],
      '便秘': ['便秘', '排便困难', '大便干结'],
      '头晕': ['头晕', '眩晕', '头昏'],
      '乏力': ['乏力', '疲劳', '疲倦', '没精神', '无力'],
      '尿频尿急': ['尿频', '尿急', '小便多', '尿不尽'],
      '关节痛': ['关节痛', '关节疼', '关节肿痛']
    };

    for (const [symptom, keywords] of Object.entries(symptomKeywords)) {
      for (const keyword of keywords) {
        if (lowerDesc.includes(keyword)) {
          return symptom;
        }
      }
    }

    return null;
  }

  /**
   * 提取症状特征
   * @param {String} description
   * @returns {Object} 特征对象
   */
  extractFeatures(description) {
    const features = {
      location: [],
      quality: [],
      timing: [],
      triggers: [],
      relievers: []
    };

    const lowerDesc = description.toLowerCase();

    // 部位特征
    const locationMap = {
      '双侧': ['双侧', '两边', '两侧'],
      '单侧': ['单侧', '一侧', '左边', '右面'],
      '前额': ['前额', '额头'],
      '枕部': ['枕部', '后脑', '后头'],
      '眼周': ['眼周', '眼睛周围'],
      '胸骨后': ['胸骨后', '胸骨后面'],
      '侧腹部': ['侧腹', '腰部'],
      '上腹部': ['上腹', '胃'],
      '右下腹': ['右下腹']
    };

    // 性质特征
    const qualityMap = {
      '胀痛': ['胀痛', '胀'],
      '搏动性': ['搏动', '跳痛', '一跳一跳'],
      '刺痛': ['刺痛', '针刺样', '像针扎'],
      '烧灼感': ['烧灼', '烧心', '火烧'],
      '压迫感': ['压迫', '紧箍', '紧'],
      '绞痛': ['绞痛', '阵发性剧痛']
    };

    // 时间特征
    const timingMap = {
      '持续性': ['持续', '一直', '不停'],
      '间歇性': ['间歇', '阵发', '断断续续'],
      '晨起': ['晨起', '早晨', '早上'],
      '夜间': ['夜间', '晚上', '夜里'],
      '活动后': ['活动后', '运动后']
    };

    // 提取所有特征
    [locationMap, qualityMap, timingMap].forEach(map => {
      for (const [feature, keywords] of Object.entries(map)) {
        for (const keyword of keywords) {
          if (lowerDesc.includes(keyword)) {
            // 确定添加到哪个数组
            if (locationMap[feature]) features.location.push(feature);
            else if (qualityMap[feature]) features.quality.push(feature);
            else if (timingMap[feature]) features.timing.push(feature);
          }
        }
      }
    });

    return features;
  }

  /**
   * 评估严重程度
   * @param {String} description
   * @returns {String} 严重程度
   */
  assessSeverity(description) {
    const lowerDesc = description.toLowerCase();

    // 重度特征
    if (['剧烈', '难以忍受', '非常严重', '严重', '无法', '不能'].some(k => lowerDesc.includes(k))) {
      return 'severe';
    }

    // 轻度特征
    if (['轻微', '有点', '稍微', '轻度', '轻'].some(k => lowerDesc.includes(k))) {
      return 'mild';
    }

    return 'moderate';
  }

  /**
   * 分析单个症状
   * @param {Object} symptom
   * @param {Object} patientData
   * @returns {Object} 分析结果
   */
  async analyzeSingleSymptom(symptom, patientData) {
    const symptomInfo = this.knowledgeBase[symptom.name];

    if (!symptomInfo) {
      return {
        symptom: symptom.name,
        error: '知识库中未找到该症状',
        differentialDiagnoses: []
      };
    }

    // 1. 生成鉴别诊断
    const diagnoses = this.generateDifferentialDiagnoses(symptom, patientData, symptomInfo);

    // 2. 排序诊断（按可能性和风险）
    const rankedDiagnoses = this.rankDiagnoses(diagnoses);

    // 3. 识别危险信号
    const redFlags = this.identifyRedFlags(symptom, symptomInfo);

    // 4. 生成建议
    const recommendations = this.generateRecommendations(rankedDiagnoses, redFlags);

    return {
      symptom: symptom.name,
      category: symptomInfo.category,
      features: symptom,
      differentialDiagnoses: rankedDiagnoses,
      redFlags: redFlags,
      recommendations: recommendations,
      keyQuestions: symptomInfo.key_questions || []
    };
  }

  /**
   * 生成鉴别诊断
   * @param {Object} symptom
   * @param {Object} patientData
   * @param {Object} symptomInfo
   * @returns {Array} 诊断列表
   */
  generateDifferentialDiagnoses(symptom, patientData, symptomInfo) {
    const diagnoses = [];

    if (!symptomInfo.differential_diagnoses) {
      return diagnoses;
    }

    symptomInfo.differential_diagnoses.forEach(diag => {
      // 计算可能性
      const likelihood = this.calculateLikelihood(diag, symptom, patientData);

      // 评估支持/反对证据
      const evidence = this.assessEvidence(diag, symptom);

      diagnoses.push({
        name: diag.name,
        likelihood: likelihood,
        risk: diag.risk,
        supportingEvidence: evidence.supporting,
        opposingEvidence: evidence.opposing,
        typicalAge: diag.typical_age_range,
        genderPredilection: diag.gender_predilection
      });
    });

    return diagnoses;
  }

  /**
   * 计算诊断可能性
   * @param {Object} diagnosis
   * @param {Object} symptom
   * @param {Object} patientData
   * @returns {Number} 可能性 (0-1)
   */
  calculateLikelihood(diagnosis, symptom, patientData) {
    let likelihood = diagnosis.likelihood_baseline;

    // 基于支持特征调整
    if (symptom.features && diagnosis.supporting_features) {
      diagnosis.supporting_features.forEach(feature => {
        const found = this.hasFeature(symptom, feature);
        if (found) {
          likelihood *= 1.3; // 支持，增加30%概率
        }
      });
    }

    // 基于反对特征调整
    if (symptom.features && diagnosis.opposing_features) {
      diagnosis.opposing_features.forEach(feature => {
        const found = this.hasFeature(symptom, feature);
        if (found) {
          likelihood *= 0.5; // 反对，降低50%概率
        }
      });
    }

    // 基于患者特征调整
    if (patientData.age) {
      // 年龄调整
      const age = parseInt(patientData.age);
      if (diagnosis.typical_age_range) {
        if (diagnosis.typical_age_range.includes('50以上') && age < 50) {
          likelihood *= 0.7;
        } else if (diagnosis.typical_age_range.includes('50以下') && age >= 50) {
          likelihood *= 0.8;
        }
      }

      // 心血管疾病风险调整
      if (age > 50 && diagnosis.name.includes('心血管')) {
        likelihood *= 1.2;
      }
    }

    // 性别调整
    if (patientData.gender && diagnosis.gender_predilection) {
      if (diagnosis.gender_predilection.includes('女性>') && patientData.gender === 'male') {
        likelihood *= 0.7;
      } else if (diagnosis.gender_predilection.includes('男性>') && patientData.gender === 'female') {
        likelihood *= 0.7;
      }
    }

    // 限制在合理范围内
    return Math.max(0.01, Math.min(likelihood, 0.95));
  }

  /**
   * 检查是否具有某特征
   * @param {Object} symptom
   * @param {String} feature
   * @returns {Boolean}
   */
  hasFeature(symptom, feature) {
    if (!symptom.features) return false;

    // 检查位置
    if (symptom.features.location && symptom.features.location.includes(feature)) return true;

    // 检查性质
    if (symptom.features.quality && symptom.features.quality.includes(feature)) return true;

    // 检查时间
    if (symptom.features.timing && symptom.features.timing.includes(feature)) return true;

    return false;
  }

  /**
   * 评估证据
   * @param {Object} diagnosis
   * @param {Object} symptom
   * @returns {Object} 证据对象
   */
  assessEvidence(diagnosis, symptom) {
    const supporting = [];
    const opposing = [];

    // 检查支持证据
    if (diagnosis.supporting_features && symptom.features) {
      diagnosis.supporting_features.forEach(feature => {
        if (this.hasFeature(symptom, feature)) {
          supporting.push(feature);
        }
      });
    }

    // 检查反对证据
    if (diagnosis.opposing_features && symptom.features) {
      diagnosis.opposing_features.forEach(feature => {
        if (this.hasFeature(symptom, feature)) {
          opposing.push(feature);
        }
      });
    }

    return { supporting, opposing };
  }

  /**
   * 排序诊断
   * @param {Array} diagnoses
   * @returns {Array} 排序后的诊断
   */
  rankDiagnoses(diagnoses) {
    return diagnoses.sort((a, b) => {
      // 首先按风险排序（高风险优先）
      const riskOrder = { 'very_high': 1, 'high': 2, 'moderate': 3, 'low': 4 };
      const riskComparison = riskOrder[a.risk] - riskOrder[b.risk];

      if (riskComparison !== 0) return riskComparison;

      // 然后按可能性排序（高可能性优先）
      return b.likelihood - a.likelihood;
    });
  }

  /**
   * 识别危险信号
   * @param {Object} symptom
   * @param {Object} symptomInfo
   * @returns {Array} 危险信号列表
   */
  identifyRedFlags(symptom, symptomInfo) {
    const redFlags = [];

    if (!symptomInfo.red_flags) return redFlags;

    // 检查严重程度
    if (symptom.severity === 'severe') {
      redFlags.push('症状严重（' + symptom.severity + '）');
    }

    // 检查持续时间
    if (symptom.duration) {
      // 提取天数
      const days = this.extractDays(symptom.duration);
      if (days > 7) {
        redFlags.push('症状持续超过7天');
      }
    }

    // 添加知识库中的危险信号
    // 这里需要根据症状描述匹配，暂时全部添加
    if (symptomInfo.red_flags && symptomInfo.red_flags.length > 0) {
      redFlags.push(...symptomInfo.red_flags);
    }

    return [...new Set(redFlags)]; // 去重
  }

  /**
   * 从描述中提取天数
   * @param {String} duration
   * @returns {Number}
   */
  extractDays(duration) {
    const match = duration.match(/(\d+)\s*(天|日)/);
    if (match) {
      return parseInt(match[1]);
    }
    return 0;
  }

  /**
   * 生成建议
   * @param {Array} diagnoses
   * @param {Array} redFlags
   * @returns {Object} 建议对象
   */
  generateRecommendations(diagnoses, redFlags) {
    const recommendations = {
      urgency: 'observation',
      tests: [],
      selfCare: [],
      medicalAdvice: []
    };

    // 1. 判断紧急程度
    if (redFlags.length > 0 || diagnoses.some(d => d.risk === 'very_high' || d.risk === 'high')) {
      recommendations.urgency = 'immediate';
      recommendations.medicalAdvice.push('建议立即就医或拨打急救电话');
    } else if (diagnoses.some(d => d.risk === 'moderate')) {
      recommendations.urgency = 'soon';
      recommendations.medicalAdvice.push('建议尽快就医（1-2天内）');
    } else {
      recommendations.urgency = 'observation';
      recommendations.medicalAdvice.push('可居家观察，如症状加重或持续超过1周建议就医');
    }

    // 2. 建议检查
    if (diagnoses.length > 0) {
      const topDiagnosis = diagnoses[0];
      if (topDiagnosis.name.includes('头痛')) {
        recommendations.tests.push('血压测量');
        recommendations.tests.push('神经系统检查');
      } else if (topDiagnosis.name.includes('胸痛')) {
        recommendations.tests.push('心电图');
        recommendations.tests.push('心肌酶谱');
      } else if (topDiagnosis.name.includes('腹痛')) {
        recommendations.tests.push('腹部超声');
        recommendations.tests.push('血常规');
      }
    }

    // 3. 自我护理建议
    recommendations.selfCare.push('充分休息');
    recommendations.selfCare.push('记录症状日记');
    recommendations.selfCare.push('观察症状变化');

    return recommendations;
  }

  /**
   * 生成综合报告
   * @param {Array} analyses
   * @param {Object} userInput
   * @param {Object} patientData
   * @returns {Object} 综合报告
   */
  generateComprehensiveReport(analyses, userInput, patientData) {
    const mainAnalysis = analyses[0]; // 主症状分析

    return {
      timestamp: new Date().toISOString(),
      userInput: userInput,
      patientData: patientData,

      summary: this.generateSummary(mainAnalysis),

      mainSymptom: {
        name: mainAnalysis.symptom,
        category: mainAnalysis.category,
        features: mainAnalysis.features
      },

      differentialDiagnoses: mainAnalysis.differentialDiagnoses,

      redFlags: mainAnalysis.redFlags,

      recommendations: mainAnalysis.recommendations,

      keyQuestions: mainAnalysis.keyQuestions,

      visualization: {
        mindmap: null, // 将由可视化工具生成
        flowchart: null
      }
    };
  }

  /**
   * 生成摘要
   * @param {Object} analysis
   * @returns {String}
   */
  generateSummary(analysis) {
    const topDiagnosis = analysis.differentialDiagnoses[0];
    const likelihood = Math.round(topDiagnosis.likelihood * 100);

    return `主要症状：${analysis.symptom}
最可能的诊断：${topDiagnosis.name}（可能性：${likelihood}%）
需要排除的诊断：${analysis.differentialDiagnoses.slice(1, 3).map(d => d.name + '（' + Math.round(d.likelihood * 100) + '%）').join('、')}`;
  }
}

module.exports = SymptomAnalysisEngine;

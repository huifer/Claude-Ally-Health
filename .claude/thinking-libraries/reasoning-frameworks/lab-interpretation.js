/**
 * 检查结果解读推理引擎
 *
 * 功能：
 * 1. 异常结果识别和分类
 * 2. 模式识别（关联指标异常）
 * 3. 病理生理机制推理
 * 4. 鉴别诊断生成
 * 5. 临床意义解释
 */

const fs = require('fs');
const path = require('path');

class LabInterpretationEngine {
  constructor() {
    this.knowledgeBase = this.loadKnowledgeBase();
  }

  /**
   * 加载检查异常知识库
   */
  loadKnowledgeBase() {
    const dbPath = path.join(__dirname, '../knowledge-bases/lab-abnormality-db.json');
    try {
      const data = fs.readFileSync(dbPath, 'utf8');
      const db = JSON.parse(data);
      return db['lab abnormalities'];
    } catch (error) {
      console.error('无法加载检查异常知识库:', error.message);
      return {};
    }
  }

  /**
   * 主分析方法
   * @param {Object} labResults - 检查结果
   * @param {Object} patientData - 患者数据
   * @returns {Object} 分析结果
   */
  async interpret(labResults, patientData = {}) {
    // 1. 识别异常结果
    const abnormalities = this.identifyAbnormalities(labResults);

    // 2. 模式识别
    const patterns = this.identifyPatterns(abnormalities, labResults);

    // 3. 病理生理机制推理
    const pathophysiology = this.reasonPathophysiology(abnormalities, patterns);

    // 4. 鉴别诊断
    const diagnoses = this.generateDifferentialDiagnoses(abnormalities, patterns, patientData);

    // 5. 临床意义解释
    const significance = this.explainClinicalSignificance(abnormalities, patterns, patientData);

    // 6. 生成建议
    const recommendations = this.generateRecommendations(abnormalities, patterns, diagnoses);

    // 7. 生成综合报告
    return {
      timestamp: new Date().toISOString(),
      labResults: labResults,
      patientData: patientData,

      summary: this.generateSummary(abnormalities, patterns),

      abnormalities: abnormalities,
      patterns: patterns,
      pathophysiology: pathophysiology,
      diagnoses: diagnoses,
      clinicalSignificance: significance,
      recommendations: recommendations,

      visualization: {
        patternsChart: null, // 将由可视化工具生成
        correlationMap: null
      }
    };
  }

  /**
   * 识别异常结果
   * @param {Object} labResults
   * @returns {Array}
   */
  identifyAbnormalities(labResults) {
    const abnormalities = [];

    // 血压
    if (labResults.blood_pressure) {
      const bp = labResults.blood_pressure;
      const systolic = bp.systolic || bp.sbp;
      const diastolic = bp.diastolic || bp.dbp;

      if (systolic >= 140 || diastolic >= 90) {
        abnormalities.push({
          test: '血压',
          value: `${systolic}/${diastolic} mmHg`,
          abnormality: '血压升高',
          severity: this.classifyBloodPressureSeverity(systolic, diastolic),
          category: 'cardiovascular'
        });
      } else if (systolic < 90 || diastolic < 60) {
        abnormalities.push({
          test: '血压',
          value: `${systolic}/${diastolic} mmHg`,
          abnormality: '血压降低',
          severity: 'mild',
          category: 'cardiovascular'
        });
      }
    }

    // 血脂
    if (labResults.lipids) {
      const lipids = labResults.lipids;

      // 总胆固醇
      if (lipids.total_cholesterol) {
        const tc = this.parseCholesterolValue(lipids.total_cholesterol);
        if (tc >= 6.2) { // >=240 mg/dL
          abnormalities.push({
            test: '总胆固醇',
            value: lipids.total_cholesterol,
            abnormality: '总胆固醇升高',
            severity: tc >= 7.0 ? 'severe' : 'moderate',
            category: 'lipid'
          });
        }
      }

      // LDL-C
      if (lipids.ldl) {
        const ldl = this.parseCholesterolValue(lipids.ldl);
        if (ldl >= 4.1) { // >=160 mg/dL
          abnormalities.push({
            test: 'LDL-C',
            value: lipids.ldl,
            abnormality: 'LDL-C升高',
            severity: ldl >= 4.9 ? 'severe' : 'moderate',
            category: 'lipid'
          });
        }
      }

      // HDL-C
      if (lipids.hdl) {
        const hdl = this.parseCholesterolValue(lipids.hdl);
        const gender = labResults.patient_gender || 'male';
        const threshold = gender === 'female' ? 1.3 : 1.0;

        if (hdl < threshold) {
          abnormalities.push({
            test: 'HDL-C',
            value: lipids.hdl,
            abnormality: 'HDL-C降低',
            severity: 'mild',
            category: 'lipid'
          });
        }
      }

      // 甘油三酯
      if (lipids.triglycerides) {
        const tg = this.parseCholesterolValue(lipids.triglycerides);
        if (tg >= 2.3) { // >=200 mg/dL
          abnormalities.push({
            test: '甘油三酯',
            value: lipids.triglycerides,
            abnormality: '甘油三酯升高',
            severity: tg >= 5.6 ? 'severe' : 'moderate',
            category: 'lipid'
          });
        }
      }
    }

    // 血糖
    if (labResults.glucose) {
      const glucose = labResults.glucose;
      if (glucose.fasting) {
        const fg = this.parseGlucoseValue(glucose.fasting);
        if (fg >= 7.0) {
          abnormalities.push({
            test: '空腹血糖',
            value: glucose.fasting,
            abnormality: '空腹血糖升高',
            severity: fg >= 11.1 ? 'severe' : 'moderate',
            category: 'glucose'
          });
        } else if (fg >= 6.1) {
          abnormalities.push({
            test: '空腹血糖',
            value: glucose.fasting,
            abnormality: '空腹血糖受损',
            severity: 'mild',
            category: 'glucose'
          });
        }
      }
    }

    // 血常规
    if (labResults.cbc) {
      const cbc = labResults.cbc;

      // 血红蛋白
      if (cbc.hemoglobin) {
        const hb = parseFloat(cbc.hemoglobin);
        const gender = labResults.patient_gender || 'male';
        const threshold = gender === 'female' ? 115 : 130;

        if (hb < threshold) {
          abnormalities.push({
            test: '血红蛋白',
            value: cbc.hemoglobin,
            abnormality: '血红蛋白降低',
            severity: hb < 90 ? 'severe' : hb < 60 ? 'moderate' : 'mild',
            category: 'blood'
          });
        }
      }

      // 白细胞
      if (cbc.white_blood_cell) {
        const wbc = parseFloat(cbc.white_blood_cell);
        if (wbc > 10.0) {
          abnormalities.push({
            test: '白细胞',
            value: cbc.white_blood_cell,
            abnormality: '白细胞升高',
            severity: wbc > 20.0 ? 'moderate' : 'mild',
            category: 'blood'
          });
        } else if (wbc < 4.0) {
          abnormalities.push({
            test: '白细胞',
            value: cbc.white_blood_cell,
            abnormality: '白细胞降低',
            severity: wbc < 2.0 ? 'severe' : 'mild',
            category: 'blood'
          });
        }
      }

      // 血小板
      if (cbc.platelet) {
        const plt = parseFloat(cbc.platelet);
        if (plt < 100) {
          abnormalities.push({
            test: '血小板',
            value: cbc.platelet,
            abnormality: '血小板降低',
            severity: plt < 50 ? 'severe' : plt < 20 ? 'very_severe' : 'moderate',
            category: 'blood'
          });
        }
      }
    }

    // 肝功能
    if (labResults.liver_function) {
      const lft = labResults.liver_function;

      // ALT
      if (lft.alt) {
        const alt = parseFloat(lft.alt);
        const upperLimit = 50; // 通用上限
        if (alt > upperLimit) {
          abnormalities.push({
            test: 'ALT',
            value: lft.alt,
            abnormality: 'ALT升高',
            severity: alt > upperLimit * 10 ? 'severe' : alt > upperLimit * 5 ? 'moderate' : 'mild',
            category: 'liver'
          });
        }
      }

      // AST
      if (lft.ast) {
        const ast = parseFloat(lft.ast);
        const upperLimit = 40;
        if (ast > upperLimit) {
          abnormalities.push({
            test: 'AST',
            value: lft.ast,
            abnormality: 'AST升高',
            severity: ast > upperLimit * 10 ? 'severe' : ast > upperLimit * 5 ? 'moderate' : 'mild',
            category: 'liver'
          });
        }
      }
    }

    // 肾功能
    if (labResults.kidney_function) {
      const kft = labResults.kidney_function;

      // 肌酐
      if (kft.creatinine) {
        const cr = parseFloat(kft.creatinine);
        const upperLimit = 115; // 通用上限
        if (cr > upperLimit) {
          abnormalities.push({
            test: '肌酐',
            value: kft.creatinine,
            abnormality: '肌酐升高',
            severity: cr > 442 ? 'severe' : cr > 177 ? 'moderate' : 'mild',
            category: 'kidney'
          });
        }
      }
    }

    return abnormalities;
  }

  /**
   * 识别异常模式
   * @param {Array} abnormalities
   * @param {Object} labResults
   * @returns {Array}
   */
  identifyPatterns(abnormalities, labResults) {
    const patterns = [];

    // 模式1：代谢综合征
    const hasHighBP = abnormalities.some(a => a.abnormality === '血压升高');
    const hasHighLipid = abnormalities.some(a => a.category === 'lipid' && (a.abnormality.includes('升高') || a.abnormality.includes('异常')));
    const hasHighGlucose = abnormalities.some(a => a.category === 'glucose');

    if (hasHighBP && hasHighLipid) {
      patterns.push({
        name: '代谢综合征模式',
        description: '血压升高 + 血脂异常',
        confidence: hasHighGlucose ? 0.95 : 0.85,
        clinicalSignificance: '心血管风险显著增加，需综合干预',
        components: ['血压升高', '血脂异常'].concat(hasHighGlucose ? ['血糖升高'] : [])
      });
    }

    // 模式2：高血压 + 血脂异常 + 血糖升高（完整代谢综合征）
    if (hasHighBP && hasHighLipid && hasHighGlucose) {
      patterns.push({
        name: '完整代谢综合征',
        description: '血压 + 血脂 + 血糖均异常',
        confidence: 0.90,
        clinicalSignificance: '心血管疾病和糖尿病的高危状态，需积极干预',
        components: ['血压升高', '血脂异常', '血糖升高']
      });
    }

    // 模式3：肝细胞损伤模式
    const hasElevatedALT = abnormalities.some(a => a.test === 'ALT');
    const hasElevatedAST = abnormalities.some(a => a.test === 'AST');

    if (hasElevatedALT && hasElevatedAST) {
      const alt = parseFloat(labResults.liver_function?.alt);
      const ast = parseFloat(labResults.liver_function?.ast);
      const ratio = ast / alt;

      let pattern = '肝细胞损伤';
      let etiology = '';

      if (ratio < 1) {
        etiology = '考虑病毒性肝炎、非酒精性脂肪肝';
      } else if (ratio >= 1 && alt > 2 * 40) {
        etiology = '考虑酒精性肝病、肝硬化';
      }

      patterns.push({
        name: pattern,
        description: `ALT和AST均升高，AST/ALT比值约为${ratio.toFixed(2)}`,
        etiology: etiology,
        confidence: 0.80
      });
    }

    // 模式4：贫血模式
    const hasLowHb = abnormalities.some(a => a.abnormality === '血红蛋白降低');
    if (hasLowHb && labResults.cbc) {
      const mcv = labResults.cbc.mcv ? parseFloat(labResults.cbc.mcv) : null;

      let anemiaType = '正细胞性贫血';
      if (mcv) {
        if (mcv < 80) {
          anemiaType = '小细胞性贫血（考虑缺铁性贫血）';
        } else if (mcv > 100) {
          anemiaType = '大细胞性贫血（考虑巨幼细胞贫血）';
        }
      }

      patterns.push({
        name: '贫血模式',
        description: anemiaType,
        confidence: 0.75
      });
    }

    // 模式5：肾前性 vs 肾性
    const hasHighCreatinine = abnormalities.some(a => a.abnormality === '肌酐升高');
    if (hasHighCreatinine && labResults.kidney_function) {
      const bun = labResults.kidney_function.bun;
      const cr = labResults.kidney_function.creatinine;

      if (bun && cr) {
        const bunValue = parseFloat(bun);
        const crValue = this.parseBUNValue(cr);

        if (crValue > 0 && bunValue / crValue > 20) {
          patterns.push({
            name: '肾前性肾功能损伤',
            description: 'BUN/Cr比值 >20:1，提示血容量不足或心输出量减少',
            confidence: 0.80,
            clinicalSignificance: '可能是可逆的，补充血容量可能改善'
          });
        }
      }
    }

    return patterns;
  }

  /**
   * 病理生理机制推理
   * @param {Array} abnormalities
   * @param {Array} patterns
   * @returns {Object}
   */
  reasonPathophysiology(abnormalities, patterns) {
    const reasoning = {
      mechanisms: [],
      organSystems: [],
      pathophysiology: ''
    };

    // 根据异常结果推断病理生理机制
    abnormalities.forEach(ab => {
      const info = this.knowledgeBase[ab.abnormality];
      if (info && info.clinical_significance) {
        reasoning.mechanisms.push({
          abnormality: ab.abnormality,
          mechanism: info.clinical_significance
        });
      }
    });

    // 基于模式进行推理
    patterns.forEach(pattern => {
      if (pattern.name === '代谢综合征模式' || pattern.name === '完整代谢综合征') {
        reasoning.mechanisms.push({
          pattern: pattern.name,
          mechanism: '胰岛素抵抗是核心机制，导致血压升高、血脂异常、血糖代谢异常。这些因素相互作用，加速动脉粥样硬化，显著增加心血管疾病风险。'
        });
        reasoning.organSystems = ['心血管系统', '内分泌系统', '代谢系统'];
      }

      if (pattern.name && pattern.name.includes('肝细胞损伤')) {
        reasoning.mechanisms.push({
          pattern: pattern.name,
          mechanism: '肝细胞膜受损或坏死，导致转氨酶释放入血。ALT主要存在于肝细胞胞浆，AST存在于胞浆和线粒体。AST/ALT比值有助于鉴别病因。'
        });
        reasoning.organSystems.push('肝脏');
      }
    });

    return reasoning;
  }

  /**
   * 生成鉴别诊断
   * @param {Array} abnormalities
   * @param {Array} patterns
   * @param {Object} patientData
   * @returns {Array}
   */
  generateDifferentialDiagnoses(abnormalities, patterns, patientData) {
    const diagnoses = [];

    abnormalities.forEach(ab => {
      const info = this.knowledgeBase[ab.abnormality];
      if (info && info.differential_diagnoses) {
        info.differential_diagnoses.forEach(diag => {
          const existing = diagnoses.find(d => d.name === diag.name);
          if (existing) {
            existing.supportedBy.push(ab.abnormality);
          } else {
            diagnoses.push({
              name: diag.name,
              likelihood_baseline: diag.likelihood_baseline,
              description: diag.description,
              supportedBy: [ab.abnormality],
              causes: diag.causes,
              supporting_evidence: diag.supporting_evidence,
              red_flags: diag.red_flags
            });
          }
        });
      }
    });

    // 按支持证据数量和基础可能性排序
    return diagnoses.sort((a, b) => {
      const aSupports = a.supportedBy.length;
      const bSupports = b.supportedBy.length;
      return bSupports - aSupports || b.likelihood_baseline - a.likelihood_baseline;
    });
  }

  /**
   * 解释临床意义
   * @param {Array} abnormalities
   * @param {Array} patterns
   * @param {Object} patientData
   * @returns {Object}
   */
  explainClinicalSignificance(abnormalities, patterns, patientData) {
    const significance = {
      overallRisk: 'low',
      risks: [],
      implications: [],
      urgency: 'routine'
    };

    // 评估整体风险
    const severeAbnormalities = abnormalities.filter(a => a.severity === 'severe' || a.severity === 'very_severe');
    const moderateAbnormalities = abnormalities.filter(a => a.severity === 'moderate');

    if (severeAbnormalities.length > 0) {
      significance.overallRisk = 'high';
      significance.urgency = 'urgent';
    } else if (moderateAbnormalities.length >= 2) {
      significance.overallRisk = 'moderate';
      significance.urgency = 'soon';
    }

    // 特定风险
    abnormalities.forEach(ab => {
      const info = this.knowledgeBase[ab.abnormality];
      if (info) {
        if (info.risks) {
          significance.risks.push(...(info.risks || []));
        }
        if (info.management && info.management.targets) {
          significance.implications.push(`需控制至目标水平：${JSON.stringify(info.management.targets)}`);
        }
      }
    });

    // 模式的临床意义
    patterns.forEach(pattern => {
      if (pattern.clinicalSignificance) {
        significance.implications.push(pattern.clinicalSignificance);
      }
    });

    return significance;
  }

  /**
   * 生成建议
   * @param {Array} abnormalities
   * @param {Array} patterns
   * @param {Array} diagnoses
   * @returns {Object}
   */
  generateRecommendations(abnormalities, patterns, diagnoses) {
    const recommendations = {
      urgency: 'routine',
      followUp: [],
      lifestyle: [],
      pharmacological: [],
      furtherTesting: []
    };

    // 基于异常严重程度
    const hasSevere = abnormalities.some(a => a.severity === 'severe' || a.severity === 'very_severe');
    if (hasSevere) {
      recommendations.urgency = 'urgent';
      recommendations.followUp.push('建议尽快就医（1周内）');
    } else if (abnormalities.length >= 2) {
      recommendations.urgency = 'soon';
      recommendations.followUp.push('建议近期就医（1个月内）');
    } else {
      recommendations.followUp.push('建议定期复查（3-6个月）');
    }

    // 特定异常的建议
    abnormalities.forEach(ab => {
      const info = this.knowledgeBase[ab.abnormality];
      if (info && info.management) {
        if (info.management.lifestyle) {
          recommendations.lifestyle.push(...info.management.lifestyle);
        }
        if (info.management.pharmacological) {
          recommendations.pharmacological.push(...info.management.pharmacological);
        }
      }
    });

    // 去重
    recommendations.lifestyle = [...new Set(recommendations.lifestyle)];
    recommendations.pharmacological = [...new Set(recommendations.pharmacological)];

    // 进一步检查建议
    if (patterns.some(p => p.name === '代谢综合征模式' || p.name === '完整代谢综合征')) {
      recommendations.furtherTesting.push('评估心血管风险（如ASCVD风险评分）');
      recommendations.furtherTesting.push('筛查糖尿病并发症（眼底、肾功能、神经病变）');
    }

    if (abnormalities.some(a => a.category === 'liver')) {
      recommendations.furtherTesting.push('完善肝炎病毒标志物检查');
      recommendations.furtherTesting.push('肝脏B超检查');
    }

    if (abnormalities.some(a => a.category === 'kidney')) {
      recommendations.furtherTesting.push('评估肾功能分期（eGFR、尿白蛋白/肌酐比）');
      recommendations.furtherTesting.push('泌尿系B超检查');
    }

    return recommendations;
  }

  /**
   * 生成摘要
   * @param {Array} abnormalities
   * @param {Array} patterns
   * @returns {String}
   */
  generateSummary(abnormalities, patterns) {
    if (abnormalities.length === 0) {
      return '所有检查结果均在正常范围内。';
    }

    let summary = `检测到${abnormalities.length}项指标异常：\n`;
    abnormalities.forEach((ab, index) => {
      summary += `${index + 1}. ${ab.test}：${ab.value}（${ab.abnormality}）\n`;
    });

    if (patterns.length > 0) {
      summary += `\n识别到${patterns.length}种异常模式：\n`;
      patterns.forEach((p, index) => {
        summary += `${index + 1}. ${p.name}：${p.description || ''}\n`;
      });
    }

    return summary;
  }

  /**
   * 辅助方法：血压严重程度分类
   */
  classifyBloodPressureSeverity(systolic, diastolic) {
    if (systolic >= 180 || diastolic >= 110) return 'very_severe';
    if (systolic >= 160 || diastolic >= 100) return 'severe';
    if (systolic >= 140 || diastolic >= 90) return 'moderate';
    return 'mild';
  }

  /**
   * 辅助方法：解析胆固醇值
   */
  parseCholesterolValue(value) {
    // 假设输入可能是 mmol/L 或 mg/dL
    const num = parseFloat(value);
    if (num > 10) {
      return num / 38.67; // mg/dL 转 mmol/L
    }
    return num;
  }

  /**
   * 辅助方法：解析血糖值
   */
  parseGlucoseValue(value) {
    const num = parseFloat(value);
    if (num > 30) {
      return num / 18.0; // mg/dL 转 mmol/L
    }
    return num;
  }

  /**
   * 辅助方法：解析BUN值
   */
  parseBUNValue(value) {
    const num = parseFloat(value);
    if (num > 100) {
      return num / 2.8; // mg/dL 转 mmol/L
    }
    return num;
  }
}

module.exports = LabInterpretationEngine;

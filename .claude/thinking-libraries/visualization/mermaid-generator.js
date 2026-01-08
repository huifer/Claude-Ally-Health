/**
 * Mermaid图表生成器
 *
 * 功能：
 * 1. 生成思维导图（mindmap）
 * 2. 生成流程图（flowchart）
 * 3. 生成决策树
 */

class MermaidGenerator {
  /**
   * 生成症状分析思维导图
   * @param {Object} analysisData - 分析结果数据
   * @returns {String} Mermaid代码
   */
  generateMindMap(analysisData) {
    let mermaid = 'mindmap\n';
    mermaid += `  root((${analysisData.mainSymptom.name}))\n`;

    // 1. 症状特点分支
    mermaid += '    ((症状特点))\n';

    if (analysisData.mainSymptom.features) {
      const features = analysisData.mainSymptom.features;

      // 部位
      if (features.location && features.location.length > 0) {
        mermaid += '      部位\n';
        features.location.forEach(loc => {
          mermaid += `        ${loc}\n`;
        });
      }

      // 性质
      if (features.quality && features.quality.length > 0) {
        mermaid += '      性质\n';
        features.quality.forEach(qual => {
          mermaid += `        ${qual}\n`;
        });
      }

      // 时间
      if (features.timing && features.timing.length > 0) {
        mermaid += '      时间\n';
        features.timing.forEach(timing => {
          mermaid += `        ${timing}\n`;
        });
      }

      // 严重程度
      if (features.severity) {
        mermaid += `      严重程度\n        ${this.severityToLabel(features.severity)}\n`;
      }
    }

    // 2. 鉴别诊断分支
    mermaid += '    ((鉴别诊断))\n';

    analysisData.differentialDiagnoses.slice(0, 5).forEach(diagnosis => {
      mermaid += `      ${diagnosis.name}\n`;
      mermaid += `        可能性: ${this.likelihoodToLabel(diagnosis.likelihood)}\n`;
      mermaid += `        风险: ${this.riskToLabel(diagnosis.risk)}\n`;

      if (diagnosis.supportingEvidence && diagnosis.supportingEvidence.length > 0) {
        mermaid += '        支持: ';
        mermaid += diagnosis.supportingEvidence.slice(0, 2).join('、');
        mermaid += '\n';
      }
    });

    // 3. 危险信号分支
    if (analysisData.redFlags && analysisData.redFlags.length > 0) {
      mermaid += '    ((⚠️ 危险信号))\n';
      analysisData.redFlags.slice(0, 5).forEach(flag => {
        mermaid += `      ${flag}\n`;
      });
    }

    return mermaid;
  }

  /**
   * 生成决策流程图
   * @param {Object} analysisData - 分析结果数据
   * @returns {String} Mermaid代码
   */
  generateFlowChart(analysisData) {
    let mermaid = 'flowchart TD\n';

    const symptom = analysisData.mainSymptom.name;
    const urgency = analysisData.recommendations.urgency;

    // 开始节点
    mermaid += `    A[症状: ${symptom}] --> B{紧急程度评估?}\n\n`;

    // 紧急程度分支
    if (urgency === 'immediate') {
      mermaid += '    B -->|危险信号/高风险| C[立即就医]\n';
      mermaid += '    C --> D[🚨 就诊急诊或拨打120]\n';
      mermaid += '    D --> E[告知医生症状和危险信号]\n';
    } else if (urgency === 'soon') {
      mermaid += '    B -->|中度风险| C[尽快就医]\n';
      mermaid += '    C --> D[📅 1-2天内预约门诊]\n';
      mermaid += '    D --> E[携带症状记录和既往检查]\n';
    } else {
      mermaid += '    B -->|低风险| C[居家观察]\n';
      mermaid += '    C --> D[📋 记录症状日记]\n';
      mermaid += '    D --> E[充分休息和自我护理]\n';
      mermaid += '    E --> F{症状变化?}\n';
      mermaid += '    F -->|加重| G[立即就医]\n';
      mermaid += '    F -->|持续>1周| G\n';
      mermaid += '    F -->|改善| H[继续观察]\n';
    }

    // 检查建议
    if (analysisData.recommendations.tests && analysisData.recommendations.tests.length > 0) {
      mermaid += '\n    I[建议检查] --> J[';
      mermaid += analysisData.recommendations.tests.join('\\n    I --> J[');
      mermaid += ']\n';
    }

    return mermaid;
  }

  /**
   * 生成诊断可能性对比图
   * @param {Array} diagnoses - 诊断列表
   * @returns {String} Mermaid代码
   */
  generateLikelihoodChart(diagnoses) {
    let mermaid = '%%{init: {\'theme\': \'base\', \'themeVariables\': { \'primaryColor\': \'#ffcc00\'}}}%%\n';
    mermaid += 'pie showData\n';
    mermaid += '  title 鉴别诊断可能性分布\n';

    diagnoses.slice(0, 5).forEach(diagnosis => {
      const likelihood = Math.round(diagnosis.likelihood * 100);
      mermaid += `  "${diagnosis.name}" : ${likelihood}\n`;
    });

    return mermaid;
  }

  /**
   * 生成时间线图（症状进展）
   * @param {Object} analysisData - 分析结果数据
   * @returns {String} Mermaid代码
   */
  generateTimeline(analysisData) {
    let mermaid = 'timeline\n';
    mermaid += '  title 症状管理时间线\n';

    const today = new Date();
    const symptom = analysisData.mainSymptom;

    // 症状出现
    mermaid += `  症状出现 : ${symptom.name}\n`;

    // 居家观察期
    if (analysisData.recommendations.urgency === 'observation') {
      const observationEnd = new Date(today);
      observationEnd.setDate(today.getDate() + 7);
      mermaid += `  居家观察 : 观察症状变化 (至${observationEnd.toLocaleDateString('zh-CN')})\n`;

      const followupDate = new Date(today);
      followupDate.setDate(today.getDate() + 7);
      if (followupDate > observationEnd) {
        mermaid += `  如未改善 : 建议就医 (${followupDate.toLocaleDateString('zh-CN')})\n`;
      }
    }

    // 就医建议
    if (analysisData.recommendations.urgency === 'soon') {
      const appointmentDate = new Date(today);
      appointmentDate.setDate(today.getDate() + 1);
      mermaid += `  预约门诊 : 建议在${appointmentDate.toLocaleDateString('zh-CN')}前就诊\n`;
    }

    // 检查建议
    if (analysisData.recommendations.tests && analysisData.recommendations.tests.length > 0) {
      const testDate = new Date(today);
      testDate.setDate(today.getDate() + 3);
      mermaid += `  建议检查 : ${analysisData.recommendations.tests.join('、')} (建议在${testDate.toLocaleDateString('zh-CN')}前完成)\n`;
    }

    return mermaid;
  }

  /**
   * 将可能性数值转换为标签
   * @param {Number} likelihood
   * @returns {String}
   */
  likelihoodToLabel(likelihood) {
    const percentage = Math.round(likelihood * 100);
    if (percentage >= 60) return `很高 (${percentage}%)`;
    if (percentage >= 40) return `较高 (${percentage}%)`;
    if (percentage >= 20) return `中等 (${percentage}%)`;
    if (percentage >= 10) return `较低 (${percentage}%)`;
    return `很低 (${percentage}%)`;
  }

  /**
   * 将风险等级转换为标签
   * @param {String} risk
   * @returns {String}
   */
  riskToLabel(risk) {
    const riskMap = {
      'very_high': '🚨 极高',
      'high': '⚠️ 高',
      'moderate': '⚡ 中等',
      'low': '✅ 低'
    };
    return riskMap[risk] || risk;
  }

  /**
   * 将严重程度转换为标签
   * @param {String} severity
   * @returns {String}
   */
  severityToLabel(severity) {
    const severityMap = {
      'mild': '轻度',
      'moderate': '中度',
      'severe': '重度'
    };
    return severityMap[severity] || severity;
  }
}

module.exports = MermaidGenerator;

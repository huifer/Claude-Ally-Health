/**
 * HTML报告生成器
 *
 * 功能：
 * 1. 生成交互式HTML报告
 * 2. 集成Mermaid图表
 * 3. 提供友好的可视化界面
 */

const fs = require('fs');
const path = require('path');

class HTMLReportBuilder {
  /**
   * 生成完整的HTML报告
   * @param {Object} analysisData - 分析结果数据
   * @param {String} outputPath - 输出文件路径
   * @returns {String} HTML内容
   */
  generateHTMLReport(analysisData, outputPath) {
    const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>症状分析报告 - ${analysisData.mainSymptom.name}</title>
  <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', sans-serif;
      line-height: 1.6;
      color: #333;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px;
      text-align: center;
    }

    .header h1 {
      font-size: 32px;
      margin-bottom: 10px;
      font-weight: 600;
    }

    .header .timestamp {
      opacity: 0.9;
      font-size: 14px;
    }

    .summary {
      background: #f8f9fa;
      padding: 30px;
      border-left: 4px solid #667eea;
      margin: 30px;
      border-radius: 8px;
    }

    .summary h2 {
      color: #667eea;
      margin-bottom: 15px;
      font-size: 20px;
    }

    .summary p {
      white-space: pre-line;
      line-height: 1.8;
    }

    .section {
      padding: 30px;
      border-bottom: 1px solid #eee;
    }

    .section:last-child {
      border-bottom: none;
    }

    .section h2 {
      color: #333;
      margin-bottom: 20px;
      font-size: 24px;
      border-left: 4px solid #667eea;
      padding-left: 15px;
    }

    .symptom-features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    .feature-card {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
      border-left: 3px solid #667eea;
    }

    .feature-card .label {
      font-weight: 600;
      color: #667eea;
      margin-bottom: 8px;
      font-size: 14px;
    }

    .feature-card .value {
      color: #333;
      font-size: 16px;
    }

    .diagnosis-list {
      margin-top: 20px;
    }

    .diagnosis-item {
      background: #fff;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 15px;
      transition: all 0.3s;
    }

    .diagnosis-item:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      transform: translateY(-2px);
    }

    .diagnosis-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .diagnosis-name {
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }

    .diagnosis-likelihood {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
    }

    .likelihood-high {
      background: #ffebee;
      color: #c62828;
    }

    .likelihood-moderate {
      background: #fff3e0;
      color: #e65100;
    }

    .likelihood-low {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .diagnosis-details {
      margin-top: 15px;
    }

    .evidence-list {
      list-style: none;
      padding: 0;
      margin-top: 10px;
    }

    .evidence-list li {
      padding: 8px 0;
      padding-left: 20px;
      position: relative;
    }

    .evidence-list li:before {
      content: '•';
      position: absolute;
      left: 0;
      color: #667eea;
      font-weight: bold;
    }

    .evidence-list.supporting li:before {
      color: #4caf50;
    }

    .evidence-list.opposing li:before {
      color: #f44336;
    }

    .red-flags {
      background: #ffebee;
      border-left: 4px solid #f44336;
      padding: 20px;
      border-radius: 8px;
      margin-top: 20px;
    }

    .red-flags h3 {
      color: #c62828;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
    }

    .red-flags h3:before {
      content: '⚠️';
      margin-right: 8px;
    }

    .red-flags ul {
      list-style: none;
      padding: 0;
    }

    .red-flags li {
      padding: 8px 0;
      padding-left: 25px;
      position: relative;
    }

    .red-flags li:before {
      content: '🚨';
      position: absolute;
      left: 0;
    }

    .recommendations {
      background: #e8f5e9;
      border-left: 4px solid #4caf50;
      padding: 20px;
      border-radius: 8px;
      margin-top: 20px;
    }

    .recommendations h3 {
      color: #2e7d32;
      margin-bottom: 15px;
    }

    .recommendations ul {
      list-style: none;
      padding: 0;
    }

    .recommendations li {
      padding: 10px 0;
      padding-left: 25px;
      position: relative;
    }

    .recommendations li:before {
      content: '✓';
      position: absolute;
      left: 0;
      color: #4caf50;
      font-weight: bold;
    }

    .chart-container {
      background: white;
      padding: 30px;
      border-radius: 8px;
      margin: 20px 0;
      border: 1px solid #e0e0e0;
    }

    .mermaid {
      text-align: center;
      background: #fafafa;
      padding: 20px;
      border-radius: 8px;
    }

    .urgency-banner {
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      font-weight: 600;
      font-size: 18px;
      margin-bottom: 20px;
    }

    .urgency-immediate {
      background: #ffebee;
      color: #c62828;
      border: 2px solid #ef5350;
    }

    .urgency-soon {
      background: #fff3e0;
      color: #e65100;
      border: 2px solid #ffa726;
    }

    .urgency-observation {
      background: #e8f5e9;
      color: #2e7d32;
      border: 2px solid #66bb6a;
    }

    .key-questions {
      background: #e3f2fd;
      border-left: 4px solid #2196f3;
      padding: 20px;
      border-radius: 8px;
      margin-top: 20px;
    }

    .key-questions h3 {
      color: #1565c0;
      margin-bottom: 15px;
    }

    .key-questions ul {
      list-style: none;
      padding: 0;
    }

    .key-questions li {
      padding: 8px 0;
      padding-left: 25px;
      position: relative;
    }

    .key-questions li:before {
      content: '?';
      position: absolute;
      left: 0;
      color: #2196f3;
      font-weight: bold;
    }

    .disclaimer {
      background: #fff3e0;
      padding: 20px;
      border-radius: 8px;
      margin: 30px;
      font-size: 14px;
      color: #e65100;
      border-left: 4px solid #ffa726;
    }

    @media (max-width: 768px) {
      .header h1 {
        font-size: 24px;
      }

      .section {
        padding: 20px;
      }

      .symptom-features {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- 头部 -->
    <div class="header">
      <h1>🔍 症状分析报告</h1>
      <div class="timestamp">生成时间: ${new Date(analysisData.timestamp).toLocaleString('zh-CN')}</div>
    </div>

    <!-- 紧急程度横幅 -->
    <div style="padding: 0 30px; margin-top: 30px;">
      <div class="urgency-banner urgency-${analysisData.recommendations.urgency}">
        ${this.getUrgencyText(analysisData.recommendations.urgency)}
      </div>
    </div>

    <!-- 分析摘要 -->
    <div class="summary">
      <h2>📋 分析摘要</h2>
      <p>${analysisData.summary}</p>
    </div>

    <!-- 症状特征 -->
    <div class="section">
      <h2>🔎 症状特征分析</h2>
      <div class="symptom-features">
        ${this.generateFeatureCards(analysisData.mainSymptom)}
      </div>
    </div>

    <!-- 鉴别诊断 -->
    <div class="section">
      <h2>🏥 鉴别诊断</h2>
      <div class="diagnosis-list">
        ${this.generateDiagnosisCards(analysisData.differentialDiagnoses)}
      </div>
    </div>

    <!-- 思维导图 -->
    <div class="section">
      <h2>🧠 思维导图</h2>
      <div class="chart-container">
        <div class="mermaid">
${analysisData.visualization.mindmap}
        </div>
      </div>
    </div>

    <!-- 决策流程图 -->
    <div class="section">
      <h2>📊 决策流程</h2>
      <div class="chart-container">
        <div class="mermaid">
${analysisData.visualization.flowchart}
        </div>
      </div>
    </div>

    <!-- 危险信号 -->
    ${analysisData.redFlags && analysisData.redFlags.length > 0 ? `
    <div class="section">
      <div class="red-flags">
        <h3>危险信号警示</h3>
        <ul>
          ${analysisData.redFlags.slice(0, 8).map(flag => `<li>${flag}</li>`).join('')}
        </ul>
      </div>
    </div>
    ` : ''}

    <!-- 建议 -->
    <div class="section">
      <h2>💡 建议</h2>
      <div class="recommendations">
        <h3>就医建议</h3>
        <ul>
          ${analysisData.recommendations.medicalAdvice.map(advice => `<li>${advice}</li>`).join('')}
        </ul>

        ${analysisData.recommendations.tests && analysisData.recommendations.tests.length > 0 ? `
        <h3>建议检查</h3>
        <ul>
          ${analysisData.recommendations.tests.map(test => `<li>${test}</li>`).join('')}
        </ul>
        ` : ''}

        ${analysisData.recommendations.selfCare && analysisData.recommendations.selfCare.length > 0 ? `
        <h3>自我护理</h3>
        <ul>
          ${analysisData.recommendations.selfCare.map(care => `<li>${care}</li>`).join('')}
        </ul>
        ` : ''}
      </div>
    </div>

    <!-- 关键问题 -->
    ${analysisData.keyQuestions && analysisData.keyQuestions.length > 0 ? `
    <div class="section">
      <div class="key-questions">
        <h3>❓ 关键问题（就医时可询问医生）</h3>
        <ul>
          ${analysisData.keyQuestions.map(q => `<li>${q}</li>`).join('')}
        </ul>
      </div>
    </div>
    ` : ''}

    <!-- 免责声明 -->
    <div class="disclaimer">
      <strong>⚠️ 免责声明：</strong><br>
      本症状分析报告由AI系统生成，仅供参考，不能替代专业医疗诊断和建议。
      如有紧急情况或症状加重，请立即就医或拨打急救电话。
      所有医疗决策应由专业医生根据具体情况做出。
    </div>
  </div>

  <script>
    // 初始化Mermaid
    mermaid.initialize({
      startOnLoad: true,
      theme: 'base',
      themeVariables: {
        primaryColor: '#667eea',
        primaryTextColor: '#fff',
        primaryBorderColor: '#764ba2',
        lineColor: '#667eea',
        secondaryColor: '#764ba2',
        tertiaryColor: '#f8f9fa'
      },
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis'
      },
      mindmap: {
        useMaxWidth: true,
        padding: 20
      }
    });
  </script>
</body>
</html>
    `;

    // 保存到文件
    if (outputPath) {
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(outputPath, html, 'utf8');
    }

    return html;
  }

  /**
   * 生成症状特征卡片HTML
   * @param {Object} symptom
   * @returns {String} HTML
   */
  generateFeatureCards(symptom) {
    if (!symptom.features) {
      return '<div class="feature-card"><div class="label">症状名称</div><div class="value">' + symptom.name + '</div></div>';
    }

    let html = '';

    // 症状名称
    html += '<div class="feature-card"><div class="label">症状名称</div><div class="value">' + symptom.name + '</div></div>';

    // 部位
    if (symptom.features.location && symptom.features.location.length > 0) {
      html += '<div class="feature-card"><div class="label">部位</div><div class="value">' + symptom.features.location.join('、') + '</div></div>';
    }

    // 性质
    if (symptom.features.quality && symptom.features.quality.length > 0) {
      html += '<div class="feature-card"><div class="label">性质</div><div class="value">' + symptom.features.quality.join('、') + '</div></div>';
    }

    // 时间
    if (symptom.features.timing && symptom.features.timing.length > 0) {
      html += '<div class="feature-card"><div class="label">时间</div><div class="value">' + symptom.features.timing.join('、') + '</div></div>';
    }

    // 严重程度
    if (symptom.features.severity) {
      html += '<div class="feature-card"><div class="label">严重程度</div><div class="value">' + this.severityToLabel(symptom.features.severity) + '</div></div>';
    }

    return html;
  }

  /**
   * 生成诊断卡片HTML
   * @param {Array} diagnoses
   * @returns {String} HTML
   */
  generateDiagnosisCards(diagnoses) {
    return diagnoses.slice(0, 5).map(diagnosis => {
      const likelihood = Math.round(diagnosis.likelihood * 100);
      const likelihoodClass = likelihood >= 60 ? 'high' : likelihood >= 30 ? 'moderate' : 'low';

      let evidenceHtml = '';
      if (diagnosis.supportingEvidence && diagnosis.supportingEvidence.length > 0) {
        evidenceHtml += '<h4>✓ 支持点</h4><ul class="evidence-list supporting">';
        evidenceHtml += diagnosis.supportingEvidence.map(e => `<li>${e}</li>`).join('');
        evidenceHtml += '</ul>';
      }

      if (diagnosis.opposingEvidence && diagnosis.opposingEvidence.length > 0) {
        evidenceHtml += '<h4>✗ 反对点</h4><ul class="evidence-list opposing">';
        evidenceHtml += diagnosis.opposingEvidence.map(e => `<li>${e}</li>`).join('');
        evidenceHtml += '</ul>';
      }

      return `
        <div class="diagnosis-item">
          <div class="diagnosis-header">
            <div class="diagnosis-name">${diagnosis.name}</div>
            <div class="diagnosis-likelihood likelihood-${likelihoodClass}">
              可能性: ${likelihood}%
            </div>
          </div>
          <div class="diagnosis-details">
            <p><strong>风险等级：</strong>${this.riskToLabel(diagnosis.risk)}</p>
            ${diagnosis.typicalAge ? `<p><strong>典型年龄：</strong>${diagnosis.typicalAge}</p>` : ''}
            ${diagnosis.genderPredilection ? `<p><strong>性别倾向：</strong>${diagnosis.genderPredilection}</p>` : ''}
            ${evidenceHtml}
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * 获取紧急程度文本
   * @param {String} urgency
   * @returns {String}
   */
  getUrgencyText(urgency) {
    const urgencyMap = {
      'immediate': '🚨 检测到危险信号或高风险，建议立即就医！',
      'soon': '⚡ 中度风险，建议尽快就医（1-2天内）',
      'observation': '✅ 低风险，可居家观察，注意症状变化'
    };
    return urgencyMap[urgency] || urgency;
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

module.exports = HTMLReportBuilder;

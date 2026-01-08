/**
 * 健康数据聚合器
 *
 * 功能：
 * 1. 从多个数据源整合健康数据
 * 2. 计算趋势（血压、血糖、体重等）
 * 3. 识别模式
 * 4. 为分析引擎提供完整的数据上下文
 */

const fs = require('fs');
const path = require('path');

class HealthDataAggregator {
  constructor() {
    this.baseDir = path.join(process.cwd(), 'data');
  }

  /**
   * 聚合所有相关健康数据
   * @param {Object} options - 选项
   * @returns {Object}
   */
  async gatherAllRelevantData(options = {}) {
    const data = {
      // 1. 基础档案
      profile: await this.loadProfile(),

      // 2. 慢性病信息
      chronicDiseases: await this.loadChronicDiseases(),

      // 3. 生命体征历史
      vitalSigns: await this.loadVitalSigns(options.vitalSignsDaysBack || 90),

      // 4. 检查结果历史
      labResults: await this.loadLabResults(options.labResultsMonthsBack || 12),

      // 5. 症状历史
      symptomHistory: await this.loadSymptomHistory(options.symptomMonthsBack || 6),

      // 6. 用药记录
      medications: await this.loadMedications(),

      // 7. 筛查记录
      screenings: await this.loadScreenings()
    };

    // 8. 计算趋势
    data.trends = {
      bloodPressure: this.calculateBloodPressureTrend(data.vitalSigns),
      glucose: this.calculateGlucoseTrend(data.vitalSigns),
      weight: this.calculateWeightTrend(data.vitalSigns)
    };

    return data;
  }

  /**
   * 加载基础档案
   */
  async loadProfile() {
    const filePath = path.join(this.baseDir, 'profile.json');
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(content);
      }
    } catch (error) {
      console.error('加载profile失败:', error.message);
    }
    return {};
  }

  /**
   * 加载慢性病信息
   */
  async loadChronicDiseases() {
    const filePath = path.join(this.baseDir, 'chronic-diseases.json');
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(content);
      }
    } catch (error) {
      console.error('加载慢性病数据失败:', error.message);
    }
    return {};
  }

  /**
   * 加载生命体征历史
   * @param {Number} daysBack - 回溯天数
   */
  async loadVitalSigns(daysBack) {
    const vitalSigns = {
      bloodPressure: [],
      glucose: [],
      weight: []
    };

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    // 遍历每个月的文件夹
    for (let d = new Date(startDate); d <= endDate; d.setMonth(d.getMonth() + 1)) {
      const yearMonth = d.toISOString().substring(0, 7); // YYYY-MM
      const dirPath = path.join(this.baseDir, `vital-signs-logs/${yearMonth}`);

      if (!fs.existsSync(dirPath)) continue;

      try {
        const files = fs.readdirSync(dirPath);
        files.forEach(file => {
          if (!file.endsWith('.json')) return;

          const filePath = path.join(dirPath, file);
          try {
            const content = fs.readFileSync(filePath, 'utf8');
            const data = JSON.parse(content);

            if (data.vital_signs) {
              // 血压
              if (data.vital_signs.blood_pressure) {
                vitalSigns.bloodPressure.push({
                  date: data.record_date,
                  systolic: data.vital_signs.blood_pressure.systolic,
                  diastolic: data.vital_signs.blood_pressure.diastolic,
                  timing: data.vital_signs.blood_pressure.timing
                });
              }

              // 血糖
              if (data.vital_signs.blood_glucose) {
                vitalSigns.glucose.push({
                  date: data.record_date,
                  value: data.vital_signs.blood_glucose.value,
                  timing: data.vital_signs.blood_glucose.timing
                });
              }

              // 体重
              if (data.vital_signs.weight) {
                vitalSigns.weight.push({
                  date: data.record_date,
                  value: data.vital_signs.weight
                });
              }
            }
          } catch (error) {
            // 跳过损坏的文件
          }
        });
      } catch (error) {
        // 跳过无法读取的目录
      }
    }

    return vitalSigns;
  }

  /**
   * 加载检查结果（简化版本，实际应用中可能需要更复杂的实现）
   */
  async loadLabResults(monthsBack) {
    // 这里简化处理，实际应用中可能需要从不同的数据源加载
    // 暂时返回空对象，由用户直接提供检查结果
    return {
      blood_pressure: {},
      lipids: {},
      glucose: {},
      cbc: {},
      liver_function: {},
      kidney_function: {}
    };
  }

  /**
   * 加载症状历史
   */
  async loadSymptomHistory(monthsBack) {
    const symptoms = [];

    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - monthsBack);

    const dirPath = path.join(this.baseDir, '症状记录');

    if (!fs.existsSync(dirPath)) return symptoms;

    try {
      const iterateDirectories = (currentPath) => {
        const items = fs.readdirSync(currentPath, { withFileTypes: true });

        items.forEach(item => {
          const fullPath = path.join(currentPath, item.name);

          if (item.isDirectory()) {
            const match = item.name.match(/(\d{4}-\d{2})/);
            if (match) {
              const dirDate = new Date(match[1] + '-01');
              if (dirDate >= startDate && dirDate <= endDate) {
                iterateDirectories(fullPath);
              }
            }
          } else if (item.isFile() && item.name.endsWith('.json')) {
            try {
              const content = fs.readFileSync(fullPath, 'utf8');
              const data = JSON.parse(content);

              if (data.symptom_date) {
                const symptomDate = new Date(data.symptom_date);
                if (symptomDate >= startDate && symptomDate <= endDate) {
                  symptoms.push({
                    date: data.symptom_date,
                    symptom: data.standardized.main_symptom,
                    severity: data.standardized.severity,
                    category: data.standardized.category
                  });
                }
              }
            } catch (error) {
              // 跳过损坏的文件
            }
          }
        });
      };

      iterateDirectories(dirPath);
    } catch (error) {
      console.error('加载症状历史失败:', error.message);
    }

    return symptoms;
  }

  /**
   * 加载用药记录
   */
  async loadMedications() {
    const filePath = path.join(this.baseDir, 'medications', 'current-medications.json');
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(content);
      }
    } catch (error) {
      console.error('加载用药记录失败:', error.message);
    }
    return [];
  }

  /**
   * 加载筛查记录
   */
  async loadScreenings() {
    const filePath = path.join(this.baseDir, 'screening-tracker.json');
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(content);
      }
    } catch (error) {
      console.error('加载筛查记录失败:', error.message);
    }
    return {};
  }

  /**
   * 计算血压趋势
   */
  calculateBloodPressureTrend(vitalSigns) {
    const bpData = vitalSigns.bloodPressure;

    if (bpData.length < 2) {
      return { trend: 'insufficient_data', change: null };
    }

    // 按日期排序
    bpData.sort((a, b) => new Date(a.date) - new Date(b.date));

    const first = bpData[0];
    const last = bpData[bpData.length - 1];

    const systolicChange = last.systolic - first.systolic;
    const diastolicChange = last.diastolic - first.diastolic;

    // 计算变化百分比
    const systolicChangePercent = ((systolicChange / first.systolic) * 100).toFixed(1);
    const diastolicChangePercent = ((diastolicChange / first.diastolic) * 100).toFixed(1);

    let trend = 'stable';
    if (Math.abs(systolicChangePercent) > 5) {
      trend = systolicChange > 0 ? 'rising' : 'falling';
    }

    return {
      trend: trend,
      systolicChange: systolicChange,
      diastolicChange: diastolicChange,
      systolicChangePercent: parseFloat(systolicChangePercent),
      diastolicChangePercent: parseFloat(diastolicChangePercent),
      dataPoints: bpData.length,
      first: first,
      last: last
    };
  }

  /**
   * 计算血糖趋势
   */
  calculateGlucoseTrend(vitalSigns) {
    const glucoseData = vitalSigns.glucose;

    if (glucoseData.length < 2) {
      return { trend: 'insufficient_data', change: null };
    }

    glucoseData.sort((a, b) => new Date(a.date) - new Date(b.date));

    const first = glucoseData[0];
    const last = glucoseData[glucoseData.length - 1];

    const change = last.value - first.value;
    const changePercent = ((change / first.value) * 100).toFixed(1);

    let trend = 'stable';
    if (Math.abs(changePercent) > 10) {
      trend = change > 0 ? 'rising' : 'falling';
    }

    return {
      trend: trend,
      change: change,
      changePercent: parseFloat(changePercent),
      dataPoints: glucoseData.length,
      first: first,
      last: last
    };
  }

  /**
   * 计算体重趋势
   */
  calculateWeightTrend(vitalSigns) {
    const weightData = vitalSigns.weight;

    if (weightData.length < 2) {
      return { trend: 'insufficient_data', change: null };
    }

    weightData.sort((a, b) => new Date(a.date) - new Date(b.date));

    const first = weightData[0];
    const last = weightData[weightData.length - 1];

    const change = last.value - first.value;
    const changePercent = ((change / first.value) * 100).toFixed(1);

    let trend = 'stable';
    if (Math.abs(changePercent) > 3) {
      trend = change > 0 ? 'rising' : 'falling';
    }

    return {
      trend: trend,
      change: change,
      changePercent: parseFloat(changePercent),
      dataPoints: weightData.length,
      first: first,
      last: last
    };
  }
}

module.exports = HealthDataAggregator;

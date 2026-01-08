'use client';

import { AlertCircle, Info, CheckCircle, TrendingUp } from 'lucide-react';

interface StageIndicatorProps {
  stage: 'pre' | 'peri' | 'post';
  lastPeriod?: string;
  symptoms?: any[];
  notes?: string;
}

type StageInfo = {
  label: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: typeof Info;
  characteristics: string[];
  recommendations: string[];
};

const stageInfo: Record<string, StageInfo> = {
  pre: {
    label: '更年期前期',
    description: '月经周期规律，未出现更年期症状',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    icon: CheckCircle,
    characteristics: [
      '月经周期规律（21-35天）',
      '激素水平稳定',
      '生育能力正常',
      '无潮热、盗汗等症状',
    ],
    recommendations: [
      '保持健康的生活方式',
      '定期进行妇科检查',
      '注意钙和维生素D的摄入',
      '保持规律运动',
    ],
  },
  peri: {
    label: '围绝经期',
    description: '月经周期开始不规律，出现更年期症状',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    icon: AlertCircle,
    characteristics: [
      '月经周期不规律',
      '可能出现潮热、盗汗',
      '情绪波动',
      '睡眠质量下降',
      '激素水平波动',
    ],
    recommendations: [
      '记录症状和月经周期',
      '咨询医生关于激素替代疗法',
      '保持规律运动和健康饮食',
      '进行骨密度检查',
      '关注心血管健康',
    ],
  },
  post: {
    label: '绝经后期',
    description: '停经12个月以上，进入绝经状态',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    icon: TrendingUp,
    characteristics: [
      '停经12个月以上',
      '雌激素水平降低',
      '生育能力丧失',
      '骨质疏松风险增加',
      '心血管疾病风险增加',
    ],
    recommendations: [
      '定期进行骨密度检查',
      '补充钙和维生素D',
      '保持健康体重',
      '定期心血管检查',
      '注意盆底肌健康',
      '保持社交活动和心理健康',
    ],
  },
};

export function StageIndicator({ stage, lastPeriod, symptoms = [], notes }: StageIndicatorProps) {
  const info = stageInfo[stage];
  const Icon = info.icon;

  // Calculate months since last period
  const getMonthsSinceLastPeriod = () => {
    if (!lastPeriod) return null;

    const last = new Date(lastPeriod);
    const today = new Date();
    const months = (today.getFullYear() - last.getFullYear()) * 12 + (today.getMonth() - last.getMonth());

    return months;
  };

  const monthsSinceLastPeriod = getMonthsSinceLastPeriod();

  // Get recent symptoms count (last 30 days)
  const recentSymptoms = symptoms.filter(s => {
    const symptomDate = new Date(s.date);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return symptomDate >= thirtyDaysAgo;
  });

  return (
    <div className="space-y-4">
      {/* Stage Badge */}
      <div
        className={`${info.bgColor} ${info.borderColor} border-2 p-6 rounded-2xl transition-all`}
      >
        <div className="flex items-start space-x-4">
          <div
            className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center ${info.bgColor} ${info.color}`}
          >
            <Icon className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className={`text-2xl font-bold ${info.color}`}>
                {info.label}
              </h3>
              {stage === 'pre' && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  正常状态
                </span>
              )}
              {stage === 'peri' && (
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                  过渡阶段
                </span>
              )}
              {stage === 'post' && (
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                  新阶段
                </span>
              )}
            </div>
            <p className="text-sm text-gray-700 mb-3">{info.description}</p>

            {/* Additional Info */}
            <div className="flex flex-wrap gap-4 text-xs">
              {monthsSinceLastPeriod !== null && (
                <div className="flex items-center space-x-1">
                  <span className="text-gray-600">距上次月经:</span>
                  <span className="font-semibold text-gray-900">
                    {monthsSinceLastPeriod} 个月
                  </span>
                </div>
              )}
              {recentSymptoms.length > 0 && (
                <div className="flex items-center space-x-1">
                  <span className="text-gray-600">近30天症状:</span>
                  <span className="font-semibold text-gray-900">
                    {recentSymptoms.length} 次
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Characteristics */}
      <div className="bg-macos-bg-card p-6 rounded-2xl border border-macos-border">
        <h4 className="text-md font-semibold text-macos-text-primary mb-3">
          阶段特征
        </h4>
        <ul className="space-y-2">
          {info.characteristics.map((characteristic, index) => (
            <li key={index} className="flex items-start space-x-2">
              <div className={`w-1.5 h-1.5 rounded-full ${info.bgColor.replace('bg-', 'bg-').replace('50', '500')} mt-2 flex-shrink-0`} />
              <span className="text-sm text-macos-text-secondary">{characteristic}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100/30 p-6 rounded-2xl border border-blue-200">
        <h4 className="text-md font-semibold text-gray-900 mb-3">
          健康建议
        </h4>
        <ul className="space-y-2">
          {info.recommendations.map((recommendation, index) => (
            <li key={index} className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
              <span className="text-sm text-gray-700">{recommendation}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Notes */}
      {notes && (
        <div className="bg-macos-bg-card p-6 rounded-2xl border border-macos-border">
          <h4 className="text-md font-semibold text-macos-text-primary mb-3">
            备注
          </h4>
          <p className="text-sm text-macos-text-secondary whitespace-pre-wrap">
            {notes}
          </p>
        </div>
      )}

      {/* Stage Progression Indicator */}
      {stage === 'pre' && (
        <div className="bg-macos-bg-card p-4 rounded-xl border border-macos-border">
          <div className="flex items-center justify-between text-xs text-macos-text-muted mb-2">
            <span>更年期前期</span>
            <span>围绝经期</span>
            <span>绝经后期</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: '15%' }} />
          </div>
          <p className="text-xs text-macos-text-muted mt-2 text-center">
            当前阶段: 更年期前期
          </p>
        </div>
      )}

      {stage === 'peri' && (
        <div className="bg-macos-bg-card p-4 rounded-xl border border-macos-border">
          <div className="flex items-center justify-between text-xs text-macos-text-muted mb-2">
            <span>更年期前期</span>
            <span>围绝经期</span>
            <span>绝经后期</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-orange-500 rounded-full transition-all" style={{ width: '50%' }} />
          </div>
          <p className="text-xs text-macos-text-muted mt-2 text-center">
            当前阶段: 围绝经期 (过渡阶段)
          </p>
          {monthsSinceLastPeriod !== null && monthsSinceLastPeriod >= 3 && (
            <p className="text-xs text-orange-600 mt-1 text-center">
              已停经 {monthsSinceLastPeriod} 个月，如持续至12个月将进入绝经后期
            </p>
          )}
        </div>
      )}

      {stage === 'post' && (
        <div className="bg-macos-bg-card p-4 rounded-xl border border-macos-border">
          <div className="flex items-center justify-between text-xs text-macos-text-muted mb-2">
            <span>更年期前期</span>
            <span>围绝经期</span>
            <span>绝经后期</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: '100%' }} />
          </div>
          <p className="text-xs text-macos-text-muted mt-2 text-center">
            当前阶段: 绝经后期 (停经12个月以上)
          </p>
        </div>
      )}
    </div>
  );
}

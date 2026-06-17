'use client';

import { Loader2, Globe, Search, Brain, FileText, CheckCircle } from 'lucide-react';

interface LoadingStateProps {
  customerName: string;
}

const steps = [
  { icon: Globe, label: '抓取客户网站内容', description: '正在分析网站结构...' },
  { icon: Search, label: '搜索补充商业情报', description: '正在搜索LinkedIn、新闻、财务数据...' },
  { icon: Brain, label: 'AI深度分析', description: '正在生成11部分完整报告...' },
  { icon: FileText, label: '报告生成', description: '正在格式化输出...' },
];

export default function LoadingState({ customerName }: LoadingStateProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-50 rounded-full mb-4">
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">
            正在分析: {customerName}
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            整个过程大约需要 30-60 秒，请耐心等待...
          </p>
        </div>

        <div className="space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            // 模拟步骤进度：每个步骤约8-15秒
            const progress = Math.min(100, ((Date.now() % 60000) / 15000) * 100);
            const isActive = progress > index * 25;
            const isComplete = progress > (index + 1) * 25;

            return (
              <div
                key={step.label}
                className={`flex items-start gap-4 p-4 rounded-lg transition-all ${
                  isActive ? 'bg-primary-50 border border-primary-100' : 'bg-gray-50 border border-gray-100'
                }`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  isComplete
                    ? 'bg-green-100 text-green-600'
                    : isActive
                    ? 'bg-primary-100 text-primary-600'
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {isComplete ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`font-medium text-sm ${
                    isActive ? 'text-primary-900' : 'text-gray-500'
                  }`}>
                    {step.label}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-lg">
          <p className="text-xs text-amber-700">
            <strong>提示:</strong> 分析过程中会调用多个外部API（网页抓取、搜索、AI生成），
            总耗时取决于客户网站复杂度和网络状况。
          </p>
        </div>
      </div>
    </div>
  );
}

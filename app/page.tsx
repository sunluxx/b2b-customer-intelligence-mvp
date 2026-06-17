'use client';

import { useState } from 'react';
import { Lightbulb, Zap, BarChart3, Shield } from 'lucide-react';
import AnalysisForm from '@/components/AnalysisForm';
import LoadingState from '@/components/LoadingState';
import ReportView from '@/components/ReportView';

interface AnalysisResult {
  report: string;
  customerName: string;
  meta: {
    duration: string;
    websiteContentLength: number;
    additionalPagesFetched: number;
    searchesCompleted: number;
    generatedAt: string;
  };
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentCustomer, setCurrentCustomer] = useState('');

  const handleAnalyze = async (data: { customerName: string; website: string; country: string }) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setCurrentCustomer(data.customerName);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.details || result.error || '分析请求失败');
      }

      setResult({
        report: result.report,
        customerName: result.customerName,
        meta: result.meta,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : '未知错误';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">B2B Customer Intelligence</h1>
              <p className="text-xs text-gray-500">客户情报分析系统 v1.0</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200">
              <Zap className="w-3 h-3" />
              AI驱动
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full border border-primary-200">
              <BarChart3 className="w-3 h-3" />
              V3.4框架
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 欢迎区域 */}
        {!result && !isLoading && (
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              欧洲LED照明市场 · B2B客户情报分析
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              基于AI技术，自动抓取客户网站、搜索商业情报、生成完整的11部分专业分析报告。
              支持制造商、进口商、品牌商等多类型客户分析。
            </p>
            
            {/* 特性展示 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 max-w-3xl mx-auto">
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">智能数据采集</h3>
                <p className="text-xs text-gray-500 mt-1">自动抓取网站 + 多维度搜索补充</p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">11部分分析框架</h3>
                <p className="text-xs text-gray-500 mt-1">执行摘要到行动计划的完整闭环</p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">产品匹配评估</h3>
                <p className="text-xs text-gray-500 mt-1">4类产品精准匹配 + 成交概率预测</p>
              </div>
            </div>
          </div>
        )}

        {/* 分析表单 */}
        {!result && <AnalysisForm onSubmit={handleAnalyze} isLoading={isLoading} />}

        {/* 加载状态 */}
        {isLoading && <LoadingState customerName={currentCustomer} />}

        {/* 错误提示 */}
        {error && (
          <div className="w-full max-w-2xl mx-auto mt-6">
            <div className="bg-red-50 border border-red-200 rounded-xl p-5">
              <h3 className="text-red-800 font-semibold mb-2">分析失败</h3>
              <p className="text-red-600 text-sm">{error}</p>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => setError(null)}
                  className="px-4 py-2 bg-white text-red-600 text-sm font-medium rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
                >
                  返回重试
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 报告展示 */}
        {result && (
          <div className="space-y-6">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              <button
                onClick={() => {
                  setResult(null);
                  setError(null);
                }}
                className="px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors border border-primary-200"
              >
                分析新客户
              </button>
            </div>
            <ReportView
              report={result.report}
              customerName={result.customerName}
              meta={result.meta}
            />
          </div>
        )}
      </div>

      {/* 底部 */}
      <footer className="border-t border-gray-200 bg-white mt-16">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center">
          <p className="text-xs text-gray-400">
            B2B Customer Intelligence MVP v1.0 · Powered by OpenAI GPT-4o & Tavily Search
          </p>
        </div>
      </footer>
    </main>
  );
}

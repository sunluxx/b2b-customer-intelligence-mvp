'use client';

import { useState } from 'react';
import { Search, Globe, Building2, Loader2, ArrowRight } from 'lucide-react';

interface AnalysisFormProps {
  onSubmit: (data: { customerName: string; website: string; country: string }) => void;
  isLoading: boolean;
}

export default function AnalysisForm({ onSubmit, isLoading }: AnalysisFormProps) {
  const [customerName, setCustomerName] = useState('');
  const [website, setWebsite] = useState('');
  const [country, setCountry] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !website.trim()) return;
    onSubmit({ customerName: customerName.trim(), website: website.trim(), country: country.trim() });
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Search className="w-5 h-5 text-primary-600" />
            开始分析
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            输入客户基本信息，系统将自动收集情报并生成完整报告
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 客户名称 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              客户名称 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="例如: DOTLUX GmbH"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* 官方网站 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              官方网站 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="例如: dotlux.de 或 https://dotlux.de"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* 国家/地区 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              国家/地区
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="例如: Germany, Sweden, Israel"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* 提交按钮 */}
          <button
            type="submit"
            disabled={isLoading || !customerName.trim() || !website.trim()}
            className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                分析中，请稍候...
              </>
            ) : (
              <>
                生成情报分析报告
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

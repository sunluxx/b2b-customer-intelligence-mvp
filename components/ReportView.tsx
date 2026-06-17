'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Download, Copy, Check, ChevronDown, ChevronUp, FileText, Clock, Database } from 'lucide-react';

interface ReportViewProps {
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

export default function ReportView({ report, customerName, meta }: ReportViewProps) {
  const [copied, setCopied] = useState(false);
  const [showMeta, setShowMeta] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(report);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 复制失败静默处理
    }
  };

  const handleDownload = () => {
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${customerName.replace(/\s+/g, '_')}_Analysis_Report.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generatedDate = new Date(meta.generatedAt).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* 报告头部 */}
      <div className="bg-white rounded-t-2xl shadow-sm border border-gray-200 border-b-0 p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-primary-600" />
              <h2 className="text-xl font-bold text-gray-900">
                {customerName} - B2B客户情报分析报告
              </h2>
            </div>
            <p className="text-sm text-gray-500">
              生成时间: {generatedDate}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-green-600">已复制</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  复制
                </>
              )}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              下载报告
            </button>
          </div>
        </div>

        {/* 元数据折叠面板 */}
        <div className="mt-4">
          <button
            onClick={() => setShowMeta(!showMeta)}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showMeta ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {showMeta ? '收起分析详情' : '查看分析详情'}
          </button>
          
          {showMeta && (
            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-1">
                  <Clock className="w-3 h-3" />
                  分析耗时
                </div>
                <p className="text-sm font-semibold text-gray-900">{meta.duration}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-1">
                  <Database className="w-3 h-3" />
                  网站内容
                </div>
                <p className="text-sm font-semibold text-gray-900">{meta.websiteContentLength.toLocaleString()} 字符</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-1">
                  <FileText className="w-3 h-3" />
                  补充页面
                </div>
                <p className="text-sm font-semibold text-gray-900">{meta.additionalPagesFetched} 个</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-1">
                  <Database className="w-3 h-3" />
                  搜索查询
                </div>
                <p className="text-sm font-semibold text-gray-900">{meta.searchesCompleted} 个</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 报告内容 */}
      <div className="bg-white rounded-b-2xl shadow-sm border border-gray-200 p-8">
        <div className="markdown-report">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {report}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

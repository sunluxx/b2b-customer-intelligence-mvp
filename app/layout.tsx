import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'B2B Customer Intelligence - 客户情报分析系统',
  description: 'AI驱动的B2B客户情报分析报告生成系统，专注于欧洲LED照明市场',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  );
}

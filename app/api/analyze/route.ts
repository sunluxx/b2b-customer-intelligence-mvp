/**
 * B2B Customer Intelligence - API Route
 * 
 * 核心分析API：接收客户信息，自动收集数据，调用AI生成报告
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://lanyiapi.com/v1',
});
import { fetchWebsite, fetchMultiplePages, batchSearch } from '@/lib/tools';
import { buildAnalysisPrompt, SYSTEM_PROMPT } from '@/lib/prompts';

// 配置API超时
export const maxDuration = 300; // 5分钟
export const dynamic = 'force-dynamic';

/**
 * POST /api/analyze
 * 接收客户信息，生成完整情报分析报告
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // 解析请求体
    const body = await request.json();
    const { customerName, website, country = '' } = body;

    // 验证输入
    if (!customerName || !website) {
      return NextResponse.json(
        { error: '客户名称和网址为必填项' },
        { status: 400 }
      );
    }

    // 步骤1: 抓取主站内容
    console.log(`[${customerName}] Step 1/5: 抓取主站内容...`);
    const websiteContent = await fetchWebsite(website);
    console.log(`[${customerName}] 主站内容抓取完成，长度: ${websiteContent.length}`);

    // 步骤2: 抓取补充页面
    console.log(`[${customerName}] Step 2/5: 抓取补充页面...`);
    const commonPaths = [
      '/about-us',
      '/about',
      '/company',
      '/products',
      '/product',
      '/en/about-us',
      '/en/products',
      '/en/company',
      '/om-oss',
      '/produkter',
    ];

    const additionalPages = await fetchMultiplePages(website, commonPaths);
    const successfulPages = Object.entries(additionalPages).filter(([_, content]) => 
      !content.startsWith('Error')
    );
    console.log(`[${customerName}] 补充页面抓取完成: ${successfulPages.length}/${commonPaths.length} 成功`);

    // 步骤3: 搜索补充信息
    console.log(`[${customerName}] Step 3/5: 搜索补充信息...`);
    const searchQueries = [
      `"${customerName}" ${country} LinkedIn employees CEO founder`,
      `"${customerName}" ${country} lighting LED products revenue employee size`,
      `"${customerName}" ${country} import China supplier manufacturing`,
      `"${customerName}" ${country} project reference customer case study`,
      `"${customerName}" ${country} news 2024 2025 2026`,
    ];

    const searchResults = await batchSearch(searchQueries);
    const successfulSearches = Object.entries(searchResults).filter(([_, result]) => 
      !result.startsWith('Error')
    );
    console.log(`[${customerName}] 搜索完成: ${successfulSearches.length}/${searchQueries.length} 成功`);

    // 步骤4: 构建提示词
    console.log(`[${customerName}] Step 4/5: 构建AI提示词...`);
    const userPrompt = buildAnalysisPrompt(

      console.log(`[${customerName}] Prompt Length: ${userPrompt.length}`);
      customerName,
      website,
      country,
      websiteContent,
      Object.fromEntries(successfulPages),
      Object.fromEntries(successfulSearches)
    );
console.log(`[${customerName}] Prompt Length: ${userPrompt.length}`);
    
    // 步骤5: 调用AI生成报告
    console.log(`[${customerName}] Step 5/5: 调用AI生成报告...`);
    const { text: report } = await generateText({
      model: openai('gpt-5.5'),
      system: SYSTEM_PROMPT,
      prompt: userPrompt,
      temperature: 0.3,
      maxTokens: 3000,
    });

    console.log(`[${customerName}] Report Length: ${report.length}`);
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`[${customerName}] 报告生成完成，耗时: ${duration}秒`);

    // 返回结果
    return NextResponse.json({
      success: true,
      customerName,
      website,
      country,
      report,
      meta: {
        duration: `${duration}秒`,
        websiteContentLength: websiteContent.length,
        additionalPagesFetched: successfulPages.length,
        searchesCompleted: successfulSearches.length,
        generatedAt: new Date().toISOString(),
      },
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('分析API错误:', errorMessage);

    return NextResponse.json(
      {
        error: '报告生成失败',
        details: errorMessage,
        suggestion: '请检查API密钥配置是否正确，或稍后重试。如果问题持续，请联系技术支持。',
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS 处理CORS预检请求
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

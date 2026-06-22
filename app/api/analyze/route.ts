/**
 * B2B Customer Intelligence - API Route (流式修复版)
 * 保留 gpt-5.5，改用流式输出解决前端超时问题
 */

import { NextRequest } from 'next/server';
import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { fetchWebsite, fetchMultiplePages, batchSearch } from '@/lib/tools';
import { buildAnalysisPrompt, SYSTEM_PROMPT } from '@/lib/prompts';

export const maxDuration = 300;
export const dynamic = 'force-dynamic';

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || 'https://lanyiapi.com/v1',
});

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  console.log('ENV CHECK:', {
    key: process.env.OPENAI_API_KEY?.slice(0, 8) + '...',
    base: process.env.OPENAI_BASE_URL,
  });

  try {
    const body = await request.json();
    const { customerName, website, country = '' } = body;

    if (!customerName || !website) {
      return new Response(
        JSON.stringify({ error: '客户名称和网址为必填项' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 步骤1: 抓取主站内容
    console.log(`[${customerName}] Step 1/5: 抓取主站内容...`);
    const websiteContent = await fetchWebsite(website);
    console.log(`[${customerName}] 主站内容抓取完成，长度: ${websiteContent.length}`);

    // 步骤2: 抓取补充页面
    console.log(`[${customerName}] Step 2/5: 抓取补充页面...`);
    const commonPaths = ['/about-us', '/about', '/products'];
    const additionalPages = await fetchMultiplePages(website, commonPaths);
    const successfulPages = Object.entries(additionalPages).filter(
      ([_, content]) => !content.startsWith('Error')
    );
    console.log(`[${customerName}] 补充页面抓取完成: ${successfulPages.length}/${commonPaths.length} 成功`);

    // 步骤3: 搜索补充信息
    console.log(`[${customerName}] Step 3/5: 搜索补充信息...`);
    const searchQueries = [
      `"${customerName}" ${country} LinkedIn employees CEO founder`,
      `"${customerName}" ${country} lighting LED products revenue employee size`,
      `"${customerName}" ${country} project reference customer case study`,
    ];
    const searchResults = await batchSearch(searchQueries);
    const successfulSearches = Object.entries(searchResults).filter(
      ([_, result]) => !result.startsWith('Error')
    );
    console.log(`[${customerName}] 搜索完成: ${successfulSearches.length}/${searchQueries.length} 成功`);

    // 步骤4: 构建提示词
    console.log(`[${customerName}] Step 4/5: 构建AI提示词...`);
    const userPrompt = buildAnalysisPrompt(
      customerName,
      website,
      country,
      websiteContent,
      Object.fromEntries(successfulPages),
      Object.fromEntries(successfulSearches)
    );
    console.log(`[${customerName}] Prompt Length: ${userPrompt.length}`);

    // 步骤5: 流式调用AI生成报告（保留gpt-5.5）
    console.log(`[${customerName}] Step 5/5: 流式调用AI生成报告...`);

    const result = await streamText({
      model: openai('gpt-5.5'),
      system: SYSTEM_PROMPT,
      prompt: userPrompt,
      temperature: 0.3,
      maxTokens: 3000,
      onFinish: ({ text }) => {
        const duration = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`[${customerName}] 报告生成完成，耗时: ${duration}秒，长度: ${text.length}`);
      },
    });

    // 流式返回，前端实时看到内容，不会超时
    return result.toDataStreamResponse();

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('分析API错误:', errorMessage);

    return new Response(
      JSON.stringify({
        error: '报告生成失败',
        details: errorMessage,
        suggestion: '请检查API密钥配置是否正确，或稍后重试。',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

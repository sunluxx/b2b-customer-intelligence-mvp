import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://lanyiapi.com/v1',
});

export async function POST(request: NextRequest) {
  try {
    const { customerName } = await request.json();

    const start = Date.now();

    const { text } = await generateText({
      model: openai('gpt-5.5'),
      prompt: `简单介绍一下公司：${customerName}`,
      maxTokens: 500,
    });

    const duration = Date.now() - start;

    return NextResponse.json({
      success: true,
      text,
      duration: `${duration}ms`,
    });

  } catch (error) {
    return NextResponse.json(
      {
        error: 'AI调用失败',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

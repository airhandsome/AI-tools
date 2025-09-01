import { NextRequest, NextResponse } from 'next/server';
import { buildPrompt, callOpenAI } from '@/lib/ai';

export async function POST(req: NextRequest) {
  const { text, style = '正式', length = '适中', humor = false } = await req.json();
  if (!text || typeof text !== 'string') {
    return NextResponse.json({ ok: false, error: '缺少文本' }, { status: 400 });
  }
  const system = '你是一个中文写作与编辑助手，擅长多风格改写，要求清晰、流畅、事实准确。';
  const prompt = buildPrompt([
    `请将以下文本改写为目标风格，并确保语义不变、结构清晰。`,
    `目标风格：${style}；长度：${length}；幽默元素：${humor ? '少量点缀' : '不需要'}`,
    `输出要求：仅返回改写后的文本，不要附加解释。`,
    `文本：\n${text}`
  ]);
  const result = await callOpenAI(prompt, system);
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}


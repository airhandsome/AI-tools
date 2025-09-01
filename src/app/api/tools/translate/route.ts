import { NextRequest, NextResponse } from 'next/server';
import { buildPrompt, callOpenAI } from '@/lib/ai';

export async function POST(req: NextRequest) {
  const { text, to = 'en', tone = 'neutral', glossary = '' } = await req.json();
  if (!text) return NextResponse.json({ ok: false, error: '缺少文本' }, { status: 400 });
  const system = '你是专业本地化助手，翻译准确、语气一致，支持术语表优先。';
  const prompt = buildPrompt([
    `目标语言：${to}；语气：${tone}`,
    glossary ? `术语优先：\n${glossary}` : undefined,
    '仅返回译文，不要解释。',
    `文本：\n${text}`
  ]);
  const result = await callOpenAI(prompt, system);
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}


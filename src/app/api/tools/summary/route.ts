import { NextRequest, NextResponse } from 'next/server';
import { buildPrompt, callOpenAI } from '@/lib/ai';

export async function POST(req: NextRequest) {
  const { text, length = 150 } = await req.json();
  if (!text) return NextResponse.json({ ok: false, error: '缺少文本/内容' }, { status: 400 });
  const system = '你是摘要助手，擅长抓要点与行动项，语言简洁。';
  const prompt = buildPrompt([
    `请以约 ${length} 字输出中文摘要与3-5条要点。`,
    '格式：先摘要段落，再列要点（短句）。',
    `内容：\n${text}`
  ]);
  const result = await callOpenAI(prompt, system);
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}


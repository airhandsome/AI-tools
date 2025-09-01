import { NextRequest, NextResponse } from 'next/server';
import { buildPrompt, callOpenAI } from '@/lib/ai';

export async function POST(req: NextRequest) {
  const { code, tone = 'plain' } = await req.json();
  if (!code) return NextResponse.json({ ok: false, error: '缺少代码' }, { status: 400 });
  const system = '你是代码讲解与重构建议助手，能够用通俗语言解释复杂代码，并提示潜在风险点。';
  const style = tone === 'funny' ? '幽默吐槽风格' : '通俗直白风格';
  const prompt = buildPrompt([
    `请以${style}解释以下代码在做什么，并给出可改进点：`,
    '仅返回：功能解释、潜在问题、改进建议（分段）',
    `代码：\n${code}`
  ]);
  const result = await callOpenAI(prompt, system);
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}


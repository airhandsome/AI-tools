import { NextRequest, NextResponse } from 'next/server';
import { callOpenAI, buildPrompt, cleanAIResponse } from '@/lib/ai';

export async function POST(req: NextRequest) {
  const { topic, depth = 3 } = await req.json();
  if (!topic) return NextResponse.json({ ok: false, error: '缺少主题' }, { status: 400 });
  const system = '你是大纲/思维导图生成助手。';
  const prompt = buildPrompt([
    `基于主题生成层级大纲（深度不超过 ${depth} 级），用 Markdown 列表表示（- 层级）。`,
    '要求：逻辑清晰、覆盖主要方面，每个节点不超过12字。',
    `主题：${topic}`
  ]);
  const res = await callOpenAI(prompt, system);
  
  if (res.ok && res.content) {
    res.content = cleanAIResponse(res.content, 'text');
  }
  
  return NextResponse.json(res, { status: res.ok ? 200 : 500 });
}


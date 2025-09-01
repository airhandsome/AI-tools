import { NextRequest, NextResponse } from 'next/server';
import { callOpenAI, buildPrompt, cleanAIResponse } from '@/lib/ai';

export async function POST(req: NextRequest) {
  const { product, desc, count = 10 } = await req.json();
  if (!product) return NextResponse.json({ ok: false, error: '缺少产品名' }, { status: 400 });
  const system = '你是中文营销Slogan文案助手。';
  const prompt = buildPrompt([
    `请为以下产品生成 ${count} 条中文口号，兼顾记忆点与可传播性，长度不超过16字。`,
    `产品：${product}`,
    desc ? `描述：${desc}` : undefined,
    '只返回逐条列出的口号列表，不要解释。'
  ]);
  const res = await callOpenAI(prompt, system);
  
  if (res.ok && res.content) {
    res.content = cleanAIResponse(res.content, 'text');
  }
  
  return NextResponse.json(res, { status: res.ok ? 200 : 500 });
}


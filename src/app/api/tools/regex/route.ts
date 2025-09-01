import { NextRequest, NextResponse } from 'next/server';
import { buildPrompt, callOpenAI } from '@/lib/ai';

export async function POST(req: NextRequest) {
  const { intent, dialect = 'javascript', sample = '' } = await req.json();
  if (!intent) return NextResponse.json({ ok: false, error: '缺少意图/描述' }, { status: 400 });
  const system = '你是正则表达式专家，擅长根据自然语言描述在指定方言下构造正则，并解释含义与示例。';
  const prompt = buildPrompt([
    `方言：${dialect}`,
    `根据以下描述生成正则，并给出中文解释与1-2个匹配/不匹配例子。`,
    `只返回：正则、解释、示例（按清晰结构）`,
    `描述：${intent}`,
    sample ? `示例文本（可选）：\n${sample}` : undefined
  ]);
  const result = await callOpenAI(prompt, system);
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}


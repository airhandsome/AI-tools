import { NextRequest, NextResponse } from 'next/server';
import { buildPrompt, callOpenAI } from '@/lib/ai';

export async function POST(req: NextRequest) {
  const { nl, sql, dialect = 'postgres', schema = '' } = await req.json();
  if (!nl && !sql) return NextResponse.json({ ok: false, error: '需要 nl 或 sql 其一' }, { status: 400 });
  const system = '你是数据库与SQL专家，能够在不同方言间生成、解释与优化SQL。';
  const prompt = nl
    ? buildPrompt([
        `方言：${dialect}`,
        schema ? `表结构：\n${schema}` : undefined,
        `根据以下自然语言需求生成 SQL 并简要说明：\n${nl}`,
        `只返回：SQL 代码块，随后一段简短中文解释。`
      ])
    : buildPrompt([
        `方言：${dialect}`,
        `解释以下 SQL 的逻辑，并在可能时给出优化建议：`,
        `SQL：\n${sql}`
      ]);
  const result = await callOpenAI(prompt, system);
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}


import { NextRequest, NextResponse } from 'next/server';
import { buildPrompt, callOpenAI } from '@/lib/ai';

export async function POST(req: NextRequest) {
  const { intent, platform = 'excel', formula } = await req.json();
  if (!intent && !formula) return NextResponse.json({ ok: false, error: '需要 intent 或 formula 其一' }, { status: 400 });
  const system = '你是表格公式助手，擅长生成与解释 Excel/Google Sheets 公式。';
  const prompt = intent
    ? buildPrompt([
        `平台：${platform}`,
        `将以下需求转换为公式，并给出简短解释：\n${intent}`,
        `仅返回：公式（代码块）与简要解释。`
      ])
    : buildPrompt([
        `平台：${platform}`,
        `解释以下公式用途并指出常见错误：\n${formula}`
      ]);
  const result = await callOpenAI(prompt, system);
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}


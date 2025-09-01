import { NextRequest, NextResponse } from 'next/server';
import { buildPrompt, callOpenAI } from '@/lib/ai';

export async function POST(req: NextRequest) {
  const { resume, jd } = await req.json();
  if (!resume || !jd) return NextResponse.json({ ok: false, error: '缺少简历或JD' }, { status: 400 });
  const system = '你是招聘顾问，擅长基于JD评估简历匹配度并提出可落地的优化建议。';
  const prompt = buildPrompt([
    '请给出：匹配度评分(0-100)、优势、差距、可改写的要点示例(3-5条)。',
    `JD：\n${jd}`,
    `简历：\n${resume}`
  ]);
  const result = await callOpenAI(prompt, system);
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}


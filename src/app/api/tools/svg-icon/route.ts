import { NextRequest, NextResponse } from 'next/server';
import { callOpenAI, buildPrompt, cleanAIResponse } from '@/lib/ai';

export async function POST(req: NextRequest) {
  const { description, size = 128, stroke = 2, style = 'outline' } = await req.json();
  if (!description) return NextResponse.json({ ok: false, error: '缺少描述' }, { status: 400 });
  const system = '你是SVG图标生成助手。严格输出可渲染的 <svg> 元素，禁止额外说明文字。';
  const prompt = buildPrompt([
    `根据描述生成一个 ${style} 风格的SVG图标，viewBox=0 0 ${size} ${size}，stroke-width=${stroke}，尽量使用基本图形与路径；不要外链字体或图片。`,
    '只返回SVG标签本体。',
    `描述：${description}`
  ]);
  const res = await callOpenAI(prompt, system);
  
  if (res.ok && res.content) {
    res.content = cleanAIResponse(res.content, 'text');
  }
  
  return NextResponse.json(res, { status: res.ok ? 200 : 500 });
}


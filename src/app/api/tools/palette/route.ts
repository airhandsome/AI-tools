import { NextRequest, NextResponse } from 'next/server';
import { callOpenAI, buildPrompt, cleanAIResponse } from '@/lib/ai';

export async function POST(req: NextRequest) {
  const { theme, locked }: { theme: string; locked?: string } = await req.json();
  if (!theme && !locked) return NextResponse.json({ ok: false, error: '缺少主题或已锁定颜色' }, { status: 400 });
  const system = '你是配色设计助手，请严格输出 JSON。';
  const prompt = buildPrompt([
    '根据主题生成 5-6 个协调的颜色方案，返回 JSON 数组：[{"name":"Primary","hex":"#...","role":"primary|secondary|accent|neutral","contrastOnWhite":"AA/AAA"}]',
    '颜色需可用于 UI，保证可访问性（对比度至少AA）并附上简单中文名称。',
    locked ? `保留此颜色并围绕它设计：${locked}` : undefined,
    theme ? `主题：${theme}` : undefined
  ]);
  const res = await callOpenAI(prompt, system);
  
  if (res.ok && res.content) {
    try {
      const cleaned = cleanAIResponse(res.content, 'json');
      // 验证JSON格式
      JSON.parse(cleaned);
      res.content = cleaned;
    } catch (e) {
      return NextResponse.json({ ok: false, error: 'AI返回的内容格式错误' }, { status: 500 });
    }
  }
  
  return NextResponse.json(res, { status: res.ok ? 200 : 500 });
}


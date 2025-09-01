import { NextRequest, NextResponse } from 'next/server';
import { callOpenAI, buildPrompt, cleanAIResponse } from '@/lib/ai';

export async function POST(req: NextRequest) {
  const { industry = '通用', days = 30, goal } = await req.json();
  if (!goal) return NextResponse.json({ ok: false, error: '缺少目标' }, { status: 400 });
  const system = '你是内容日历生成助手。';
  const prompt = buildPrompt([
    `为${industry}行业生成 ${days} 天内容日历，字段：day(1-${days})、theme、channel(微博/公众号/小红书/抖音等)、title、tags、cta。`,
    `目标：${goal}`,
    '只返回 JSON 数组。'
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


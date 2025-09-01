import { NextRequest, NextResponse } from 'next/server';
import { buildPrompt, callOpenAI } from '@/lib/ai';

export async function POST(req: NextRequest) {
  const { topic, platform = 'xiaohongshu' } = await req.json();
  if (!topic) return NextResponse.json({ ok: false, error: '缺少主题' }, { status: 400 });
  const system = '你是社媒运营助手，能为不同平台生成合适的标签和Emoji组合。';
  const prompt = buildPrompt([
    `平台：${platform}`,
    '请输出10-15个中文标签与合适的Emoji，按相关性排序；最后给出一条示例文案（含标签）。',
    `主题：${topic}`
  ]);
  const result = await callOpenAI(prompt, system);
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}


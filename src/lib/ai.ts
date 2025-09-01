export type AiResponse = {
  ok: boolean;
  content?: string;
  error?: string;
  usage?: { inputTokens?: number; outputTokens?: number };
  meta?: Record<string, unknown>;
};

type Provider = 'openai' | 'deepseek';
const PROVIDER = (process.env.AI_PROVIDER as Provider) || (process.env.DEEPSEEK_API_KEY ? 'deepseek' : 'openai');
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

if (!OPENAI_API_KEY) {
  // Allow startup without key; runtime will error only on API calls
}

export async function callOpenAI(prompt: string, system?: string): Promise<AiResponse> {
  const useDeepseek: boolean = PROVIDER === 'deepseek';
  const baseUrl = useDeepseek ? 'https://api.deepseek.com/v1/chat/completions' : 'https://api.openai.com/v1/chat/completions';
  const apiKey = useDeepseek ? DEEPSEEK_API_KEY : OPENAI_API_KEY;
  const model = useDeepseek ? DEEPSEEK_MODEL : OPENAI_MODEL;
  if (!apiKey) {
    return { ok: false, error: useDeepseek ? 'Missing DEEPSEEK_API_KEY' : 'Missing OPENAI_API_KEY' };
  }
  try {
    const res = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        messages: [
          ...(system ? [{ role: 'system', content: system }] : []),
          { role: 'user', content: prompt }
        ]
      })
    });
    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: `${useDeepseek ? 'DeepSeek' : 'OpenAI'} error ${res.status}: ${text}` };
    }
    const data = await res.json();
    const content: string | undefined = data?.choices?.[0]?.message?.content;
    const usage = data?.usage ? { inputTokens: data.usage.prompt_tokens, outputTokens: data.usage.completion_tokens } : undefined;
    return { ok: true, content, usage };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Unknown error' };
  }
}

export function buildPrompt(parts: Array<string | undefined>): string {
  return parts.filter(Boolean).join('\n\n');
}

// 清理AI返回的内容，移除可能的Markdown代码块格式
export function cleanAIResponse(content: string, type?: 'json' | 'html' | 'text'): string {
  if (!content) return '';
  
  let cleaned = content;
  
  // 根据类型进行不同的清理
  if (type === 'json') {
    // 对于JSON，移除所有代码块标记
    cleaned = cleaned.replace(/```json\s*/gi, '').replace(/```\s*$/gi, '');
    cleaned = cleaned.replace(/^```\s*/gi, '').replace(/\s*```$/gi, '');
  } else if (type === 'html') {
    // 对于HTML，只移除代码块标记，保留HTML内容
    cleaned = cleaned.replace(/```html\s*/gi, '').replace(/```\s*$/gi, '');
    cleaned = cleaned.replace(/^```\s*/gi, '').replace(/\s*```$/gi, '');
  } else {
    // 默认情况，移除所有代码块标记
    cleaned = cleaned.replace(/```\w*\s*/gi, '').replace(/```\s*$/gi, '');
    cleaned = cleaned.replace(/^```\s*/gi, '').replace(/\s*```$/gi, '');
  }
  
  // 移除多余的空行
  cleaned = cleaned.trim();
  
  return cleaned;
}


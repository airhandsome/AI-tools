import { NextRequest, NextResponse } from 'next/server';
import { callOpenAI, buildPrompt, cleanAIResponse } from '@/lib/ai';

export async function POST(req: NextRequest) {
  const { description, framework = 'html+tailwind' } = await req.json();
  if (!description) return NextResponse.json({ ok: false, error: '缺少描述' }, { status: 400 });
  
  const system = '你是UI代码生成助手。';
  let prompt: string;
  
  if (framework === 'react') {
    prompt = buildPrompt([
      `请生成一个React函数组件，满足：${description}`,
      '要求：使用函数组件、React Hooks、JSX语法、Tailwind CSS样式、可访问性（aria-label/alt）、移动端优先。',
      '只返回组件代码，不要解释。',
      '必须使用标准格式：function App() { return (...); }',
      '不要包含import语句，只返回组件定义。'
    ]);
  } else if (framework === 'vue') {
    prompt = buildPrompt([
      `请生成一个Vue 3组件，满足：${description}`,
      '要求：使用Composition API、简单的template、setup函数、Tailwind CSS样式、可访问性、移动端优先。',
      '只返回组件代码，不要解释。',
      '必须使用标准格式：const app = Vue.createApp({ template: `...`, setup() { ... } })',
      '不要使用class语法、import语句、复杂的ES6语法，只使用基本的Vue 3语法。',
      'template中只使用基本的HTML和Tailwind类名。'
    ]);
  } else {
    prompt = buildPrompt([
      `请生成一个 ${framework} 组件代码（含HTML+CSS/Tailwind），满足：${description}`,
      '要求：结构语义化、可访问性（aria-label/alt）、移动端优先、不要外部依赖。',
      '只返回代码块，不要解释。'
    ]);
  }
  
  const res = await callOpenAI(prompt, system);
  
  if (res.ok && res.content) {
    res.content = cleanAIResponse(res.content, 'html');
  }
  
  return NextResponse.json(res, { status: res.ok ? 200 : 500 });
}


'use client';
import { useMemo, useState } from 'react';

type Tool = { href: string; title: string; desc: string; keywords?: string[] };

function fuzzyScore(query: string, text: string): number {
  if (!query) return 0;
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  // Exact/substring boosts
  if (t === q) return 1000;
  if (t.includes(q)) return 600 + Math.max(0, 50 - (t.indexOf(q) || 0));
  // Simple subsequence scoring
  let score = 0;
  let ti = 0;
  for (let i = 0; i < q.length; i++) {
    const ch = q[i];
    const idx = t.indexOf(ch, ti);
    if (idx === -1) { score -= 5; continue; }
    // closer characters -> higher score
    score += 20 - Math.min(19, idx - ti);
    ti = idx + 1;
  }
  return score;
}

export default function HomePage() {
  const tools: Tool[] = [
    { href: '/tools/rewrite', title: '文本润色与风格转换', desc: '输入文本，选择风格，一键重写' },
    { href: '/tools/code-explain', title: '代码解释与简化', desc: '用通俗语言解释/优化代码', keywords: ['code','explain','refactor'] },
    { href: '/tools/translate', title: '翻译校对与本地化', desc: '多语翻译与语气一致性', keywords: ['translate','localization','glossary'] },
    { href: '/tools/summary', title: '长文摘要与要点', desc: 'URL/文本 → 摘要与要点', keywords: ['summary','outline'] },
    { href: '/tools/regex', title: '正则生成与解释', desc: 'NL→Regex / Regex→解释', keywords: ['regex','regular expression'] },
    { href: '/tools/sql', title: 'SQL 生成与解释', desc: '方言切换，结构示例', keywords: ['sql','query'] },
    { href: '/tools/excel', title: 'Excel/Sheets 公式助手', desc: '描述→公式，解释与修复', keywords: ['excel','sheets','formula'] },
    { href: '/tools/resume', title: '简历优化与JD匹配', desc: '评分与改写建议', keywords: ['resume','cv','job'] },
    { href: '/tools/social-tags', title: '社媒标签与Emoji', desc: '主题→平台化标签', keywords: ['social','tags','emoji'] },
    { href: '/tools/palette', title: '配色方案生成器', desc: '主题→5-6色配色，支持锁定', keywords: ['color','palette'] },
    { href: '/tools/slogan', title: '口号/标题生成器', desc: '产品名称+描述→10条备选', keywords: ['slogan','title'] },
    { href: '/tools/ui-snippet', title: '描述→UI片段', desc: '生成 HTML/Tailwind 组件', keywords: ['ui','component','tailwind'] },
    { href: '/tools/outline', title: '思维导图/大纲', desc: '主题→多层级 Markdown 大纲', keywords: ['outline','mindmap'] },
    { href: '/tools/svg-icon', title: 'SVG图标生成器', desc: '描述→参数化SVG图标', keywords: ['svg','icon','vector'] },
    { href: '/tools/calendar', title: '营销计划/内容日历', desc: '行业+目标→30日内容主题', keywords: ['calendar','marketing','content'] },
    { href: '/tools/website-iq', title: '网站"智商检测器"', desc: 'URL分析业务价值与改进建议', keywords: ['website','analysis','business'] },
    { href: '/tools/prompt-optimizer', title: 'AI绘画提示词优化器', desc: '短想法→专业绘画提示词', keywords: ['ai','art','prompt','midjourney'] },
    { href: '/tools/listing-optimizer', title: '电商Listing优化器', desc: '商品页优化提升转化率', keywords: ['ecommerce','listing','amazon','optimization'] }
  ];

  const [q, setQ] = useState('');
  const results = useMemo(() => {
    if (!q.trim()) return tools;
    const scored = tools.map(t => {
      const text = `${t.title} ${t.desc} ${(t.keywords||[]).join(' ')}`;
      const score = fuzzyScore(q.trim(), text);
      return { t, score };
    }).filter(r => r.score > 0);
    scored.sort((a,b) => b.score - a.score);
    return scored.map(r => r.t);
  }, [q, tools]);

  return (
    <section className="stack">
      <h1>AI 工具栈</h1>
      <div className="card" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <input
          className="input lg"
          placeholder="搜索工具名称、功能或关键词（如：SQL、正则、翻译）"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ flex: 1 }}
        />
        {q && (
          <button className="btn" onClick={() => setQ('')}>清空</button>
        )}
      </div>
      <div className="grid">
        {results.map((t) => (
          <a key={t.href} href={t.href} className="card hover-raise" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h3 style={{ marginTop: 0 }}>{t.title}</h3>
            <p style={{ opacity: .9 }}>{t.desc}</p>
          </a>
        ))}
        {results.length === 0 && (
          <div className="card">未找到匹配的工具，试试其他关键词</div>
        )}
      </div>
    </section>
  );
}


'use client';
import { useState } from 'react';
import { postJson, type ApiResult } from '@/lib/api';
import CopyButton from '@/app/_components/CopyButton';
import Examples, { type Example } from '@/app/_components/Examples';
import Usage from '@/app/_components/Usage';
import { ToolDonation } from '@/app/_components/Monetize';

export default function RewritePage() {
  const [text, setText] = useState('');
  const [style, setStyle] = useState('正式');
  const [length, setLength] = useState('适中');
  const [humor, setHumor] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  async function onGenerate() {
    setLoading(true); setError(''); setResult('');
    try {
      const data = await postJson<ApiResult>('/api/tools/rewrite', { text, style, length, humor });
      if (!data.ok) throw new Error(data.error || '生成失败');
      setResult(data.content || '');
      // 简单事件埋点
      if (typeof window !== 'undefined') {
        (window as any).gtag?.('event', 'ai_tool_generate', { tool_name: 'rewrite', success: true });
      }
    } catch (e: any) {
      setError(e.message || '请求失败');
    } finally {
      setLoading(false);
    }
  }

  function onCopy() {
    if (!result) return;
    navigator.clipboard.writeText(result);
    (window as any).gtag?.('event', 'ai_tool_copy', { tool_name: 'rewrite' });
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <section className="stack prose">
      <h2>文本润色与风格转换</h2>
      <Usage
        title="如何使用"
        steps={[
          '在上方文本框粘贴需要改写的内容',
          '选择目标风格与长度，可选"少量幽默"',
          '点击"生成"，在下方查看并复制结果'
        ]}
        tips={[
          '尽量提供明确场景，如"给客户的道歉邮件"',
          '结果不满意可再次生成或调整风格，再试一次'
        ]}
      />
      <Examples
        items={([
          { title: '正式邮件', text: 'hi，明天能不能把报告给我，我要交老板。' },
          { title: '社交媒体', text: '新品上线了，快来看看，超好用！' },
          { title: '学术口吻', text: '我们本季度的增长还可以，主要是产品卖得好。' }
        ] as Example[])}
        onUse={(t) => setText(t)}
      />
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <div className="card input-area" style={{ width: '100%' }}>
          <div className="stack">
            <textarea className="lg" rows={12} placeholder="粘贴需要改写的文本" value={text} onChange={(e) => setText(e.target.value)} />
            <div className="row" style={{ flexWrap: 'wrap' }}>
              <select className="lg" value={style} onChange={(e) => setStyle(e.target.value)}>
                <option>正式</option>
                <option>社交媒体</option>
                <option>学术</option>
                <option>口语</option>
                <option>简洁</option>
              </select>
              <select className="lg" value={length} onChange={(e) => setLength(e.target.value)}>
                <option>简短</option>
                <option>适中</option>
                <option>详细</option>
              </select>
              <label className="row" style={{ gap: 6 }}>
                <input type="checkbox" checked={humor} onChange={(e) => setHumor(e.target.checked)} /> 少量幽默
              </label>
              <button className="btn primary" onClick={onGenerate} disabled={loading || !text}>
                {loading ? '生成中…' : '生成'}
              </button>
            </div>
          </div>
        </div>

        <div className="card output-area" style={{ width: '100%' }}>
          <div className="stack">
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <h3>输出</h3>
              <CopyButton getText={() => result} />
            </div>
            {error && <p style={{ color: '#b91c1c' }}>{error}</p>}
            <textarea className="lg" rows={12} value={result} readOnly />
          </div>
        </div>
      </div>

      {/* 捐赠组件 */}
      <ToolDonation />
    </section>
  );
}


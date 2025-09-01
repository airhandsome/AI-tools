'use client';
import { useState, useEffect } from 'react';
import { postJson, type ApiResult } from '@/lib/api';
import CopyButton from '@/app/_components/CopyButton';
import Usage from '@/app/_components/Usage';
import Examples from '@/app/_components/Examples';

export default function CodeExplainPage() {
  const [code, setCode] = useState('');
  const [tone, setTone] = useState('plain');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 页面离开提醒
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (loading) {
        e.preventDefault();
        e.returnValue = '正在生成中，确定要离开吗？';
        return '正在生成中，确定要离开吗？';
      }
    };

    const handlePopState = (e: PopStateEvent) => {
      if (loading) {
        if (!confirm('正在生成中，确定要离开吗？')) {
          e.preventDefault();
          window.history.pushState(null, '', window.location.href);
        }
      }
    };

    if (loading) {
      window.addEventListener('beforeunload', handleBeforeUnload);
      window.addEventListener('popstate', handlePopState);
      window.history.pushState(null, '', window.location.href);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [loading]);

  async function onExplain() {
    setLoading(true); setError(''); setResult('');
    try {
      const data = await postJson<ApiResult>('/api/tools/code-explain', { code, tone });
      if (!data.ok) throw new Error(data.error || '失败');
      setResult(data.content || '');
    } catch (e: any) { setError(e.message || '请求失败'); } finally { setLoading(false); }
  }

  return (
    <section className="stack prose">
      <h2>代码解释与简化</h2>
      <Examples
        items={[
          { title: '异步请求', text: 'async function fetchData(){ try{ const r=await fetch(url); return await r.json(); }catch(e){ console.error(e); } }' },
          { title: '数组去重', text: 'const unique=[...new Set(arr)]' },
          { title: '递归遍历树', text: 'function walk(n){ if(!n) return; visit(n); (n.children||[]).forEach(walk); }' }
        ]}
        onUse={(t) => setCode(t)}
      />
      <Usage
        title="如何使用"
        steps={[
          '粘贴需要解释的代码片段',
          '选择语气（通俗/幽默吐槽）',
          '点击"解释"，在下方查看功能解释与改进建议'
        ]}
      />
      <div className="stack">
        <div className="card stack" style={{ width: '100%' }}>
          <textarea className="lg" rows={14} placeholder="粘贴代码" value={code} onChange={(e) => setCode(e.target.value)} />
          <div className="row">
            <select className="lg" value={tone} onChange={(e) => setTone(e.target.value)}>
              <option value="plain">通俗</option>
              <option value="funny">幽默吐槽</option>
            </select>
            <button 
              className={`btn generate ${loading ? 'loading' : ''}`}
              onClick={onExplain} 
              disabled={!code || loading}
            >
              {loading ? '生成中…' : '🔍 解释代码'}
            </button>
          </div>
        </div>
        <div className="card stack" style={{ width: '100%' }}>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <h3>输出</h3>
            <CopyButton getText={() => result} />
          </div>
          {error && <p style={{ color: '#b91c1c' }}>{error}</p>}
          <pre><code>{result}</code></pre>
        </div>
      </div>
    </section>
  );
}


'use client';
import { useState, useEffect } from 'react';
import { postJson, type ApiResult } from '@/lib/api';
import CopyButton from '@/app/_components/CopyButton';
import Usage from '@/app/_components/Usage';
import Examples from '@/app/_components/Examples';

export default function SloganPage() {
  const [product, setProduct] = useState('手冲咖啡店');
  const [desc, setDesc] = useState('一家专注手冲咖啡的社区小店');
  const [count, setCount] = useState(10);
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

  async function onGenerate() {
    setLoading(true); setError(''); setResult('');
    try {
      const data = await postJson<ApiResult>('/api/tools/slogan', { product, desc, count });
      if (!data.ok) throw new Error(data.error || '失败');
      setResult(data.content || '');
    } catch (e: any) { setError(e.message || '请求失败'); } finally { setLoading(false); }
  }

  return (
    <section className="stack prose">
      <h2>AI 小标题/口号生成器</h2>
      <Examples
        items={[
          { title: '咖啡店', text: '手冲咖啡店' },
          { title: '健身App', text: '智能健身打卡App' },
          { title: '教育SaaS', text: '面向机构的教务SaaS' }
        ]}
        onUse={(t) => setProduct(t)}
      />
      <Usage
        title="如何使用"
        steps={[
          '输入产品名称，可补充一句描述',
          '设置条数，点击"生成"',
          '在下方复制口号列表'
        ]}
      />
      <div className="stack">
        <div className="card stack">
          <input className="input lg" placeholder="产品名称" value={product} onChange={(e) => setProduct(e.target.value)} />
          <input className="input lg" placeholder="简短描述（可选）" value={desc} onChange={(e) => setDesc(e.target.value)} />
          <div className="row">
            <select className="lg" value={count} onChange={(e) => setCount(Number(e.target.value))}>
              <option value={5}>5条</option>
              <option value={10}>10条</option>
              <option value={20}>20条</option>
            </select>
            <button 
              className={`btn generate ${loading ? 'loading' : ''}`}
              onClick={onGenerate} 
              disabled={loading || !product}
            >
              {loading ? '生成中…' : '💡 生成口号'}
            </button>
          </div>
        </div>
        <div className="card stack">
          {error && <p style={{ color: '#b91c1c' }}>{error}</p>}
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <h3>输出</h3>
            <CopyButton getText={() => result} />
          </div>
          <pre><code>{result}</code></pre>
        </div>
      </div>
    </section>
  );
}


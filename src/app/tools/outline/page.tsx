'use client';
import { useState, useEffect } from 'react';
import { postJson, type ApiResult } from '@/lib/api';
import CopyButton from '@/app/_components/CopyButton';
import Usage from '@/app/_components/Usage';
import Examples from '@/app/_components/Examples';

export default function OutlinePage() {
  const [topic, setTopic] = useState('如何搭建个人知识库');
  const [depth, setDepth] = useState(3);
  const [outline, setOutline] = useState('');
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
    setLoading(true); setError(''); setOutline('');
    try {
      const data = await postJson<ApiResult>('/api/tools/outline', { topic, depth });
      if (!data.ok) throw new Error(data.error || '失败');
      setOutline(data.content || '');
    } catch (e: any) { setError(e.message || '请求失败'); } finally { setLoading(false); }
  }

  return (
    <section className="stack prose">
      <h2>思维导图/大纲生成器</h2>
      <Examples
        items={[
          { title: '行业报告', text: '生成式AI行业分析' },
          { title: '课程大纲', text: '前端工程化入门课程' },
          { title: '写作计划', text: '我的年度读书总结' }
        ]}
        onUse={(t) => setTopic(t)}
      />
      <Usage
        title="如何使用"
        steps={[
          '输入主题，选择层级深度',
          '点击生成，复制 Markdown 列表作为大纲'
        ]}
      />
      <div className="stack">
        <div className="card stack">
          <input className="input lg" placeholder="主题" value={topic} onChange={(e) => setTopic(e.target.value)} />
          <div className="row">
            <select className="lg" value={depth} onChange={(e) => setDepth(Number(e.target.value))}>
              <option value={2}>2 层</option>
              <option value={3}>3 层</option>
              <option value={4}>4 层</option>
            </select>
            <button 
              className={`btn generate ${loading ? 'loading' : ''}`}
              onClick={onGenerate} 
              disabled={loading || !topic}
            >
              {loading ? '生成中…' : '📋 生成大纲'}
            </button>
          </div>
        </div>
        <div className="card stack">
          {error && <p style={{ color: '#b91c1c' }}>{error}</p>}
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <h3>输出</h3>
            <CopyButton getText={() => outline} />
          </div>
          <pre><code>{outline}</code></pre>
        </div>
      </div>
    </section>
  );
}


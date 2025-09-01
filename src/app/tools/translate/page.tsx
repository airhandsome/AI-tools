'use client';
import { useState, useEffect } from 'react';
import { postJson, type ApiResult } from '@/lib/api';
import CopyButton from '@/app/_components/CopyButton';
import Usage from '@/app/_components/Usage';
import Examples from '@/app/_components/Examples';

export default function TranslatePage() {
  const [text, setText] = useState('');
  const [to, setTo] = useState('en');
  const [tone, setTone] = useState('neutral');
  const [glossary, setGlossary] = useState('');
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

  async function onTranslate() {
    setLoading(true); setError(''); setResult('');
    try {
      const data = await postJson<ApiResult>('/api/tools/translate', { text, to, tone, glossary });
      if (!data.ok) throw new Error(data.error || '失败');
      setResult(data.content || '');
    } catch (e: any) { setError(e.message || '请求失败'); } finally { setLoading(false); }
  }

  return (
    <section className="stack prose">
      <h2>翻译校对与本地化</h2>
      <Examples
        items={[
          { title: '产品描述', text: '这是一款面向初学者的轻量级AI工具，帮助你更快完成工作。' },
          { title: '客服回复', text: '非常抱歉给您带来困扰，我们将尽快处理并反馈。' },
          { title: '博客段落', text: '生成式AI正在改变知识工作者的生产方式。' }
        ]}
        onUse={(t) => setText(t)}
      />
      <Usage
        title="如何使用"
        steps={[
          '粘贴要翻译的文本，选择目标语言与语气',
          '可提供术语表（每行一个术语），提高一致性',
          '点击"翻译"，在下方复制译文'
        ]}
      />
      <div className="stack">
        <div className="card stack" style={{ width: '100%' }}>
          <textarea className="lg" rows={10} placeholder="输入需要翻译的文本" value={text} onChange={(e) => setText(e.target.value)} />
          <div className="row">
            <select className="lg" value={to} onChange={(e) => setTo(e.target.value)}>
              <option value="en">English</option>
              <option value="ja">日本語</option>
              <option value="ko">한국어</option>
              <option value="de">Deutsch</option>
              <option value="fr">Français</option>
            </select>
            <select className="lg" value={tone} onChange={(e) => setTone(e.target.value)}>
              <option value="neutral">中性</option>
              <option value="formal">正式</option>
              <option value="casual">口语</option>
            </select>
            <button 
              className={`btn generate ${loading ? 'loading' : ''}`}
              disabled={!text || loading} 
              onClick={onTranslate}
            >
              {loading ? '生成中…' : '🌐 翻译'}
            </button>
          </div>
          <textarea className="lg" rows={6} placeholder="可选：术语优先（每行一个）" value={glossary} onChange={(e) => setGlossary(e.target.value)} />
        </div>
        <div className="card stack" style={{ width: '100%' }}>
          {error && <p style={{ color: '#b91c1c' }}>{error}</p>}
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <h3>输出</h3>
            <CopyButton getText={() => result} />
          </div>
          <textarea className="lg" rows={10} value={result} readOnly />
        </div>
      </div>
    </section>
  );
}


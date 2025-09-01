'use client';
import { useState, useEffect } from 'react';
import { postJson, type ApiResult } from '@/lib/api';
import CopyButton from '@/app/_components/CopyButton';
import Usage from '@/app/_components/Usage';
import Examples from '@/app/_components/Examples';

export default function SummaryPage() {
  const [text, setText] = useState('');
  const [length, setLength] = useState(150);
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

  async function onSummarize() {
    setLoading(true); setError(''); setResult('');
    try {
      const data = await postJson<ApiResult>('/api/tools/summary', { text, length });
      if (!data.ok) throw new Error(data.error || '失败');
      setResult(data.content || '');
    } catch (e: any) { setError(e.message || '请求失败'); } finally { setLoading(false); }
  }

  return (
    <section className="stack prose">
      <h2>长文摘要与要点</h2>
      <Examples
        items={[
          { title: '会议纪要', text: '会议讨论了下季度OKR、研发排期与营销预算，主要分歧在…' },
          { title: '行业文章', text: '近年来云计算成本结构发生变化，边缘计算与无服务器架构…' },
          { title: '长邮件', text: '亲爱的团队成员们，过去两周我们完成了…' }
        ]}
        onUse={(t) => setText(t)}
      />
      <Usage
        title="如何使用"
        steps={[
          '粘贴要摘要的长文/会议记录/网页文本',
          '选择摘要长度（50/150/300字）',
          '点击"摘要"，在下方复制摘要与要点'
        ]}
      />
      <div className="stack">
        <div className="card stack" style={{ width: '100%' }}>
          <textarea className="lg" rows={12} placeholder="粘贴或输入要摘要的文本（支持较长内容）" value={text} onChange={(e) => setText(e.target.value)} />
          <div className="row">
            <select className="lg" value={length} onChange={(e) => setLength(Number(e.target.value))}>
              <option value={50}>约50字</option>
              <option value={150}>约150字</option>
              <option value={300}>约300字</option>
            </select>
            <button 
              className={`btn generate ${loading ? 'loading' : ''}`}
              disabled={!text || loading} 
              onClick={onSummarize}
            >
              {loading ? '生成中…' : '📝 生成摘要'}
            </button>
          </div>
        </div>
        <div className="card stack" style={{ width: '100%' }}>
          {error && <p style={{ color: '#b91c1c' }}>{error}</p>}
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <h3>输出</h3>
            <CopyButton getText={() => result} />
          </div>
          <textarea className="lg" rows={12} value={result} readOnly />
        </div>
      </div>
    </section>
  );
}


'use client';
import { useState, useEffect } from 'react';
import { postJson, type ApiResult } from '@/lib/api';
import Usage from '@/app/_components/Usage';
import Examples from '@/app/_components/Examples';
import CopyButton from '@/app/_components/CopyButton';

type DayItem = { day: number; theme: string; channel: string; title: string; tags?: string; cta?: string };

export default function CalendarPage() {
  const [industry, setIndustry] = useState('通用');
  const [days, setDays] = useState(30);
  const [goal, setGoal] = useState('提高品牌曝光与互动');
  const [items, setItems] = useState<DayItem[]>([]);
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
    setLoading(true); setError(''); setItems([]);
    try {
      const data = await postJson<ApiResult>('/api/tools/calendar', { industry, days, goal });
      if (!data.ok) throw new Error(data.error || '失败');
      try {
        const parsed = JSON.parse(data.content || '[]');
        setItems(parsed);
      } catch (parseError) {
        throw new Error('返回的数据格式错误，请重试');
      }
    } catch (e: any) { setError(e.message || '请求失败'); } finally { setLoading(false); }
  }

  // 导出为CSV
  const exportAsCSV = () => {
    if (!items.length) return;
    
    const headers = ['Day', 'Theme', 'Channel', 'Title', 'Tags', 'CTA'];
    const csvContent = [
      headers.join(','),
      ...items.map(item => [
        item.day,
        `"${item.theme}"`,
        item.channel,
        `"${item.title}"`,
        item.tags ? `"${item.tags}"` : '',
        item.cta ? `"${item.cta}"` : ''
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `content-calendar-${industry}-${days}days.csv`;
    link.click();
  };

  return (
    <section className="stack prose">
      <h2>营销计划/内容日历</h2>
      <Examples
        items={[
          { title: '电商', text: '电商' },
          { title: 'SaaS', text: 'SaaS' },
          { title: '本地生活', text: '本地生活' }
        ]}
        onUse={(t) => setIndustry(t)}
      />
      <Usage
        title="如何使用"
        steps={[ '选择行业与天数，填写目标，点击生成；可复制JSON或导出CSV' ]}
      />
      <div className="stack">
        <div className="card stack">
          <div className="row">
            <input className="input lg" placeholder="行业（如：电商、SaaS）" value={industry} onChange={(e) => setIndustry(e.target.value)} />
            <select className="lg" value={days} onChange={(e) => setDays(Number(e.target.value))}>
              <option value={7}>7天</option>
              <option value={14}>14天</option>
              <option value={30}>30天</option>
            </select>
          </div>
          <input className="input lg" placeholder="目标（如：提高品牌曝光与互动）" value={goal} onChange={(e) => setGoal(e.target.value)} />
          <button 
            className={`btn generate ${loading ? 'loading' : ''}`}
            onClick={onGenerate} 
            disabled={loading || !goal}
          >
            {loading ? '生成中…' : '📅 生成日历'}
          </button>
        </div>
        <div className="card stack">
          {error && <p style={{ color: '#b91c1c' }}>{error}</p>}
          {items.length > 0 ? (
            <>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <h3>输出</h3>
                <div className="row" style={{ gap: 8 }}>
                  <button className="btn" onClick={exportAsCSV}>导出CSV</button>
                  <CopyButton getText={() => JSON.stringify(items, null, 2)} />
                </div>
              </div>
              <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
                {items.map((it) => (
                  <div key={it.day} className="card" style={{ padding: 12 }}>
                    <strong>Day {it.day}</strong>
                    <div style={{ color: 'var(--muted)', fontSize: 12 }}>{it.channel}</div>
                    <div>{it.theme}</div>
                    <div style={{ fontSize: 14 }}>{it.title}</div>
                    {it.tags && <div style={{ color: 'var(--muted)', fontSize: 12 }}>{it.tags}</div>}
                    {it.cta && <div style={{ fontSize: 12 }}>CTA：{it.cta}</div>}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div>生成后在此处显示内容日历。</div>
          )}
        </div>
      </div>
    </section>
  );
}


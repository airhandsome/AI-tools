'use client';
import { useState, useEffect } from 'react';
import { postJson, type ApiResult } from '@/lib/api';
import Usage from '@/app/_components/Usage';
import Examples from '@/app/_components/Examples';
import CopyButton from '@/app/_components/CopyButton';

export default function SvgIconPage() {
  const [description, setDescription] = useState('一杯咖啡的线性图标');
  const [size, setSize] = useState(128);
  const [stroke, setStroke] = useState(2);
  const [style, setStyle] = useState('outline');
  const [svg, setSvg] = useState('');
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
    setLoading(true); setError(''); setSvg('');
    try {
      const data = await postJson<ApiResult>('/api/tools/svg-icon', { description, size, stroke, style });
      if (!data.ok) throw new Error(data.error || '失败');
      setSvg(data.content || '');
    } catch (e: any) { setError(e.message || '请求失败'); } finally { setLoading(false); }
  }

  return (
    <section className="stack prose">
      <h2>图标描述→SVG 生成器</h2>
      <Examples
        items={[
          { title: '咖啡杯', text: '一杯咖啡的线性图标' },
          { title: '云下载', text: '云朵与向下箭头的图标' },
          { title: '爱心', text: '爱心线性图标，圆角' }
        ]}
        onUse={(t) => setDescription(t)}
      />
      <Usage
        title="如何使用"
        steps={['输入描述，选择大小/描边/风格，点击生成，复制SVG']}
      />
      <div className="stack">
        <div className="card stack">
          <input className="input lg" placeholder="描述" value={description} onChange={(e) => setDescription(e.target.value)} />
          <div className="row">
            <select className="lg" value={style} onChange={(e) => setStyle(e.target.value)}>
              <option value="outline">Outline</option>
              <option value="solid">Solid</option>
            </select>
            <select className="lg" value={size} onChange={(e) => setSize(Number(e.target.value))}>
              <option value={64}>64</option>
              <option value={128}>128</option>
              <option value={256}>256</option>
            </select>
            <select className="lg" value={stroke} onChange={(e) => setStroke(Number(e.target.value))}>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
            </select>
            <button 
              className={`btn generate ${loading ? 'loading' : ''}`}
              onClick={onGenerate} 
              disabled={loading || !description}
            >
              {loading ? '生成中…' : '🎨 生成图标'}
            </button>
          </div>
        </div>
        <div className="card stack">
          {error && <p style={{ color: '#b91c1c' }}>{error}</p>}
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <h3>输出</h3>
            <CopyButton getText={() => svg} />
          </div>
          <div dangerouslySetInnerHTML={{ __html: svg }} />
        </div>
      </div>
    </section>
  );
}


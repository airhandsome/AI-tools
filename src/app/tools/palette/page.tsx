'use client';
import { useState, useEffect } from 'react';
import { postJson, type ApiResult } from '@/lib/api';
import CopyButton from '@/app/_components/CopyButton';
import Usage from '@/app/_components/Usage';

type Color = { name: string; hex: string; role?: string; contrastOnWhite?: string };

export default function PalettePage() {
  const [theme, setTheme] = useState('宁静的大海');
  const [locked, setLocked] = useState('');
  const [colors, setColors] = useState<Color[]>([]);
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
    setLoading(true); setError(''); setColors([]);
    try {
      const data = await postJson<ApiResult>('/api/tools/palette', { theme, locked });
      if (!data.ok) throw new Error(data.error || '失败');
      try {
        const parsed = JSON.parse(data.content || '[]');
        setColors(parsed);
      } catch (parseError) {
        throw new Error('返回的数据格式错误，请重试');
      }
    } catch (e: any) { setError(e.message || '请求失败'); } finally { setLoading(false); }
  }

  // 导出为PNG
  const exportAsPNG = () => {
    if (!colors.length) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const itemWidth = 200;
    const itemHeight = 120;
    const cols = Math.min(3, colors.length);
    const rows = Math.ceil(colors.length / cols);
    
    canvas.width = cols * itemWidth;
    canvas.height = rows * itemHeight;
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    colors.forEach((color, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = col * itemWidth;
      const y = row * itemHeight;
      
      // 绘制颜色块
      ctx.fillStyle = color.hex;
      ctx.fillRect(x, y, itemWidth, itemHeight * 0.7);
      
      // 绘制文字
      ctx.fillStyle = '#000000';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(color.name || color.role || 'Color', x + itemWidth / 2, y + itemHeight * 0.8);
      ctx.fillText(color.hex, x + itemWidth / 2, y + itemHeight * 0.9);
    });
    
    // 下载
    const link = document.createElement('a');
    link.download = `palette-${theme}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  // 获取对比度徽章样式
  const getContrastBadge = (contrast: string) => {
    if (!contrast) return null;
    const isAAA = contrast.includes('AAA');
    const isAA = contrast.includes('AA');
    
    return (
      <span style={{
        fontSize: '10px',
        padding: '2px 6px',
        borderRadius: '4px',
        color: 'white',
        background: isAAA ? '#10b981' : isAA ? '#f59e0b' : '#ef4444',
        marginLeft: '8px'
      }}>
        {contrast}
      </span>
    );
  };

  return (
    <section className="stack prose">
      <h2>AI 颜色方案生成器</h2>
      <Usage
        title="如何使用"
        steps={[
          '输入主题词（如：夏天的芒果、Cyberpunk）',
          '可选：锁定一个你喜欢的颜色（如 #2563EB）',
          '点击"生成"，在下方预览与复制HEX'
        ]}
        tips={[ '点击色块复制HEX；可导出为JSON或PNG' ]}
      />
      <div className="stack">
        <div className="card stack">
          <input className="input lg" placeholder="主题" value={theme} onChange={(e) => setTheme(e.target.value)} />
          <input className="input lg" placeholder="可选：锁定颜色（如 #2563EB）" value={locked} onChange={(e) => setLocked(e.target.value)} />
          <button 
            className={`btn generate ${loading ? 'loading' : ''}`}
            onClick={onGenerate} 
            disabled={loading || (!theme && !locked)}
          >
            {loading ? '生成中…' : '🎨 生成配色'}
          </button>
        </div>
        <div className="card stack">
          {error && <p style={{ color: '#b91c1c' }}>{error}</p>}
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
            {colors.map((c) => (
              <div key={c.hex} className="card" style={{ padding: 0 }}>
                <div style={{ height: 100, background: c.hex, borderTopLeftRadius: 16, borderTopRightRadius: 16 }} />
                <div style={{ padding: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong>{c.name || c.role || 'Color'}</strong>
                    <button className="btn" onClick={() => navigator.clipboard.writeText(c.hex)}>复制HEX</button>
                  </div>
                  <div style={{ color: 'var(--muted)', fontSize: 12 }}>
                    {c.hex} {getContrastBadge(c.contrastOnWhite || '')}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {colors.length > 0 && (
            <div className="row" style={{ justifyContent: 'flex-end', gap: 8 }}>
              <button className="btn" onClick={exportAsPNG}>导出PNG</button>
              <CopyButton getText={() => JSON.stringify(colors, null, 2)} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}


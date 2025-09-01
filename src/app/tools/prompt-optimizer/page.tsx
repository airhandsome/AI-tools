'use client';
import { useState, useEffect } from 'react';
import { postJson, type ApiResult } from '@/lib/api';
import CopyButton from '@/app/_components/CopyButton';
import Usage from '@/app/_components/Usage';
import Examples from '@/app/_components/Examples';

type OptimizedPrompt = {
  midjourney: string;
  stableDiffusion: string;
  dalle: string;
  tips: string[];
  parameters: {
    style: string;
    quality: string;
    aspect: string;
    lighting: string;
  };
};

export default function PromptOptimizerPage() {
  const [idea, setIdea] = useState('');
  const [style, setStyle] = useState('realistic');
  const [mood, setMood] = useState('neutral');
  const [result, setResult] = useState<OptimizedPrompt | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 页面离开提醒
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (loading) {
        e.preventDefault();
        e.returnValue = '正在优化中，确定要离开吗？';
        return '正在优化中，确定要离开吗？';
      }
    };

    const handlePopState = (e: PopStateEvent) => {
      if (loading) {
        if (!confirm('正在优化中，确定要离开吗？')) {
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

  async function onOptimize() {
    if (!idea.trim()) return;
    
    setLoading(true); 
    setError(''); 
    setResult(null);
    
    try {
      const data = await postJson<ApiResult>('/api/tools/prompt-optimizer', { 
        idea: idea.trim(),
        style,
        mood
      });
      
      if (!data.ok) throw new Error(data.error || '优化失败');
      
      try {
        const parsed = JSON.parse(data.content || '{}');
        setResult(parsed);
      } catch (parseError) {
        throw new Error('返回的数据格式错误，请重试');
      }
    } catch (e: any) { 
      setError(e.message || '请求失败'); 
    } finally { 
      setLoading(false); 
    }
  }

  return (
    <section className="stack prose">
      <h2>"一句话画图"Prompt优化器</h2>
      <Examples
        items={[
          { title: '未来城市', text: '一个充满科技感的未来城市' },
          { title: '魔法森林', text: '神秘的魔法森林，有发光植物' },
          { title: '太空旅行', text: '在太空中旅行的场景' }
        ]}
        onUse={(t) => setIdea(t)}
      />
      <Usage
        title="如何使用"
        steps={[
          '用一句话描述你想要生成的图像',
          '选择风格和情绪偏好',
          '点击"优化"，获得专业的AI绘画提示词'
        ]}
        tips={['支持Midjourney、Stable Diffusion、DALL-E等多种AI绘画工具']}
      />
      
      <div className="stack">
        <div className="card stack">
          <textarea 
            className="lg" 
            rows={6}
            placeholder="描述你想要的图像（如：一只可爱的小猫在花园里玩耍）" 
            value={idea} 
            onChange={(e) => setIdea(e.target.value)}
          />
          
          <div className="row">
            <select className="lg" value={style} onChange={(e) => setStyle(e.target.value)}>
              <option value="realistic">写实风格</option>
              <option value="artistic">艺术风格</option>
              <option value="cartoon">卡通风格</option>
              <option value="anime">动漫风格</option>
              <option value="oil-painting">油画风格</option>
              <option value="watercolor">水彩风格</option>
            </select>
            
            <select className="lg" value={mood} onChange={(e) => setMood(e.target.value)}>
              <option value="neutral">中性</option>
              <option value="bright">明亮</option>
              <option value="dark">暗黑</option>
              <option value="warm">温暖</option>
              <option value="cool">冷色调</option>
              <option value="mysterious">神秘</option>
            </select>
            
            <button 
              className={`btn generate ${loading ? 'loading' : ''}`}
              onClick={onOptimize} 
              disabled={!idea.trim() || loading}
            >
              {loading ? '优化中…' : '🎨 优化提示词'}
            </button>
          </div>
        </div>

        {error && (
          <div className="card" style={{ borderColor: '#ef4444', background: '#fef2f2' }}>
            <p style={{ color: '#dc2626', margin: 0 }}>❌ {error}</p>
          </div>
        )}

        {result && (
          <div className="card stack">
            <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>优化后的提示词</h3>
              <CopyButton getText={() => JSON.stringify(result, null, 2)} />
            </div>

            {/* 参数配置 */}
            <div className="card" style={{ background: '#f8fafc' }}>
              <h4 style={{ marginTop: 0, color: '#475569' }}>⚙️ 推荐参数</h4>
              <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                <div>
                  <strong>风格：</strong>{result.parameters.style}
                </div>
                <div>
                  <strong>质量：</strong>{result.parameters.quality}
                </div>
                <div>
                  <strong>比例：</strong>{result.parameters.aspect}
                </div>
                <div>
                  <strong>光照：</strong>{result.parameters.lighting}
                </div>
              </div>
            </div>

            {/* 各平台提示词 */}
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
              <div className="card" style={{ background: '#f0f9ff', borderColor: '#0ea5e9' }}>
                <h4 style={{ color: '#0c4a6e', marginTop: 0 }}>🎭 Midjourney</h4>
                <textarea 
                  className="lg" 
                  rows={8} 
                  value={result.midjourney} 
                  readOnly
                  style={{ background: 'white', fontFamily: 'monospace' }}
                />
                <CopyButton getText={() => result.midjourney} />
              </div>
              
              <div className="card" style={{ background: '#f0fdf4', borderColor: '#10b981' }}>
                <h4 style={{ color: '#14532d', marginTop: 0 }}>🤖 Stable Diffusion</h4>
                <textarea 
                  className="lg" 
                  rows={8} 
                  value={result.stableDiffusion} 
                  readOnly
                  style={{ background: 'white', fontFamily: 'monospace' }}
                />
                <CopyButton getText={() => result.stableDiffusion} />
              </div>
              
              <div className="card" style={{ background: '#fef3c7', borderColor: '#f59e0b' }}>
                <h4 style={{ color: '#92400e', marginTop: 0 }}>🌟 DALL-E</h4>
                <textarea 
                  className="lg" 
                  rows={8} 
                  value={result.dalle} 
                  readOnly
                  style={{ background: 'white', fontFamily: 'monospace' }}
                />
                <CopyButton getText={() => result.dalle} />
              </div>
            </div>

            {/* 使用技巧 */}
            <div className="card" style={{ background: '#fef2f2', borderColor: '#ef4444' }}>
              <h4 style={{ color: '#991b1b', marginTop: 0 }}>💡 使用技巧</h4>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {result.tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
} 
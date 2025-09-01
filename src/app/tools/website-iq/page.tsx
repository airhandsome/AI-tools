'use client';
import { useState, useEffect } from 'react';
import { postJson, type ApiResult } from '@/lib/api';
import CopyButton from '@/app/_components/CopyButton';
import Usage from '@/app/_components/Usage';
import Examples from '@/app/_components/Examples';

type WebsiteAnalysis = {
  business: string;
  target: string;
  value: string;
  issues: string[];
  suggestions: string[];
  score: number;
};

export default function WebsiteIqPage() {
  const [url, setUrl] = useState('');
  const [analysis, setAnalysis] = useState<WebsiteAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 页面离开提醒
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (loading) {
        e.preventDefault();
        e.returnValue = '正在分析中，确定要离开吗？';
        return '正在分析中，确定要离开吗？';
      }
    };

    const handlePopState = (e: PopStateEvent) => {
      if (loading) {
        if (!confirm('正在分析中，确定要离开吗？')) {
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

  async function onAnalyze() {
    if (!url.trim()) return;
    
    setLoading(true); 
    setError(''); 
    setAnalysis(null);
    
    try {
      const data = await postJson<ApiResult>('/api/tools/website-iq', { url: url.trim() });
      if (!data.ok) throw new Error(data.error || '分析失败');
      
      try {
        const parsed = JSON.parse(data.content || '{}');
        
        // 验证返回的数据结构
        if (!parsed.business || !parsed.target || !parsed.value || !parsed.issues || !parsed.suggestions || typeof parsed.score !== 'number') {
          throw new Error('返回的数据结构不完整');
        }
        
        setAnalysis(parsed);
      } catch (parseError) {
        console.error('JSON解析错误:', parseError);
        console.error('原始数据:', data.content);
        throw new Error('返回的数据格式错误，请重试');
      }
    } catch (e: any) { 
      setError(e.message || '请求失败'); 
    } finally { 
      setLoading(false); 
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981'; // 绿色
    if (score >= 60) return '#f59e0b'; // 黄色
    return '#ef4444'; // 红色
  };

  const getScoreText = (score: number) => {
    if (score >= 80) return '优秀';
    if (score >= 60) return '良好';
    if (score >= 40) return '一般';
    return '需要改进';
  };

  return (
    <section className="stack prose">
      <h2>网站"智商检测器"</h2>
      <Examples
        items={[
          { title: '电商网站', text: 'https://www.amazon.com' },
          { title: 'SaaS产品', text: 'https://www.notion.so' },
          { title: '个人博客', text: 'https://example.com' }
        ]}
        onUse={(t) => setUrl(t)}
      />
      <Usage
        title="如何使用"
        steps={[
          '输入要分析的网站URL',
          '点击"检测"，AI将分析网站的业务价值',
          '查看分析报告，了解改进建议'
        ]}
        tips={['支持大多数公开网站，分析包括业务定位、目标用户、价值主张等']}
      />
      
      <div className="stack">
        <div className="card stack">
          <input 
            className="input lg" 
            placeholder="输入网站URL（如：https://example.com）" 
            value={url} 
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onAnalyze()}
          />
          <button 
            className={`btn generate ${loading ? 'loading' : ''}`}
            onClick={onAnalyze} 
            disabled={!url.trim() || loading}
          >
            {loading ? '分析中…' : '🧠 检测智商'}
          </button>
        </div>

        {error && (
          <div className="card" style={{ borderColor: '#ef4444', background: '#fef2f2' }}>
            <p style={{ color: '#dc2626', margin: 0 }}>❌ {error}</p>
          </div>
        )}

        {analysis && (
          <div className="card stack">
            <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>分析报告</h3>
              <CopyButton getText={() => JSON.stringify(analysis, null, 2)} />
            </div>

            {/* 智商评分 */}
            <div style={{ 
              textAlign: 'center', 
              padding: '24px', 
              background: '#f8fafc', 
              borderRadius: '16px',
              border: `3px solid ${getScoreColor(analysis.score)}`
            }}>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: getScoreColor(analysis.score) }}>
                {analysis.score}
              </div>
              <div style={{ fontSize: '18px', color: '#64748b', marginTop: '8px' }}>
                智商评分：{getScoreText(analysis.score)}
              </div>
            </div>

            {/* 业务分析 */}
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
              <div className="card" style={{ background: '#f0f9ff', borderColor: '#0ea5e9' }}>
                <h4 style={{ color: '#0c4a6e', marginTop: 0 }}>🎯 业务定位</h4>
                <p style={{ margin: 0 }}>{analysis.business}</p>
              </div>
              
              <div className="card" style={{ background: '#f0fdf4', borderColor: '#10b981' }}>
                <h4 style={{ color: '#14532d', marginTop: 0 }}>👥 目标用户</h4>
                <p style={{ margin: 0 }}>{analysis.target}</p>
              </div>
              
              <div className="card" style={{ background: '#fef3c7', borderColor: '#f59e0b' }}>
                <h4 style={{ color: '#92400e', marginTop: 0 }}>💎 价值主张</h4>
                <p style={{ margin: 0 }}>{analysis.value}</p>
              </div>
            </div>

            {/* 问题与建议 */}
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
              <div className="card" style={{ background: '#fef2f2', borderColor: '#ef4444' }}>
                <h4 style={{ color: '#991b1b', marginTop: 0 }}>⚠️ 发现的问题</h4>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {analysis.issues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </div>
              
              <div className="card" style={{ background: '#f0fdf4', borderColor: '#10b981' }}>
                <h4 style={{ color: '#14532d', marginTop: 0 }}>💡 改进建议</h4>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {analysis.suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
} 
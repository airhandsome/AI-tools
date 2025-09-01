'use client';
import { useState, useEffect } from 'react';
import { postJson, type ApiResult } from '@/lib/api';
import CopyButton from '@/app/_components/CopyButton';
import Usage from '@/app/_components/Usage';
import Examples from '@/app/_components/Examples';

type OptimizedListing = {
  title: string;
  bulletPoints: string[];
  description: string;
  keywords: string[];
  seoTitle: string;
  metaDescription: string;
  suggestions: string[];
};

export default function ListingOptimizerPage() {
  const [url, setUrl] = useState('');
  const [platform, setPlatform] = useState('amazon');
  const [category, setCategory] = useState('electronics');
  const [result, setResult] = useState<OptimizedListing | null>(null);
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
    if (!url.trim()) return;
    
    setLoading(true); 
    setError(''); 
    setResult(null);
    
    try {
      const data = await postJson<ApiResult>('/api/tools/listing-optimizer', { 
        url: url.trim(),
        platform,
        category
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
      <h2>电商Listing优化器</h2>
      <Examples
        items={[
          { title: 'Amazon产品', text: 'https://www.amazon.com/dp/B08N5WRWNW' },
          { title: '淘宝商品', text: 'https://item.taobao.com/item.htm?id=123456789' },
          { title: '京东商品', text: 'https://item.jd.com/1234567890.html' },
          { title: '拼多多商品', text: 'https://mobile.yangkeduo.com/goods.html?goods_id=123456789' }
        ]}
        onUse={(t) => setUrl(t)}
      />
      <Usage
        title="如何使用"
        steps={[
          '输入商品页面URL或粘贴商品信息',
          '选择电商平台和商品类别',
          '点击"优化"，获得专业的Listing优化建议'
        ]}
        tips={[
          '支持Amazon、速卖通、eBay等国际平台',
          '支持淘宝、天猫、京东、拼多多等中国平台',
          '中国平台自动生成中文内容，国际平台生成英文内容'
        ]}
      />
      
      <div className="stack">
        <div className="card stack">
          <textarea 
            className="lg" 
            rows={8}
            placeholder="输入商品页面URL或粘贴商品标题、描述等信息" 
            value={url} 
            onChange={(e) => setUrl(e.target.value)}
          />
          
          <div className="row">
            <select className="lg" value={platform} onChange={(e) => setPlatform(e.target.value)}>
              <option value="amazon">Amazon</option>
              <option value="aliexpress">速卖通</option>
              <option value="ebay">eBay</option>
              <option value="shopify">Shopify独立站</option>
              <option value="walmart">Walmart</option>
              <option value="taobao">淘宝</option>
              <option value="tmall">天猫</option>
              <option value="jd">京东</option>
              <option value="pinduoduo">拼多多</option>
              <option value="xiaohongshu">小红书</option>
              <option value="douyin">抖音电商</option>
              <option value="kuaishou">快手小店</option>
            </select>
            
            <select className="lg" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="electronics">电子产品</option>
              <option value="clothing">服装鞋帽</option>
              <option value="home">家居用品</option>
              <option value="beauty">美妆个护</option>
              <option value="sports">运动户外</option>
              <option value="books">图书音像</option>
              <option value="automotive">汽车用品</option>
              <option value="toys">玩具游戏</option>
              <option value="food">食品饮料</option>
              <option value="health">保健品</option>
              <option value="digital">数码配件</option>
              <option value="other">其他</option>
            </select>
            
            <button 
              className={`btn generate ${loading ? 'loading' : ''}`}
              onClick={onOptimize} 
              disabled={!url.trim() || loading}
            >
              {loading ? '优化中…' : '🛒 优化Listing'}
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
              <h3>优化后的Listing</h3>
              <CopyButton getText={() => JSON.stringify(result, null, 2)} />
            </div>

            {/* 标题优化 */}
            <div className="card" style={{ background: '#f0f9ff', borderColor: '#0ea5e9' }}>
              <h4 style={{ color: '#0c4a6e', marginTop: 0 }}>📝 优化后的标题</h4>
              <div style={{ 
                background: 'white', 
                padding: '16px', 
                borderRadius: '8px', 
                border: '1px solid #e2e8f0',
                fontFamily: 'monospace',
                fontSize: '14px'
              }}>
                {result.title}
              </div>
              <CopyButton getText={() => result.title} />
            </div>

            {/* 五点描述 */}
            <div className="card" style={{ background: '#f0fdf4', borderColor: '#10b981' }}>
              <h4 style={{ color: '#14532d', marginTop: 0 }}>✨ 五点描述</h4>
              <div className="stack" style={{ gap: '12px' }}>
                {result.bulletPoints.map((point, index) => (
                  <div key={index} style={{ 
                    background: 'white', 
                    padding: '12px', 
                    borderRadius: '8px', 
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px'
                  }}>
                    <span style={{ 
                      background: '#10b981', 
                      color: 'white', 
                      borderRadius: '50%', 
                      width: '20px', 
                      height: '20px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontSize: '12px',
                      flexShrink: 0
                    }}>
                      {index + 1}
                    </span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
              <CopyButton getText={() => result.bulletPoints.join('\n')} />
            </div>

            {/* 详细描述 */}
            <div className="card" style={{ background: '#fef3c7', borderColor: '#f59e0b' }}>
              <h4 style={{ color: '#92400e', marginTop: 0 }}>📖 详细描述</h4>
              <textarea 
                className="lg" 
                rows={8} 
                value={result.description} 
                readOnly
                style={{ background: 'white', fontFamily: 'monospace' }}
              />
              <CopyButton getText={() => result.description} />
            </div>

            {/* 关键词 */}
            <div className="card" style={{ background: '#f8fafc', borderColor: '#64748b' }}>
              <h4 style={{ color: '#475569', marginTop: 0 }}>🔍 关键词建议</h4>
              <div style={{ 
                background: 'white', 
                padding: '16px', 
                borderRadius: '8px', 
                border: '1px solid #e2e8f0'
              }}>
                {result.keywords.map((keyword, index) => (
                  <span key={index} style={{
                    display: 'inline-block',
                    background: '#e2e8f0',
                    color: '#475569',
                    padding: '4px 8px',
                    borderRadius: '16px',
                    fontSize: '12px',
                    margin: '4px',
                    fontFamily: 'monospace'
                  }}>
                    {keyword}
                  </span>
                ))}
              </div>
              <CopyButton getText={() => result.keywords.join(', ')} />
            </div>

            {/* SEO优化 */}
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
              <div className="card" style={{ background: '#fef2f2', borderColor: '#ef4444' }}>
                <h4 style={{ color: '#991b1b', marginTop: 0 }}>📱 SEO标题</h4>
                <textarea 
                  className="lg" 
                  rows={3} 
                  value={result.seoTitle} 
                  readOnly
                  style={{ background: 'white', fontFamily: 'monospace' }}
                />
                <CopyButton getText={() => result.seoTitle} />
              </div>
              
              <div className="card" style={{ background: '#fef2f2', borderColor: '#ef4444' }}>
                <h4 style={{ color: '#991b1b', marginTop: 0 }}>🔗 Meta描述</h4>
                <textarea 
                  className="lg" 
                  rows={3} 
                  value={result.metaDescription} 
                  readOnly
                  style={{ background: 'white', fontFamily: 'monospace' }}
                />
                <CopyButton getText={() => result.metaDescription} />
              </div>
            </div>

            {/* 改进建议 */}
            <div className="card" style={{ background: '#f0fdf4', borderColor: '#10b981' }}>
              <h4 style={{ color: '#14532d', marginTop: 0 }}>💡 改进建议</h4>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {result.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
} 
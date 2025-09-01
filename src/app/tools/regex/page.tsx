'use client';
import { useState, useEffect } from 'react';
import { postJson, type ApiResult } from '@/lib/api';
import CopyButton from '@/app/_components/CopyButton';
import Usage from '@/app/_components/Usage';
import Examples from '@/app/_components/Examples';

export default function RegexPage() {
  const [intent, setIntent] = useState('');
  const [dialect, setDialect] = useState('javascript');
  const [sample, setSample] = useState('');
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
      const data = await postJson<ApiResult>('/api/tools/regex', { intent, dialect, sample });
      if (!data.ok) throw new Error(data.error || '生成失败');
      setResult(data.content || '');
    } catch (e: any) { setError(e.message || '请求失败'); } finally { setLoading(false); }
  }

  return (
    <section className="stack prose">
      <h2>正则生成与解释</h2>
      <Examples
        items={[
          { title: '国内手机号', text: '匹配以1开头的11位中国大陆手机号' },
          { title: '电子邮箱', text: '匹配常见电子邮箱地址' },
          { title: 'IPv4 地址', text: '匹配合法 IPv4 地址' }
        ]}
        onUse={(t) => setIntent(t)}
      />
      <Usage
        title="如何使用"
        steps={[
          '用自然语言描述匹配需求（如"匹配国内手机号"）',
          '选择正则方言（JS/PCRE等），点击生成',
          '在下方查看正则、解释与示例，复制使用'
        ]}
        tips={['可粘贴示例文本帮助生成更准确的匹配']}
      />
      <div className="stack">
        <div className="card stack" style={{ width: '100%' }}>
          <textarea className="lg" rows={8} placeholder="用自然语言描述你的匹配需求" value={intent} onChange={(e) => setIntent(e.target.value)} />
          <div className="row">
            <select className="lg" value={dialect} onChange={(e) => setDialect(e.target.value)}>
              <option value="javascript">JavaScript</option>
              <option value="pcre">PCRE</option>
              <option value="python">Python</option>
              <option value="golang">Go</option>
            </select>
            <button 
              className={`btn generate ${loading ? 'loading' : ''}`}
              onClick={onGenerate} 
              disabled={!intent || loading}
            >
              {loading ? '生成中…' : '🔍 生成正则'}
            </button>
          </div>
          <textarea className="lg" rows={6} placeholder="可选：提供示例文本以便测试" value={sample} onChange={(e) => setSample(e.target.value)} />
        </div>
        <div className="card stack" style={{ width: '100%' }}>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <h3>输出</h3>
            <CopyButton getText={() => result} />
          </div>
          {error && <p style={{ color: '#b91c1c' }}>{error}</p>}
          <pre><code>{result}</code></pre>
        </div>
      </div>
    </section>
  );
}


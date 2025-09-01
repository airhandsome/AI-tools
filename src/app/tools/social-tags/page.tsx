'use client';
import { useState } from 'react';
import { postJson, type ApiResult } from '@/lib/api';
import CopyButton from '@/app/_components/CopyButton';
import Usage from '@/app/_components/Usage';
import Examples from '@/app/_components/Examples';

export default function SocialTagsPage() {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('xiaohongshu');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function onGenerate() {
    setLoading(true); setError(''); setResult('');
    try {
      const data = await postJson<ApiResult>('/api/tools/social-tags', { topic, platform });
      if (!data.ok) throw new Error(data.error || '失败');
      setResult(data.content || '');
    } catch (e: any) { setError(e.message || '请求失败'); } finally { setLoading(false); }
  }

  return (
    <section className="stack prose">
      <h2>社媒标签与 Emoji 推荐</h2>
      <Examples
        items={[
          { title: '新品上架', text: '手冲咖啡器具新品，主打极简设计与稳定萃取' },
          { title: '节日活动', text: '双十一店铺满减促销，限时优惠' },
          { title: '生活方式', text: '晨间跑步与健康饮食分享' }
        ]}
        onUse={(t) => setTopic(t)}
      />
      <Usage
        title="如何使用"
        steps={[
          '输入主题词/产品/活动信息',
          '选择平台（小红书/抖音/微博等）',
          '点击“生成”，复制标签和示例文案使用'
        ]}
      />
      <div className="stack">
        <div className="card stack" style={{ width: '100%' }}>
          <textarea className="lg" rows={7} placeholder="输入主题" value={topic} onChange={(e) => setTopic(e.target.value)} />
          <div className="row">
            <select className="lg" value={platform} onChange={(e) => setPlatform(e.target.value)}>
              <option value="xiaohongshu">小红书</option>
              <option value="douyin">抖音</option>
              <option value="weibo">微博</option>
              <option value="twitter">Twitter/X</option>
              <option value="instagram">Instagram</option>
            </select>
            <button className="btn primary" disabled={!topic || loading} onClick={onGenerate}>{loading ? '生成中…' : '生成'}</button>
          </div>
        </div>
        <div className="card stack" style={{ width: '100%' }}>
          {error && <p style={{ color: '#b91c1c' }}>{error}</p>}
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <h3>输出</h3>
            <CopyButton getText={() => result} />
          </div>
          <pre><code>{result}</code></pre>
        </div>
      </div>
    </section>
  );
}


'use client';
import { useState } from 'react';
import { postJson, type ApiResult } from '@/lib/api';
import CopyButton from '@/app/_components/CopyButton';
import Usage from '@/app/_components/Usage';
import Examples from '@/app/_components/Examples';

export default function SqlPage() {
  const [nl, setNl] = useState('');
  const [sql, setSql] = useState('');
  const [dialect, setDialect] = useState('postgres');
  const [schema, setSchema] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const examples = [
    { title: 'Top10 销售额', text: '从 orders 表查询近30天按销售额排名前10的商品及总额' },
    { title: '日活统计', text: '统计 users 表中每日登录用户数，返回最近14天的日期和DAU' }
  ];

  async function run(body: any) {
    setLoading(true); setError(''); setResult('');
    try {
      const data = await postJson<ApiResult>('/api/tools/sql', body);
      if (!data.ok) throw new Error(data.error || '失败');
      setResult(data.content || '');
    } catch (e: any) { setError(e.message || '请求失败'); } finally { setLoading(false); }
  }

  return (
    <section className="stack prose">
      <h2>SQL 生成与解释</h2>
      <Examples
        items={[
          { title: 'Top10 销售额', text: '从 orders 表查询近30天按销售额排名前10的商品及总额' },
          { title: '日活统计', text: '统计 users 表中每日登录用户数，返回最近14天的日期和DAU' },
          { title: '订单转化率', text: '计算访问、下单、支付的转化率漏斗' }
        ]}
        onUse={(t) => setNl(t)}
      />
      <Usage
        title="如何使用"
        steps={[
          '选择数据库方言（Postgres/MySQL/SQLite等）',
          '二选一：输入自然语言需求 或 粘贴 SQL',
          '可选：提供表结构/示例，有助于更准确生成',
          '点击“生成/解释”，在下方复制结果'
        ]}
        tips={['敏感数据请脱敏，避免上传真实隐私信息']}
      />
      <div className="card" style={{ width: '100%' }}>
        <div className="row" style={{ flexWrap: 'wrap', gap: 8 }}>
          {examples.map(e => (
            <button key={e.title} className="btn" onClick={() => setNl(e.text)}>{e.title}</button>
          ))}
        </div>
      </div>
      <div className="stack">
        <div className="card stack" style={{ width: '100%' }}>
          <div className="row">
            <select className="lg" value={dialect} onChange={(e) => setDialect(e.target.value)}>
              <option value="postgres">PostgreSQL</option>
              <option value="mysql">MySQL</option>
              <option value="sqlite">SQLite</option>
              <option value="mssql">SQL Server</option>
            </select>
          </div>
          <textarea className="lg" rows={7} placeholder="自然语言需求（与SQL二选一）" value={nl} onChange={(e) => setNl(e.target.value)} />
          <textarea className="lg" rows={7} placeholder="SQL（与自然语言二选一）" value={sql} onChange={(e) => setSql(e.target.value)} />
          <textarea className="lg" rows={6} placeholder="可选：表结构/示例" value={schema} onChange={(e) => setSchema(e.target.value)} />
          <div className="row">
            <button className="btn primary" disabled={loading || (!nl && !sql)} onClick={() => run({ nl, dialect, schema })}>生成/解释</button>
          </div>
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


'use client';
import { useState } from 'react';
import { postJson, type ApiResult } from '@/lib/api';
import CopyButton from '@/app/_components/CopyButton';
import Usage from '@/app/_components/Usage';
import Examples from '@/app/_components/Examples';

export default function ExcelPage() {
  const [intent, setIntent] = useState('');
  const [platform, setPlatform] = useState('excel');
  const [formula, setFormula] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function run(body: any) {
    setLoading(true); setError(''); setResult('');
    try {
      const data = await postJson<ApiResult>('/api/tools/excel', body);
      if (!data.ok) throw new Error(data.error || '失败');
      setResult(data.content || '');
    } catch (e: any) { setError(e.message || '请求失败'); } finally { setLoading(false); }
  }

  return (
    <section className="stack prose">
      <h2>Excel/Sheets 公式助手</h2>
      <Examples
        items={[
          { title: '去重计数', text: '统计A列中不重复的值数量' },
          { title: '条件求和', text: '对B列在A列等于"北京"的行进行求和' },
          { title: '日期提取', text: '从C列日期中提取月份并统计每月数量' }
        ]}
        onUse={(t) => setIntent(t)}
      />
      <Usage
        title="如何使用"
        steps={[
          '选择平台（Excel/Sheets）',
          '二选一：输入需求描述 或 粘贴已有公式',
          '点击“生成/解释”，复制结果用于你的表格'
        ]}
        tips={['可说明示例数据与期望输出，有助更准确']}
      />
      <div className="stack">
        <div className="card stack" style={{ width: '100%' }}>
          <div className="row">
            <select className="lg" value={platform} onChange={(e) => setPlatform(e.target.value)}>
              <option value="excel">Excel</option>
              <option value="sheets">Google Sheets</option>
            </select>
          </div>
          <textarea className="lg" rows={7} placeholder="需求描述（与公式二选一）" value={intent} onChange={(e) => setIntent(e.target.value)} />
          <textarea className="lg" rows={7} placeholder="已有公式（与描述二选一）" value={formula} onChange={(e) => setFormula(e.target.value)} />
          <button className="btn primary" disabled={loading || (!intent && !formula)} onClick={() => run({ intent, platform, formula })}>生成/解释</button>
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


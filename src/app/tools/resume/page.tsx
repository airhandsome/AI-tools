'use client';
import { useState } from 'react';
import { postJson, type ApiResult } from '@/lib/api';
import CopyButton from '@/app/_components/CopyButton';
import Usage from '@/app/_components/Usage';
import Examples from '@/app/_components/Examples';

export default function ResumePage() {
  const [resume, setResume] = useState('');
  const [jd, setJd] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function onAnalyze() {
    setLoading(true); setError(''); setResult('');
    try {
      const data = await postJson<ApiResult>('/api/tools/resume', { resume, jd });
      if (!data.ok) throw new Error(data.error || '失败');
      setResult(data.content || '');
    } catch (e: any) { setError(e.message || '请求失败'); } finally { setLoading(false); }
  }

  return (
    <section className="stack prose">
      <h2>简历优化与 JD 匹配</h2>
      <Examples
        items={[
          { title: '简历示例：前端', text: '三年 Web 前端，负责电商活动页，核心指标转化率+18%' },
          { title: '简历示例：数据分析', text: '两年数据分析，搭建BI报表，月活留存率+12%' },
          { title: '简历示例：后端', text: '四年后端，微服务与消息队列落地，接口99.95%可用' },
          { title: '简历示例：产品', text: '三年产品，负责ToB权限系统，需求落地率95%' },
          { title: '简历示例：运营', text: '两年新媒体运营，粉丝增长12万，转化率+20%' }
        ]}
        onUse={(t) => setResume(t)}
      />
      <Examples
        items={[
          { title: 'JD 示例：前端工程师', text: '负责中大型前端项目的架构设计与性能优化，熟悉React' },
          { title: 'JD 示例：数据分析师', text: '负责数据清洗与指标体系建设，熟练SQL与可视化' },
          { title: 'JD 示例：后端工程师', text: '负责服务端接口设计与稳定性建设，熟悉微服务与Kafka' },
          { title: 'JD 示例：产品经理', text: '负责需求分析与原型设计，推进跨部门协作与项目落地' },
          { title: 'JD 示例：运营', text: '负责内容策划与活动运营，对用户增长与转化负责' }
        ]}
        onUse={(t) => setJd(t)}
      />
      <Usage
        title="如何使用"
        steps={[
          '粘贴你的简历要点/经历/项目/技能',
          '粘贴目标岗位 JD（职责与要求）',
          '点击“生成报告”，查看匹配度与优化建议'
        ]}
        tips={['尽量量化成果（如提升XX%，减少YY小时）效果更佳']}
      />
      <div className="stack">
        <div className="card stack" style={{ width: '100%' }}>
          <textarea className="lg" rows={12} placeholder="粘贴简历（要点/经历/项目/技能）" value={resume} onChange={(e) => setResume(e.target.value)} />
          <textarea className="lg" rows={10} placeholder="粘贴 JD（岗位职责/任职要求）" value={jd} onChange={(e) => setJd(e.target.value)} />
          <button className="btn primary" disabled={!resume || !jd || loading} onClick={onAnalyze}>{loading ? '分析中…' : '生成报告'}</button>
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


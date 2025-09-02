'use client';
import { useState, useEffect } from 'react';
import CopyButton from '@/app/_components/CopyButton';
import Usage from '@/app/_components/Usage';
import Examples from '@/app/_components/Examples';
import { ToolDonation } from '@/app/_components/Monetize';

export default function TimestampPage() {
  const [timestamp, setTimestamp] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [mode, setMode] = useState<'timestamp' | 'datetime'>('timestamp');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [error, setError] = useState('');

  // 更新当前时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const convertTimestampToDateTime = () => {
    try {
      setError('');
      const ts = parseInt(timestamp);
      if (isNaN(ts)) {
        setError('请输入有效的时间戳');
        return;
      }
      
      // 判断是秒还是毫秒
      const date = ts > 9999999999 ? new Date(ts) : new Date(ts * 1000);
      setDateTime(date.toISOString().replace('T', ' ').replace('Z', ''));
    } catch (e) {
      setError('转换失败，请检查时间戳格式');
    }
  };

  const convertDateTimeToTimestamp = () => {
    try {
      setError('');
      const date = new Date(dateTime);
      if (isNaN(date.getTime())) {
        setError('请输入有效的日期时间');
        return;
      }
      
      setTimestamp(date.getTime().toString());
    } catch (e) {
      setError('转换失败，请检查日期时间格式');
    }
  };

  const handleConvert = () => {
    if (mode === 'timestamp') {
      convertTimestampToDateTime();
    } else {
      convertDateTimeToTimestamp();
    }
  };

  const handleClear = () => {
    setTimestamp('');
    setDateTime('');
    setError('');
  };

  const useCurrentTime = () => {
    const now = new Date();
    setTimestamp(now.getTime().toString());
    setDateTime(now.toISOString().replace('T', ' ').replace('Z', ''));
  };

  return (
    <section className="stack prose">
      <h2>时间戳转换工具</h2>
      
      <Usage
        title="如何使用"
        steps={[
          '选择转换模式（时间戳转日期 或 日期转时间戳）',
          '输入要转换的时间戳或日期时间',
          '点击"转换"按钮获得结果',
          '使用"复制"按钮复制结果'
        ]}
        tips={[
          '时间戳可以是秒（10位）或毫秒（13位）',
          '日期时间格式：YYYY-MM-DD HH:mm:ss',
          '支持自动识别时间戳格式'
        ]}
      />

      <Examples
        items={[
          { title: '当前时间戳', text: Date.now().toString() },
          { title: '2024年1月1日', text: '1704067200000' },
          { title: '日期时间', text: '2024-01-01 12:00:00' }
        ]}
        onUse={(t) => {
          if (t.includes('-') || t.includes(':')) {
            setMode('datetime');
            setDateTime(t);
          } else {
            setMode('timestamp');
            setTimestamp(t);
          }
        }}
      />

      <div className="card" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
        <h3 style={{ margin: '0 0 12px 0', color: '#475569' }}>🕐 当前时间</h3>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <strong>时间戳（毫秒）:</strong> {currentTime.getTime()}
          </div>
          <div>
            <strong>时间戳（秒）:</strong> {Math.floor(currentTime.getTime() / 1000)}
          </div>
          <div>
            <strong>日期时间:</strong> {currentTime.toISOString().replace('T', ' ').replace('Z', '')}
          </div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <div className="card">
          <div className="stack">
            <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>输入</h3>
              <div className="row" style={{ gap: '8px' }}>
                <button
                  className={`btn ${mode === 'timestamp' ? 'primary' : ''}`}
                  onClick={() => setMode('timestamp')}
                  style={{ fontSize: '12px', padding: '6px 12px' }}
                >
                  时间戳转日期
                </button>
                <button
                  className={`btn ${mode === 'datetime' ? 'primary' : ''}`}
                  onClick={() => setMode('datetime')}
                  style={{ fontSize: '12px', padding: '6px 12px' }}
                >
                  日期转时间戳
                </button>
              </div>
            </div>
            
            {mode === 'timestamp' ? (
              <input
                className="input lg"
                placeholder="输入时间戳（秒或毫秒）..."
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
              />
            ) : (
              <input
                className="input lg"
                placeholder="输入日期时间（YYYY-MM-DD HH:mm:ss）..."
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
              />
            )}
            
            <div className="row" style={{ gap: '8px' }}>
              <button className="btn generate" onClick={handleConvert}>
                {mode === 'timestamp' ? '📅 转换为日期' : '⏰ 转换为时间戳'}
              </button>
              <button className="btn" onClick={useCurrentTime}>
                使用当前时间
              </button>
              <button className="btn" onClick={handleClear}>
                清空
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="stack">
            <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>输出</h3>
              <CopyButton getText={() => mode === 'timestamp' ? dateTime : timestamp} />
            </div>
            
            {error && (
              <div style={{ color: '#b91c1c', padding: '8px', background: '#fef2f2', borderRadius: '8px' }}>
                {error}
              </div>
            )}
            
            <textarea
              className="lg"
              rows={4}
              placeholder="转换结果将显示在这里..."
              value={mode === 'timestamp' ? dateTime : timestamp}
              readOnly
            />
            
            {mode === 'timestamp' && dateTime && (
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                本地时间: {new Date(dateTime).toLocaleString('zh-CN')}
              </div>
            )}
            
            {mode === 'datetime' && timestamp && (
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                秒: {Math.floor(parseInt(timestamp) / 1000)} | 
                毫秒: {timestamp}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <h3>关于时间戳</h3>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>Unix 时间戳</h4>
            <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
              从1970年1月1日00:00:00 UTC开始计算的秒数
            </p>
          </div>
          <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>JavaScript 时间戳</h4>
            <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
              从1970年1月1日00:00:00 UTC开始计算的毫秒数
            </p>
          </div>
          <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>ISO 8601</h4>
            <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
              国际标准日期时间格式：YYYY-MM-DDTHH:mm:ss.sssZ
            </p>
          </div>
        </div>
        <p style={{ marginTop: '16px', fontSize: '14px' }}>
          时间戳常用于：API接口、数据库存储、日志记录、缓存过期时间等场景。
          本工具支持自动识别秒级和毫秒级时间戳。
        </p>
      </div>

      <ToolDonation />
    </section>
  );
} 
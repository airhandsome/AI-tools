'use client';
import { useState, useEffect } from 'react';
import CopyButton from '@/app/_components/CopyButton';
import Usage from '@/app/_components/Usage';
import Examples from '@/app/_components/Examples';
import { ToolDonation } from '@/app/_components/Monetize';

const timezones = [
  { name: 'UTC', offset: 0, label: 'UTC (协调世界时)' },
  { name: 'Asia/Shanghai', offset: 8, label: '中国标准时间 (CST)' },
  { name: 'Asia/Tokyo', offset: 9, label: '日本标准时间 (JST)' },
  { name: 'Asia/Seoul', offset: 9, label: '韩国标准时间 (KST)' },
  { name: 'America/New_York', offset: -5, label: '美国东部时间 (EST)' },
  { name: 'America/Chicago', offset: -6, label: '美国中部时间 (CST)' },
  { name: 'America/Denver', offset: -7, label: '美国山地时间 (MST)' },
  { name: 'America/Los_Angeles', offset: -8, label: '美国太平洋时间 (PST)' },
  { name: 'Europe/London', offset: 0, label: '英国时间 (GMT/BST)' },
  { name: 'Europe/Paris', offset: 1, label: '欧洲中部时间 (CET)' },
  { name: 'Europe/Berlin', offset: 1, label: '德国时间 (CET)' },
  { name: 'Australia/Sydney', offset: 10, label: '澳大利亚东部时间 (AEST)' },
  { name: 'Australia/Perth', offset: 8, label: '澳大利亚西部时间 (AWST)' },
  { name: 'Pacific/Auckland', offset: 12, label: '新西兰时间 (NZST)' },
  { name: 'Asia/Dubai', offset: 4, label: '阿联酋时间 (GST)' },
  { name: 'Asia/Singapore', offset: 8, label: '新加坡时间 (SGT)' },
  { name: 'Asia/Bangkok', offset: 7, label: '泰国时间 (ICT)' },
  { name: 'Asia/Kolkata', offset: 5.5, label: '印度标准时间 (IST)' },
  { name: 'Asia/Karachi', offset: 5, label: '巴基斯坦时间 (PKT)' },
  { name: 'Asia/Tehran', offset: 3.5, label: '伊朗标准时间 (IRST)' },
  { name: 'Asia/Jerusalem', offset: 2, label: '以色列时间 (IST)' },
  { name: 'Africa/Cairo', offset: 2, label: '埃及时间 (EET)' },
  { name: 'Africa/Lagos', offset: 1, label: '西非时间 (WAT)' },
  { name: 'Africa/Johannesburg', offset: 2, label: '南非标准时间 (SAST)' },
  { name: 'America/Sao_Paulo', offset: -3, label: '巴西时间 (BRT)' },
  { name: 'America/Mexico_City', offset: -6, label: '墨西哥时间 (CST)' },
  { name: 'America/Argentina/Buenos_Aires', offset: -3, label: '阿根廷时间 (ART)' },
  { name: 'America/Santiago', offset: -3, label: '智利时间 (CLT)' },
  { name: 'America/Lima', offset: -5, label: '秘鲁时间 (PET)' },
  { name: 'America/Bogota', offset: -5, label: '哥伦比亚时间 (COT)' },
  { name: 'America/Caracas', offset: -4, label: '委内瑞拉时间 (VET)' },
  { name: 'America/Havana', offset: -5, label: '古巴时间 (CST)' },
  { name: 'America/Panama', offset: -5, label: '巴拿马时间 (EST)' },
  { name: 'America/Guatemala', offset: -6, label: '危地马拉时间 (CST)' },
  { name: 'America/El_Salvador', offset: -6, label: '萨尔瓦多时间 (CST)' },
  { name: 'America/Honduras', offset: -6, label: '洪都拉斯时间 (CST)' },
  { name: 'America/Nicaragua', offset: -6, label: '尼加拉瓜时间 (CST)' },
  { name: 'America/Costa_Rica', offset: -6, label: '哥斯达黎加时间 (CST)' },
  { name: 'America/Belize', offset: -6, label: '伯利兹时间 (CST)' },
  { name: 'America/Guayaquil', offset: -5, label: '厄瓜多尔时间 (ECT)' },
  { name: 'America/Asuncion', offset: -3, label: '巴拉圭时间 (PYT)' },
  { name: 'America/Montevideo', offset: -3, label: '乌拉圭时间 (UYT)' },
  { name: 'America/La_Paz', offset: -4, label: '玻利维亚时间 (BOT)' },
  { name: 'America/Quito', offset: -5, label: '厄瓜多尔时间 (ECT)' },
  { name: 'America/Guatemala', offset: -6, label: '危地马拉时间 (CST)' },
  { name: 'America/El_Salvador', offset: -6, label: '萨尔瓦多时间 (CST)' },
  { name: 'America/Honduras', offset: -6, label: '洪都拉斯时间 (CST)' },
  { name: 'America/Nicaragua', offset: -6, label: '尼加拉瓜时间 (CST)' },
  { name: 'America/Costa_Rica', offset: -6, label: '哥斯达黎加时间 (CST)' },
  { name: 'America/Belize', offset: -6, label: '伯利兹时间 (CST)' },
  { name: 'America/Guayaquil', offset: -5, label: '厄瓜多尔时间 (ECT)' },
  { name: 'America/Asuncion', offset: -3, label: '巴拉圭时间 (PYT)' },
  { name: 'America/Montevideo', offset: -3, label: '乌拉圭时间 (UYT)' },
  { name: 'America/La_Paz', offset: -4, label: '玻利维亚时间 (BOT)' },
  { name: 'America/Quito', offset: -5, label: '厄瓜多尔时间 (ECT)' }
];

export default function TimezonePage() {
  const [sourceTimezone, setSourceTimezone] = useState('Asia/Shanghai');
  const [targetTimezone, setTargetTimezone] = useState('America/New_York');
  const [sourceTime, setSourceTime] = useState('');
  const [targetTime, setTargetTime] = useState('');
  const [currentTimes, setCurrentTimes] = useState<{[key: string]: string}>({});

  // 获取当前时间
  useEffect(() => {
    const updateCurrentTimes = () => {
      const now = new Date();
      const times: {[key: string]: string} = {};
      
      timezones.forEach(tz => {
        try {
          const time = new Date(now.toLocaleString('en-US', { timeZone: tz.name }));
          times[tz.name] = time.toLocaleString('zh-CN', {
            timeZone: tz.name,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          });
        } catch (e) {
          // 如果时区不可用，使用偏移量计算
          const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
          const targetTime = new Date(utc + (tz.offset * 3600000));
          times[tz.name] = targetTime.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          });
        }
      });
      
      setCurrentTimes(times);
    };

    updateCurrentTimes();
    const interval = setInterval(updateCurrentTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  const convertTime = () => {
    if (!sourceTime.trim()) {
      setTargetTime('');
      return;
    }

    try {
      // 解析源时间
      const sourceDate = new Date(sourceTime);
      if (isNaN(sourceDate.getTime())) {
        setTargetTime('时间格式无效');
        return;
      }

      // 获取源时区的偏移量
      const sourceTz = timezones.find(tz => tz.name === sourceTimezone);
      const targetTz = timezones.find(tz => tz.name === targetTimezone);
      
      if (!sourceTz || !targetTz) {
        setTargetTime('时区信息无效');
        return;
      }

      // 计算时区差异
      const timeDiff = (targetTz.offset - sourceTz.offset) * 60 * 60 * 1000;
      const targetDate = new Date(sourceDate.getTime() + timeDiff);

      // 格式化输出
      setTargetTime(targetDate.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }));
    } catch (e) {
      setTargetTime('转换失败');
    }
  };

  const handleClear = () => {
    setSourceTime('');
    setTargetTime('');
  };

  const setCurrentTime = () => {
    const now = new Date();
    setSourceTime(now.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }));
  };

  return (
    <section className="stack prose">
      <h2>时区转换器</h2>
      
      <Usage
        title="如何使用"
        steps={[
          '选择源时区和目标时区',
          '输入要转换的时间（或点击"当前时间"）',
          '点击"转换"按钮获得结果',
          '使用"复制"按钮复制结果'
        ]}
        tips={[
          '支持全球主要时区转换',
          '自动显示各时区当前时间',
          '支持自定义时间转换'
        ]}
      />

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <div className="card">
          <div className="stack">
            <h3>源时区</h3>
            
            <select 
              className="lg" 
              value={sourceTimezone} 
              onChange={(e) => setSourceTimezone(e.target.value)}
            >
              {timezones.map(tz => (
                <option key={tz.name} value={tz.name}>
                  {tz.label}
                </option>
              ))}
            </select>

            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 'bold' }}>
                当前时间
              </label>
              <div style={{ 
                padding: '8px', 
                background: '#f3f4f6', 
                border: '1px solid #d1d5db', 
                borderRadius: '4px',
                fontSize: '14px'
              }}>
                {currentTimes[sourceTimezone] || '加载中...'}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 'bold' }}>
                输入时间
              </label>
              <input
                type="datetime-local"
                value={sourceTime}
                onChange={(e) => setSourceTime(e.target.value)}
                style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
              />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="stack">
            <h3>目标时区</h3>
            
            <select 
              className="lg" 
              value={targetTimezone} 
              onChange={(e) => setTargetTimezone(e.target.value)}
            >
              {timezones.map(tz => (
                <option key={tz.name} value={tz.name}>
                  {tz.label}
                </option>
              ))}
            </select>

            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 'bold' }}>
                当前时间
              </label>
              <div style={{ 
                padding: '8px', 
                background: '#f3f4f6', 
                border: '1px solid #d1d5db', 
                borderRadius: '4px',
                fontSize: '14px'
              }}>
                {currentTimes[targetTimezone] || '加载中...'}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 'bold' }}>
                转换结果
              </label>
              <div style={{ 
                padding: '8px', 
                background: '#f0f9ff', 
                border: '1px solid #0ea5e9', 
                borderRadius: '4px',
                fontSize: '14px',
                color: '#0369a1'
              }}>
                {targetTime || '等待转换...'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="stack">
          <div className="row" style={{ gap: '8px' }}>
            <button className="btn generate" onClick={convertTime}>
              🔄 转换时间
            </button>
            <button className="btn" onClick={setCurrentTime}>
              ⏰ 当前时间
            </button>
            <button className="btn" onClick={handleClear}>
              清空
            </button>
            <CopyButton getText={() => targetTime} />
          </div>
        </div>
      </div>

      <div className="card">
        <h3>常用时区对比</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '16px',
          maxHeight: '400px',
          overflowY: 'auto'
        }}>
          {[
            { name: 'Asia/Shanghai', label: '中国' },
            { name: 'America/New_York', label: '美国东部' },
            { name: 'Europe/London', label: '英国' },
            { name: 'Asia/Tokyo', label: '日本' },
            { name: 'Australia/Sydney', label: '澳大利亚' },
            { name: 'America/Los_Angeles', label: '美国西部' }
          ].map(tz => (
            <div key={tz.name} style={{ 
              padding: '12px', 
              border: '1px solid #e5e7eb', 
              borderRadius: '8px',
              background: '#f9fafb'
            }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>{tz.label}</h4>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                {currentTimes[tz.name] || '加载中...'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <ToolDonation />
    </section>
  );
} 
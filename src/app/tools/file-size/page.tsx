'use client';
import { useState } from 'react';
import CopyButton from '@/app/_components/CopyButton';
import Usage from '@/app/_components/Usage';
import Examples from '@/app/_components/Examples';
import { ToolDonation } from '@/app/_components/Monetize';

const units = [
  { name: 'B', label: '字节 (B)', multiplier: 1 },
  { name: 'KB', label: '千字节 (KB)', multiplier: 1024 },
  { name: 'MB', label: '兆字节 (MB)', multiplier: 1024 * 1024 },
  { name: 'GB', label: '吉字节 (GB)', multiplier: 1024 * 1024 * 1024 },
  { name: 'TB', label: '太字节 (TB)', multiplier: 1024 * 1024 * 1024 * 1024 },
  { name: 'PB', label: '拍字节 (PB)', multiplier: 1024 * 1024 * 1024 * 1024 * 1024 },
  { name: 'EB', label: '艾字节 (EB)', multiplier: 1024 * 1024 * 1024 * 1024 * 1024 * 1024 }
];

export default function FileSizePage() {
  const [inputValue, setInputValue] = useState('');
  const [fromUnit, setFromUnit] = useState('MB');
  const [toUnit, setToUnit] = useState('KB');
  const [result, setResult] = useState('');

  const convertSize = () => {
    if (!inputValue.trim()) {
      setResult('');
      return;
    }

    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResult('请输入有效的数字');
      return;
    }

    const fromUnitData = units.find(u => u.name === fromUnit);
    const toUnitData = units.find(u => u.name === toUnit);

    if (!fromUnitData || !toUnitData) {
      setResult('单位选择错误');
      return;
    }

    // 转换为字节
    const bytes = value * fromUnitData.multiplier;
    
    // 转换为目标单位
    const resultValue = bytes / toUnitData.multiplier;
    
    // 格式化结果
    let formattedResult;
    if (resultValue >= 1) {
      formattedResult = resultValue.toFixed(2);
    } else if (resultValue >= 0.01) {
      formattedResult = resultValue.toFixed(4);
    } else {
      formattedResult = resultValue.toExponential(4);
    }
    
    setResult(`${formattedResult} ${toUnit}`);
  };

  const handleClear = () => {
    setInputValue('');
    setResult('');
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const commonSizes = [
    { name: '1KB', bytes: 1024 },
    { name: '1MB', bytes: 1024 * 1024 },
    { name: '1GB', bytes: 1024 * 1024 * 1024 },
    { name: '1TB', bytes: 1024 * 1024 * 1024 * 1024 },
    { name: '1PB', bytes: 1024 * 1024 * 1024 * 1024 * 1024 }
  ];

  return (
    <section className="stack prose">
      <h2>文件大小转换工具</h2>
      
      <Usage
        title="如何使用"
        steps={[
          '输入要转换的数值',
          '选择源单位和目标单位',
          '点击"转换"按钮获得结果',
          '使用"复制"按钮复制结果'
        ]}
        tips={[
          '支持B、KB、MB、GB、TB、PB、EB等单位',
          '使用1024进制（二进制）',
          '自动格式化显示结果'
        ]}
      />

      <Examples
        items={[
          { title: '1MB转KB', text: '1' },
          { title: '1GB转MB', text: '1' },
          { title: '1024KB转MB', text: '1024' }
        ]}
        onUse={(t) => setInputValue(t)}
      />

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <div className="card">
          <div className="stack">
            <h3>输入</h3>
            
            <div className="stack" style={{ gap: '12px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 'bold' }}>
                  数值
                </label>
                <input
                  type="number"
                  className="lg"
                  placeholder="输入数值..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  step="any"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 'bold' }}>
                  源单位
                </label>
                <select 
                  className="lg" 
                  value={fromUnit} 
                  onChange={(e) => setFromUnit(e.target.value)}
                >
                  {units.map(unit => (
                    <option key={unit.name} value={unit.name}>
                      {unit.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 'bold' }}>
                  目标单位
                </label>
                <select 
                  className="lg" 
                  value={toUnit} 
                  onChange={(e) => setToUnit(e.target.value)}
                >
                  {units.map(unit => (
                    <option key={unit.name} value={unit.name}>
                      {unit.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="row" style={{ gap: '8px' }}>
              <button className="btn generate" onClick={convertSize}>
                🔄 转换
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
              <h3>结果</h3>
              <CopyButton getText={() => result} />
            </div>
            
            <div style={{ 
              padding: '16px', 
              background: '#f0f9ff', 
              border: '1px solid #0ea5e9', 
              borderRadius: '8px',
              fontSize: '18px',
              fontFamily: 'monospace',
              textAlign: 'center',
              minHeight: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {result || '等待转换...'}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>常用文件大小对照</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px'
        }}>
          {commonSizes.map(size => (
            <div key={size.name} style={{ 
              padding: '12px', 
              border: '1px solid #e5e7eb', 
              borderRadius: '8px',
              background: '#f9fafb'
            }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>
                {size.name}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                {formatBytes(size.bytes)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>单位说明</h3>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>二进制单位</h4>
            <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
              1 KB = 1,024 B<br />
              1 MB = 1,024 KB<br />
              1 GB = 1,024 MB
            </p>
          </div>
          <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>常见用途</h4>
            <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
              B: 文本文件<br />
              KB: 小图片<br />
              MB: 文档、图片<br />
              GB: 视频、软件
            </p>
          </div>
          <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>大文件单位</h4>
            <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
              TB: 硬盘容量<br />
              PB: 数据中心<br />
              EB: 全球数据
            </p>
          </div>
        </div>
        <p style={{ marginTop: '16px', fontSize: '14px' }}>
          文件大小转换工具使用1024进制（二进制），这是计算机系统中常用的文件大小表示方法。
          支持从字节(B)到艾字节(EB)的各种单位转换。
        </p>
      </div>

      <ToolDonation />
    </section>
  );
} 
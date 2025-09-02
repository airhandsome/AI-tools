'use client';
import { useState } from 'react';
import CopyButton from '@/app/_components/CopyButton';
import Usage from '@/app/_components/Usage';
import Examples from '@/app/_components/Examples';
import { ToolDonation } from '@/app/_components/Monetize';

export default function BaseConvertPage() {
  const [input, setInput] = useState('');
  const [fromBase, setFromBase] = useState(10);
  const [toBase, setToBase] = useState(16);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const convertBase = () => {
    setError('');
    
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      // 解析输入数字
      let decimal: number;
      
      if (fromBase === 10) {
        decimal = parseInt(input, 10);
      } else if (fromBase === 2) {
        decimal = parseInt(input, 2);
      } else if (fromBase === 8) {
        decimal = parseInt(input, 8);
      } else if (fromBase === 16) {
        decimal = parseInt(input, 16);
      } else {
        // 自定义进制转换
        decimal = parseInt(input, fromBase);
      }

      if (isNaN(decimal)) {
        setError(`输入的数字在${fromBase}进制下无效`);
        return;
      }

      // 转换为目标进制
      let result: string;
      
      if (toBase === 10) {
        result = decimal.toString();
      } else if (toBase === 2) {
        result = decimal.toString(2);
      } else if (toBase === 8) {
        result = decimal.toString(8);
      } else if (toBase === 16) {
        result = decimal.toString(16).toUpperCase();
      } else {
        // 自定义进制转换
        result = decimal.toString(toBase).toUpperCase();
      }

      setOutput(result);
    } catch (e) {
      setError('转换失败，请检查输入');
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const getBaseInfo = (base: number) => {
    switch (base) {
      case 2: return '二进制 (0-1)';
      case 8: return '八进制 (0-7)';
      case 10: return '十进制 (0-9)';
      case 16: return '十六进制 (0-9, A-F)';
      default: return `${base}进制`;
    }
  };

  const getValidChars = (base: number) => {
    switch (base) {
      case 2: return '0, 1';
      case 8: return '0, 1, 2, 3, 4, 5, 6, 7';
      case 10: return '0, 1, 2, 3, 4, 5, 6, 7, 8, 9';
      case 16: return '0, 1, 2, 3, 4, 5, 6, 7, 8, 9, A, B, C, D, E, F';
      default: return `0-${Math.min(base-1, 9)}${base > 10 ? `, A-${String.fromCharCode(65 + Math.min(base-11, 25))}` : ''}`;
    }
  };

  return (
    <section className="stack prose">
      <h2>进制转换器</h2>
      
      <Usage
        title="如何使用"
        steps={[
          '选择源进制和目标进制',
          '输入要转换的数字',
          '点击"转换"按钮获得结果',
          '使用"复制"按钮复制结果'
        ]}
        tips={[
          '支持二进制、八进制、十进制、十六进制转换',
          '支持自定义进制转换（2-36进制）',
          '十六进制字母不区分大小写'
        ]}
      />

      <Examples
        items={[
          { title: '十进制转十六进制', text: '255' },
          { title: '二进制转十进制', text: '10101010' },
          { title: '十六进制转二进制', text: 'FF' }
        ]}
        onUse={(t) => setInput(t)}
      />

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <div className="card">
          <div className="stack">
            <h3>输入</h3>
            
            <div className="stack" style={{ gap: '12px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 'bold' }}>
                  源进制
                </label>
                <select 
                  className="lg" 
                  value={fromBase} 
                  onChange={(e) => setFromBase(parseInt(e.target.value))}
                >
                  <option value={2}>二进制 (2)</option>
                  <option value={8}>八进制 (8)</option>
                  <option value={10}>十进制 (10)</option>
                  <option value={16}>十六进制 (16)</option>
                  <option value={3}>三进制 (3)</option>
                  <option value={4}>四进制 (4)</option>
                  <option value={5}>五进制 (5)</option>
                  <option value={6}>六进制 (6)</option>
                  <option value={7}>七进制 (7)</option>
                  <option value={9}>九进制 (9)</option>
                  <option value={12}>十二进制 (12)</option>
                  <option value={20}>二十进制 (20)</option>
                  <option value={36}>三十六进制 (36)</option>
                </select>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                  有效字符：{getValidChars(fromBase)}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 'bold' }}>
                  目标进制
                </label>
                <select 
                  className="lg" 
                  value={toBase} 
                  onChange={(e) => setToBase(parseInt(e.target.value))}
                >
                  <option value={2}>二进制 (2)</option>
                  <option value={8}>八进制 (8)</option>
                  <option value={10}>十进制 (10)</option>
                  <option value={16}>十六进制 (16)</option>
                  <option value={3}>三进制 (3)</option>
                  <option value={4}>四进制 (4)</option>
                  <option value={5}>五进制 (5)</option>
                  <option value={6}>六进制 (6)</option>
                  <option value={7}>七进制 (7)</option>
                  <option value={9}>九进制 (9)</option>
                  <option value={12}>十二进制 (12)</option>
                  <option value={20}>二十进制 (20)</option>
                  <option value={36}>三十六进制 (36)</option>
                </select>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                  有效字符：{getValidChars(toBase)}
                </div>
              </div>
            </div>
            
            <input
              type="text"
              className="lg"
              placeholder={`输入${getBaseInfo(fromBase)}数字...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            
            {error && (
              <div style={{ 
                padding: '8px', 
                background: '#fef2f2', 
                border: '1px solid #fecaca', 
                borderRadius: '4px',
                color: '#dc2626',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}
            
            <div className="row" style={{ gap: '8px' }}>
              <button className="btn generate" onClick={convertBase}>
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
              <h3>输出</h3>
              <CopyButton getText={() => output} />
            </div>
            
            <div style={{ 
              padding: '12px', 
              background: '#f0f9ff', 
              border: '1px solid #0ea5e9', 
              borderRadius: '4px',
              fontSize: '16px',
              fontFamily: 'monospace',
              minHeight: '48px',
              display: 'flex',
              alignItems: 'center'
            }}>
              {output || '等待转换...'}
            </div>
            
            {output && (
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                {getBaseInfo(toBase)} 格式
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <h3>常用进制对照表</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px',
          maxHeight: '400px',
          overflowY: 'auto'
        }}>
          {[
            { decimal: 0, binary: '0', octal: '0', hex: '0' },
            { decimal: 1, binary: '1', octal: '1', hex: '1' },
            { decimal: 2, binary: '10', octal: '2', hex: '2' },
            { decimal: 3, binary: '11', octal: '3', hex: '3' },
            { decimal: 4, binary: '100', octal: '4', hex: '4' },
            { decimal: 5, binary: '101', octal: '5', hex: '5' },
            { decimal: 6, binary: '110', octal: '6', hex: '6' },
            { decimal: 7, binary: '111', octal: '7', hex: '7' },
            { decimal: 8, binary: '1000', octal: '10', hex: '8' },
            { decimal: 9, binary: '1001', octal: '11', hex: '9' },
            { decimal: 10, binary: '1010', octal: '12', hex: 'A' },
            { decimal: 15, binary: '1111', octal: '17', hex: 'F' },
            { decimal: 16, binary: '10000', octal: '20', hex: '10' },
            { decimal: 255, binary: '11111111', octal: '377', hex: 'FF' }
          ].map(item => (
            <div key={item.decimal} style={{ 
              padding: '12px', 
              border: '1px solid #e5e7eb', 
              borderRadius: '8px',
              background: '#f9fafb'
            }}>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                十进制: {item.decimal}
              </div>
              <div style={{ fontSize: '14px', fontFamily: 'monospace' }}>
                二进制: {item.binary}<br />
                八进制: {item.octal}<br />
                十六进制: {item.hex}
              </div>
            </div>
          ))}
        </div>
      </div>

      <ToolDonation />
    </section>
  );
} 
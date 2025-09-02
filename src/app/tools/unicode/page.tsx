'use client';
import { useState } from 'react';
import CopyButton from '@/app/_components/CopyButton';
import Usage from '@/app/_components/Usage';
import Examples from '@/app/_components/Examples';
import { ToolDonation } from '@/app/_components/Monetize';

export default function UnicodePage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [format, setFormat] = useState<'unicode' | 'hex' | 'decimal'>('unicode');

  const handleEncode = () => {
    let result = '';
    for (let i = 0; i < input.length; i++) {
      const charCode = input.charCodeAt(i);
      switch (format) {
        case 'unicode':
          result += `\\u${charCode.toString(16).padStart(4, '0')}`;
          break;
        case 'hex':
          result += `0x${charCode.toString(16).toUpperCase()}`;
          break;
        case 'decimal':
          result += charCode.toString();
          break;
      }
      if (i < input.length - 1) result += ' ';
    }
    setOutput(result);
  };

  const handleDecode = () => {
    try {
      let result = '';
      const codes = input.trim().split(/\s+/);
      
      for (const code of codes) {
        let charCode: number;
        
        if (code.startsWith('\\u')) {
          // Unicode格式: \u0041
          charCode = parseInt(code.slice(2), 16);
        } else if (code.startsWith('0x')) {
          // 十六进制格式: 0x41
          charCode = parseInt(code.slice(2), 16);
        } else {
          // 十进制格式: 65
          charCode = parseInt(code, 10);
        }
        
        if (!isNaN(charCode)) {
          result += String.fromCharCode(charCode);
        } else {
          result += code; // 如果解析失败，保留原文本
        }
      }
      
      setOutput(result);
    } catch (e) {
      setOutput('解码失败，请检查输入格式');
    }
  };

  const handleConvert = () => {
    if (mode === 'encode') {
      handleEncode();
    } else {
      handleDecode();
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  return (
    <section className="stack prose">
      <h2>Unicode 编码转换工具</h2>
      
      <Usage
        title="如何使用"
        steps={[
          '选择编码或解码模式',
          '选择输出格式（Unicode、十六进制、十进制）',
          '在输入框中粘贴要处理的文本',
          '点击"转换"按钮获得结果',
          '使用"复制"按钮复制结果'
        ]}
        tips={[
          '编码：将文本转换为Unicode编码',
          '解码：将Unicode编码转换回文本',
          '支持多种编码格式'
        ]}
      />

      <Examples
        items={[
          { title: 'Hello World', text: 'Hello World' },
          { title: '中文测试', text: '中文测试' },
          { title: 'Unicode编码', text: '\\u0048 \\u0065 \\u006c \\u006c \\u006f' }
        ]}
        onUse={(t) => setInput(t)}
      />

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <div className="card">
          <div className="stack">
            <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>输入</h3>
              <div className="row" style={{ gap: '8px' }}>
                <button
                  className={`btn ${mode === 'encode' ? 'primary' : ''}`}
                  onClick={() => setMode('encode')}
                  style={{ fontSize: '12px', padding: '6px 12px' }}
                >
                  编码
                </button>
                <button
                  className={`btn ${mode === 'decode' ? 'primary' : ''}`}
                  onClick={() => setMode('decode')}
                  style={{ fontSize: '12px', padding: '6px 12px' }}
                >
                  解码
                </button>
              </div>
            </div>

            {mode === 'encode' && (
              <select 
                className="lg" 
                value={format} 
                onChange={(e) => setFormat(e.target.value as any)}
              >
                <option value="unicode">Unicode格式 (\u0041)</option>
                <option value="hex">十六进制格式 (0x41)</option>
                <option value="decimal">十进制格式 (65)</option>
              </select>
            )}
            
            <textarea
              className="lg"
              rows={8}
              placeholder={mode === 'encode' ? '输入要编码的文本...' : '输入要解码的Unicode编码...'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            
            <div className="row" style={{ gap: '8px' }}>
              <button className="btn generate" onClick={handleConvert}>
                {mode === 'encode' ? '🔤 编码' : '📝 解码'}
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
            
            <textarea
              className="lg"
              rows={8}
              placeholder="转换结果将显示在这里..."
              value={output}
              readOnly
            />
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Unicode编码格式说明</h3>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>Unicode格式</h4>
            <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
              \u0041 \u0042 \u0043<br />
              适用于JavaScript和JSON
            </p>
          </div>
          <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>十六进制格式</h4>
            <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
              0x41 0x42 0x43<br />
              适用于编程和调试
            </p>
          </div>
          <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>十进制格式</h4>
            <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
              65 66 67<br />
              适用于数值计算
            </p>
          </div>
        </div>
        <p style={{ marginTop: '16px', fontSize: '14px' }}>
          Unicode是一种字符编码标准，为世界上几乎所有的字符分配了唯一的数字标识。
          本工具支持多种Unicode编码格式，方便在不同场景下使用。
        </p>
      </div>

      <ToolDonation />
    </section>
  );
} 
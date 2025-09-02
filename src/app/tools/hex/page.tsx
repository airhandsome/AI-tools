'use client';
import { useState } from 'react';
import CopyButton from '@/app/_components/CopyButton';
import Usage from '@/app/_components/Usage';
import Examples from '@/app/_components/Examples';
import { ToolDonation } from '@/app/_components/Monetize';

export default function HexPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const handleEncode = () => {
    try {
      let result = '';
      for (let i = 0; i < input.length; i++) {
        const charCode = input.charCodeAt(i);
        result += charCode.toString(16).padStart(2, '0');
      }
      setOutput(result);
    } catch (e) {
      setOutput('编码失败');
    }
  };

  const handleDecode = () => {
    try {
      // 移除所有空格和换行符
      const cleanInput = input.replace(/\s/g, '');
      
      // 检查是否为有效的十六进制字符串
      if (!/^[0-9a-fA-F]*$/.test(cleanInput)) {
        setOutput('解码失败：输入不是有效的十六进制字符串');
        return;
      }
      
      // 确保字符串长度为偶数
      if (cleanInput.length % 2 !== 0) {
        setOutput('解码失败：十六进制字符串长度必须为偶数');
        return;
      }
      
      let result = '';
      for (let i = 0; i < cleanInput.length; i += 2) {
        const hex = cleanInput.substr(i, 2);
        const charCode = parseInt(hex, 16);
        result += String.fromCharCode(charCode);
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
      <h2>十六进制编码转换工具</h2>
      
      <Usage
        title="如何使用"
        steps={[
          '选择编码或解码模式',
          '在输入框中粘贴要处理的文本',
          '点击"转换"按钮获得结果',
          '使用"复制"按钮复制结果'
        ]}
        tips={[
          '编码：将文本转换为十六进制编码',
          '解码：将十六进制编码转换回文本',
          '解码时自动忽略空格和换行符'
        ]}
      />

      <Examples
        items={[
          { title: 'Hello World', text: 'Hello World' },
          { title: '中文测试', text: '中文测试' },
          { title: '十六进制编码', text: '48656c6c6f20576f726c64' }
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
            
            <textarea
              className="lg"
              rows={8}
              placeholder={mode === 'encode' ? '输入要编码的文本...' : '输入要解码的十六进制编码...'}
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
        <h3>关于十六进制编码</h3>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>编码原理</h4>
            <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
              每个字符转换为两位十六进制数，如 'A' → '41'
            </p>
          </div>
          <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>应用场景</h4>
            <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
              数据传输、调试、二进制文件分析
            </p>
          </div>
          <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>格式要求</h4>
            <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
              解码时字符串长度必须为偶数
            </p>
          </div>
        </div>
        <p style={{ marginTop: '16px', fontSize: '14px' }}>
          十六进制编码是一种将二进制数据转换为可读文本的方法。
          每个字节用两个十六进制数字表示，常用于数据传输和调试。
        </p>
      </div>

      <ToolDonation />
    </section>
  );
} 
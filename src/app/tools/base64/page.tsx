'use client';
import { useState } from 'react';
import CopyButton from '@/app/_components/CopyButton';
import Usage from '@/app/_components/Usage';
import Examples from '@/app/_components/Examples';
import { ToolDonation } from '@/app/_components/Monetize';

export default function Base64Page() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState('');

  const handleEncode = () => {
    try {
      setError('');
      // 使用UTF-8编码处理中文
      const encoded = btoa(unescape(encodeURIComponent(input)));
      setOutput(encoded);
    } catch (e) {
      setError('编码失败，请检查输入内容');
    }
  };

  const handleDecode = () => {
    try {
      setError('');
      // 使用UTF-8解码处理中文
      const decoded = decodeURIComponent(escape(atob(input)));
      setOutput(decoded);
    } catch (e) {
      setError('解码失败，请检查输入是否为有效的Base64编码');
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
    setError('');
  };

  return (
    <section className="stack prose">
      <h2>Base64 编码/解码工具</h2>
      
      <Usage
        title="如何使用"
        steps={[
          '选择编码或解码模式',
          '在输入框中粘贴要处理的文本',
          '点击"转换"按钮获得结果',
          '使用"复制"按钮复制结果'
        ]}
        tips={[
          '编码：将普通文本转换为Base64编码',
          '解码：将Base64编码转换回普通文本',
          '支持中文、英文、特殊字符等'
        ]}
      />

      <Examples
        items={[
          { title: 'Hello World', text: 'Hello World' },
          { title: '中文测试', text: '中文测试' },
          { title: '特殊字符', text: '!@#$%^&*()' }
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
              placeholder={mode === 'encode' ? '输入要编码的文本...' : '输入要解码的Base64编码...'}
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
            
            {error && (
              <div style={{ color: '#b91c1c', padding: '8px', background: '#fef2f2', borderRadius: '8px' }}>
                {error}
              </div>
            )}
            
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
        <h3>关于 Base64</h3>
        <p>
          Base64 是一种基于64个可打印字符来表示二进制数据的编码方式。
          它常用于：
        </p>
        <ul>
          <li>在HTTP协议中传输二进制数据</li>
          <li>在JSON中嵌入图片等二进制数据</li>
          <li>在邮件系统中传输附件</li>
          <li>在URL中传递参数</li>
        </ul>
        <p>
          Base64 编码会将原始数据的大小增加约33%，因为它使用4个字符来表示3个字节的数据。
        </p>
      </div>

      <ToolDonation />
    </section>
  );
} 
'use client';
import { useState } from 'react';
import CopyButton from '@/app/_components/CopyButton';
import Usage from '@/app/_components/Usage';
import Examples from '@/app/_components/Examples';
import { ToolDonation } from '@/app/_components/Monetize';

export default function UrlEncodePage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const handleEncode = () => {
    try {
      const encoded = encodeURIComponent(input);
      setOutput(encoded);
    } catch (e) {
      setOutput('编码失败');
    }
  };

  const handleDecode = () => {
    try {
      const decoded = decodeURIComponent(input);
      setOutput(decoded);
    } catch (e) {
      setOutput('解码失败，请检查URL编码格式');
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
      <h2>URL 编码/解码工具</h2>
      
      <Usage
        title="如何使用"
        steps={[
          '选择编码或解码模式',
          '在输入框中粘贴要处理的文本',
          '点击"转换"按钮获得结果',
          '使用"复制"按钮复制结果'
        ]}
        tips={[
          '编码：将特殊字符转换为URL安全格式',
          '解码：将URL编码转换回原始文本',
          '常用于URL参数、表单数据等'
        ]}
      />

      <Examples
        items={[
          { title: '中文参数', text: 'name=张三&city=北京' },
          { title: '特殊字符', text: 'query=hello world!' },
          { title: 'URL编码', text: 'name%3D%E5%BC%A0%E4%B8%89%26city%3D%E5%8C%97%E4%BA%AC' }
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
              placeholder={mode === 'encode' ? '输入要编码的文本...' : '输入要解码的URL编码...'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            
            <div className="row" style={{ gap: '8px' }}>
              <button className="btn generate" onClick={handleConvert}>
                {mode === 'encode' ? '🔗 编码' : '📝 解码'}
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
        <h3>关于 URL 编码</h3>
        <p>
          URL编码（Percent-encoding）是一种将特殊字符转换为URL安全格式的方法。
          它使用百分号（%）后跟两个十六进制数字来表示字符。
        </p>
        <p>常见编码示例：</p>
        <ul>
          <li>空格 → %20</li>
          <li>中文"张" → %E5%BC%A0</li>
          <li>特殊字符"!" → %21</li>
          <li>等号"=" → %3D</li>
          <li>与号"&" → %26</li>
        </ul>
        <p>
          URL编码常用于：URL参数、表单数据提交、API接口调用等场景。
        </p>
      </div>

      <ToolDonation />
    </section>
  );
} 
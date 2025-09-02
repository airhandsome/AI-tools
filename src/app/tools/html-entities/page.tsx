'use client';
import { useState } from 'react';
import CopyButton from '@/app/_components/CopyButton';
import Usage from '@/app/_components/Usage';
import Examples from '@/app/_components/Examples';
import { ToolDonation } from '@/app/_components/Monetize';

export default function HtmlEntitiesPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const htmlEntities: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '©': '&copy;',
    '®': '&reg;',
    '™': '&trade;',
    '€': '&euro;',
    '£': '&pound;',
    '¥': '&yen;',
    '¢': '&cent;',
    '°': '&deg;',
    '±': '&plusmn;',
    '×': '&times;',
    '÷': '&divide;',
    '≠': '&ne;',
    '≤': '&le;',
    '≥': '&ge;',
    '∞': '&infin;',
    '√': '&radic;',
    '∑': '&sum;',
    '∏': '&prod;',
    '∫': '&int;',
    'α': '&alpha;',
    'β': '&beta;',
    'γ': '&gamma;',
    'δ': '&delta;',
    'ε': '&epsilon;',
    'ζ': '&zeta;',
    'η': '&eta;',
    'θ': '&theta;',
    'ι': '&iota;',
    'κ': '&kappa;',
    'λ': '&lambda;',
    'μ': '&mu;',
    'ν': '&nu;',
    'ξ': '&xi;',
    'ο': '&omicron;',
    'π': '&pi;',
    'ρ': '&rho;',
    'σ': '&sigma;',
    'τ': '&tau;',
    'υ': '&upsilon;',
    'φ': '&phi;',
    'χ': '&chi;',
    'ψ': '&psi;',
    'ω': '&omega;'
  };

  const reverseHtmlEntities: { [key: string]: string } = {};
  Object.entries(htmlEntities).forEach(([char, entity]) => {
    reverseHtmlEntities[entity] = char;
  });

  const handleEncode = () => {
    let result = input;
    Object.entries(htmlEntities).forEach(([char, entity]) => {
      result = result.replace(new RegExp(char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), entity);
    });
    setOutput(result);
  };

  const handleDecode = () => {
    let result = input;
    Object.entries(reverseHtmlEntities).forEach(([entity, char]) => {
      result = result.replace(new RegExp(entity, 'g'), char);
    });
    setOutput(result);
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
      <h2>HTML 实体编码工具</h2>
      
      <Usage
        title="如何使用"
        steps={[
          '选择编码或解码模式',
          '在输入框中粘贴要处理的文本',
          '点击"转换"按钮获得结果',
          '使用"复制"按钮复制结果'
        ]}
        tips={[
          '编码：将特殊字符转换为HTML实体',
          '解码：将HTML实体转换回特殊字符',
          '支持常用HTML实体和数学符号'
        ]}
      />

      <Examples
        items={[
          { title: 'HTML标签', text: '<div>Hello World</div>' },
          { title: '特殊符号', text: '© 2024 & 公司™' },
          { title: '数学公式', text: 'α + β = γ, π ≈ 3.14' }
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
              placeholder={mode === 'encode' ? '输入要编码的HTML文本...' : '输入要解码的HTML实体...'}
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
        <h3>常用HTML实体</h3>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>基本字符</h4>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              &amp; &lt; &gt; &quot; &#39;
            </div>
          </div>
          <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>商标符号</h4>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              &copy; &reg; &trade;
            </div>
          </div>
          <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>货币符号</h4>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              &euro; &pound; &yen; &cent;
            </div>
          </div>
          <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>数学符号</h4>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              &plusmn; &times; &divide; &pi;
            </div>
          </div>
        </div>
        <p style={{ marginTop: '16px', fontSize: '14px' }}>
          HTML实体编码用于在HTML文档中安全地显示特殊字符，避免与HTML标签冲突。
          常见的实体包括基本字符、商标符号、货币符号和数学符号等。
        </p>
      </div>

      <ToolDonation />
    </section>
  );
} 
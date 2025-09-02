'use client';
import { useState } from 'react';
import CopyButton from '@/app/_components/CopyButton';
import Usage from '@/app/_components/Usage';
import Examples from '@/app/_components/Examples';
import { ToolDonation } from '@/app/_components/Monetize';

export default function JsonPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'format' | 'minify' | 'validate'>('format');
  const [error, setError] = useState('');

  const handleFormat = () => {
    try {
      setError('');
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
    } catch (e: any) {
      setError(`JSON格式错误: ${e.message}`);
    }
  };

  const handleMinify = () => {
    try {
      setError('');
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
    } catch (e: any) {
      setError(`JSON格式错误: ${e.message}`);
    }
  };

  const handleValidate = () => {
    try {
      setError('');
      const parsed = JSON.parse(input);
      setOutput(`✅ JSON格式正确\n\n解析结果:\n${JSON.stringify(parsed, null, 2)}`);
    } catch (e: any) {
      setError(`❌ JSON格式错误: ${e.message}`);
      setOutput('');
    }
  };

  const handleConvert = () => {
    if (mode === 'format') {
      handleFormat();
    } else if (mode === 'minify') {
      handleMinify();
    } else {
      handleValidate();
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  return (
    <section className="stack prose">
      <h2>JSON 格式化工具</h2>
      
      <Usage
        title="如何使用"
        steps={[
          '选择操作模式（格式化、压缩、验证）',
          '在输入框中粘贴JSON文本',
          '点击相应按钮处理JSON',
          '使用"复制"按钮复制结果'
        ]}
        tips={[
          '格式化：美化JSON，添加缩进和换行',
          '压缩：移除所有空格和换行，减小体积',
          '验证：检查JSON格式是否正确'
        ]}
      />

      <Examples
        items={[
          { title: '简单对象', text: '{"name":"张三","age":25,"city":"北京"}' },
          { title: '数组示例', text: '[{"id":1,"name":"产品1"},{"id":2,"name":"产品2"}]' },
          { title: '嵌套对象', text: '{"user":{"name":"李四","profile":{"email":"test@example.com"}},"settings":{"theme":"dark"}}' }
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
                  className={`btn ${mode === 'format' ? 'primary' : ''}`}
                  onClick={() => setMode('format')}
                  style={{ fontSize: '12px', padding: '6px 12px' }}
                >
                  格式化
                </button>
                <button
                  className={`btn ${mode === 'minify' ? 'primary' : ''}`}
                  onClick={() => setMode('minify')}
                  style={{ fontSize: '12px', padding: '6px 12px' }}
                >
                  压缩
                </button>
                <button
                  className={`btn ${mode === 'validate' ? 'primary' : ''}`}
                  onClick={() => setMode('validate')}
                  style={{ fontSize: '12px', padding: '6px 12px' }}
                >
                  验证
                </button>
              </div>
            </div>
            
            <textarea
              className="lg"
              rows={12}
              placeholder="粘贴JSON文本..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            
            <div className="row" style={{ gap: '8px' }}>
              <button className="btn generate" onClick={handleConvert}>
                {mode === 'format' ? '🎨 格式化' : mode === 'minify' ? '📦 压缩' : '✅ 验证'}
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
              rows={12}
              placeholder="处理结果将显示在这里..."
              value={output}
              readOnly
            />
            
            {output && mode !== 'validate' && (
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                字符数: {output.length} | 
                行数: {output.split('\n').length}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <h3>关于 JSON</h3>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>JSON 格式</h4>
            <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
              轻量级的数据交换格式，易于人阅读和编写
            </p>
          </div>
          <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>常见用途</h4>
            <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
              API接口、配置文件、数据存储、前后端通信
            </p>
          </div>
          <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>语法规则</h4>
            <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
              键值对、数组、字符串、数字、布尔值、null
            </p>
          </div>
        </div>
        <p style={{ marginTop: '16px', fontSize: '14px' }}>
          JSON (JavaScript Object Notation) 是一种独立于编程语言的数据格式。
          它基于JavaScript对象语法，但可以被任何编程语言解析和生成。
        </p>
      </div>

      <ToolDonation />
    </section>
  );
} 
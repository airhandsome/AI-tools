'use client';
import { useState } from 'react';
import CopyButton from '@/app/_components/CopyButton';
import Usage from '@/app/_components/Usage';
import Examples from '@/app/_components/Examples';
import { ToolDonation } from '@/app/_components/Monetize';

export default function TextCasePage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const convertCase = (type: string) => {
    switch (type) {
      case 'uppercase':
        setOutput(input.toUpperCase());
        break;
      case 'lowercase':
        setOutput(input.toLowerCase());
        break;
      case 'capitalize':
        setOutput(input.replace(/\b\w/g, (char) => char.toUpperCase()));
        break;
      case 'titlecase':
        setOutput(input.replace(/\b\w+/g, (word) => 
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ));
        break;
      case 'alternating':
        setOutput(input.split('').map((char, index) => 
          index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
        ).join(''));
        break;
      case 'inverse':
        setOutput(input.split('').map(char => 
          char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
        ).join(''));
        break;
      default:
        setOutput(input);
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  return (
    <section className="stack prose">
      <h2>文本大小写转换工具</h2>
      
      <Usage
        title="如何使用"
        steps={[
          '在输入框中粘贴要转换的文本',
          '点击相应的转换按钮',
          '在输出框中查看结果',
          '使用"复制"按钮复制结果'
        ]}
        tips={[
          '支持多种大小写转换模式',
          '可以处理中英文混合文本',
          '保持原有的标点符号和空格'
        ]}
      />

      <Examples
        items={[
          { title: 'Hello World', text: 'Hello World' },
          { title: '混合文本', text: 'Hello 世界 World' },
          { title: '全大写', text: 'HELLO WORLD' }
        ]}
        onUse={(t) => setInput(t)}
      />

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <div className="card">
          <div className="stack">
            <h3>输入</h3>
            
            <textarea
              className="lg"
              rows={8}
              placeholder="输入要转换的文本..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            
            <div className="row" style={{ gap: '8px' }}>
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
        <h3>转换选项</h3>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <button 
            className="btn" 
            onClick={() => convertCase('uppercase')}
            style={{ textAlign: 'left', justifyContent: 'flex-start' }}
          >
            <strong>全大写</strong><br />
            <small style={{ color: '#6b7280' }}>HELLO WORLD</small>
          </button>
          
          <button 
            className="btn" 
            onClick={() => convertCase('lowercase')}
            style={{ textAlign: 'left', justifyContent: 'flex-start' }}
          >
            <strong>全小写</strong><br />
            <small style={{ color: '#6b7280' }}>hello world</small>
          </button>
          
          <button 
            className="btn" 
            onClick={() => convertCase('capitalize')}
            style={{ textAlign: 'left', justifyContent: 'flex-start' }}
          >
            <strong>首字母大写</strong><br />
            <small style={{ color: '#6b7280' }}>Hello World</small>
          </button>
          
          <button 
            className="btn" 
            onClick={() => convertCase('titlecase')}
            style={{ textAlign: 'left', justifyContent: 'flex-start' }}
          >
            <strong>标题格式</strong><br />
            <small style={{ color: '#6b7280' }}>Hello World</small>
          </button>
          
          <button 
            className="btn" 
            onClick={() => convertCase('alternating')}
            style={{ textAlign: 'left', justifyContent: 'flex-start' }}
          >
            <strong>交替大小写</strong><br />
            <small style={{ color: '#6b7280' }}>hElLo WoRlD</small>
          </button>
          
          <button 
            className="btn" 
            onClick={() => convertCase('inverse')}
            style={{ textAlign: 'left', justifyContent: 'flex-start' }}
          >
            <strong>大小写反转</strong><br />
            <small style={{ color: '#6b7280' }}>hELLO wORLD</small>
          </button>
        </div>
      </div>

      <div className="card">
        <h3>关于文本大小写</h3>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>全大写</h4>
            <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
              所有字母转换为大写，常用于标题、强调
            </p>
          </div>
          <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>全小写</h4>
            <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
              所有字母转换为小写，常用于代码、标签
            </p>
          </div>
          <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>首字母大写</h4>
            <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
              每个单词的首字母大写，常用于句子开头
            </p>
          </div>
        </div>
        <p style={{ marginTop: '16px', fontSize: '14px' }}>
          文本大小写转换在写作、编程、设计等场景中非常有用。
          不同的转换模式适用于不同的使用场景。
        </p>
      </div>

      <ToolDonation />
    </section>
  );
} 
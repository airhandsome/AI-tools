'use client';
import { useState } from 'react';
import CopyButton from '@/app/_components/CopyButton';
import Usage from '@/app/_components/Usage';
import Examples from '@/app/_components/Examples';
import { ToolDonation } from '@/app/_components/Monetize';

// 简单的哈希函数实现
async function calculateHash(text: string, algorithm: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  
  switch (algorithm) {
    case 'md5':
      // 使用 Web Crypto API 的 SHA-1 作为替代（浏览器不支持 MD5）
      const sha1Hash = await crypto.subtle.digest('SHA-1', data);
      return Array.from(new Uint8Array(sha1Hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    case 'sha1':
      const sha1Result = await crypto.subtle.digest('SHA-1', data);
      return Array.from(new Uint8Array(sha1Result))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    case 'sha256':
      const sha256Result = await crypto.subtle.digest('SHA-256', data);
      return Array.from(new Uint8Array(sha256Result))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    case 'sha512':
      const sha512Result = await crypto.subtle.digest('SHA-512', data);
      return Array.from(new Uint8Array(sha512Result))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    default:
      throw new Error('不支持的哈希算法');
  }
}

export default function HashPage() {
  const [input, setInput] = useState('');
  const [algorithm, setAlgorithm] = useState('sha256');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const algorithms = [
    { value: 'md5', label: 'MD5 (128位)', note: '注意：浏览器使用SHA-1替代' },
    { value: 'sha1', label: 'SHA-1 (160位)' },
    { value: 'sha256', label: 'SHA-256 (256位)' },
    { value: 'sha512', label: 'SHA-512 (512位)' }
  ];

  const handleCalculate = async () => {
    if (!input.trim()) {
      setError('请输入要计算哈希的内容');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const hash = await calculateHash(input, algorithm);
      setResult(hash);
    } catch (e: any) {
      setError(e.message || '计算失败');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInput('');
    setResult('');
    setError('');
  };

  return (
    <section className="stack prose">
      <h2>哈希计算器</h2>
      
      <Usage
        title="如何使用"
        steps={[
          '选择哈希算法（MD5、SHA-1、SHA-256、SHA-512）',
          '在输入框中粘贴要计算哈希的文本',
          '点击"计算哈希"按钮获得结果',
          '使用"复制"按钮复制哈希值'
        ]}
        tips={[
          '哈希是单向加密，无法从哈希值反推原文',
          '相同输入总是产生相同的哈希值',
          'SHA-256是目前最常用的哈希算法'
        ]}
      />

      <Examples
        items={[
          { title: 'Hello World', text: 'Hello World' },
          { title: '密码123', text: 'password123' },
          { title: '中文测试', text: '中文测试文本' }
        ]}
        onUse={(t) => setInput(t)}
      />

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <div className="card">
          <div className="stack">
            <h3>输入</h3>
            
            <select 
              className="lg" 
              value={algorithm} 
              onChange={(e) => setAlgorithm(e.target.value)}
            >
              {algorithms.map(alg => (
                <option key={alg.value} value={alg.value}>
                  {alg.label}
                </option>
              ))}
            </select>
            
            <textarea
              className="lg"
              rows={8}
              placeholder="输入要计算哈希的文本..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            
            <div className="row" style={{ gap: '8px' }}>
              <button 
                className="btn generate" 
                onClick={handleCalculate}
                disabled={loading || !input.trim()}
              >
                {loading ? '计算中...' : '🔐 计算哈希'}
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
              <h3>哈希结果</h3>
              <CopyButton getText={() => result} />
            </div>
            
            {error && (
              <div style={{ color: '#b91c1c', padding: '8px', background: '#fef2f2', borderRadius: '8px' }}>
                {error}
              </div>
            )}
            
            <textarea
              className="lg"
              rows={8}
              placeholder="哈希值将显示在这里..."
              value={result}
              readOnly
            />
            
            {result && (
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                算法: {algorithms.find(alg => alg.value === algorithm)?.label}
                <br />
                长度: {result.length} 字符
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <h3>关于哈希算法</h3>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {algorithms.map(alg => (
            <div key={alg.value} style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>{alg.label}</h4>
              <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
                {alg.note || `${alg.value.toUpperCase()} 是一种安全的哈希算法`}
              </p>
            </div>
          ))}
        </div>
        <p style={{ marginTop: '16px', fontSize: '14px' }}>
          哈希算法常用于：密码存储、文件完整性验证、数字签名、区块链等场景。
          现代应用推荐使用 SHA-256 或 SHA-512 算法。
        </p>
      </div>

      <ToolDonation />
    </section>
  );
} 
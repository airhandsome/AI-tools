'use client';
import { useState } from 'react';
import CopyButton from '@/app/_components/CopyButton';
import Usage from '@/app/_components/Usage';
import Examples from '@/app/_components/Examples';
import { ToolDonation } from '@/app/_components/Monetize';

export default function AesPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [key, setKey] = useState('');
  const [error, setError] = useState('');

  // 简单的AES加密实现（使用Web Crypto API）
  const encryptAES = async (text: string, password: string) => {
    try {
      // 生成密钥
      const encoder = new TextEncoder();
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveBits', 'deriveKey']
      );
      
      const key = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: encoder.encode('salt'),
          iterations: 100000,
          hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt']
      );

      // 生成IV
      const iv = crypto.getRandomValues(new Uint8Array(12));
      
      // 加密
      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        encoder.encode(text)
      );

      // 组合IV和加密数据
      const encryptedArray = new Uint8Array(encrypted);
      const result = new Uint8Array(iv.length + encryptedArray.length);
      result.set(iv);
      result.set(encryptedArray, iv.length);

      // 转换为Base64
      return btoa(String.fromCharCode(...result));
    } catch (e) {
      throw new Error('加密失败');
    }
  };

  // 简单的AES解密实现
  const decryptAES = async (encryptedText: string, password: string) => {
    try {
      // 解码Base64
      const encryptedData = new Uint8Array(
        atob(encryptedText).split('').map(char => char.charCodeAt(0))
      );

      // 提取IV和加密数据
      const iv = encryptedData.slice(0, 12);
      const encrypted = encryptedData.slice(12);

      // 生成密钥
      const encoder = new TextEncoder();
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveBits', 'deriveKey']
      );
      
      const key = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: encoder.encode('salt'),
          iterations: 100000,
          hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        true,
        ['decrypt']
      );

      // 解密
      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        encrypted
      );

      return new TextDecoder().decode(decrypted);
    } catch (e) {
      throw new Error('解密失败，请检查密钥是否正确');
    }
  };

  const handleConvert = async () => {
    setError('');
    
    if (!input.trim()) {
      setError('请输入要处理的文本');
      return;
    }
    
    if (!key.trim()) {
      setError('请输入密钥');
      return;
    }

    try {
      if (mode === 'encrypt') {
        const result = await encryptAES(input, key);
        setOutput(result);
      } else {
        const result = await decryptAES(input, key);
        setOutput(result);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : '操作失败');
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setKey('');
    setError('');
  };

  const generateRandomKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setKey(result);
  };

  return (
    <section className="stack prose">
      <h2>AES 加密/解密工具</h2>
      
      <Usage
        title="如何使用"
        steps={[
          '选择加密或解密模式',
          '输入密钥（或点击生成随机密钥）',
          '在输入框中粘贴要处理的文本',
          '点击"转换"按钮获得结果',
          '使用"复制"按钮复制结果'
        ]}
        tips={[
          '加密：将明文转换为密文',
          '解密：将密文转换回明文',
          '请妥善保管密钥，密钥丢失将无法解密'
        ]}
      />

      <Examples
        items={[
          { title: '简单文本', text: 'Hello World' },
          { title: '中文内容', text: '这是一个测试文本' },
          { title: 'JSON数据', text: '{"name": "test", "value": 123}' }
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
                  className={`btn ${mode === 'encrypt' ? 'primary' : ''}`}
                  onClick={() => setMode('encrypt')}
                  style={{ fontSize: '12px', padding: '6px 12px' }}
                >
                  加密
                </button>
                <button
                  className={`btn ${mode === 'decrypt' ? 'primary' : ''}`}
                  onClick={() => setMode('decrypt')}
                  style={{ fontSize: '12px', padding: '6px 12px' }}
                >
                  解密
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 'bold' }}>
                密钥
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="输入密钥..."
                  style={{ flex: 1, padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                />
                <button 
                  className="btn" 
                  onClick={generateRandomKey}
                  style={{ fontSize: '12px', padding: '6px 12px' }}
                >
                  生成
                </button>
              </div>
            </div>
            
            <textarea
              className="lg"
              rows={8}
              placeholder={mode === 'encrypt' ? '输入要加密的文本...' : '输入要解密的Base64编码...'}
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
              <button className="btn generate" onClick={handleConvert}>
                {mode === 'encrypt' ? '🔒 加密' : '🔓 解密'}
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
        <h3>关于AES加密</h3>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>加密算法</h4>
            <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
              AES-GCM 256位加密，使用PBKDF2密钥派生
            </p>
          </div>
          <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>安全特性</h4>
            <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
              支持认证加密，防止数据篡改
            </p>
          </div>
          <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>输出格式</h4>
            <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
              加密结果以Base64格式输出
            </p>
          </div>
        </div>
        <p style={{ marginTop: '16px', fontSize: '14px' }}>
          AES（高级加密标准）是一种对称加密算法，广泛应用于数据保护。
          本工具使用AES-GCM模式，提供加密和认证双重保护。
        </p>
      </div>

      <ToolDonation />
    </section>
  );
} 
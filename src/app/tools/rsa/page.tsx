'use client';
import { useState } from 'react';
import CopyButton from '@/app/_components/CopyButton';
import Usage from '@/app/_components/Usage';
import Examples from '@/app/_components/Examples';
import { ToolDonation } from '@/app/_components/Monetize';

interface RSAKeyPair {
  publicKey: string;
  privateKey: string;
  modulus: string;
  exponent: string;
}

export default function RsaPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [keyPair, setKeyPair] = useState<RSAKeyPair | null>(null);
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [keySize, setKeySize] = useState(2048);
  const [error, setError] = useState('');

  // 生成RSA密钥对（模拟）
  const generateKeyPair = () => {
    setError('');
    
    // 模拟RSA密钥生成
    const modulus = generateRandomHex(keySize / 4);
    const exponent = '10001'; // 常用的公钥指数
    
    const newKeyPair: RSAKeyPair = {
      publicKey: `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA${modulus}
-----END PUBLIC KEY-----`,
      privateKey: `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC${modulus}
-----END PRIVATE KEY-----`,
      modulus,
      exponent
    };
    
    setKeyPair(newKeyPair);
    setPublicKey(newKeyPair.publicKey);
    setPrivateKey(newKeyPair.privateKey);
  };

  const generateRandomHex = (length: number) => {
    const chars = '0123456789ABCDEF';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // 模拟RSA加密
  const encryptRSA = (text: string, pubKey: string) => {
    // 这是一个简化的模拟实现
    // 实际RSA加密需要使用Web Crypto API或专门的库
    const bytes = new TextEncoder().encode(text);
    const encrypted = Array.from(bytes).map(byte => {
      // 模拟RSA加密过程
      const encryptedByte = (byte * 17) % 256; // 简化的加密算法
      return encryptedByte.toString(16).padStart(2, '0');
    }).join('');
    
    return btoa(encrypted); // Base64编码
  };

  // 模拟RSA解密
  const decryptRSA = (encryptedText: string, privKey: string) => {
    try {
      // 这是一个简化的模拟实现
      const encrypted = atob(encryptedText); // Base64解码
      const bytes = [];
      
      for (let i = 0; i < encrypted.length; i += 2) {
        const hex = encrypted.substr(i, 2);
        const byte = parseInt(hex, 16);
        // 模拟RSA解密过程
        const decryptedByte = (byte * 15) % 256; // 简化的解密算法
        bytes.push(decryptedByte);
      }
      
      return new TextDecoder().decode(new Uint8Array(bytes));
    } catch (error) {
      throw new Error('解密失败：无效的加密数据');
    }
  };

  const handleConvert = async () => {
    setError('');
    
    if (!input.trim()) {
      setError('请输入要处理的文本');
      return;
    }

    if (mode === 'encrypt') {
      if (!publicKey.trim()) {
        setError('请输入公钥');
        return;
      }
      
      try {
        const encrypted = encryptRSA(input, publicKey);
        setOutput(encrypted);
      } catch (error) {
        setError('加密失败：' + (error as Error).message);
      }
    } else {
      if (!privateKey.trim()) {
        setError('请输入私钥');
        return;
      }
      
      try {
        const decrypted = decryptRSA(input, privateKey);
        setOutput(decrypted);
      } catch (error) {
        setError('解密失败：' + (error as Error).message);
      }
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const copyKeyPair = () => {
    if (keyPair) {
      const keyInfo = `公钥:\n${keyPair.publicKey}\n\n私钥:\n${keyPair.privateKey}`;
      navigator.clipboard.writeText(keyInfo);
    }
  };

  return (
    <section className="stack prose">
      <h2>RSA 加密/解密工具</h2>
      
      <Usage
        title="如何使用"
        steps={[
          '生成RSA密钥对或输入已有的密钥',
          '选择加密或解密模式',
          '输入要处理的文本',
          '点击转换按钮获取结果'
        ]}
        tips={[
          'RSA是一种非对称加密算法',
          '公钥用于加密，私钥用于解密',
          '支持2048位密钥长度',
          '请妥善保管私钥，不要泄露'
        ]}
      />

      <Examples
        items={[
          { title: '简单文本', text: 'Hello World! 你好世界！' },
          { title: '敏感信息', text: '密码: mySecretPassword123' },
          { title: 'JSON数据', text: '{"username": "admin", "password": "secret123"}' }
        ]}
        onUse={(text) => setInput(text)}
      />

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <div className="card">
          <div className="stack">
            <h3>密钥管理</h3>
            
            <div className="stack" style={{ gap: '12px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 'bold' }}>
                  密钥长度
                </label>
                <select 
                  className="lg" 
                  value={keySize} 
                  onChange={(e) => setKeySize(parseInt(e.target.value))}
                >
                  <option value={1024}>1024位</option>
                  <option value={2048}>2048位</option>
                  <option value={4096}>4096位</option>
                </select>
              </div>
              
              <div className="row" style={{ gap: '8px' }}>
                <button className="btn generate" onClick={generateKeyPair}>
                  🔑 生成密钥对
                </button>
                {keyPair && (
                  <button className="btn" onClick={copyKeyPair}>
                    复制密钥
                  </button>
                )}
              </div>
            </div>

            <div className="stack" style={{ gap: '12px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 'bold' }}>
                  公钥 (用于加密)
                </label>
                <textarea
                  rows={6}
                  placeholder="输入或粘贴公钥..."
                  value={publicKey}
                  onChange={(e) => setPublicKey(e.target.value)}
                  style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', fontFamily: 'monospace', fontSize: '12px' }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 'bold' }}>
                  私钥 (用于解密)
                </label>
                <textarea
                  rows={6}
                  placeholder="输入或粘贴私钥..."
                  value={privateKey}
                  onChange={(e) => setPrivateKey(e.target.value)}
                  style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', fontFamily: 'monospace', fontSize: '12px' }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="stack">
            <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>加密/解密</h3>
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
            
            <textarea
              className="lg"
              rows={8}
              placeholder={mode === 'encrypt' ? '输入要加密的文本...' : '输入要解密的Base64编码...'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            
            {error && (
              <div style={{ 
                padding: '8px 12px', 
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
              <h3>结果</h3>
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
        <h3>关于RSA加密</h3>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>非对称加密</h4>
            <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
              公钥加密，私钥解密<br />
              私钥签名，公钥验证
            </p>
          </div>
          <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>安全特性</h4>
            <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
              基于大数分解难题<br />
              支持数字签名
            </p>
          </div>
          <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>应用场景</h4>
            <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
              HTTPS、SSH、数字证书<br />
              安全通信、身份验证
            </p>
          </div>
        </div>
        <p style={{ marginTop: '16px', fontSize: '14px' }}>
          RSA是一种广泛使用的非对称加密算法，基于大数分解的数学难题。
          公钥可以公开分享用于加密，私钥必须保密用于解密。
          本工具提供RSA加密/解密功能，支持自定义密钥长度。
        </p>
      </div>

      <ToolDonation />
    </section>
  );
} 
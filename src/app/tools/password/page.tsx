'use client';
import { useState } from 'react';
import CopyButton from '@/app/_components/CopyButton';
import Usage from '@/app/_components/Usage';
import Examples from '@/app/_components/Examples';
import { ToolDonation } from '@/app/_components/Monetize';

export default function PasswordPage() {
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [generatedPasswords, setGeneratedPasswords] = useState<string[]>([]);
  const [count, setCount] = useState(5);

  const generatePassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const similar = 'il1Lo0O';
    const ambiguous = '{}[]()/\\\'"`~,;:.<>';

    let chars = '';
    if (includeUppercase) chars += uppercase;
    if (includeLowercase) chars += lowercase;
    if (includeNumbers) chars += numbers;
    if (includeSymbols) chars += symbols;

    if (excludeSimilar) {
      chars = chars.split('').filter(char => !similar.includes(char)).join('');
    }
    if (excludeAmbiguous) {
      chars = chars.split('').filter(char => !ambiguous.includes(char)).join('');
    }

    if (chars.length === 0) {
      alert('请至少选择一种字符类型');
      return;
    }

    const passwords: string[] = [];
    for (let i = 0; i < count; i++) {
      let password = '';
      for (let j = 0; j < length; j++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      passwords.push(password);
    }

    setGeneratedPasswords(passwords);
  };

  const getPasswordStrength = (password: string): { score: number; label: string; color: string } => {
    let score = 0;
    if (password.match(/[a-z]/)) score++;
    if (password.match(/[A-Z]/)) score++;
    if (password.match(/[0-9]/)) score++;
    if (password.match(/[^a-zA-Z0-9]/)) score++;
    if (password.length >= 12) score++;

    if (score <= 1) return { score, label: '很弱', color: '#ef4444' };
    if (score <= 2) return { score, label: '弱', color: '#f97316' };
    if (score <= 3) return { score, label: '中等', color: '#eab308' };
    if (score <= 4) return { score, label: '强', color: '#22c55e' };
    return { score, label: '很强', color: '#16a34a' };
  };

  const handleClear = () => {
    setGeneratedPasswords([]);
  };

  return (
    <section className="stack prose">
      <h2>密码生成器</h2>
      
      <Usage
        title="如何使用"
        steps={[
          '设置密码长度和字符类型',
          '选择是否排除相似字符和歧义字符',
          '设置生成密码数量',
          '点击"生成密码"按钮',
          '使用"复制"按钮复制密码'
        ]}
        tips={[
          '建议密码长度至少12位',
          '包含多种字符类型可提高安全性',
          '定期更换密码，不要重复使用'
        ]}
      />

      <Examples
        items={[
          { title: '强密码', text: 'Kj9#mN2$pL5@vX8' },
          { title: '中等密码', text: 'MyPassword123' },
          { title: '弱密码', text: 'password' }
        ]}
        onUse={(t) => {
          setGeneratedPasswords([t]);
          setLength(t.length);
        }}
      />

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <div className="card">
          <div className="stack">
            <h3>设置</h3>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                密码长度: {length}
              </label>
              <input
                type="range"
                min="4"
                max="64"
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                生成数量: {count}
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  checked={includeUppercase}
                  onChange={(e) => setIncludeUppercase(e.target.checked)}
                />
                大写字母 (A-Z)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  checked={includeLowercase}
                  onChange={(e) => setIncludeLowercase(e.target.checked)}
                />
                小写字母 (a-z)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                />
                数字 (0-9)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  checked={includeSymbols}
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                />
                特殊字符 (!@#$%^&*)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  checked={excludeSimilar}
                  onChange={(e) => setExcludeSimilar(e.target.checked)}
                />
                排除相似字符 (il1Lo0O)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  checked={excludeAmbiguous}
                  onChange={(e) => setExcludeAmbiguous(e.target.checked)}
                />
                排除歧义字符 ({[]}()/\'")
              </label>
            </div>
            
            <div className="row" style={{ gap: '8px' }}>
              <button className="btn generate" onClick={generatePassword}>
                🔐 生成密码
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
              <h3>生成的密码</h3>
              <CopyButton getText={() => generatedPasswords.join('\n')} />
            </div>
            
            {generatedPasswords.length > 0 ? (
              <div className="stack" style={{ gap: '8px' }}>
                {generatedPasswords.map((password, index) => {
                  const strength = getPasswordStrength(password);
                  return (
                    <div
                      key={index}
                      style={{
                        padding: '12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        background: '#f9fafb'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <code style={{ fontSize: '16px', fontFamily: 'monospace' }}>{password}</code>
                        <span style={{ 
                          fontSize: '12px', 
                          padding: '2px 8px', 
                          borderRadius: '4px', 
                          background: strength.color,
                          color: 'white',
                          fontWeight: 'bold'
                        }}>
                          {strength.label}
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        长度: {password.length} | 强度: {strength.score}/5
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ 
                padding: '40px', 
                textAlign: 'center', 
                color: '#9ca3af',
                border: '2px dashed #e5e7eb',
                borderRadius: '8px'
              }}>
                点击"生成密码"按钮开始生成
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <h3>密码安全建议</h3>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>长度要求</h4>
            <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
              至少12位，推荐16位以上
            </p>
          </div>
          <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>字符类型</h4>
            <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
              包含大小写字母、数字、特殊字符
            </p>
          </div>
          <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>避免使用</h4>
            <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
              个人信息、常见词汇、连续字符
            </p>
          </div>
        </div>
        <p style={{ marginTop: '16px', fontSize: '14px' }}>
          强密码是保护账户安全的第一道防线。建议为不同账户使用不同的密码，
          并定期更换密码。可以使用密码管理器来安全地存储和管理密码。
        </p>
      </div>

      <ToolDonation />
    </section>
  );
} 
'use client';
import { useState } from 'react';
import CopyButton from '@/app/_components/CopyButton';
import Usage from '@/app/_components/Usage';
import Examples from '@/app/_components/Examples';
import { ToolDonation } from '@/app/_components/Monetize';

export default function TextDedupPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'lines' | 'words' | 'chars'>('lines');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [sortOutput, setSortOutput] = useState(false);

  const handleDedup = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      let result = '';
      
      if (mode === 'lines') {
        // 按行去重
        let lines = input.split('\n').filter(line => line.trim() !== '');
        
        if (!caseSensitive) {
          const seen = new Set();
          lines = lines.filter(line => {
            const lowerLine = line.toLowerCase();
            if (seen.has(lowerLine)) {
              return false;
            }
            seen.add(lowerLine);
            return true;
          });
        } else {
          const seen = new Set();
          lines = lines.filter(line => {
            if (seen.has(line)) {
              return false;
            }
            seen.add(line);
            return true;
          });
        }
        
        if (sortOutput) {
          lines.sort();
        }
        
        result = lines.join('\n');
      } else if (mode === 'words') {
        // 按单词去重
        const words = input.split(/\s+/).filter(word => word.trim() !== '');
        
        if (!caseSensitive) {
          const seen = new Set();
          const uniqueWords = words.filter(word => {
            const lowerWord = word.toLowerCase();
            if (seen.has(lowerWord)) {
              return false;
            }
            seen.add(lowerWord);
            return true;
          });
          
          if (sortOutput) {
            uniqueWords.sort();
          }
          
          result = uniqueWords.join(' ');
        } else {
          const seen = new Set();
          const uniqueWords = words.filter(word => {
            if (seen.has(word)) {
              return false;
            }
            seen.add(word);
            return true;
          });
          
          if (sortOutput) {
            uniqueWords.sort();
          }
          
          result = uniqueWords.join(' ');
        }
      } else if (mode === 'chars') {
        // 按字符去重
        const chars = input.split('');
        
        if (!caseSensitive) {
          const seen = new Set();
          const uniqueChars = chars.filter(char => {
            const lowerChar = char.toLowerCase();
            if (seen.has(lowerChar)) {
              return false;
            }
            seen.add(lowerChar);
            return true;
          });
          
          if (sortOutput) {
            uniqueChars.sort();
          }
          
          result = uniqueChars.join('');
        } else {
          const seen = new Set();
          const uniqueChars = chars.filter(char => {
            if (seen.has(char)) {
              return false;
            }
            seen.add(char);
            return true;
          });
          
          if (sortOutput) {
            uniqueChars.sort();
          }
          
          result = uniqueChars.join('');
        }
      }
      
      setOutput(result);
    } catch (e) {
      setOutput('处理失败');
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  const getStats = () => {
    if (!input.trim()) return null;
    
    const lines = input.split('\n').filter(line => line.trim() !== '');
    const words = input.split(/\s+/).filter(word => word.trim() !== '');
    const chars = input.split('');
    
    const uniqueLines = new Set(caseSensitive ? lines : lines.map(line => line.toLowerCase())).size;
    const uniqueWords = new Set(caseSensitive ? words : words.map(word => word.toLowerCase())).size;
    const uniqueChars = new Set(caseSensitive ? chars : chars.map(char => char.toLowerCase())).size;
    
    return {
      original: { lines: lines.length, words: words.length, chars: chars.length },
      unique: { lines: uniqueLines, words: uniqueWords, chars: uniqueChars }
    };
  };

  const stats = getStats();

  return (
    <section className="stack prose">
      <h2>文本去重工具</h2>
      
      <Usage
        title="如何使用"
        steps={[
          '选择去重模式（按行、按单词、按字符）',
          '设置是否区分大小写',
          '选择是否对结果排序',
          '在输入框中粘贴要处理的文本',
          '点击"去重"按钮获得结果',
          '使用"复制"按钮复制结果'
        ]}
        tips={[
          '按行去重：删除重复的行',
          '按单词去重：删除重复的单词',
          '按字符去重：删除重复的字符',
          '不区分大小写时，大小写不同的相同内容会被视为重复'
        ]}
      />

      <Examples
        items={[
          { title: '重复行', text: 'apple\nbanana\napple\ncherry\nbanana' },
          { title: '重复单词', text: 'hello world hello test world' },
          { title: '重复字符', text: 'hello world' }
        ]}
        onUse={(t) => setInput(t)}
      />

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <div className="card">
          <div className="stack">
            <h3>输入</h3>
            
            <div className="stack" style={{ gap: '12px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 'bold' }}>
                  去重模式
                </label>
                <select 
                  className="lg" 
                  value={mode} 
                  onChange={(e) => setMode(e.target.value as any)}
                >
                  <option value="lines">按行去重</option>
                  <option value="words">按单词去重</option>
                  <option value="chars">按字符去重</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={caseSensitive}
                    onChange={(e) => setCaseSensitive(e.target.checked)}
                  />
                  <span style={{ fontSize: '14px' }}>区分大小写</span>
                </label>
                
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={sortOutput}
                    onChange={(e) => setSortOutput(e.target.checked)}
                  />
                  <span style={{ fontSize: '14px' }}>排序结果</span>
                </label>
              </div>
            </div>
            
            <textarea
              className="lg"
              rows={8}
              placeholder="输入要处理的文本..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            
            {stats && (
              <div style={{ 
                padding: '8px', 
                background: '#f3f4f6', 
                border: '1px solid #d1d5db', 
                borderRadius: '4px',
                fontSize: '12px'
              }}>
                <div>原始：{stats.original.lines}行, {stats.original.words}词, {stats.original.chars}字符</div>
                <div>去重后：{stats.unique.lines}行, {stats.unique.words}词, {stats.unique.chars}字符</div>
              </div>
            )}
            
            <div className="row" style={{ gap: '8px' }}>
              <button className="btn generate" onClick={handleDedup}>
                🔄 去重
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
              placeholder="去重结果将显示在这里..."
              value={output}
              readOnly
            />
          </div>
        </div>
      </div>

      <div className="card">
        <h3>去重模式说明</h3>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>按行去重</h4>
            <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
              删除重复的行，保留每行的第一次出现
            </p>
          </div>
          <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>按单词去重</h4>
            <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
              删除重复的单词，保留每个单词的第一次出现
            </p>
          </div>
          <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>按字符去重</h4>
            <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
              删除重复的字符，保留每个字符的第一次出现
            </p>
          </div>
        </div>
        <p style={{ marginTop: '16px', fontSize: '14px' }}>
          文本去重工具可以帮助清理重复内容，提高文本质量。
          支持多种去重模式，满足不同的处理需求。
        </p>
      </div>

      <ToolDonation />
    </section>
  );
} 
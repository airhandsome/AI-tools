'use client';
import { useState, useEffect } from 'react';
import CopyButton from '@/app/_components/CopyButton';
import Usage from '@/app/_components/Usage';
import Examples from '@/app/_components/Examples';
import { ToolDonation } from '@/app/_components/Monetize';

interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  lines: number;
  paragraphs: number;
  sentences: number;
  bytes: number;
  readingTime: number;
  speakingTime: number;
  uniqueWords: number;
  wordFrequency: { [key: string]: number };
  topWords: Array<{ word: string; count: number }>;
}

export default function TextStatsPage() {
  const [input, setInput] = useState('');
  const [stats, setStats] = useState<TextStats | null>(null);

  const calculateStats = (text: string): TextStats => {
    if (!text.trim()) {
      return {
        characters: 0,
        charactersNoSpaces: 0,
        words: 0,
        lines: 0,
        paragraphs: 0,
        sentences: 0,
        bytes: 0,
        readingTime: 0,
        speakingTime: 0,
        uniqueWords: 0,
        wordFrequency: {},
        topWords: []
      };
    }

    // 基础统计
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const lines = text.split('\n').length;
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).length;
    
    // 句子统计（支持中英文标点）
    const sentences = text.split(/[.!?。！？\n]+/).filter(s => s.trim()).length;
    
    // 字节统计（UTF-8编码）
    const bytes = new TextEncoder().encode(text).length;
    
    // 单词统计（支持中英文）
    const words = text.trim() ? text.split(/\s+/).filter(word => word.trim()).length : 0;
    
    // 词频统计
    const wordFrequency: { [key: string]: number } = {};
    const wordMatches = text.match(/[\u4e00-\u9fa5]+|[a-zA-Z]+/g) || [];
    
    wordMatches.forEach(word => {
      const lowerWord = word.toLowerCase();
      wordFrequency[lowerWord] = (wordFrequency[lowerWord] || 0) + 1;
    });
    
    const uniqueWords = Object.keys(wordFrequency).length;
    
    // 高频词汇（前10）
    const topWords = Object.entries(wordFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word, count]) => ({ word, count }));
    
    // 时间估算
    const readingTime = Math.ceil(words / 200); // 每分钟200词
    const speakingTime = Math.ceil(words / 150); // 每分钟150词

    return {
      characters,
      charactersNoSpaces,
      words,
      lines,
      paragraphs,
      sentences,
      bytes,
      readingTime,
      speakingTime,
      uniqueWords,
      wordFrequency,
      topWords
    };
  };

  useEffect(() => {
    const newStats = calculateStats(input);
    setStats(newStats);
  }, [input]);

  const handleClear = () => {
    setInput('');
    setStats(null);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <section className="stack prose">
      <h2>文本统计工具</h2>
      
      <Usage
        title="如何使用"
        steps={[
          '在文本框中输入或粘贴要分析的文本',
          '系统实时显示各种统计信息',
          '查看基础统计、高级统计和词频分析',
          '复制统计结果或文本内容'
        ]}
        tips={[
          '支持中英文混合文本分析',
          '实时统计，无需手动计算',
          '提供阅读时间和说话时间估算',
          '显示高频词汇和词频分布'
        ]}
      />

      <Examples
        items={[
          { title: '中文文章', text: '人工智能是计算机科学的一个分支，它企图了解智能的实质，并生产出一种新的能以人类智能相似的方式做出反应的智能机器。该领域的研究包括机器人、语言识别、图像识别、自然语言处理和专家系统等。' },
          { title: '英文文档', text: 'Artificial Intelligence (AI) is a branch of computer science that aims to understand the essence of intelligence and produce a new type of intelligent machine that can react in ways similar to human intelligence. Research in this field includes robotics, speech recognition, image recognition, natural language processing, and expert systems.' },
          { title: '混合文本', text: 'Hello World! 你好世界！\n\nThis is a mixed text with both English and Chinese characters. 这是一个包含英文和中文的混合文本。\n\nIt can help you analyze the statistics of different languages. 它可以帮助你分析不同语言的统计信息。' }
        ]}
        onUse={(text) => setInput(text)}
      />

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <div className="card">
          <div className="stack">
            <h3>输入文本</h3>
            <textarea 
              className="lg" 
              rows={12} 
              placeholder="输入或粘贴要分析的文本..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <div className="row" style={{ gap: '8px' }}>
              <button className="btn" onClick={handleClear}>
                清空
              </button>
              <CopyButton getText={() => input} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="stack">
            <h3>统计结果</h3>
            {stats ? (
              <div className="stack" style={{ gap: '16px' }}>
                {/* 基础统计 */}
                <div>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>基础统计</h4>
                  <div style={{ 
                    padding: '12px', 
                    background: '#f3f4f6', 
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <div><strong>字符数:</strong> {stats.characters}</div>
                      <div><strong>字符数(无空格):</strong> {stats.charactersNoSpaces}</div>
                      <div><strong>单词数:</strong> {stats.words}</div>
                      <div><strong>行数:</strong> {stats.lines}</div>
                      <div><strong>段落数:</strong> {stats.paragraphs}</div>
                      <div><strong>句子数:</strong> {stats.sentences}</div>
                    </div>
                  </div>
                </div>

                {/* 高级统计 */}
                <div>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>高级统计</h4>
                  <div style={{ 
                    padding: '12px', 
                    background: '#f3f4f6', 
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <div><strong>文件大小:</strong> {formatBytes(stats.bytes)}</div>
                      <div><strong>唯一词汇:</strong> {stats.uniqueWords}</div>
                      <div><strong>阅读时间:</strong> {stats.readingTime} 分钟</div>
                      <div><strong>说话时间:</strong> {stats.speakingTime} 分钟</div>
                    </div>
                  </div>
                </div>

                {/* 高频词汇 */}
                {stats.topWords.length > 0 && (
                  <div>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>高频词汇 (前10)</h4>
                    <div style={{ 
                      padding: '12px', 
                      background: '#f3f4f6', 
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}>
                      {stats.topWords.map((item, index) => (
                        <div key={index} style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          marginBottom: '4px',
                          padding: '4px 8px',
                          background: index < 3 ? '#e0f2fe' : 'transparent',
                          borderRadius: '4px'
                        }}>
                          <span>{item.word}</span>
                          <span style={{ fontWeight: 'bold' }}>{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ 
                padding: '40px', 
                textAlign: 'center', 
                color: '#6b7280',
                fontSize: '14px'
              }}>
                输入文本后显示统计结果
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <h3>统计说明</h3>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>字符统计</h4>
            <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
              包含所有字符，包括空格、标点符号等
            </p>
          </div>
          <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>时间估算</h4>
            <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
              阅读时间：每分钟200词<br />
              说话时间：每分钟150词
            </p>
          </div>
          <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>词频分析</h4>
            <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
              统计每个词汇的出现次数，支持中英文
            </p>
          </div>
        </div>
        <p style={{ marginTop: '16px', fontSize: '14px' }}>
          文本统计工具可以帮助分析文本的基本特征，包括字符数、单词数、行数等基础信息，
          以及阅读时间、词频分析等高级统计功能。
        </p>
      </div>

      <ToolDonation />
    </section>
  );
} 
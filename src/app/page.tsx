'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';

type Tool = { href: string; title: string; desc: string; keywords?: string[] };

function fuzzyScore(query: string, text: string): number {
  if (!query) return 0;
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  // Exact/substring boosts
  if (t === q) return 1000;
  if (t.includes(q)) return 600 + Math.max(0, 50 - (t.indexOf(q) || 0));
  // Simple subsequence scoring
  let score = 0;
  let ti = 0;
  for (let i = 0; i < q.length; i++) {
    const ch = q[i];
    const idx = t.indexOf(ch, ti);
    if (idx === -1) { score -= 5; continue; }
    // closer characters -> higher score
    score += 20 - Math.min(19, idx - ti);
    ti = idx + 1;
  }
  return score;
}

export default function HomePage() {
  const aiTools: Tool[] = [
    { href: '/tools/rewrite', title: '文本润色与风格转换', desc: '输入文本，选择风格，一键重写' },
    { href: '/tools/code-explain', title: '代码解释与简化', desc: '用通俗语言解释/优化代码', keywords: ['code','explain','refactor'] },
    { href: '/tools/translate', title: '翻译校对与本地化', desc: '多语翻译与语气一致性', keywords: ['translate','localization','glossary'] },
    { href: '/tools/summary', title: '长文摘要与要点', desc: 'URL/文本 → 摘要与要点', keywords: ['summary','outline'] },
    { href: '/tools/regex', title: '正则生成与解释', desc: 'NL→Regex / Regex→解释', keywords: ['regex','regular expression'] },
    { href: '/tools/sql', title: 'SQL 生成与解释', desc: '方言切换，结构示例', keywords: ['sql','query'] },
    { href: '/tools/excel', title: 'Excel/Sheets 公式助手', desc: '描述→公式，解释与修复', keywords: ['excel','sheets','formula'] },
    { href: '/tools/resume', title: '简历优化与JD匹配', desc: '评分与改写建议', keywords: ['resume','cv','job'] },
    { href: '/tools/social-tags', title: '社媒标签与Emoji', desc: '主题→平台化标签', keywords: ['social','tags','emoji'] },
    { href: '/tools/palette', title: '配色方案生成器', desc: '主题→5-6色配色，支持锁定', keywords: ['color','palette'] },
    { href: '/tools/slogan', title: '口号/标题生成器', desc: '产品名称+描述→10条备选', keywords: ['slogan','title'] },
    { href: '/tools/ui-snippet', title: '描述→UI片段', desc: '生成 HTML/Tailwind 组件', keywords: ['ui','component','tailwind'] },
    { href: '/tools/outline', title: '思维导图/大纲', desc: '主题→多层级 Markdown 大纲', keywords: ['outline','mindmap'] },
    { href: '/tools/svg-icon', title: 'SVG图标生成器', desc: '描述→参数化SVG图标', keywords: ['svg','icon','vector'] },
    { href: '/tools/calendar', title: '营销计划/内容日历', desc: '行业+目标→30日内容主题', keywords: ['calendar','marketing','content'] },
    { href: '/tools/website-iq', title: '网站"智商检测器"', desc: 'URL分析业务价值与改进建议', keywords: ['website','analysis','business'] },
    { href: '/tools/prompt-optimizer', title: 'AI绘画提示词优化器', desc: '短想法→专业绘画提示词', keywords: ['ai','art','prompt','midjourney'] },
    { href: '/tools/listing-optimizer', title: '电商Listing优化器', desc: '商品页优化提升转化率', keywords: ['ecommerce','listing','amazon','optimization'] }
  ];

  const basicTools: Tool[] = [
    // 编码转换工具
    { href: '/tools/base64', title: 'Base64 编码/解码', desc: '文本、图片转Base64编码', keywords: ['base64','encode','decode'] },
    { href: '/tools/url-encode', title: 'URL 编码/解码', desc: 'URL特殊字符转义处理', keywords: ['url','encode','decode','escape'] },
    { href: '/tools/html-entities', title: 'HTML 实体编码', desc: 'HTML特殊字符编码转换', keywords: ['html','entities','encode'] },
    { href: '/tools/unicode', title: 'Unicode 编码转换', desc: 'Unicode与文本互转', keywords: ['unicode','encode','decode'] },
    { href: '/tools/hex', title: 'Hex 编码转换', desc: '十六进制编码转换', keywords: ['hex','encode','decode'] },
    
    // 加密解密工具
    { href: '/tools/hash', title: '哈希计算器', desc: 'MD5、SHA1、SHA256等哈希计算', keywords: ['hash','md5','sha','encrypt'] },
    { href: '/tools/aes', title: 'AES 加密/解密', desc: 'AES对称加密解密工具', keywords: ['aes','encrypt','decrypt','symmetric'] },
    { href: '/tools/rsa', title: 'RSA 加密/解密', desc: 'RSA非对称加密解密', keywords: ['rsa','encrypt','decrypt','asymmetric'] },
    { href: '/tools/password', title: '密码生成器', desc: '生成强密码和随机字符串', keywords: ['password','generator','random'] },
    
    // 时间日期工具
    { href: '/tools/timestamp', title: '时间戳转换', desc: 'Unix时间戳与日期互转', keywords: ['timestamp','unix','date','time'] },
    { href: '/tools/timezone', title: '时区转换器', desc: '不同时区时间对比转换', keywords: ['timezone','convert','time'] },
    { href: '/tools/date-calc', title: '日期计算器', desc: '日期加减、间隔计算', keywords: ['date','calculator','interval'] },
    
    // 文本处理工具
    { href: '/tools/text-case', title: '文本大小写转换', desc: '大小写、首字母大写转换', keywords: ['text','case','uppercase','lowercase'] },
    { href: '/tools/text-dedup', title: '文本去重工具', desc: '删除重复行和重复内容', keywords: ['text','deduplicate','remove','duplicate'] },
    { href: '/tools/text-stats', title: '文本统计工具', desc: '字符数、单词数、行数统计', keywords: ['text','statistics','count','words'] },
    { href: '/tools/text-diff', title: '文本对比工具', desc: '两段文本差异对比', keywords: ['text','diff','compare','difference'] },
    { href: '/tools/json', title: 'JSON 格式化', desc: 'JSON美化、压缩、验证', keywords: ['json','format','beautify','minify'] },
    { href: '/tools/xml', title: 'XML 格式化', desc: 'XML美化、压缩、验证', keywords: ['xml','format','beautify','minify'] },
    
    // 数据转换工具
    { href: '/tools/json-csv', title: 'JSON ↔ CSV 转换', desc: 'JSON与CSV格式互转', keywords: ['json','csv','convert','data'] },
    { href: '/tools/json-yaml', title: 'JSON ↔ YAML 转换', desc: 'JSON与YAML格式互转', keywords: ['json','yaml','convert','config'] },
    { href: '/tools/sql-format', title: 'SQL 格式化', desc: 'SQL语句美化、格式化', keywords: ['sql','format','beautify'] },
    
    // 图片处理工具
    { href: '/tools/image-compress', title: '图片压缩工具', desc: '在线压缩图片文件', keywords: ['image','compress','optimize'] },
    { href: '/tools/image-convert', title: '图片格式转换', desc: 'JPG/PNG/WEBP格式转换', keywords: ['image','convert','format'] },
    { href: '/tools/image-base64', title: '图片Base64转换', desc: '图片转Base64编码', keywords: ['image','base64','encode'] },
    { href: '/tools/qrcode', title: '二维码生成器', desc: '生成和解码二维码', keywords: ['qrcode','qr','generate','decode'] },
    
    // 网络工具
    { href: '/tools/ip', title: 'IP 地址查询', desc: '查询IP地址和地理位置', keywords: ['ip','address','location','geo'] },
    { href: '/tools/dns', title: 'DNS 查询工具', desc: '域名解析和WHOIS信息', keywords: ['dns','domain','whois','resolve'] },
    { href: '/tools/port-scan', title: '端口扫描器', desc: '检测常用端口状态', keywords: ['port','scan','network','check'] },
    { href: '/tools/http-test', title: 'HTTP 请求测试', desc: 'GET/POST请求在线测试', keywords: ['http','request','test','api'] },
    
    // 开发辅助工具
    { href: '/tools/regex-test', title: '正则表达式测试', desc: '在线正则表达式测试工具', keywords: ['regex','regular','expression','test'] },
    { href: '/tools/color', title: '颜色选择器', desc: 'RGB/HEX/HSL颜色转换', keywords: ['color','picker','rgb','hex','hsl'] },
    { href: '/tools/css-minify', title: 'CSS 压缩工具', desc: 'CSS代码压缩和格式化', keywords: ['css','minify','compress'] },
    { href: '/tools/js-minify', title: 'JS 压缩工具', desc: 'JavaScript代码压缩', keywords: ['javascript','js','minify','compress'] },
    
    // 数学计算工具
    { href: '/tools/base-convert', title: '进制转换器', desc: '二进制、八进制、十进制、十六进制转换', keywords: ['base','convert','binary','hex','octal'] },
    { href: '/tools/unit-convert', title: '单位转换器', desc: '长度、重量、温度等单位转换', keywords: ['unit','convert','length','weight','temperature'] },
    { href: '/tools/currency', title: '汇率转换器', desc: '实时汇率计算转换', keywords: ['currency','exchange','rate','convert'] },
    { href: '/tools/percentage', title: '百分比计算器', desc: '百分比相关计算工具', keywords: ['percentage','calculate','percent'] },
    
    // 文件工具
    { href: '/tools/file-hash', title: '文件哈希计算', desc: '计算文件MD5/SHA哈希值', keywords: ['file','hash','md5','sha','checksum'] },
    { href: '/tools/file-size', title: '文件大小转换', desc: 'B/KB/MB/GB单位转换', keywords: ['file','size','convert','bytes'] },
    { href: '/tools/file-type', title: '文件类型检测', desc: '根据内容判断文件类型', keywords: ['file','type','detect','mime'] }
  ];

  const [q, setQ] = useState('');
  const [activeTab, setActiveTab] = useState<'ai' | 'basic'>('ai');
  
  const aiResults = useMemo(() => {
    if (!q.trim()) return aiTools;
    const scored = aiTools.map(t => {
      const text = `${t.title} ${t.desc} ${(t.keywords||[]).join(' ')}`;
      const score = fuzzyScore(q.trim(), text);
      return { t, score };
    }).filter(r => r.score > 0);
    scored.sort((a,b) => b.score - a.score);
    return scored.map(r => r.t);
  }, [q, aiTools]);

  const basicResults = useMemo(() => {
    if (!q.trim()) return basicTools;
    const scored = basicTools.map(t => {
      const text = `${t.title} ${t.desc} ${(t.keywords||[]).join(' ')}`;
      const score = fuzzyScore(q.trim(), text);
      return { t, score };
    }).filter(r => r.score > 0);
    scored.sort((a,b) => b.score - a.score);
    return scored.map(r => r.t);
  }, [q, basicTools]);

  const bmcId = process.env.NEXT_PUBLIC_BMC_ID;

  return (
    <section className="stack">
      <h1>AI 工具栈</h1>
      <div className="card" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <input
          className="input lg"
          placeholder="搜索工具名称、功能或关键词（如：SQL、正则、翻译、Base64）"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ flex: 1 }}
        />
        {q && (
          <button className="btn" onClick={() => setQ('')}>清空</button>
        )}
      </div>

      {/* 捐赠按钮区域 */}
      {bmcId && (
        <div className="card" style={{ 
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          border: '2px solid #3b82f6',
          textAlign: 'center',
          padding: '24px',
          marginBottom: '20px'
        }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#fff' }}>
            ☕ 如果这些工具对你有帮助，请支持一下
          </h3>
          <p style={{ margin: '0 0 16px 0', color: '#e0e7ff', fontSize: '14px' }}>
            你的支持是我持续开发和维护的动力
          </p>
          <a 
            href={`https://www.buymeacoffee.com/${bmcId}`} 
            target="_blank" 
            rel="noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#fff',
              color: '#3b82f6',
              padding: '12px 24px',
              borderRadius: '25px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '16px',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
            }}
          >
            ☕ 支持一下
          </a>
        </div>
      )}

      {/* 工具分类标签 */}
      <div className="card" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className={`btn ${activeTab === 'ai' ? 'primary' : ''}`}
            onClick={() => setActiveTab('ai')}
            style={{ 
              background: activeTab === 'ai' ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : '#f3f4f6',
              color: activeTab === 'ai' ? '#fff' : '#374151'
            }}
          >
            🤖 AI 工具 ({aiResults.length})
          </button>
          <button
            className={`btn ${activeTab === 'basic' ? 'primary' : ''}`}
            onClick={() => setActiveTab('basic')}
            style={{ 
              background: activeTab === 'basic' ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : '#f3f4f6',
              color: activeTab === 'basic' ? '#fff' : '#374151'
            }}
          >
            🛠️ 基础工具 ({basicResults.length})
          </button>
        </div>
      </div>

      {/* 工具网格 */}
      <div className="grid">
        {activeTab === 'ai' ? (
          aiResults.length > 0 ? (
            aiResults.map((t) => (
              <a key={t.href} href={t.href} className="card hover-raise" style={{ textDecoration: 'none', color: 'inherit' }}>
                <h3 style={{ marginTop: 0 }}>{t.title}</h3>
                <p style={{ opacity: .9 }}>{t.desc}</p>
              </a>
            ))
          ) : (
            <div className="card">未找到匹配的AI工具，试试其他关键词</div>
          )
        ) : (
          basicResults.length > 0 ? (
            basicResults.map((t) => (
              <a key={t.href} href={t.href} className="card hover-raise" style={{ textDecoration: 'none', color: 'inherit' }}>
                <h3 style={{ marginTop: 0 }}>{t.title}</h3>
                <p style={{ opacity: .9 }}>{t.desc}</p>
              </a>
            ))
          ) : (
            <div className="card">未找到匹配的基础工具，试试其他关键词</div>
          )
        )}
      </div>
    </section>
  );
}


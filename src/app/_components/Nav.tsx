'use client';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

export default function Nav() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const timeoutRefs = useRef<{ [key: string]: NodeJS.Timeout | null }>({});

  // 延迟关闭下拉菜单
  const handleMouseLeave = (dropdownKey: string) => {
    timeoutRefs.current[dropdownKey] = setTimeout(() => {
      setActiveDropdown(null);
    }, 300); // 300ms延迟，给用户足够时间移动到子菜单
  };

  // 取消延迟关闭
  const handleMouseEnter = (dropdownKey: string) => {
    if (timeoutRefs.current[dropdownKey]) {
      clearTimeout(timeoutRefs.current[dropdownKey]!);
      timeoutRefs.current[dropdownKey] = null;
    }
    setActiveDropdown(dropdownKey);
  };

  // 点击切换展开/折叠（用于移动端或需要点击交互的场景）
  const handleToggleClick = (dropdownKey: string) => {
    console.log('handleToggleClick', dropdownKey, timeoutRefs.current[dropdownKey]);
    if (timeoutRefs.current[dropdownKey]) {
      clearTimeout(timeoutRefs.current[dropdownKey]!);
      timeoutRefs.current[dropdownKey] = null;
    }
    setActiveDropdown(prev => (prev === dropdownKey ? null : dropdownKey));    
  };

  // 清理定时器
  useEffect(() => {
    return () => {
      Object.values(timeoutRefs.current).forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });
    };
  }, []);

  const tools: { [key: string]: Array<{ name: string; href: string }> } = {
    'AI工具': [
      { name: '文本润色与风格转换', href: '/tools/rewrite' },
      { name: '代码解释器', href: '/tools/code-explain' },
      { name: '多语言翻译器', href: '/tools/translate' },
      { name: '智能摘要生成器', href: '/tools/summary' },
      { name: '正则表达式生成器', href: '/tools/regex' },
      { name: 'SQL查询生成器', href: '/tools/sql' },
      { name: 'Excel公式生成器', href: '/tools/excel' },
      { name: '简历优化与JD匹配', href: '/tools/resume' },
      { name: '社交媒体标签生成器', href: '/tools/social-tags' }
    ],
    '设计工具': [
      { name: 'AI颜色方案生成器', href: '/tools/palette' },
      { name: 'AI小标题/口号生成器', href: '/tools/slogan' },
      { name: '前端UI片段生成器', href: '/tools/ui-snippet' },
      { name: '思维导图/大纲生成器', href: '/tools/outline' },
      { name: 'SVG图标生成器', href: '/tools/svg-icon' },
      { name: '营销计划/内容日历', href: '/tools/calendar' }
    ],
    '高级工具': [
      { name: '网站"智商检测器"', href: '/tools/website-iq' },
      { name: 'AI绘画提示词优化器', href: '/tools/prompt-optimizer' },
      { name: '电商Listing优化器', href: '/tools/listing-optimizer' }
    ],
    '基础工具': [
      { name: 'Base64 编码/解码', href: '/tools/base64' },
      { name: 'URL 编码/解码', href: '/tools/url-encode' },
      { name: 'HTML 实体编码', href: '/tools/html-entities' },
      { name: 'Unicode 编码转换', href: '/tools/unicode' },
      { name: 'Hex 编码转换', href: '/tools/hex' },
      { name: '哈希计算器', href: '/tools/hash' },
      { name: 'AES 加密/解密', href: '/tools/aes' },
      { name: 'RSA 加密/解密', href: '/tools/rsa' },
      { name: '密码生成器', href: '/tools/password' },
      { name: '时间戳转换', href: '/tools/timestamp' },
      { name: '日期计算器', href: '/tools/date-calc' },
      { name: '时区转换器', href: '/tools/timezone' },
      { name: '文本大小写转换', href: '/tools/text-case' },
      { name: '文本去重工具', href: '/tools/text-dedup' },
      { name: '文本统计工具', href: '/tools/text-stats' },
      { name: 'JSON 格式化', href: '/tools/json' },
      { name: '进制转换器', href: '/tools/base-convert' },
      { name: '文件大小转换', href: '/tools/file-size' },
      { name: '文件类型检测', href: '/tools/file-type' },
      { name: '颜色选择器', href: '/tools/color' }
    ]
  };

  return (
    <header className="site-header">
      <div className="container">
        <nav>
          <Link href="/" className="brand">
            AI工具栈
          </Link>
          
          <Link href="/" className="nav-home">
            首页
          </Link>

          {Object.entries(tools).map(([category, items]) => (
            <div
              key={category}
              className="dropdown"
              ref={el => dropdownRefs.current[category] = el}
              onMouseEnter={() => handleMouseEnter(category)}
              onMouseLeave={() => handleMouseLeave(category)}
            >
              <div
                className="dropdown-title"
                role="button"
                tabIndex={0}
                onClick={() => handleToggleClick(category)}
              >
                {category}
              </div>
              <div 
                className={`dropdown-content ${activeDropdown === category ? 'active' : ''}`}
                onMouseEnter={() => handleMouseEnter(category)}
                onMouseLeave={() => handleMouseLeave(category)}
              >
                {items.map((tool) => (
                  <Link key={tool.href} href={tool.href as any}>
                    {tool.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </header>
  );
}


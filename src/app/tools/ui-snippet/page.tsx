'use client';
import { useState, useEffect } from 'react';
import { postJson, type ApiResult } from '@/lib/api';
import CopyButton from '@/app/_components/CopyButton';
import Usage from '@/app/_components/Usage';
import Examples from '@/app/_components/Examples';

export default function UiSnippetPage() {
  const [description, setDescription] = useState('一个卡片组件，含图片、标题、描述和按钮');
  const [framework, setFramework] = useState('html+tailwind');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');

  // 页面离开提醒
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (loading) {
        e.preventDefault();
        e.returnValue = '正在生成中，确定要离开吗？';
        return '正在生成中，确定要离开吗？';
      }
    };

    const handlePopState = (e: PopStateEvent) => {
      if (loading) {
        if (!confirm('正在生成中，确定要离开吗？')) {
          e.preventDefault();
          window.history.pushState(null, '', window.location.href);
        }
      }
    };

    if (loading) {
      window.addEventListener('beforeunload', handleBeforeUnload);
      window.addEventListener('popstate', handlePopState);
      window.history.pushState(null, '', window.location.href);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [loading]);

  async function onGenerate() {
    setLoading(true); setError(''); setCode('');
    try {
      const data = await postJson<ApiResult>('/api/tools/ui-snippet', { description, framework });
      if (!data.ok) throw new Error(data.error || '失败');
      setCode(data.content || '');
    } catch (e: any) { setError(e.message || '请求失败'); } finally { setLoading(false); }
  }

  // 提取HTML内容用于预览
  const getPreviewHtml = () => {
    if (!code) return '';
    
    // 根据框架类型生成不同的预览HTML
    if (framework === 'html+tailwind') {
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { margin: 0; padding: 20px; font-family: system-ui, -apple-system, sans-serif; }
          </style>
        </head>
        <body>
          ${code}
        </body>
        </html>
      `;
    } else if (framework === 'html+css') {
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { margin: 0; padding: 20px; font-family: system-ui, -apple-system, sans-serif; }
            ${code.includes('<style>') ? '' : code}
          </style>
        </head>
        <body>
          ${code.includes('<style>') ? code.replace(/<style>[\s\S]*?<\/style>/gi, '') : ''}
        </body>
        </html>
      `;
    } else if (framework === 'react') {
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
          <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { margin: 0; padding: 20px; font-family: system-ui, -apple-system, sans-serif; }
          </style>
        </head>
        <body>
          <div id="root"></div>
          <script type="text/babel">
            try {
              ${code}
              const root = ReactDOM.createRoot(document.getElementById('root'));
              root.render(<App />);
            } catch (error) {
              document.getElementById('root').innerHTML = '<div style="color: red; padding: 20px;">React组件渲染错误: ' + error.message + '</div>';
            }
          </script>
        </body>
        </html>
      `;
    } else if (framework === 'vue') {
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { margin: 0; padding: 20px; font-family: system-ui, -apple-system, sans-serif; }
          </style>
        </head>
        <body>
          <div id="app"></div>
          <script>
            try {
              ${code}
              if (typeof app !== 'undefined') {
                app.mount('#app');
              } else {
                // 创建默认app
                const app = Vue.createApp({
                  template: '<div style="padding: 20px; color: #666;">Vue组件预览</div>',
                  setup() { return {} }
                });
                app.mount('#app');
              }
            } catch (error) {
              document.getElementById('app').innerHTML = '<div style="color: red; padding: 20px;">Vue组件渲染错误，请检查代码语法</div>';
            }
          </script>
        </body>
        </html>
      `;
    }
    
    return code;
  };

  return (
    <section className="stack prose">
      <h2>描述→前端 UI 片段</h2>
      <Examples
        items={[
          { title: '价格卡', text: '价格卡：标题、价格、特性列表、购买按钮' },
          { title: '导航栏', text: '顶部导航：左logo，中间菜单，右登录按钮' },
          { title: '登录窗', text: '登录弹窗：邮箱+密码，忘记密码与提交按钮' }
        ]}
        onUse={(t) => setDescription(t)}
      />
      <Usage
        title="如何使用"
        steps={[
          '用自然语言描述你想要的组件',
          '选择框架（支持HTML+Tailwind、HTML+CSS、React、Vue）',
          '点击生成，查看代码和预览效果'
        ]}
      />
      <div className="stack">
        <div className="card stack">
          <textarea className="lg" rows={6} placeholder="描述组件" value={description} onChange={(e) => setDescription(e.target.value)} />
          <div className="row">
            <select className="lg" value={framework} onChange={(e) => setFramework(e.target.value)}>
              <option value="html+tailwind">HTML+Tailwind</option>
              <option value="html+css">HTML+CSS</option>
              <option value="react">React</option>
              <option value="vue">Vue 3</option>
            </select>
            <button 
              className={`btn generate ${loading ? 'loading' : ''}`}
              onClick={onGenerate} 
              disabled={loading || !description}
            >
              {loading ? '生成中…' : '🚀 生成代码'}
            </button>
            <button 
              className="btn" 
              onClick={() => {
                const testCodes = {
                  'html+tailwind': '<div class="bg-blue-500 text-white p-4 rounded-lg">Hello Tailwind!</div>',
                  'html+css': '<div style="background: blue; color: white; padding: 16px; border-radius: 8px;">Hello CSS!</div>',
                  'react': 'function App() { return <div style={{background: "blue", color: "white", padding: "16px", borderRadius: "8px"}}>Hello React!</div>; }',
                  'vue': 'const app = Vue.createApp({ template: `<div style="background: blue; color: white; padding: 16px; border-radius: 8px;">Hello Vue!</div>`, setup() { return {} } });'
                };
                setCode(testCodes[framework as keyof typeof testCodes] || '');
              }}
            >
              测试预览
            </button>
          </div>
        </div>
        
        {code && (
          <div className="card stack">
            {error && <p style={{ color: '#b91c1c' }}>{error}</p>}
            
            {/* 标签页切换 */}
            <div className="row" style={{ borderBottom: '1px solid var(--border)', marginBottom: 16 }}>
              <button 
                className={`btn ${activeTab === 'code' ? 'primary' : ''}`}
                onClick={() => setActiveTab('code')}
                style={{ border: 'none', borderRadius: 0, borderBottom: activeTab === 'code' ? '2px solid var(--primary)' : 'none' }}
              >
                代码
              </button>
              <button 
                className={`btn ${activeTab === 'preview' ? 'primary' : ''}`}
                onClick={() => setActiveTab('preview')}
                style={{ border: 'none', borderRadius: 0, borderBottom: activeTab === 'preview' ? '2px solid var(--primary)' : 'none' }}
              >
                预览
              </button>
              <div style={{ flex: 1 }} />
              <CopyButton getText={() => code} />
            </div>
            
            {/* 代码显示 */}
            {activeTab === 'code' && (
              <pre style={{ margin: 0, padding: 16, background: 'var(--bg-secondary)', borderRadius: 8, overflow: 'auto' }}>
                <code>{code}</code>
              </pre>
            )}
            
            {/* 预览显示 */}
            {activeTab === 'preview' && (
              <div style={{ 
                border: '1px solid var(--border)', 
                borderRadius: 8, 
                padding: 16, 
                background: 'white',
                minHeight: 200,
                overflow: 'auto'
              }}>
                <iframe
                  srcDoc={getPreviewHtml()}
                  style={{ 
                    width: '100%', 
                    height: '400px', 
                    border: 'none',
                    borderRadius: 4
                  }}
                  title="UI Preview"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}


import type { Metadata } from 'next';
import './globals.css';
import GA from './_components/GA';
import Monetize from './_components/Monetize';
import Nav from './_components/Nav';

export const metadata: Metadata = {
  title: 'AI 工具栈',
  description: '轻量但高频的 AI 工具集合，文本、代码、办公提效。'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <GA />
        <header className="site-header">
          <Nav />
        </header>
        <main className="container">{children}</main>
        <Monetize />
        <footer className="container footer">
          <span>© {new Date().getFullYear()} AI 工具栈</span>
        </footer>
      </body>
    </html>
  );
}


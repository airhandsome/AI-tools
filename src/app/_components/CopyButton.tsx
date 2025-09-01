'use client';
import { useState } from 'react';

export default function CopyButton({ getText }: { getText: () => string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      className="btn"
      onClick={() => {
        const v = getText();
        if (!v) return;
        navigator.clipboard.writeText(v);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
    >
      {copied ? '已复制' : '复制'}
    </button>
  );
}


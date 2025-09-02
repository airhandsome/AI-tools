# AI 工具栈（层次一实现）

## 开发

```
npm i
npm run dev
```

## 环境变量

创建 `.env.local`：
```
OPENAI_API_KEY=sk-xxx
OPENAI_MODEL=gpt-4o-mini
NEXT_PUBLIC_GA_ID=G-XXXXXXXX
# 变现（可选） 如果没有添加的话，就默认不显示广告和buy me a coffee
NEXT_PUBLIC_BMC_ID=your_bmc_id
NEXT_PUBLIC_ENABLE_ADS=false
# DeepSeek（可选，设置后优先使用）
AI_PROVIDER=deepseek
DEEPSEEK_API_KEY=sk-deepseek-xxx
DEEPSEEK_MODEL=deepseek-chat
```

## 目录结构
- `src/app` Next.js App Router 页面与 API（Serverless）
- `src/lib/ai.ts` 通用 OpenAI 调用封装
- `src/app/tools/*` 层次一工具页面
- `src/app/api/tools/*` 层次一工具 API

## 已实现（层次一 9 个工具）
- 文本润色与风格转换 `/tools/rewrite`
- 代码解释与简化 `/tools/code-explain`
- 翻译校对与本地化 `/tools/translate`
- 长文摘要与要点 `/tools/summary`
- 正则生成与解释 `/tools/regex`
- SQL 生成与解释 `/tools/sql`
- Excel/Sheets 公式助手 `/tools/excel`
- 简历优化与 JD 匹配 `/tools/resume`
- 社媒标签与 Emoji 推荐 `/tools/social-tags`

## 部署
- 推荐 Vercel：导入仓库 → 配置环境变量 → 部署。
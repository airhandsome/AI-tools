# AI API 配置说明

## 🚨 重要：需要配置API密钥

你的AI工具栈目前无法正常工作，因为缺少必要的API密钥配置。

## 📝 配置步骤

### 1. 创建环境变量文件

在项目根目录创建 `.env.local` 文件：

```bash
# AI服务配置
# 选择AI提供商: 'openai' 或 'deepseek'
AI_PROVIDER=deepseek

# OpenAI配置 (如果使用OpenAI)
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini

# DeepSeek配置 (如果使用DeepSeek)
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_MODEL=deepseek-chat
```

### 2. 获取API密钥

#### 方式一：使用DeepSeek（推荐，免费额度）
1. 访问 [DeepSeek官网](https://platform.deepseek.com/)
2. 注册账号并登录
3. 在控制台获取API密钥
4. 设置 `AI_PROVIDER=deepseek` 和 `DEEPSEEK_API_KEY=你的密钥`

#### 方式二：使用OpenAI
1. 访问 [OpenAI官网](https://platform.openai.com/)
2. 注册账号并登录
3. 在API Keys页面获取密钥
4. 设置 `AI_PROVIDER=openai` 和 `OPENAI_API_KEY=你的密钥`

### 3. 重启开发服务器

配置完成后，重启开发服务器：

```bash
npm run dev
```

## 🔍 验证配置

配置成功后，你应该能在控制台看到：
- API调用成功的日志
- AI返回的JSON数据
- 工具正常工作

## ❌ 常见错误

1. **"Missing DEEPSEEK_API_KEY"** - 需要设置DeepSeek API密钥
2. **"Missing OPENAI_API_KEY"** - 需要设置OpenAI API密钥
3. **"AI服务调用失败"** - 检查API密钥是否正确

## 💡 推荐配置

对于开发和测试，推荐使用DeepSeek：
- 有免费额度
- 响应速度快
- 支持中文
- 配置简单

## 🆘 需要帮助？

如果配置后仍有问题，请检查：
1. 环境变量文件是否正确创建
2. API密钥是否有效
3. 网络连接是否正常
4. 控制台错误信息 
import { NextRequest, NextResponse } from 'next/server';
import { callOpenAI } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const { url, platform, category } = await request.json();
    
    if (!url) {
      return NextResponse.json({ ok: false, error: '请提供商品信息' });
    }

    const platformMap = {
      amazon: 'Amazon',
      aliexpress: '速卖通',
      ebay: 'eBay',
      shopify: 'Shopify独立站',
      walmart: 'Walmart',
      taobao: '淘宝',
      tmall: '天猫',
      jd: '京东',
      pinduoduo: '拼多多',
      xiaohongshu: '小红书',
      douyin: '抖音电商',
      kuaishou: '快手小店'
    };

    const categoryMap = {
      electronics: '电子产品',
      clothing: '服装鞋帽',
      home: '家居用品',
      beauty: '美妆个护',
      sports: '运动户外',
      books: '图书音像',
      automotive: '汽车用品',
      toys: '玩具游戏',
      food: '食品饮料',
      health: '保健品',
      digital: '数码配件',
      other: '其他'
    };

    // 判断是否为中国平台
    const isChinesePlatform = ['taobao', 'tmall', 'jd', 'pinduoduo', 'xiaohongshu', 'douyin', 'kuaishou'].includes(platform);
    
    // 根据平台选择语言
    const language = isChinesePlatform ? '中文' : '英文';
    const platformName = platformMap[platform as keyof typeof platformMap] || 'Amazon';
    const categoryName = categoryMap[category as keyof typeof categoryMap] || '电子产品';

    const prompt = `请为以下电商商品优化Listing，提升转化率和搜索排名。

商品信息: ${url}
平台: ${platformName}
类别: ${categoryName}
语言要求: ${language}

${isChinesePlatform ? '请用中文生成所有内容，包括标题、描述、关键词等。' : '请用英文生成所有内容，包括标题、描述、关键词等。'}

请生成以下格式的JSON响应：

{
  "title": "${isChinesePlatform ? '优化后的商品标题，包含主要关键词和卖点' : 'Optimized product title with main keywords and selling points'}",
  "bulletPoints": [
    "${isChinesePlatform ? '五点描述1，突出核心卖点' : 'Bullet point 1, highlighting core selling points'}",
    "${isChinesePlatform ? '五点描述2，强调产品优势' : 'Bullet point 2, emphasizing product advantages'}",
    "${isChinesePlatform ? '五点描述3，说明使用场景' : 'Bullet point 3, describing usage scenarios'}",
    "${isChinesePlatform ? '五点描述4，提及技术特点' : 'Bullet point 4, mentioning technical features'}",
    "${isChinesePlatform ? '五点描述5，强调售后服务' : 'Bullet point 5, emphasizing after-sales service'}"
  ],
  "description": "${isChinesePlatform ? '详细的商品描述，包含产品特性、规格参数、使用说明等' : 'Detailed product description including features, specifications, usage instructions, etc.'}",
  "keywords": ["${isChinesePlatform ? '关键词1' : 'keyword1'}", "${isChinesePlatform ? '关键词2' : 'keyword2'}", "${isChinesePlatform ? '关键词3' : 'keyword3'}", "${isChinesePlatform ? '关键词4' : 'keyword4'}", "${isChinesePlatform ? '关键词5' : 'keyword5'}"],
  "seoTitle": "${isChinesePlatform ? 'SEO优化的页面标题，60字符以内' : 'SEO-optimized page title, within 60 characters'}",
  "metaDescription": "${isChinesePlatform ? 'Meta描述，160字符以内，包含主要关键词' : 'Meta description, within 160 characters, including main keywords'}",
  "suggestions": [
    "${isChinesePlatform ? '改进建议1' : 'Improvement suggestion 1'}",
    "${isChinesePlatform ? '改进建议2' : 'Improvement suggestion 2'}",
    "${isChinesePlatform ? '改进建议3' : 'Improvement suggestion 3'}"
  ]
}

要求：
1. 标题要包含主要关键词，突出卖点，符合${platformName}平台规则
2. 五点描述要具体、有说服力，每点不超过200字符
3. 关键词要相关性强，包含长尾词
4. SEO标题和Meta描述要优化搜索排名
5. 改进建议要有建设性和可操作性
6. 只返回JSON，不要其他文字
7. 符合${platformName}平台的最佳实践
8. ${isChinesePlatform ? '所有内容必须使用中文，符合中国用户习惯' : 'All content must be in English, suitable for international users'}`;

    const response = await callOpenAI(prompt);
    
    // 调试：输出API响应
    console.log('=== Listing Optimizer API 调试信息 ===');
    console.log('API响应类型:', typeof response);
    console.log('API响应值:', response);
    
    // 检查API调用是否成功
    if (!response.ok) {
      console.error('AI API调用失败:', response.error);
      return NextResponse.json({ 
        ok: false, 
        error: response.error || 'AI服务调用失败' 
      });
    }
    
    // 获取AI返回的内容
    const content = response.content;
    
    if (!content) {
      console.error('AI返回的内容为空');
      return NextResponse.json({ 
        ok: false, 
        error: 'AI返回的内容为空，请重试' 
      });
    }
    
    console.log('AI返回的原始内容:', content);
    console.log('内容类型:', typeof content);
    console.log('内容长度:', content.length);
    
    // 清理和格式化AI返回的内容
    let cleanedContent = content;
    
    // 移除可能的markdown代码块标记
    if (cleanedContent.includes('```json')) {
      cleanedContent = cleanedContent.replace(/```json\s*/, '').replace(/\s*```/, '');
      console.log('移除markdown json标记后的内容:', cleanedContent);
    }
    if (cleanedContent.includes('```')) {
      cleanedContent = cleanedContent.replace(/```\s*/, '').replace(/\s*```/, '');
      console.log('移除markdown标记后的内容:', cleanedContent);
    }
    
    // 尝试找到JSON内容的开始和结束
    const jsonStart = cleanedContent.indexOf('{');
    const jsonEnd = cleanedContent.lastIndexOf('}');
    
    console.log('JSON开始位置:', jsonStart);
    console.log('JSON结束位置:', jsonEnd);
    
    if (jsonStart !== -1 && jsonEnd !== -1) {
      cleanedContent = cleanedContent.substring(jsonStart, jsonEnd + 1);
      console.log('提取的JSON内容:', cleanedContent);
    }
    
    // 验证JSON格式
    try {
      const parsed = JSON.parse(cleanedContent);
      console.log('成功解析的JSON:', parsed);
    } catch (parseError) {
      console.error('AI返回的内容无法解析为JSON:', cleanedContent);
      console.error('解析错误详情:', parseError);
      return NextResponse.json({ 
        ok: false, 
        error: 'AI返回的数据格式不正确，请重试' 
      });
    }
    
    console.log('=== 调试信息结束 ===');
    
    return NextResponse.json({ 
      ok: true, 
      content: cleanedContent 
    });

  } catch (error: any) {
    console.error('Listing optimizer error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: error.message || '优化失败，请重试' 
    });
  }
} 
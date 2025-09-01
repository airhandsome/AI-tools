import { NextRequest, NextResponse } from 'next/server';
import { callOpenAI } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json({ ok: false, error: '请提供网站URL' });
    }

    // 验证URL格式
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ ok: false, error: '请输入有效的URL格式' });
    }

    const prompt = `请分析这个网站的业务价值和用户体验，给出一个综合评分（0-100分）和详细分析。

网站URL: ${url}

请从以下角度分析：
1. 业务定位：这个网站是做什么的？主要业务是什么？
2. 目标用户：主要面向哪些用户群体？
3. 价值主张：网站的核心价值是什么？
4. 发现的问题：存在哪些用户体验或业务逻辑问题？
5. 改进建议：如何提升网站的价值和用户体验？

请以JSON格式返回，包含以下字段：
{
  "business": "业务定位描述",
  "target": "目标用户描述", 
  "value": "价值主张描述",
  "issues": ["问题1", "问题2", "问题3"],
  "suggestions": ["建议1", "建议2", "建议3"],
  "score": 85
}

注意：
- score是0-100的整数
- issues和suggestions是字符串数组，每个元素要具体明确
- 分析要客观专业，有建设性
- 只返回JSON，不要其他文字
- 确保JSON格式完全正确，可以被JSON.parse()解析`;

    const response = await callOpenAI(prompt);
    
    // 调试：输出API响应
    console.log('=== Website IQ API 调试信息 ===');
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
    console.error('Website IQ analysis error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: error.message || '分析失败，请重试' 
    });
  }
} 
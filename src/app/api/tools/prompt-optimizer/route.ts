import { NextRequest, NextResponse } from 'next/server';
import { callOpenAI } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const { idea, style, mood } = await request.json();
    
    if (!idea) {
      return NextResponse.json({ ok: false, error: '请提供图像描述' });
    }

    const styleMap = {
      realistic: '写实风格',
      artistic: '艺术风格',
      cartoon: '卡通风格',
      anime: '动漫风格',
      'oil-painting': '油画风格',
      watercolor: '水彩风格'
    };

    const moodMap = {
      neutral: '中性',
      bright: '明亮',
      dark: '暗黑',
      warm: '温暖',
      cool: '冷色调',
      mysterious: '神秘'
    };

    const prompt = `请为以下图像描述优化生成专业的AI绘画提示词，支持多个平台。

原始描述: ${idea}
风格偏好: ${styleMap[style as keyof typeof styleMap] || '写实风格'}
情绪偏好: ${moodMap[mood as keyof typeof moodMap] || '中性'}

请生成以下格式的JSON响应：

{
  "midjourney": "Midjourney专用的详细提示词，包含风格、质量、光照等参数",
  "stableDiffusion": "Stable Diffusion专用的提示词，包含负面提示词",
  "dalle": "DALL-E专用的提示词，简洁明了",
  "tips": [
    "使用技巧1",
    "使用技巧2", 
    "使用技巧3"
  ],
  "parameters": {
    "style": "推荐的风格参数",
    "quality": "推荐的质量参数",
    "aspect": "推荐的宽高比",
    "lighting": "推荐的光照效果"
  }
}

要求：
1. 每个平台的提示词都要专业、详细、可执行
2. 参数建议要具体且实用
3. 使用技巧要有建设性
4. 只返回JSON，不要其他文字
5. 提示词要符合各平台的特点和最佳实践`;

    const response = await callOpenAI(prompt);
    
    // 调试：输出API响应
    console.log('=== Prompt Optimizer API 调试信息 ===');
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
    console.error('Prompt optimizer error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: error.message || '优化失败，请重试' 
    });
  }
} 
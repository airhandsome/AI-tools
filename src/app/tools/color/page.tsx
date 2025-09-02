'use client';
import { useState, useRef, useEffect } from 'react';
import CopyButton from '@/app/_components/CopyButton';
import Usage from '@/app/_components/Usage';
import Examples from '@/app/_components/Examples';
import { ToolDonation } from '@/app/_components/Monetize';

// 预设颜色调色板
const colorPalette = [
  // 红色系
  '#ff0000', '#ff4444', '#ff6666', '#ff8888', '#ffaaaa', '#ffcccc', '#ffeeee',
  '#cc0000', '#cc4444', '#cc6666', '#cc8888', '#ccaaaa', '#cccccc', '#cceeee',
  '#990000', '#994444', '#996666', '#998888', '#99aaaa', '#99cccc', '#99eeee',
  '#660000', '#664444', '#666666', '#668888', '#66aaaa', '#66cccc', '#66eeee',
  
  // 绿色系
  '#00ff00', '#44ff44', '#66ff66', '#88ff88', '#aaffaa', '#ccffcc', '#eeffee',
  '#00cc00', '#44cc44', '#66cc66', '#88cc88', '#aaccaa', '#cccccc', '#eeccee',
  '#009900', '#449944', '#669966', '#889988', '#aa99aa', '#cc99cc', '#ee99ee',
  '#006600', '#446644', '#666666', '#886688', '#aa66aa', '#cc66cc', '#ee66ee',
  
  // 蓝色系
  '#0000ff', '#4444ff', '#6666ff', '#8888ff', '#aaaaff', '#ccccff', '#eeeeff',
  '#0000cc', '#4444cc', '#6666cc', '#8888cc', '#aaaacc', '#cccccc', '#eeeccc',
  '#000099', '#444499', '#666699', '#888899', '#aa9999', '#cc9999', '#ee9999',
  '#000066', '#444466', '#666666', '#886666', '#aa6666', '#cc6666', '#ee6666',
  
  // 黄色系
  '#ffff00', '#ffff44', '#ffff66', '#ffff88', '#ffffaa', '#ffffcc', '#ffffee',
  '#cccc00', '#cccc44', '#cccc66', '#cccc88', '#ccccaa', '#cccccc', '#ccceee',
  '#999900', '#999944', '#999966', '#999988', '#9999aa', '#9999cc', '#9999ee',
  '#666600', '#666644', '#666666', '#666688', '#6666aa', '#6666cc', '#6666ee',
  
  // 紫色系
  '#ff00ff', '#ff44ff', '#ff66ff', '#ff88ff', '#ffaaff', '#ffccff', '#ffeeff',
  '#cc00cc', '#cc44cc', '#cc66cc', '#cc88cc', '#ccaacc', '#cccccc', '#cceecc',
  '#990099', '#994499', '#996699', '#998899', '#99aa99', '#99cc99', '#99ee99',
  '#660066', '#664466', '#666666', '#668866', '#66aa66', '#66cc66', '#66ee66',
  
  // 青色系
  '#00ffff', '#44ffff', '#66ffff', '#88ffff', '#aaffff', '#ccffff', '#eeffff',
  '#00cccc', '#44cccc', '#66cccc', '#88cccc', '#aacccc', '#cccccc', '#eeeccc',
  '#009999', '#449999', '#669999', '#889999', '#aa9999', '#cc9999', '#ee9999',
  '#006666', '#446666', '#666666', '#886666', '#aa6666', '#cc6666', '#ee6666',
  
  // 橙色系
  '#ff8800', '#ffaa44', '#ffcc66', '#ffee88', '#ffffaa', '#ffffcc', '#ffffee',
  '#cc6600', '#cc8844', '#ccaa66', '#cccc88', '#cceeaa', '#ccffcc', '#ccffee',
  '#994400', '#996644', '#998866', '#99aa88', '#99ccaa', '#99eecc', '#99ffee',
  '#662200', '#664444', '#666666', '#668888', '#66aaaa', '#66cccc', '#66eeee',
  
  // 粉色系
  '#ff0088', '#ff4488', '#ff6688', '#ff8888', '#ffaa88', '#ffcc88', '#ffee88',
  '#cc0066', '#cc4466', '#cc6666', '#cc8866', '#ccaa66', '#cccc66', '#ccee66',
  '#990044', '#994444', '#996644', '#998844', '#99aa44', '#99cc44', '#99ee44',
  '#660022', '#664422', '#666622', '#668822', '#66aa22', '#66cc22', '#66ee22',
];

export default function ColorPage() {
  const [color, setColor] = useState('#3b82f6');
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 });
  const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 });
  const [hex, setHex] = useState('#3b82f6');
  const [isPickerActive, setIsPickerActive] = useState(false);
  const [showPalette, setShowPalette] = useState(false);

  // 将十六进制转换为RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // 将RGB转换为十六进制
  const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };

  // 将RGB转换为HSL
  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  // 将HSL转换为RGB
  const hslToRgb = (h: number, s: number, l: number) => {
    h /= 360;
    s /= 100;
    l /= 100;

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  };

  // 更新颜色值
  const updateColor = (newColor: string) => {
    setColor(newColor);
    setHex(newColor);
    
    const rgbValue = hexToRgb(newColor);
    if (rgbValue) {
      setRgb(rgbValue);
      setHsl(rgbToHsl(rgbValue.r, rgbValue.g, rgbValue.b));
    }
  };

  // 处理十六进制输入
  const handleHexChange = (value: string) => {
    if (value.match(/^#[0-9A-Fa-f]{6}$/)) {
      updateColor(value);
    } else {
      setHex(value);
    }
  };

  // 处理RGB输入
  const handleRgbChange = (type: 'r' | 'g' | 'b', value: number) => {
    const newRgb = { ...rgb, [type]: Math.max(0, Math.min(255, value)) };
    setRgb(newRgb);
    const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    updateColor(newHex);
  };

  // 处理HSL输入
  const handleHslChange = (type: 'h' | 's' | 'l', value: number) => {
    const newHsl = { ...hsl, [type]: Math.max(0, Math.min(type === 'h' ? 360 : 100, value)) };
    setHsl(newHsl);
    const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    setRgb(newRgb);
    const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    updateColor(newHex);
  };

  // 从调色板选择颜色
  const selectFromPalette = (paletteColor: string) => {
    updateColor(paletteColor);
    setShowPalette(false);
  };

  // 初始化颜色
  useEffect(() => {
    updateColor(color);
  }, []);

  return (
    <section className="stack prose">
      <h2>颜色选择器</h2>
      
      <Usage
        title="如何使用"
        steps={[
          '使用颜色选择器或输入颜色值',
          '查看不同格式的颜色值',
          '使用"复制"按钮复制颜色值',
          '点击"调色板"按钮选择预设颜色'
        ]}
        tips={[
          '支持十六进制、RGB、HSL三种格式',
          '可以实时预览颜色效果',
          '调色板包含多种预设颜色'
        ]}
      />

      <Examples
        items={[
          { title: '蓝色', text: '#3b82f6' },
          { title: '红色', text: '#ef4444' },
          { title: '绿色', text: '#22c55e' }
        ]}
        onUse={(t) => updateColor(t)}
      />

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <div className="card">
          <div className="stack">
            <h3>颜色选择</h3>
            
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input
                type="color"
                value={color}
                onChange={(e) => updateColor(e.target.value)}
                style={{ width: '60px', height: '40px', border: 'none', borderRadius: '8px' }}
              />
              <input
                type="text"
                value={hex}
                onChange={(e) => handleHexChange(e.target.value)}
                placeholder="#000000"
                style={{ flex: 1, padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
              />
            </div>

            <div style={{ 
              width: '100%', 
              height: '100px', 
              backgroundColor: color, 
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }} />

            <div className="row" style={{ gap: '8px' }}>
              <button 
                className="btn" 
                onClick={() => setShowPalette(!showPalette)}
                style={{ flex: 1 }}
              >
                🎨 调色板
              </button>
              <CopyButton getText={() => hex} />
            </div>

            {showPalette && (
              <div style={{ 
                padding: '16px', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px',
                background: '#f9fafb'
              }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '14px' }}>预设颜色</h4>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(7, 1fr)', 
                  gap: '4px',
                  maxHeight: '200px',
                  overflowY: 'auto'
                }}>
                  {colorPalette.map((paletteColor, index) => (
                    <button
                      key={index}
                      onClick={() => selectFromPalette(paletteColor)}
                      style={{
                        width: '100%',
                        height: '30px',
                        backgroundColor: paletteColor,
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'transform 0.1s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                      title={paletteColor}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="stack">
            <h3>颜色值</h3>
            
            <div className="stack" style={{ gap: '12px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 'bold' }}>
                  十六进制 (HEX)
                </label>
                <input
                  type="text"
                  value={hex}
                  onChange={(e) => handleHexChange(e.target.value)}
                  style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 'bold' }}>
                  RGB
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="number"
                    value={rgb.r}
                    onChange={(e) => handleRgbChange('r', parseInt(e.target.value) || 0)}
                    min="0"
                    max="255"
                    style={{ flex: 1, padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                  />
                  <input
                    type="number"
                    value={rgb.g}
                    onChange={(e) => handleRgbChange('g', parseInt(e.target.value) || 0)}
                    min="0"
                    max="255"
                    style={{ flex: 1, padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                  />
                  <input
                    type="number"
                    value={rgb.b}
                    onChange={(e) => handleRgbChange('b', parseInt(e.target.value) || 0)}
                    min="0"
                    max="255"
                    style={{ flex: 1, padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 'bold' }}>
                  HSL
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="number"
                    value={hsl.h}
                    onChange={(e) => handleHslChange('h', parseInt(e.target.value) || 0)}
                    min="0"
                    max="360"
                    style={{ flex: 1, padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                  />
                  <input
                    type="number"
                    value={hsl.s}
                    onChange={(e) => handleHslChange('s', parseInt(e.target.value) || 0)}
                    min="0"
                    max="100"
                    style={{ flex: 1, padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                  />
                  <input
                    type="number"
                    value={hsl.l}
                    onChange={(e) => handleHslChange('l', parseInt(e.target.value) || 0)}
                    min="0"
                    max="100"
                    style={{ flex: 1, padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              RGB: rgb({rgb.r}, {rgb.g}, {rgb.b})<br />
              HSL: hsl({hsl.h}, {hsl.s}%, {hsl.l}%)
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>关于颜色格式</h3>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>十六进制 (HEX)</h4>
            <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
              6位十六进制数，如 #3b82f6，常用于CSS和设计工具
            </p>
          </div>
          <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>RGB</h4>
            <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
              红绿蓝三色值，范围0-255，如 rgb(59, 130, 246)
            </p>
          </div>
          <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>HSL</h4>
            <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
              色相、饱和度、亮度，如 hsl(217, 91%, 60%)
            </p>
          </div>
        </div>
        <p style={{ marginTop: '16px', fontSize: '14px' }}>
          不同颜色格式适用于不同的场景。十六进制最常用于Web开发，
          RGB适合精确控制，HSL更适合调整颜色的明暗和饱和度。
        </p>
      </div>

      <ToolDonation />
    </section>
  );
} 
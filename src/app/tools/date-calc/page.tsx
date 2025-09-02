'use client';
import { useState } from 'react';
import CopyButton from '@/app/_components/CopyButton';
import Usage from '@/app/_components/Usage';
import Examples from '@/app/_components/Examples';
import { ToolDonation } from '@/app/_components/Monetize';

interface DateResult {
  result: string;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function DateCalcPage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [operation, setOperation] = useState<'diff' | 'add' | 'subtract'>('diff');
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState<'days' | 'hours' | 'minutes' | 'seconds'>('days');
  const [result, setResult] = useState<DateResult | null>(null);

  const calculateDateDifference = (start: string, end: string): DateResult => {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const diffMs = Math.abs(endTime - startTime);
    
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
    
    const result = `${days}天 ${hours}小时 ${minutes}分钟 ${seconds}秒`;
    
    return { result, days, hours, minutes, seconds };
  };

  const addToDate = (date: string, value: number, unit: string): DateResult => {
    const baseDate = new Date(date);
    let resultDate: Date;
    
    switch (unit) {
      case 'days':
        resultDate = new Date(baseDate.getTime() + value * 24 * 60 * 60 * 1000);
        break;
      case 'hours':
        resultDate = new Date(baseDate.getTime() + value * 60 * 60 * 1000);
        break;
      case 'minutes':
        resultDate = new Date(baseDate.getTime() + value * 60 * 1000);
        break;
      case 'seconds':
        resultDate = new Date(baseDate.getTime() + value * 1000);
        break;
      default:
        resultDate = baseDate;
    }
    
    const result = resultDate.toLocaleString('zh-CN');
    const diffMs = resultDate.getTime() - baseDate.getTime();
    
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
    
    return { result, days, hours, minutes, seconds };
  };

  const subtractFromDate = (date: string, value: number, unit: string): DateResult => {
    const baseDate = new Date(date);
    let resultDate: Date;
    
    switch (unit) {
      case 'days':
        resultDate = new Date(baseDate.getTime() - value * 24 * 60 * 60 * 1000);
        break;
      case 'hours':
        resultDate = new Date(baseDate.getTime() - value * 60 * 60 * 1000);
        break;
      case 'minutes':
        resultDate = new Date(baseDate.getTime() - value * 60 * 1000);
        break;
      case 'seconds':
        resultDate = new Date(baseDate.getTime() - value * 1000);
        break;
      default:
        resultDate = baseDate;
    }
    
    const result = resultDate.toLocaleString('zh-CN');
    const diffMs = baseDate.getTime() - resultDate.getTime();
    
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
    
    return { result, days, hours, minutes, seconds };
  };

  const handleCalculate = () => {
    if (operation === 'diff') {
      if (!startDate || !endDate) {
        alert('请选择开始和结束日期');
        return;
      }
      const diffResult = calculateDateDifference(startDate, endDate);
      setResult(diffResult);
    } else {
      if (!startDate || !value) {
        alert('请选择日期并输入数值');
        return;
      }
      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        alert('请输入有效的数值');
        return;
      }
      
      let calcResult: DateResult;
      if (operation === 'add') {
        calcResult = addToDate(startDate, numValue, unit);
      } else {
        calcResult = subtractFromDate(startDate, numValue, unit);
      }
      setResult(calcResult);
    }
  };

  const handleClear = () => {
    setStartDate('');
    setEndDate('');
    setValue('');
    setResult(null);
  };

  const setCurrentDate = () => {
    const now = new Date();
    const dateString = now.toISOString().slice(0, 16);
    setStartDate(dateString);
  };

  const setCurrentDateEnd = () => {
    const now = new Date();
    const dateString = now.toISOString().slice(0, 16);
    setEndDate(dateString);
  };

  return (
    <section className="stack prose">
      <h2>日期计算器</h2>
      
      <Usage
        title="如何使用"
        steps={[
          '选择计算模式：日期差、日期加法或日期减法',
          '输入相关日期和时间',
          '点击计算按钮获取结果',
          '查看详细的时间差信息'
        ]}
        tips={[
          '支持日期差计算',
          '支持日期加减运算',
          '自动格式化显示结果',
          '显示天、小时、分钟、秒的详细分解'
        ]}
      />

      <Examples
        items={[
          { title: '计算项目工期', text: '开始: 2024-01-01 09:00\n结束: 2024-01-15 18:00' },
          { title: '计算未来日期', text: '当前日期 + 30天' },
          { title: '计算过去日期', text: '当前日期 - 7天' }
        ]}
        onUse={(text) => {
          if (text.includes('开始:') && text.includes('结束:')) {
            const lines = text.split('\n');
            const startMatch = lines[0].match(/开始: (.+)/);
            const endMatch = lines[1].match(/结束: (.+)/);
            if (startMatch) setStartDate(startMatch[1]);
            if (endMatch) setEndDate(endMatch[1]);
            setOperation('diff');
          } else if (text.includes('+')) {
            setOperation('add');
            const match = text.match(/\+ (\d+)天/);
            if (match) {
              setValue(match[1]);
              setUnit('days');
            }
          } else if (text.includes('-')) {
            setOperation('subtract');
            const match = text.match(/- (\d+)天/);
            if (match) {
              setValue(match[1]);
              setUnit('days');
            }
          }
        }}
      />

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <div className="card">
          <div className="stack">
            <h3>计算设置</h3>
            
            <div className="stack" style={{ gap: '12px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 'bold' }}>
                  计算模式
                </label>
                <select 
                  className="lg" 
                  value={operation} 
                  onChange={(e) => setOperation(e.target.value as any)}
                >
                  <option value="diff">计算日期差</option>
                  <option value="add">日期加法</option>
                  <option value="subtract">日期减法</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 'bold' }}>
                  开始日期
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="datetime-local" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)}
                    style={{ flex: 1, padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                  />
                  <button className="btn" onClick={setCurrentDate} style={{ fontSize: '12px', padding: '6px 12px' }}>
                    现在
                  </button>
                </div>
              </div>
              
              {operation === 'diff' && (
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 'bold' }}>
                    结束日期
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type="datetime-local" 
                      value={endDate} 
                      onChange={(e) => setEndDate(e.target.value)}
                      style={{ flex: 1, padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                    />
                    <button className="btn" onClick={setCurrentDateEnd} style={{ fontSize: '12px', padding: '6px 12px' }}>
                      现在
                    </button>
                  </div>
                </div>
              )}
              
              {(operation === 'add' || operation === 'subtract') && (
                <div className="stack" style={{ gap: '8px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 'bold' }}>
                      数值
                    </label>
                    <input 
                      type="number" 
                      value={value} 
                      onChange={(e) => setValue(e.target.value)}
                      placeholder="输入数值..."
                      style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 'bold' }}>
                      单位
                    </label>
                    <select 
                      className="lg" 
                      value={unit} 
                      onChange={(e) => setUnit(e.target.value as any)}
                    >
                      <option value="days">天</option>
                      <option value="hours">小时</option>
                      <option value="minutes">分钟</option>
                      <option value="seconds">秒</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
            
            <div className="row" style={{ gap: '8px' }}>
              <button className="btn generate" onClick={handleCalculate}>
                🧮 计算
              </button>
              <button className="btn" onClick={handleClear}>
                清空
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="stack">
            <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>计算结果</h3>
              <CopyButton getText={() => result?.result || ''} />
            </div>
            
            {result ? (
              <div className="stack" style={{ gap: '16px' }}>
                <div style={{ 
                  padding: '16px', 
                  background: '#ecfdf5', 
                  border: '1px solid #10b981', 
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}>
                  {result.result}
                </div>
                
                <div>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>详细分解</h4>
                  <div style={{ 
                    padding: '12px', 
                    background: '#f3f4f6', 
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <div><strong>天数:</strong> {result.days}</div>
                      <div><strong>小时:</strong> {result.hours}</div>
                      <div><strong>分钟:</strong> {result.minutes}</div>
                      <div><strong>秒数:</strong> {result.seconds}</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ 
                padding: '40px', 
                textAlign: 'center', 
                color: '#6b7280',
                fontSize: '14px'
              }}>
                请设置参数后点击计算
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <h3>计算模式说明</h3>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>日期差计算</h4>
            <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
              计算两个日期之间的时间差<br />
              适用于项目工期、年龄计算等
            </p>
          </div>
          <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>日期加法</h4>
            <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
              在指定日期基础上增加时间<br />
              适用于计算未来日期
            </p>
          </div>
          <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>日期减法</h4>
            <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
              在指定日期基础上减少时间<br />
              适用于计算过去日期
            </p>
          </div>
        </div>
        <p style={{ marginTop: '16px', fontSize: '14px' }}>
          日期计算器提供多种日期运算功能，支持精确到秒的时间计算。
          可以计算两个日期之间的差值，或者在指定日期基础上进行加减运算。
        </p>
      </div>

      <ToolDonation />
    </section>
  );
} 
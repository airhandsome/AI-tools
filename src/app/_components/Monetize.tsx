'use client';

export default function Monetize() {
  const enableAds = process.env.NEXT_PUBLIC_ENABLE_ADS === 'true';
  const bmcId = process.env.NEXT_PUBLIC_BMC_ID;

  return (
    <div className="container" style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between', paddingTop: 8 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        {bmcId && (
          <a 
            className="btn" 
            href={`https://www.buymeacoffee.com/${bmcId}`} 
            target="_blank" 
            rel="noreferrer"
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: '#fff',
              fontWeight: 'bold',
              boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
            }}
          >
            支持一下 ☕
          </a>
        )}
      </div>
      {enableAds ? (
        <div className="card" style={{ width: '100%', textAlign: 'center' }}>
          <small>广告位（部署时接入 AdSense 脚本）</small>
        </div>
      ) : null}
    </div>
  );
}

// 新增：工具页面专用的捐赠组件
export function ToolDonation() {
  const bmcId = process.env.NEXT_PUBLIC_BMC_ID;
  
  if (!bmcId) return null;
  
  return (
    <div className="card" style={{ 
      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      border: '2px solid #3b82f6',
      textAlign: 'center',
      padding: '20px',
      marginTop: '20px'
    }}>
      <h4 style={{ margin: '0 0 8px 0', color: '#fff', fontSize: '16px' }}>
        ☕ 这个工具对你有帮助吗？
      </h4>
      <p style={{ margin: '0 0 12px 0', color: '#e0e7ff', fontSize: '13px' }}>
        支持我继续开发更多实用工具
      </p>
      <a 
        href={`https://www.buymeacoffee.com/${bmcId}`} 
        target="_blank" 
        rel="noreferrer"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: '#fff',
          color: '#3b82f6',
          padding: '8px 16px',
          borderRadius: '20px',
          textDecoration: 'none',
          fontWeight: 'bold',
          fontSize: '14px',
          transition: 'all 0.3s ease',
          boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.3)';
        }}
      >
        ☕ 支持一下
      </a>
    </div>
  );
}


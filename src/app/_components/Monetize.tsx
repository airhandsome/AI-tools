'use client';

export default function Monetize() {
  const enableAds = process.env.NEXT_PUBLIC_ENABLE_ADS === 'true';
  const bmcId = process.env.NEXT_PUBLIC_BMC_ID;

  return (
    <div className="container" style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between', paddingTop: 8 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        {bmcId && (
          <a className="btn" href={`https://www.buymeacoffee.com/${bmcId}`} target="_blank" rel="noreferrer">
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


import React, { useEffect, useRef } from 'react';

export default function AdZone({ slot, format = 'auto', style = {} }) {
  const ref = useRef(null);

  useEffect(() => {
    try {
      if (window.adsbygoogle && ref.current) {
        window.adsbygoogle.push({});
      }
    } catch {}
  }, []);

  const publisherId = process.env.REACT_APP_ADSENSE_ID || 'ca-pub-XXXXXXXXXXXXXXXX';

  return (
    <div style={{ textAlign: 'center', margin: '12px 0', minHeight: 90, background: '#f9fafb', border: '1px dashed #e5e7eb', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', ...style }}>
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: 'block', minWidth: 300, ...style }}
        data-ad-client={publisherId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

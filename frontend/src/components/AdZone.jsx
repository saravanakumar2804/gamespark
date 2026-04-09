import React, { useEffect, useRef } from 'react';

export default function AdZone({ slot, format = 'auto', style = {} }) {
  const ref      = useRef(null);
  const publisherId = process.env.REACT_APP_ADSENSE_ID || '';

  // Don't render at all if:
  // 1. No publisher ID set
  // 2. Publisher ID is still the placeholder
  // 3. No slot ID provided
  const isRealId = publisherId && !publisherId.includes('XXXX') && publisherId.startsWith('ca-pub-');
  const isRealSlot = slot && slot.length > 4 && !slot.includes('1234567890') && !slot.includes('0987654321') && !slot.includes('1122334455');

  useEffect(() => {
    if (!isRealId || !isRealSlot) return;
    try {
      if (window.adsbygoogle && ref.current) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch {}
  }, [isRealId, isRealSlot]);

  // If placeholder IDs — show a visual placeholder (development only)
  if (!isRealId || !isRealSlot) {
    if (process.env.NODE_ENV === 'development') {
      return (
        <div style={{ textAlign: 'center', margin: '8px 0', minHeight: style.height || 90, background: '#f9fafb', border: '1px dashed #e5e7eb', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: 12, fontWeight: 600, ...style }}>
          📢 Ad Zone ({format}) — Add real AdSense ID in .env
        </div>
      );
    }
    // In production with placeholder IDs — render nothing (no 400 errors)
    return null;
  }

  return (
    <div style={{ textAlign: 'center', margin: '8px 0', overflow: 'hidden', ...style }}>
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client={publisherId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

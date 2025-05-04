'use client';

import { useEffect } from 'react';
import { onCLS, onFID, onLCP, onTTFB, onINP, Metric } from 'web-vitals';

// Function to send metrics to analytics or console log them during development
function sendToAnalytics(metric: Metric) {
  // During development, log to console
  if (process.env.NODE_ENV === 'development') {
    console.log(metric);
    return;
  }

  // In production, send to analytics service or a backend endpoint
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    id: metric.id,
    delta: metric.delta,
  });

  // Use `navigator.sendBeacon()` if available, falling back to `fetch()`
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics', body);
  } else {
    fetch('/api/analytics', {
      body,
      method: 'POST',
      keepalive: true,
    });
  }
}

export function Analytics() {
  useEffect(() => {
    // Web Vitals reporting
    onCLS(sendToAnalytics);    // Cumulative Layout Shift
    onFID(sendToAnalytics);    // First Input Delay
    onLCP(sendToAnalytics);    // Largest Contentful Paint
    onTTFB(sendToAnalytics);   // Time to First Byte
    onINP(sendToAnalytics);    // Interaction to Next Paint
  }, []);

  // This component doesn't render anything visible
  return null;
} 
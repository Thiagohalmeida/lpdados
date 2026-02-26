'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function shouldTrack(pathname: string) {
  const path = (pathname || '').toLowerCase();
  if (!path) return false;

  const allowedPrefixes = [
    '/portal',
    '/projetos/',
    '/dashboards/',
    '/docs/',
    '/ferramentas/',
    '/pesquisas/',
    '/central-ajuda',
  ];

  return allowedPrefixes.some((prefix) => path === prefix || path.startsWith(prefix));
}

export function TelemetryTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedKey = useRef<string>('');

  useEffect(() => {
    if (!pathname || !shouldTrack(pathname)) return;

    const queryString = searchParams?.toString() || '';
    const currentKey = queryString ? `${pathname}?${queryString}` : pathname;

    if (lastTrackedKey.current === currentKey) return;
    lastTrackedKey.current = currentKey;

    const payload = {
      event_type: 'page_view',
      page_path: pathname,
      page_title: typeof document !== 'undefined' ? document.title || '' : '',
      referrer: typeof document !== 'undefined' ? document.referrer || '' : '',
      metadata: {
        query: queryString || null,
      },
    };

    fetch('/api/telemetria/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {
      // No-op to avoid UI noise if telemetry is unavailable.
    });
  }, [pathname, searchParams]);

  return null;
}

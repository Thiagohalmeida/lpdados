import { headers } from 'next/headers';

function trimTrailingSlash(url: string) {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

export async function getAppBaseUrl() {
  const explicitBase = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  if (explicitBase) {
    return trimTrailingSlash(explicitBase);
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) {
    const normalizedHost = vercelUrl.replace(/^https?:\/\//, '');
    return `https://${trimTrailingSlash(normalizedHost)}`;
  }

  const headerList = await headers();
  const host = headerList.get('x-forwarded-host') || headerList.get('host');
  if (host) {
    const proto = headerList.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
    return `${proto}://${host}`;
  }

  return 'http://localhost:3000';
}

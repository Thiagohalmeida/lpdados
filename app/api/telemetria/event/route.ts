import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import {
  insertTelemetryEvent,
  normalizePagePath,
  shouldTrackPage,
  toSha256,
} from '@/lib/telemetry';

function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const firstIp = forwarded.split(',')[0]?.trim();
    if (firstIp) return firstIp;
  }

  const realIp = request.headers.get('x-real-ip');
  return realIp?.trim() || '';
}

function getSessionTokenHash(request: NextRequest) {
  const secureToken = request.cookies.get('__Secure-next-auth.session-token')?.value;
  const plainToken = request.cookies.get('next-auth.session-token')?.value;
  const token = secureToken || plainToken || '';
  return token ? toSha256(token) : '';
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email?.toLowerCase();

    if (!userEmail) {
      return NextResponse.json({ success: false, ignored: true }, { status: 202 });
    }

    const body = await request.json().catch(() => ({}));
    const eventType = typeof body?.event_type === 'string' ? body.event_type : 'page_view';
    const pagePath = normalizePagePath(typeof body?.page_path === 'string' ? body.page_path : '');

    if (!shouldTrackPage(pagePath)) {
      return NextResponse.json({ success: true, ignored: true });
    }

    const pageTitle = typeof body?.page_title === 'string' ? body.page_title.trim() : '';
    const referrer = typeof body?.referrer === 'string' ? body.referrer.trim() : '';
    const metadata = body?.metadata && typeof body.metadata === 'object' ? body.metadata : {};
    const metadataJson = JSON.stringify(metadata);

    const clientIp = getClientIp(request);
    const ipHash = clientIp ? toSha256(clientIp) : '';
    const sessionId = getSessionTokenHash(request);
    const userAgent = request.headers.get('user-agent') || '';

    await insertTelemetryEvent({
      userEmail,
      eventType,
      pagePath,
      pageTitle,
      referrer,
      sessionId,
      userAgent,
      ipHash,
      metadataJson,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao registrar telemetria:', error);
    return NextResponse.json({ success: false, ignored: true }, { status: 202 });
  }
}

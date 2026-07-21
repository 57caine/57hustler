import { NextRequest, NextResponse } from 'next/server';

// Vercel's edge CDN has a known routing issue with certain Unicode characters
// whose UTF-8 encoding contains 0x9F as a middle byte (e.g. 音 = %E9%9F%B3).
// Requests for /category/音楽 (%E9%9F%B3%E6%A5%BD) reach the edge as a
// percent-encoded URL. When the CDN normalizer encounters %9F in a non-tail
// position it may fail to match the pre-rendered static page.
// This middleware decodes the path at the edge before routing, ensuring the
// Next.js static file lookup always receives the decoded form.
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/category/') && pathname.includes('%')) {
    const segment = pathname.slice('/category/'.length);
    let decoded: string;
    try {
      decoded = decodeURIComponent(segment);
    } catch {
      return NextResponse.next();
    }
    if (decoded !== segment) {
      const url = request.nextUrl.clone();
      url.pathname = `/category/${decoded}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/category/:path*',
};

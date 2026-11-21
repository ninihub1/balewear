import { NextResponse, type NextRequest } from 'next/server';

// Optional password gate for before launch. Set SITE_PASSWORD in Netlify to turn it on;
// remove the variable to open the site to everyone. The browser asks for a username
// (anything works) and the password.
export function middleware(req: NextRequest) {
  const password = process.env.SITE_PASSWORD;
  if (!password) return NextResponse.next();

  const auth = req.headers.get('authorization') || '';
  if (auth.startsWith('Basic ')) {
    try {
      const decoded = atob(auth.slice(6));
      const given = decoded.slice(decoded.indexOf(':') + 1);
      if (given === password) return NextResponse.next();
    } catch {
      // fall through to the prompt
    }
  }
  return new NextResponse('This site is not open yet.', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="BALE preview", charset="UTF-8"' },
  });
}

export const config = {
  // Stripe must reach the webhook, and static files load once the page is unlocked.
  matcher: ['/((?!api/webhooks|_next/static|_next/image|favicon.ico).*)'],
};

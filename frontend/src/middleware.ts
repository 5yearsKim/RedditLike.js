import { NextRequest, NextResponse } from "next/server";
import { LOCALES } from "@/config";
import createMiddleware from "next-intl/middleware";

const intlMiddleware = createMiddleware({
  locales: LOCALES,
  defaultLocale: LOCALES[0],
});

function detectLang(pathname: string): string|null {
  // Join the language candidates into a regular expression pattern
  const langPattern = LOCALES.join("|");
  // Create a regular expression to match /lang at the start of the pathname
  const regex = new RegExp(`^/(${langPattern})`);

  // Use exec() to find a match and capture the language code
  const match = regex.exec(pathname);

  // Check if there was a match
  if (match) {
    // The first captured group (index 1) will be the language code
    return match[1];
  }

  // Return null or any default value if no language code is found
  return null;
}


export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const locale = detectLang(pathname);

  const accountToken = searchParams.get("accountToken");
  const isPathConfigureAccount = pathname.includes("/configure-account");
  if (accountToken && locale && !isPathConfigureAccount) {
    const redirect = isPathConfigureAccount ? "/" : pathname;
    return NextResponse.redirect(
      new URL(`/${locale}/configure-account?redirect=${redirect}&accountToken=${accountToken}`, request.url)
    );
  }


  // redirects
  const managingPattern = /^\/(.+)\/boards\/([^\/]+)\/managings$/;
  if (managingPattern.test(pathname)) {
    return NextResponse.redirect(new URL(`${pathname}/censor`, request.url));
  }

  const searchPattern = /^\/(.+)\/searches$/;
  if (searchPattern.test(pathname)) {
    return NextResponse.redirect(new URL(`${pathname}/post`, request.url));
  }

  const adminPattern = /^\/(.+)\/admin$/;
  if (adminPattern.test(pathname)) {
    return NextResponse.redirect(new URL(`${pathname}/intro`, request.url));
  }

  const intlResponse = intlMiddleware(request);
  return intlResponse;

}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|icons).*)",
  ],
};

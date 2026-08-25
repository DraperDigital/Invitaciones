export interface PlatformContext {
  isCorporate: boolean;
  brandName: string;
  subdomain: string;
  theme: 'social' | 'corporate';
}

export function getPlatformContext(): PlatformContext {
  if (typeof window === 'undefined') {
    return {
      isCorporate: false,
      brandName: 'Invitto',
      subdomain: 'social',
      theme: 'social',
    };
  }

  const hostname = window.location.hostname;
  const pathname = window.location.pathname;

  const isOneSubdomain = hostname.startsWith('one.') || hostname.startsWith('corporativo.') || hostname.startsWith('enterprise.');
  const isOneRoute = pathname.startsWith('/one') || pathname.startsWith('/corporativo');

  const isCorporate = isOneSubdomain || isOneRoute;

  return {
    isCorporate,
    brandName: isCorporate ? 'Invitto One' : 'Invitto',
    subdomain: isCorporate ? 'one' : 'main',
    theme: isCorporate ? 'corporate' : 'social',
  };
}

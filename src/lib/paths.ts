export const BASE_URL = import.meta.env.BASE_URL || '/';
export const BASE_PATH = BASE_URL.replace(/\/$/, '');

/**
 * Returns a full href suitable for <a> tags in GitHub Pages project site environments.
 * Example: getLinkUrl('/image-compressor.html') => '/Splitdrop/image-compressor.html'
 */
export function getLinkUrl(path?: string): string {
  if (!path || path === '/' || path === '/index.html') {
    return BASE_URL;
  }
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('mailto:')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path : '/' + path;
  if (BASE_PATH && cleanPath.toLowerCase().startsWith(BASE_PATH.toLowerCase())) {
    return cleanPath;
  }
  return `${BASE_PATH}${cleanPath}`;
}

/**
 * Normalizes a full browser pathname into an internal route path without the repository base prefix.
 * Example: normalizePath('/Splitdrop/image-compressor.html') => '/image-compressor.html'
 */
export function normalizePath(pathname?: string): string {
  if (!pathname) return '/';
  let p = pathname;
  if (BASE_PATH && p.toLowerCase().startsWith(BASE_PATH.toLowerCase())) {
    p = p.slice(BASE_PATH.length);
  }
  if (!p.startsWith('/')) {
    p = '/' + p;
  }
  return p === '' ? '/' : p;
}

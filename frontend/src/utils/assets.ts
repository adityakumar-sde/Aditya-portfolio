/**
 * Cloudflare R2 & Edge Asset Resolver
 * 
 * When VITE_R2_STORAGE_URL is provided in environment variables
 * (e.g., https://assets.adityaraj.dev or https://pub-xxx.r2.dev),
 * heavy assets (3D models, 4K wallpapers, audio tracks) stream directly
 * from Cloudflare R2 edge object storage with zero egress fees.
 * 
 * If not set, it gracefully defaults to local /public paths.
 */
export const getAssetUrl = (path: string): string => {
  const r2Base = (import.meta as any).env?.VITE_R2_STORAGE_URL;
  if (!r2Base || typeof r2Base !== 'string') return path;
  
  const cleanBase = r2Base.endsWith('/') ? r2Base.slice(0, -1) : r2Base;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
};

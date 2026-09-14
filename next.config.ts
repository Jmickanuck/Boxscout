import type { NextConfig } from 'next';
const config: NextConfig = { reactStrictMode: true, images: { deviceSizes: [384, 512, 768], imageSizes: [128, 256], formats: ['image/webp'], qualities: [75] } };
export default config;

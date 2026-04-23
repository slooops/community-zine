/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  webpack: (config) => {
    // react-pdf / pdfjs-dist: suppress canvas (uses built-in renderer) and
    // prevent webpack from trying to bundle the worker (we serve it from public/)
    config.resolve.alias.canvas = false;
    config.resolve.alias['pdfjs-dist/build/pdf.worker.min.mjs'] = false;
    return config;
  },
};

export default nextConfig;

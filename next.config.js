/** @type {import('next').NextConfig} */
const nextConfig = {
  // Lighthouse and chrome-launcher are server-only Node.js modules
  serverExternalPackages: ['lighthouse', 'chrome-launcher'],
}

module.exports = nextConfig

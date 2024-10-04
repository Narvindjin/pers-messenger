/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['next-auth'],
    compiler: {
        styledComponents: true,
    },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'avatars.githubusercontent.com',
          port: '',
        },
      ],
    },
    experimental: {
        serverComponentsExternalPackages: [
          'puppeteer-extra', 
          'puppeteer-extra-plugin-stealth',
          'puppeteer-extra-plugin-recaptcha',
        ],
      },
};

export default nextConfig;

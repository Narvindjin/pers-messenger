/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['next-auth'],
    compiler: {
        styledComponents: true,
    },
};

export default nextConfig;

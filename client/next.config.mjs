const BACKEND_DOMAIN = process.env.NEXT_PUBLIC_BACKEND_URL

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    async redirects() {
        return [
            {
                source: '/',
                destination: `/login`,
                permanent: true,
            }
        ]
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: `${BACKEND_DOMAIN}/api/:path*`,
                basePath: false,
            }
        ]
    }
}
export default nextConfig;
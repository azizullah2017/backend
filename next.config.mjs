/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    experimental: { missingSuspenseWithCSRBailout: false },
    distDir: "build",
};

export default nextConfig;

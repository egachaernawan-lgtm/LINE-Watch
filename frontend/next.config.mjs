/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  // The demo is about the media feed, so it opens there instead of on the home dashboard.
  async redirects() {
    return process.env.NEXT_PUBLIC_DEMO_MODE === "true" ? [{ source: "/", destination: "/feed", permanent: false }] : [];
  },
};
export default nextConfig;

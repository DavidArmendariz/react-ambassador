/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)", // Apply to all routes
        headers: [
          {
            key: "Content-Security-Policy",
            value: `script-src 'self' https://js.stripe.com 'unsafe-inline';`, // Adjust as necessary
          },
          // Add any other headers you want here
        ],
      },
    ];
  },
};

module.exports = nextConfig;

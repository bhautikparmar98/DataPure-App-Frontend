/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: true,
  swcMinify: true,
  // eslint: {
  //   // Warning: This allows production builds to successfully complete even if
  //   // your project has ESLint errors.
  //   // ignoreDuringBuilds: true,
  // },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },

  // Debugger settings
  webpack(config) {
    config.output = config.output || {};
    config.output.devtoolModuleFilenameTemplate = function (info) {
      return 'file:///' + encodeURI(info.absoluteResourcePath);
    };
    return config;
  },
};

module.exports = nextConfig;

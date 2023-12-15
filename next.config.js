const envExports = require('./src/env');
const withImages = require('next-images');

const removeImports = require("next-remove-imports")();

module.exports = withImages(removeImports({
  ...envExports,
  experimental: { esmExternals: true, documentMiddleware: true }
}));

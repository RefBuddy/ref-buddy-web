/* eslint-disable import/no-unresolved */
/* eslint-disable global-require */
module.exports = {
  use: ['sass'],
  plugins: [
    require('postcss-import')(),
    require('postcss-simple-vars')({ silent: true }),
    // require('postcss-custom-media'),
    require('tailwindcss')('./tailwind.config.js'),
    require('postcss-nested')(),
    require('cssnano')(),
    require('autoprefixer')(),
  ],
  sourceMap: true,
  modules: true,
};

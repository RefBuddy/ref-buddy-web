/* eslint-disable no-console */
const activeEnv =
  process.env.GATSBY_ACTIVE_ENV || process.env.NODE_ENV || 'development';

console.log(`Using environment config: '${activeEnv}'`);
console.log(`Reading config from .env.${activeEnv}`);

require('dotenv').config({
  path: `.env.${activeEnv}`,
});

const autoprefixer = require('autoprefixer');
const tailwind = require('tailwindcss');

module.exports = {
  siteMetadata: {
    title: 'Ref Buddy Admin',
    description: 'Ref Buddy Admin Portal',
    author: '@refbuddy',
  },
  plugins: [
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: 'gatsby-plugin-sass',
      options: {
        postCssPlugins: [tailwind(), autoprefixer()],
      },
    },
    'gatsby-plugin-typescript',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'refbuddy',
        short_name: 'refbuddy',
        start_url: '/',
        background_color: '#0075EB',
        theme_color: '#0075EB',
        display: 'minimal-ui',
        icon: `src/images/favicon.png`,
      },
    },
    {
      resolve: 'gatsby-plugin-create-client-paths',
      options: { prefixes: ['/portal/*'] },
    },
  ],
};

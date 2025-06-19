module.exports = {
  content: [
    './src/**/*.js',
    './cli.js',
    './public/**/*.html',
  ],
  darkMode: 'media',
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
}; 
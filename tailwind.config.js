module.exports = {
  content: [
    './src/**/*.js',
    './cli.js',
    './public/**/*.html',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
}; 